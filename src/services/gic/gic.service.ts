import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../../types';
import { FileUploadService } from '../file-upload.service';
import { FileCompressionStrategy } from '../../lib/file-compression/strategies';
import GICContestRegModel, {
    ContestRegStatus,
} from '../../models/gic/contest_registration.model';
import DayRegModel, {
    DayRegStatus,
} from '../../models/gic/day_registration.model';
import { ItemService } from '../item.service';
import { ItemDocument } from '../../models/item.model';
import {
    GACHA_COST,
    GACHA_COST_PACK,
    GicItem,
    GicItemName,
    GicRare,
    GicRarity,
    PREMIUM_GACHA_COST,
    PREMIUM_GACHA_COST_PACK,
    gachaRarity,
    gicItems,
    premiumGachaRarity,
    random,
    GicCombineName,
    itemsName
} from './utils';
import { UserService } from '../user.service';
import { SYSTEM_ACCOUNT_ID } from '../../config';
import { TransactionService } from '../transaction.service';
import GicGiftModel from '../../models/gic/gic_gift';
import { GICAchievementService } from './gic_achievement.service';
import { SocketService } from '../../server-events/index';

@injectable()
export class GICService {
    constructor(
        @inject(ServiceType.FileUpload)
        private fileUploadService: FileUploadService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
        @inject(ServiceType.GICAchievement) private gicAchievementService: GICAchievementService,
        @inject(ServiceType.Socket) private socketService: SocketService
    ) {}

    // FOR CONTESTS

    async registerContest(
        userId: Types.ObjectId,
        ideaName: string,
        members: any[],
        files: Express.Multer.File[],
        compresionStrategy: FileCompressionStrategy,
    ) {
        const uploadedFiles = await this.fileUploadService.uploadFiles(
            files,
            compresionStrategy,
        );
        const currentTime = Date.now();

        return await GICContestRegModel.create({
            registeredBy: userId,
            registeredAt: currentTime,
            ideaDescription: uploadedFiles[0]._id,
            ideaName: ideaName,
            status: ContestRegStatus.REGISTERED,
            members: members,
        });
    }

    async findContestRegs(query: any = {}) {
        return GICContestRegModel.find(query);
    }

    // to block spamming
    async rateLimitOnContestRegistration(userId: Types.ObjectId) {
        const now = Date.now();
        const cnt = await GICContestRegModel.count({
            registeredBy: userId,
            registeredAt: {
                $gte: now - 3600000,
                $lte: now,
            },
        });
        if (cnt > 3) {
            throw new Error(
                `Contest registration limit exceeded (3 registrations every hour)`,
            );
        }
    }

    async findCurrentContestRegistration(email: string) {
        return await GICContestRegModel.findOne({
            status: { $ne: ContestRegStatus.CANCELLED },
            members: {
                $elemMatch: {
                    email: email,
                    confirmed: true,
                },
            },
        });
    }

    async userHasRegisteredContest(userId: Types.ObjectId) {
        return (
            (await GICContestRegModel.findOne({
                registeredBy: userId,
                status: { $ne: ContestRegStatus.CANCELLED },
            })) != null
        );
    }

    async emailHasTeam(email: string) {
        return (await this.findCurrentContestRegistration(email)) != null;
    }

    async findOneContestRegAndUpdate(x: any, y: any) {
        return await GICContestRegModel.findOneAndUpdate(x, y);
    }

    async findContestRegById(id: Types.ObjectId) {
        return await GICContestRegModel.findById(id);
    }

    // FOR DAY REGISTRATION

    async registerDay(
        userId: Types.ObjectId,
        day: number,
        inviteId: Types.ObjectId = undefined,
    ) {
        return await DayRegModel.create({
            registeredBy: userId,
            registeredAt: Date.now(),
            day: day,
            status: DayRegStatus.REGISTERED,
            invitedBy: inviteId,
        });
    }

    // block spamming day registration
    async rateLimitOnDayRegistration(userId: Types.ObjectId, day: number) {
        const now = Date.now();
        const cnt = await DayRegModel.count({
            registeredBy: userId,
            day: day,
            registeredAt: {
                $gte: now - 3600000,
                $lte: now,
            },
        });
        if (cnt > 3) {
            throw new Error(
                `Day registration limit exceeded (3 registrations every hour)`,
            );
        }
    }

    async findDayRegistrations(x: any) {
        return await DayRegModel.find(x);
    }

    async userHasRegisteredDay(userId: Types.ObjectId, day: number) {
        return (
            (await DayRegModel.findOne({
                registeredBy: userId,
                day: day,
                status: DayRegStatus.REGISTERED,
            })) != null
        );
    }

    async userHasCheckinDay(userId: Types.ObjectId, day: number) {
        return (
            (await DayRegModel.findOne({
                registeredBy: userId,
                day: day,
                status: DayRegStatus.CHECKIN,
            })) != null
        );
    }

