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
    GicItemName,
    GicRare,
    GicRarity,
    PREMIUM_GACHA_COST,
    PREMIUM_GACHA_COST_PACK,
    gachaRarity,
    gicItems,
    premiumGachaRarity,
    random,
} from './utils';
import { UserService } from '../user.service';
import { SYSTEM_ACCOUNT_ID } from '../../config';
import { TransactionService } from '../transaction.service';

@injectable()
export class GICService {
    constructor(
        @inject(ServiceType.FileUpload)
        private fileUploadService: FileUploadService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
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

    async findCurrentContestRegistration(userId: Types.ObjectId) {
        return await GICContestRegModel.findOne({
            registeredBy: userId,
            status: ContestRegStatus.REGISTERED,
        });
    }

    async userHasRegisteredContest(userId: Types.ObjectId) {
        return (
            (await GICContestRegModel.findOne({
                registeredBy: userId,
                status: ContestRegStatus.REGISTERED,
            })) != null
        );
    }

    async findOneContestRegAndUpdate(x: any, y: any) {
        return await GICContestRegModel.findOneAndUpdate(x, y);
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

    // Gameeeeeeeee

    async sendItemGIC(itemData: ItemDocument) {
        console.log('Send Item', itemData);
        const item = await this.itemService.createNewItem(itemData);
        return item;
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
        const item = await this.sendItemGIC(
            this.createGicRewardItem(
                userId,
                this.getRandomItemWithRare(gachaRarity),
            ),
        );
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
        for (let i = 0; i < 10; i++) {
            items.push(
                await this.sendItemGIC(
                    this.createGicRewardItem(
                        userId,
                        this.getRandomItemWithRare(gachaRarity),
                    ),
                ),
            );
        }

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
        const item = await this.sendItemGIC(
            this.createGicRewardItem(
                userId,
                this.getRandomItemWithRare(premiumGachaRarity),
            ),
        );
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
        for (let i = 0; i < 10; i++) {
            items.push(
                await this.sendItemGIC(
                    this.createGicRewardItem(
                        userId,
                        this.getRandomItemWithRare(premiumGachaRarity),
                    ),
                ),
            );
        }

        return items;
    }

    getRandomItemWithRare(rarity: GicRarity): GicItemName {
        const rnd = Math.random() * 100000;

        const percent = rnd / 1000;

        let result: GicRare,
            acc = 0;

        Object.keys(rarity).forEach((key: GicRare) => {
            if (result === null && percent > 100 - rarity[key] - acc)
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

    createGicRewardItem(userId: Types.ObjectId, itemName: GicItemName) {
        let item: ItemDocument = {
            ownerId: userId,
            name: itemName,
            imgUrl: `https://firebasestorage.googleapis.com/v0/b/gic-web-dev.appspot.com/o/characterPieces%2F${itemName}.png?alt=media`,
            description: `This is a magical item in GicReward call ${itemName}`,
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
}
