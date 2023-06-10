import AsyncLock from "async-lock"
import { Types } from "mongoose"
import GICAchievementModel from "../../models/gic/gic_achievements.model"
import { GicItem, GicItemName } from "./utils"
import Item from "../../models/item.model"
import { inject, injectable } from "inversify"
import { ServiceType } from "../../types"
import { GICService } from "./gic.service"
import { TransactionService } from "../transaction.service"

@injectable()
export class GICAchievementService {
    private lock: AsyncLock
    private EXCLUDE_SPECIAL_LIMITED_HIDDEN: number[]
    private SPECIAL_ACHIEVEMENTS: number[]

    constructor(
        @inject(ServiceType.GIC) private gicService: GICService,
        @inject(ServiceType.Transaction) private transactionService: TransactionService
    ) {
        this.lock = new AsyncLock()
        this.EXCLUDE_SPECIAL_LIMITED_HIDDEN = []
        for (let i = 1; i <= 100; i++) {
            if (![6, 29, 30, 45, 48, 49, 50, 55, 60, 64, 65, 66, 80, 89, 92, 93, 100].includes(i)) {
                this.EXCLUDE_SPECIAL_LIMITED_HIDDEN.push(i)
            }
        }
        this.SPECIAL_ACHIEVEMENTS = [29, 45, 48, 49, 55, 60, 64, 65, 80, 89, 92, 93, 100]
    }

    async getAchievementOfUser(userId: Types.ObjectId) {
        await this.lock.acquire(userId.toString(), async () => {
            const doc = await GICAchievementModel.findOne({
                userId: userId
            })
            const res = doc.achievements.filter(id => !doc.viewedAchievements.includes(id))
            return res;
        })
    }