    async findOneDayRegAndUpdate(x: any, y: any) {
        return await DayRegModel.findOneAndUpdate(x, y);
    }

    async findDayRegById(id: Types.ObjectId) {
        return await DayRegModel.findById(id);
    }

    async checkin(userId: Types.ObjectId) {
        if (await this.userHasCheckinDay(userId, 5)) {
            throw new Error(`User has already checkin to Idea Showcase`);
        }
        const reg = await DayRegModel.findOneAndUpdate(
            {
                registeredBy: userId,
                day: 5,
                status: DayRegStatus.REGISTERED,
            },
            {
                status: DayRegStatus.CHECKIN,
                checkinAt: Date.now(),
            },
        );
        if (!reg) {
            throw new Error(`User has not registered for Idea Showcase`);
        }
        if (reg.invitedBy) {
            const invited = await DayRegModel.find({
                day: 5,
                invitedBy: reg.invitedBy,
            });
            if (invited.length == 1) {
                this.sendGicGift(reg.invitedBy, 'Keychain', 'Invite 1 friend');
            } else if (invited.length == 3) {
                this.sendGicGift(
                    reg.invitedBy,
                    'Cup/Figure',
                    'Invite 3 friend',
                );
            }
        }
    }

    async findAllCheckin() {
        let checkins = await DayRegModel.find({
            day: 5,
            status: DayRegStatus.CHECKIN,
        }).populate('registeredBy');
        return checkins;
    }

    async sendItemGIC(itemData: ItemDocument) {
        console.log('Send Item', itemData);
        const item = await this.itemService.createNewItem(itemData);
        return item;
    }

    // Gameeeeeeeee

    async findAllUserGicGift(userId: Types.ObjectId) {
        let gifts = await GicGiftModel.find({
            userId: userId,
        });
        return gifts;
    }

    async findAllGicGift() {
        let gifts = await GicGiftModel.find().populate('userId');
        return gifts;
    }

    async receiveGicGift(giftId: Types.ObjectId) {
        let gift = await GicGiftModel.findById(giftId);

        if (!gift) throw Error('Gift not existed');
        gift.isReceived = true;
        gift.reveicedAt = Date.now();
        gift.save();
        return gift;
    }

    async sendGicGift(
        userId: Types.ObjectId,
        name: string,
        description: string,
    ) {
        const gicGift = await GicGiftModel.create({
            userId,
            name,
            description,
            isReceived: false,
        });

        return gicGift;
    }

    async gacha(userId: Types.ObjectId) {
        const user = await this.userService.findById(userId);
        if (user.balance < GACHA_COST) {
            throw Error('User doesnt have enough coin to gacha');
        }
        await this.transactionService.createNewTransaction(
            user._id,
            SYSTEM_ACCOUNT_ID,
            GACHA_COST,
            `Transfer ${GACHA_COST}coin to gacha`,
        );
        const name = this.getRandomItemWithRare(gachaRarity)
        const item = await this.sendItemGIC(
            this.createGicRewardItem(
                userId,
                name
            ),
        );
        this.gicAchievementService.singleGacha(userId, gicItems.find(x => x.name === name))
        return item;
    }

    async gachaPack(userId: Types.ObjectId) {
        const user = await this.userService.findById(userId);
        if (user.balance < GACHA_COST_PACK) {
            throw Error('User doesnt have enough coin to gacha');
        }
        await this.transactionService.createNewTransaction(
            user._id,
            SYSTEM_ACCOUNT_ID,
            GACHA_COST_PACK,
            `Transfer ${GACHA_COST_PACK}coin to x10 gacha`,
        );
        let items: ItemDocument[] = [];
        let itemsForAchievement: GicItem[] = []
        for (let i = 0; i < 10; i++) {
            const name = this.getRandomItemWithRare(gachaRarity)
            items.push(
                await this.sendItemGIC(
                    this.createGicRewardItem(
                        userId,
                        name
                    ),
                ),
            );
            itemsForAchievement.push(gicItems.find(x => x.name === name))
        }
        this.gicAchievementService.packGacha(userId, itemsForAchievement)

        return items;
    }

    async premiumGacha(userId: Types.ObjectId) {
        const user = await this.userService.findById(userId);
        if (user.balance < PREMIUM_GACHA_COST) {
            throw Error('User doesnt have enough coin to gacha');
        }
        await this.transactionService.createNewTransaction(
            user._id,
            SYSTEM_ACCOUNT_ID,
            GACHA_COST,
            `Transfer ${GACHA_COST}coin to premium gacha`,
        );
        const name = this.getRandomItemWithRare(premiumGachaRarity)
        const item = await this.sendItemGIC(
            this.createGicRewardItem(
                userId,
                name
            ),
        );
        this.gicAchievementService.singlePremiumGacha(userId, gicItems.find(x => x.name === name))
        return item;
    }

    async premiumGachaPack(userId: Types.ObjectId) {
        const user = await this.userService.findById(userId);
        if (user.balance < PREMIUM_GACHA_COST_PACK) {
            throw Error('User doesnt have enough coin to gacha');
        }
        await this.transactionService.createNewTransaction(
            user._id,
            SYSTEM_ACCOUNT_ID,
            PREMIUM_GACHA_COST_PACK,
            `Transfer ${PREMIUM_GACHA_COST_PACK}coin to x10 premium gacha`,
        );
        let items: ItemDocument[] = [];
        let itemsForAchievement: GicItem[] = []
        for (let i = 0; i < 10; i++) {
            const name: GicItemName = this.getRandomItemWithRare(premiumGachaRarity)
            items.push(
                await this.sendItemGIC(
                    this.createGicRewardItem(
                        userId,
                        name
                    ),
                ),
            );
            itemsForAchievement.push(gicItems.find(x => x.name === name))
        }
        this.gicAchievementService.premiumPackGacha(userId, itemsForAchievement)

        return items;
    }

    getRandomItemWithRare(rarity: GicRarity): GicItemName {
        const rnd = Math.random() * 100000;

        const percent = rnd / 1000;

        let result: GicRare,
            acc = 0;

        Object.keys(rarity).forEach((key: GicRare) => {
            if (result === undefined && percent > 100 - rarity[key] - acc)
                result = key;
            acc += rarity[key];
        });
        console.log('result', result);

        let item = gicItems[random(58)];
        console.log('first item', item);
        while (item.rare != result) {
            console.log('Random', item, result);
            item = gicItems[random(58)];
        }
        console.log('Return', item);
        return item.name;
    }

    createGicRewardItem(userId: Types.ObjectId, itemName: GicItemName | GicCombineName) {
        let item: ItemDocument = {
            ownerId: userId,
            name: itemName,
            imgUrl: `https://firebasestorage.googleapis.com/v0/b/gic-web-dev.appspot.com/o/characterPieces%2F${itemName}.png?alt=media`,
            description: `This is a magical item in GicReward called ${itemName}`,
            currentPrice: 0,
            isReceived: false,
            receivedAt: false,
            receivedNote: '',
            isRequestToReceiveItem: false,
            requestToReceiveItemAt: 0,
            collectionName: 'GicReward',
        } as ItemDocument;
        return item;
    }

    async combineMerch(userId: Types.ObjectId, s: string) {
        const OPTIONS = ["KEYCHAIN", "CUP", "FIGURE", "TOTE", "FLASK"]

        if (!OPTIONS.includes(s)) {
            throw new Error(`Unknown option: ${s}. Available options are: ${OPTIONS}`)
        }

        const myItems = (await this.itemService.getItemsOfUser(userId)).filter(x => x.collectionName === "GicReward" && itemsName.find(y => y === x.name))
        const want = `GIC_${s}` as GicCombineName
        if (myItems.find(x => x.name === want)) {
            throw new Error(`You have already used this formula before`)
        }
        const needed = [`${s}1`, `${s}2`, `${s}3`, `${s}4`]

        const missing = needed.filter(x => !myItems.find(y => y.name === x))
        if (missing.length > 0) {
            throw new Error(`Missing pieces: ${missing}`)
        }

        await this.itemService.sendItemGIC(this.createGicRewardItem(userId, want))
        this.socketService.notifyEvent(
            userId.toString(),
            `Bạn đã nhận được vật phẩm '${s}'`
        )
    }

    async combinePiece(userId: Types.ObjectId, s: string) {
        const OPTIONS = [
            "PROBLEM", "SOLUTION", "DESIGN", "PRESENT",
            "11062023", "14062023", "17062023", "25062023",
            "KEYCHAIN", "CUP", "FIGURE", "TOTE BAG",
            "VACUUM FLASK", "IDEA BOARD", "INVITE FRIEND", "BAEMIN TECH",
            "GDSC IDEA CONTEST 2023", "GOOGLE DEVELOPER STUDENT CLUB HCMUT"
        ]
        if (!OPTIONS.includes(s)) {
            throw new Error(`Unknown option: ${s}. Available options are: ${OPTIONS}`)
        }
        
        const myItems = (await this.itemService.getItemsOfUser(userId)).filter(x => x.collectionName === "GicReward" && itemsName.find(y => y === x.name))
        const need = new Map<string, number>()
        s.split('')
            .filter(x => x !== " ")
            .forEach(x => {
                (need.get(x) != undefined) ?
                    need.set(x, 1) :
                    need.set(x, need.get(x) + 1)
            })

        const have = new Map<string, number>()
        myItems.forEach(x => {
            (have.get(x.name) != undefined) ?
                have.set(x.name, 1) :
                have.set(x.name, have.get(x.name) + 1)
        })

        for (const [k, v] of need) {
            if (have.get(k) == undefined || have.get(k) < v) {
                throw new Error(`Not enough pieces`)
            }
        }

        this.gicAchievementService.combinePieces(userId, s)
    }
}