    async viewAcheivement(userId: Types.ObjectId, achievementNumber: number) {
        await this.lock.acquire(userId.toString(), async () => {
            let doc = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!doc) {
                doc = new GICAchievementModel({
                    userId: userId,
                    achievements: [],
                    viewedAchievements: []
                })
            }
            doc.viewedAchievements.push(achievementNumber);
            doc.markModified("viewedAchievements");
            await doc.save();
        })
    }

    private async gotAPiece(userId: Types.ObjectId, item: GicItem) {
        await this.lock.acquire(userId.toString(), async () => {
            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            const pieceList = await Item.find({
                ownerId: userId,
                collectionName: "GicReward"
            })
            const myPieceCount = pieceList.length

            if (!d.achievements.includes(1) && myPieceCount >= 25) {
                d.achievements.push(1)
                // TODO: send 1000 GCoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    1000,
                    "Hoàn thành nhiệm vụ 'Thu thập được 25 mảnh'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(2) && myPieceCount >= 50) {
                d.achievements.push(2)
                // TODO: send 2000 GCoins + MIRROR R
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, 'MIRROR R')
                )
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Thu thập được 50 mảnh'"
                )
                this.gotAPiece(userId, { name: 'MIRROR R', rare: 'MSR' })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(3) && myPieceCount >= 100) {
                d.achievements.push(3)
                // TODO: send 2500 GCoins + TOTE2
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, 'TOTE2')
                )
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2500,
                    "Hoàn thành nhiệm vụ 'Thu thập được 100 mảnh'"
                )
                this.gotAPiece(userId, { name: 'TOTE2', rare: 'SR' })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(4) && myPieceCount >= 200) {
                d.achievements.push(4)
                // TODO: send 5000 GCoins + 1x Normal pack
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000 + 1000,
                    "Hoàn thành nhiệm vụ 'Thu thập được 200 mảnh'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(5) && myPieceCount >= 500) {
                d.achievements.push(5)
                // TODO: send 7500 GCoins + 1x Premium pack
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    7500 + 2000,
                    "Hoàn thành nhiệm vụ 'Thu thập được 200 mảnh'"
                )
                this.completedAMission(userId)
            }

            if (!d.achievements.includes(6)) {
                // does someone have keychain4, cup4, figure4, tote4?
                const good = (await Item.findOne({
                    ownerId: { $ne: userId },
                    collectionName: "GicReward",
                    name: { $in: ["KEYCHAIN4", "CUP4", "FIGURE4", "TOTE4"] }
                })) != null
                if (good) {
                    d.achievements.push(6)
                    // TODO: send 3x premium pack + FLASK4
                    await this.gicService.sendItemGIC(
                        this.gicService.createGicRewardItem(userId, 'FLASK4')
                    )
                    await this.transactionService.createNewTransactionFromSystem(
                        userId,
                        2000 * 3,
                        "Hoàn thành nhiệm vụ 'Trở thành nguời nhanh nhất thu thập được mảnh KEYCHAIN4, CUP4, FIGURE4, TOTE4'"
                    )
                    this.gotAPiece(userId, { name: "FLASK4", rare: "LIMITED" })
                    this.completedAMission(userId)
                }
            }

            // achievements that invole unique pieces
            const uniqueNotGift = Array.from(new Set(pieceList.map(x => x.name).filter(x => x.length === 1 || x.startsWith("MIRROR")))).length
            if (!d.achievements.includes(7) && uniqueNotGift >= 18) {
                d.achievements.push(7)
                // TODO: send 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Thu thập được 18 mảnh khác nhau (Không tính mảnh quà)'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(8) && uniqueNotGift >= 38) {
                d.achievements.push(8)
                // TODO: 1x Premium Pack  + Mảnh TOTE3 + MIRROR R
                const obtainedItem = [{ name: "TOTE3", rare: "SR" }, { name: "MIRROR R", rare: "MSR" }];
                await Promise.all(obtainedItem.map((item: GicItem) => (
                    async () => {
                        await this.gicService.sendItemGIC(
                            this.gicService.createGicRewardItem(userId, item.name)
                        )
                        await this.gotAPiece(userId, item);
                    }
                )()));
                this.completedAMission(userId)
            }

            d.markModified("achievements")
            await d.save()
        })
    }

    private async completedAMission(userId: Types.ObjectId) {
        await this.lock.acquire(userId.toString(), async () => {
            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }
            if (!d.achievements.includes(99) && d.achievements.length >= 50) {
                d.achievements.push(99)
                // TODO: send FLASK2
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "FLASK2")
                );
                this.completedAMission(userId)
                this.gotAPiece(userId, { name: 'FLASK2', rare: 'SSR' })
            }
            if (!d.achievements.includes(100)) {
                const finished_100 = this.EXCLUDE_SPECIAL_LIMITED_HIDDEN.every(x => d.achievements.includes(x))
                if (finished_100) {
                    d.achievements.push(100)
                    // TODO: send 50000 GCoin
                    this.completedAMission(userId)
                }
            }
            if (!d.achievements.includes(101)) {
                const have_100 = d.achievements.includes(100)
                const have_5_special = this.SPECIAL_ACHIEVEMENTS.filter(x => d.achievements.includes(x)).length >= 5
                if (have_100 || have_5_special) {
                    d.achievements.push(101)
                    // TODO: 100000 GCoin + special message
                    this.completedAMission(userId)
                }
            }
            d.markModified("achievements")
            await d.save()
        })
    }

    public async userChangeMoney(userId: Types.ObjectId, d: number) {
        await this.lock.acquire(userId.toString(), async () => {
            if (d < 0) {
                let d = await GICAchievementModel.findOne({
                    userId: userId
                })
                if (!d) {
                    d = new GICAchievementModel({
                        userId: userId,
                        achievements: []
                    })
                }
                d.moneySpent += -d
                if (!d.achievements.includes(67) && d.moneySpent >= 5000) {
                    d.achievements.push(67)
                    // 1x normal pack
                    await this.transactionService.createNewTransactionFromSystem(
                        userId,
                        1000,
                        "Hoàn thành nhiệm vụ 'Xài 5000 GCoin'"
                    )
                    this.completedAMission(userId)
                }
                if (!d.achievements.includes(68) && d.moneySpent >= 12000) {
                    d.achievements.push(68)
                    // Premium Pack
                    await this.transactionService.createNewTransactionFromSystem(
                        userId,
                        2000,
                        "Hoàn thành nhiệm vụ 'Xài 12000 GCoin'"
                    )
                    this.completedAMission(userId)
                }
                if (!d.achievements.includes(69) && d.moneySpent >= 25000) {
                    d.achievements.push(69)
                    // 1x Normal Pack + 1x Premium Pack + 1 MIRROR R
                    await this.transactionService.createNewTransactionFromSystem(
                        userId,
                        3000,
                        "Hoàn thành nhiệm vụ 'Xài 25000 GCoin'"
                    )
                    await this.gicService.sendItemGIC(
                        this.gicService.createGicRewardItem(userId, "MIRROR R")
                    )
                    this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                    this.completedAMission(userId)
                }
                if (!d.achievements.includes(70) && d.moneySpent >= 50000) {
                    d.achievements.push(70)
                    // Premium pack +  Mirror SR
                    await this.transactionService.createNewTransactionFromSystem(
                        userId,
                        2000,
                        "Hoàn thành nhiệm vụ 'Xài 50000 GCoin'"
                    )
                    await this.gicService.sendItemGIC(
                        this.gicService.createGicRewardItem(userId, "MIRROR SR")
                    )
                    this.gotAPiece(userId, { name: "MIRROR SR", rare: "MSR" })
                    this.completedAMission(userId)
                }
            }
        })
    }

    public async singleGacha(userId: Types.ObjectId, x: GicItem) {
        await this.lock.acquire(userId.toString(), async () => {
            this.gotAPiece(userId, x)
        })
    }

    public async packGacha(userId: Types.ObjectId, a: GicItem[]) {
        await this.lock.acquire(userId.toString(), async () => {
            a.forEach(x => this.gotAPiece(userId, x))

            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            const R = a.filter(x => x.rare === 'R').length
            d.R_Pack += R
            d.packCount++;

            if (!d.achievements.includes(9) && d.R_Pack >= 10) {
                d.achievements.push(9)
                // TODO: 1000 gcoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    1000,
                    "Hoàn thành nhiệm vụ 'Kiếm được 10 mảnh R từ mở Pack'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(10) && d.R_Pack >= 20) {
                d.achievements.push(10)
                // TODO: 5000 gcoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Kiếm được 20 mảnh R từ mở Pack'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(73) && d.packCount >= 1) {
                d.achievements.push(73)
                // TODO: 500 gcoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    500,
                    "Hoàn thành nhiệm vụ 'Mở Normal Pack 1 lần'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(74) && d.packCount >= 5) {
                d.achievements.push(74)
                // TODO: 1000 gcoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    1000,
                    "Hoàn thành nhiệm vụ 'Mở Normal Pack 5 lần'"
                )
                this.completedAMission(userId)
            }
            d.markModified("achievements")
            await d.save()
        })
    }

    public async singlePremiumGacha(userId: Types.ObjectId, x: GicItem) {
        await this.lock.acquire(userId.toString(), async () => {
            this.gotAPiece(userId, x)
        })
    }

    public async premiumPackGacha(userId: Types.ObjectId, a: GicItem[]) {
        await this.lock.acquire(userId.toString(), async () => {
            a.forEach(x => this.gotAPiece(userId, x))

            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            const SR = a.filter(x => x.rare === 'SR').length
            const FLASK3 = a.filter(x => x.name === "FLASK3").length
            d.SR_PremiumPack += SR
            d.FLASK3_PremiumPack += FLASK3
            d.premiumPackCount++;

            if (!d.achievements.includes(11) && d.SR_PremiumPack >= 1) {
                d.achievements.push(11)
                // TODO: 5000 gcoins + MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Kiếm được 1 mảnh SR từ Premium Pack'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: 'MIRROR R', rare: 'MSR' })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(75) && d.premiumPackCount >= 1) {
                d.achievements.push(75)
                // 500 GCoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    500,
                    "Hoàn thành nhiệm vụ 'Mở Premium Pack 1 lần'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(76) && d.premiumPackCount >= 3) {
                d.achievements.push(76)
                // 1000 GCoin + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    1000,
                    "Hoàn thành nhiệm vụ 'Mở Premium Pack 3 lần'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(77) && d.premiumPackCount >= 5) {
                d.achievements.push(77)
                // 5000 gcoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Mở Premium Pack 5 lần'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(78) && d.premiumPackCount >= 7) {
                d.achievements.push(78)
                // 5000 GCoin + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Mở Premium Pack 7 lần'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(79) && d.premiumPackCount >= 10) {
                d.achievements.push(79)
                // 10000 GCoin + 1 MIRROR R 
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    10000,
                    "Hoàn thành nhiệm vụ 'Mở Premium Pack 10 lần'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(80) && d.FLASK3_PremiumPack >= 1) {
                d.achievements.push(80)
                // 10000 GCoin + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    10000,
                    "Hoàn thành nhiệm vụ 'Kiếm được mảnh FLASK3 từ Premium Pack'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            d.markModified("achievements")
            await d.save()
        })
    }

    private canCombineTo(a: GicItem[], s: string) {
        const aa = a.map(x => x.name)
        const ss = s.split("").filter(x => x != ' ')
        if (aa.length != ss.length) return false;
        for (let i = 0; i < aa.length; i++) if (aa[i] != ss[i]) return false;
        return true
    }

    public async combinePieces(userId: Types.ObjectId, a: GicItem[]) {
        await this.lock.acquire(userId.toString(), async () => {
            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            if (!d.achievements.includes(12) && this.canCombineTo(a, "PROBLEM")) {
                d.achievements.push(12)
                // 2000 GCoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"PROBLEM\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(13) && this.canCombineTo(a, "SOLUTION")) {
                d.achievements.push(13)
                // 5000 GCoin + 1x Normal Pack + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000 + 1000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"SOLUTION\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(14) && this.canCombineTo(a, "DESIGN")) {
                d.achievements.push(14)
                // 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"DESIGN\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(15) && this.canCombineTo(a, "PRESENT")) {
                d.achievements.push(15)
                // 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"PRESENT\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(16) && this.canCombineTo(a, "11062023")) {
                d.achievements.push(16)
                // 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"11062023\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(17) && this.canCombineTo(a, "14062023")) {
                d.achievements.push(17)
                // 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"14062023\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(18) && this.canCombineTo(a, "17062023")) {
                d.achievements.push(18)
                // 2000 gcoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"17062023\"'"
                )
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(19) && this.canCombineTo(a, "25062023")) {
                d.achievements.push(19)
                // 5000 GCoin + 1x Normal Pack + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000 + 1000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"25062023\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(20) && this.canCombineTo(a, "KEYCHAIN")) {
                d.achievements.push(20)
                // 2000 GCoin + Mảnh KEYCHAIN1
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"KEYCHAIN\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "KEYCHAIN1")
                );
                this.gotAPiece(userId, { name: "KEYCHAIN1", rare: "SR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(21) && this.canCombineTo(a, "CUP")) {
                d.achievements.push(21)
                // 2000 GCoin + Mảnh CUP1
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"CUP\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "CUP1")
                );
                this.gotAPiece(userId, { name: "CUP1", rare: "SR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(22) && this.canCombineTo(a, "FIGURE")) {
                d.achievements.push(22)
                // 2000 GCoin + Mảnh FIGURE1
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"FIGURE\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "FIGURE1")
                );
                this.gotAPiece(userId, { name: "FIGURE1", rare: "SR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(23) && this.canCombineTo(a, "TOTE BAG")) {
                d.achievements.push(23)
                // 2000 GCoin + Mảnh TOTE1
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"TOTE BAG\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "TOTE1")
                );
                this.gotAPiece(userId, { name: "TOTE1", rare: "SR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(24) && this.canCombineTo(a, "VACUUM FLASK")) {
                d.achievements.push(24)
                // 2000 GCoin + Mảnh FLASK1
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"VACUUM FLASK\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "FLASK1")
                );
                this.gotAPiece(userId, { name: "FLASK1", rare: "SSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(25) && this.canCombineTo(a, "IDEA BOARD")) {
                d.achievements.push(25)
                // 5000 GCoin + 1x Normal Pack + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000 + 1000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"IDEA BOARD\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(26) && this.canCombineTo(a, "INVITE FRIEND")) {
                d.achievements.push(26)
                // 5000 GCoin + 1x Normal Pack + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000 + 1000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"INVITE FRIEND\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(27) && this.canCombineTo(a, "BAEMIN TECH")) {
                d.achievements.push(27)
                // 7500 GCoin + 2x Normal Pack + 1 MIRROR R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    7500 + 2000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"BAEMIN TECH\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                );
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                this.completedAMission(userId)
            }
            if (!d.achievements.includes(28) && this.canCombineTo(a, "GDSC IDEA CONTEST 2023")) {
                d.achievements.push(28)
                // 10000 GCoin + 1x Normal Pack + Mảnh TOTE4
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    10000,
                    "Hoàn thành nhiệm vụ 'Ghép được chữ \"GDSC IDEA CONTEST 2023\"'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, "TOTE4")
                );
                this.gotAPiece(userId, { name: "TOTE4", rare: "SSR" })
                this.completedAMission(userId)
            }
            if (this.canCombineTo(a, "GOOGLE DEVELOPER STUDENT CLUB HCMUT")) {
                if (!d.achievements.includes(29)) {
                    d.achievements.push(29)
                    // 15000 GCoin + 3x Premium Pack
                    this.completedAMission(userId)
                }
                if (!d.achievements.includes(30)) {
                    const good = await GICAchievementModel.findOne({
                        userId: { $ne: userId },
                        achievements: 30
                    }) == null
                    if (good) {
                        d.achievements.push(30)
                        // 10000 GCoin + Mảnh FLASK4
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            10000,
                            "Hoàn thành nhiệm vụ 'Ghép được chữ \"GOOGLE DEVELOPER STUDENT CLUB HCMUT\"'"
                        )
                        await this.gicService.sendItemGIC(
                            this.gicService.createGicRewardItem(userId, "FLASK4")
                        );
                        this.gotAPiece(userId, { name: "FLASK4", rare: "LIMITED" })
                        this.completedAMission(userId)
                    }
                }
            }
            d.markModified("achievements")
            await d.save()
        })
    }

    public async addDiscordAchievement(userId: Types.ObjectId, id: number) {
        await this.lock.acquire(userId.toString(), async () => {
            let d = await GICAchievementModel.findOne({
                userId: userId
            })
            if (!d) {
                d = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }
            if (!d.achievements.includes(id)) {
                switch (id) {
                    case 31: {
                        // 1000 GCoin + 1x Normal Pack + CUP2
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            2000,
                            "Hoàn thành nhiệm vụ 'Kết nối tài khoản với Discord Bot'"
                        )
                        await this.gicService.sendItemGIC(
                            this.gicService.createGicRewardItem(userId, "CUP2")
                        )
                        this.gotAPiece(userId, { name: "CUP2", rare: "SR" })
                        break;
                    }
                    case 32: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ '/work 1 lần trong kênh daily-and-work'"
                        )
                        break;
                    }
                    case 33: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ '/work 14 lần trong kênh daily-and-work'"
                        )
                        break;
                    }
                    case 34: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ '/daily 7 lần trong kênh daily-and-work'"
                        )
                        break;
                    }
                    case 35: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ 'Chơi /guess 3 lần trong kênh battle'"
                        )
                        break;
                    }
                    case 36: {
                        // 2000 gcoin + 1 normal pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            3000,
                            "Hoàn thành nhiệm vụ 'Guess đúng trong không quá 10 lượt'"
                        )
                        break;
                    }
                    case 37: {
                        // 1000 gcoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ 'Chơi /hangman 3 lần trong kênh battle'"
                        )
                        break;
                    }
                    case 38: {
                        // 2000 GCoin + 1x Normal Pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            3000,
                            "Hoàn thành nhiệm vụ 'Thắng hangman trong không quá 10 lượt'"
                        )
                        break;
                    }
                    case 39: {
                        // 1000 gcoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ 'Chơi /rps 1 lần trong kênh battle'"
                        )
                        break;
                    }
                    case 40: {
                        // 2000 GCoin + 1x Normal Pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            3000,
                            "Hoàn thành nhiệm vụ 'Thắng /rps bằng búa 3 lần'"
                        )
                        break;
                    }
                    case 41: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ 'Battle thắng 1 lần'"
                        )
                        break;
                    }
                    case 42: {
                        // 2000 GCoin + 1x Normal Pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            3000,
                            "Hoàn thành nhiệm vụ 'Battle thắng 5 lần'"
                        )
                        break
                    }
                    case 43: {
                        // 5000 GCoin  + 3x MIRROR R
                        await Promise.all([1, 2, 3].map(_ => (
                            async () => {
                                await this.gicService.sendItemGIC(
                                    this.gicService.createGicRewardItem(userId, "MIRROR R")
                                )
                                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
                            }
                        )()))
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            5000,
                            "Hoàn thành nhiệm vụ 'Battle thắng 10 lần'"
                        )
                        break
                    }
                    case 56: {
                        // 2000 GCoin + 1x Nornal Pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            3000,
                            "Hoàn thành nhiệm vụ 'Tham gia Thursday Minigame 1 lần'"
                        )
                        break
                    }
                    case 57: {
                        // 5000 GCoin  + Mảnh FIGURE2
                        await this.gicService.sendItemGIC(
                            this.gicService.createGicRewardItem(userId, "FIGURE2")
                        )
                        this.gotAPiece(userId, { name: "FIGURE2", rare: "SR" })
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            5000,
                            "Hoàn thành nhiệm vụ 'Tham gia Thursday Minigame 2 lần'"
                        )
                        break
                    }
                    case 58: {
                        // 1000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            1000,
                            "Hoàn thành nhiệm vụ 'Trả lời đúng 5 câu hỏi từ Thursday Minigame'"
                        )
                        break
                    }
                    case 59: {
                        // 2000 GCoin
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            2000,
                            "Hoàn thành nhiệm vụ 'Trả lời đúng 10 câu hỏi từ Thursday Minigame'"
                        )
                        break
                    }
                    case 60: {
                        // 5000 GCoin + 1x Premium Pack
                        await this.transactionService.createNewTransactionFromSystem(
                            userId,
                            7000,
                            "Hoàn thành nhiệm vụ 'Lọt top 10 Thursday Minigame'"
                        )
                        break
                    }
                    default: {
                        throw new Error(`Unknown id ${id}`)
                    }
                }
                d.achievements.push(id)
                this.completedAMission(userId)
            }
            d.markModified("achievements")
            await d.save()
        })
    }

    public async URLClick(userId: Types.ObjectId, numClicks: number) {
        await this.lock.acquire(userId.toString(), async () => {
            let docs = await GICAchievementModel.findOne({
                userId: userId
            });
            if (!docs) {
                docs = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                });
            }

            if (!docs.achievements.includes(54) && numClicks === 10) {
                docs.achievements.push(54);
                // TODO: 5000 GCoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Shortened link có 10 lượt click'"
                )
                this.completedAMission(userId);
            }
            if (!docs.achievements.includes(55) && numClicks === 25) {
                docs.achievements.push(55);
                // TODO: 10000 GCoins + Premium Pack
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    10000,
                    "Hoàn thành nhiệm vụ 'Shortened link có 25 lượt click'"
                )
                this.completedAMission(userId);
            }

            docs.markModified("achievements");
            await docs.save();
        });
    }

    public async URLCreate(userId: Types.ObjectId, urlCount: number) {
        await this.lock.acquire(userId.toString(), async () => {
            let docs = await GICAchievementModel.findOne({
                userId: userId
            });
            if (!docs) {
                docs = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                });
            }

            if (!docs.achievements.includes(51) && urlCount === 1) {
                docs.achievements.push(51);
                // TODO: 1000 GCoins
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    1000,
                    "Hoàn thành nhiệm vụ 'Shorten 1 link bằng GDSC URL Shortener trên url.gdsc.app'"
                )
                this.completedAMission(userId);
            }
            if (!docs.achievements.includes(52) && urlCount === 7) {
                docs.achievements.push(52);
                // TODO: 2000 GCoins + Normal Pack R
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000 + 1000,
                    "Hoàn thành nhiệm vụ 'Shorten 7 link bằng GDSC URL Shortener trên url.gdsc.app'"
                )
                this.completedAMission(userId);
            }
            if (!docs.achievements.includes(53) && urlCount === 15) {
                docs.achievements.push(53);
                // TODO: 2000 GCoins + FIGURE4
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Shorten 15 link bằng GDSC URL Shortener trên url.gdsc.app'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, 'FIGURE4')
                )
                this.gotAPiece(userId, { name: 'FLASK4', rare: 'LIMITED' });
                this.completedAMission(userId);
            }

            docs.markModified("achievements");
            await docs.save();
        });
    }

    public async availableRecieved(userId: Types.ObjectId) {
        await this.lock.acquire(userId.toString(), async () => {
            let docs = await GICAchievementModel.findOne({
                userId: userId
            });

            if (!docs) {
                docs = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            if (!docs.achievements.includes(44)) {
                docs.achievements.push(44);
                // TODO: 2000 GCoin + 1 Normal Pack + CUP3
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000 + 1000,
                    "Hoàn thành nhiệm vụ 'Kiếm 1000 GCoin trong 1 ngày từ Math Quiz'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, 'CUP3')
                )
                this.gotAPiece(userId, { name: 'CUP3', rare: 'SR' })
                this.completedAMission(userId);
            }
        })
    }

    public async mathQuizScore(userId: Types.ObjectId, score: number) {
        await this.lock.acquire(userId.toString(), async () => {
            let docs = await GICAchievementModel.findOne({
                userId: userId
            });

            if (!docs) {
                docs = new GICAchievementModel({
                    userId: userId,
                    achievements: []
                })
            }

            docs.maxMathQuizScore = Math.max(docs.maxMathQuizScore, score);

            if (!docs.achievements.includes(46) && docs.maxMathQuizScore >= 25) {
                docs.achievements.push(46);
                // TODO: 2000 GCoin
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    2000,
                    "Hoàn thành nhiệm vụ 'Đạt 25 điểm Math Quiz'"
                )
                this.completedAMission(userId);
            }

            if (!docs.achievements.includes(47) && docs.maxMathQuizScore >= 40) {
                docs.achievements.push(47);
                // TODO: 5000 GCoin + Mảnh CUP4
                this.completedAMission(userId);
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    5000,
                    "Hoàn thành nhiệm vụ 'Đạt 40 điểm Math Quiz'"
                )
                await this.gicService.sendItemGIC(
                    this.gicService.createGicRewardItem(userId, 'CUP4')
                )
                this.gotAPiece(userId, { name: 'CUP4', rare: 'SSR' })
            }

            if (!docs.achievements.includes(48) && docs.maxMathQuizScore >= 60) {
                docs.achievements.push(48);
                // TODO: 10000 GCoin + 1x Premium Pack
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    10000 + 2000,
                    "Hoàn thành nhiệm vụ 'Đạt 60 điểm Math Quiz'"
                )
                this.completedAMission(userId);
            }

            if (!docs.achievements.includes(49) && docs.maxMathQuizScore >= 75) {
                docs.achievements.push(49);
                // TODO: 25000 GCoin + 3x Premium Pack
                await this.transactionService.createNewTransactionFromSystem(
                    userId,
                    25000 + 2000 * 3,
                    "Hoàn thành nhiệm vụ 'Đạt 75 điểm Math Quiz'"
                )
                this.completedAMission(userId);
            }
        });
    }
}
