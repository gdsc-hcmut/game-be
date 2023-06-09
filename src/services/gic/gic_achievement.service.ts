import AsyncLock from "async-lock"
import { Types } from "mongoose"
import GICAchievementModel from "../../models/gic/gic_achievements.model"
import { GicItem } from "./utils"
import Item from "../../models/item.model"

class GICAchievementService {
    private static instance: GICAchievementService = null
    private lock: AsyncLock
    private EXCLUDE_SPECIAL_LIMITED_HIDDEN: number[]
    private SPECIAL_ACHIEVEMENTS: number[]
    
    private constructor() {
        this.lock = new AsyncLock()
        this.EXCLUDE_SPECIAL_LIMITED_HIDDEN = []
        for (let i = 1; i <= 100; i++) {
            if (![6, 29, 30, 45, 48, 49, 50, 55, 60, 64, 65, 66, 80, 89, 92, 93, 100].includes(i)) {
                this.EXCLUDE_SPECIAL_LIMITED_HIDDEN.push(i)
            }
        }
        this.SPECIAL_ACHIEVEMENTS = [29, 45, 48, 49, 55, 60, 64, 65, 80, 89, 92, 93, 100]
    }
    
    public static getService() {
        if (!this.instance) {
            this.instance = new GICAchievementService()
        }
        return this.instance
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
            }
            if (!d.achievements.includes(2) && myPieceCount >= 50) {
                d.achievements.push(2)
                // TODO: send 2000 GCoins + MIRROR R
                this.gotAPiece(userId, { name: 'MIRROR R', rare: 'MSR'})
            }
            if (!d.achievements.includes(3) && myPieceCount >= 100) {
                d.achievements.push(3)
                // TODO: send 2500 GCoins + TOTE2
                this.gotAPiece(userId, { name: 'TOTE2', rare: 'SR'})
            }
            if (!d.achievements.includes(4) && myPieceCount >= 200) {
                d.achievements.push(4)
                // TODO: send 5000 GCoins + 1x Normal pack
            }
            if (!d.achievements.includes(5) && myPieceCount >= 500) {
                d.achievements.push(5)
                // TODO: send 7500 GCoins + 1x Premium pack
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
                    this.gotAPiece(userId, { name: "FLASK4", rare: "LIMITED" })
                }
            }
            
            // achievements that invole unique pieces
            const uniqueNotGift = Array.from(new Set(pieceList.map(x => x.name).filter(x => x.length === 1 ||  x.startsWith("MIRROR")))).length
            if (!d.achievements.includes(7) && uniqueNotGift >= 18) {
                d.achievements.push(7)
                // TODO: send 2000 gcoins
            }
            if (!d.achievements.includes(8) && uniqueNotGift >= 38) {
                d.achievements.push(8)
                // TODO: 1x Premium Pack  + Mảnh TOTE3 + MIRROR R
                this.gotAPiece(userId, { name: "TOTE3", rare: "SR" })
                this.gotAPiece(userId, { name: "MIRROR R", rare: "MSR" })
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
    
    public async packGacha(userId: Types.ObjectId, a: GicItem[]) {
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
            
            const R = a.filter(x => x.rare === 'R').length
            d.R_Pack += R
            
            if (!d.achievements.includes(9) && d.R_Pack >= 10) {
                d.achievements.push(9)
                // TODO: 1000 gcoin
            }
            if (!d.achievements.includes(10) && d.R_Pack >= 20) {
                d.achievements.push(10)
                // TODO: 5000 gcoin
            }
            d.markModified("achievements")
            await d.save()
        })
    }
    
    public async premiumGacha(userId: Types.ObjectId, a: GicItem[]) {
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
            
            const SR = a.filter(x => x.rare === 'SR').length
            d.SR_PremiumPack += SR
            
            if (!d.achievements.includes(11) && d.SR_PremiumPack >= 1) {
                d.achievements.push(11)
                // TODO: 5000 gcoins + MIRROR R
                this.gotAPiece(userId, { name: 'MIRROR R', rare: 'MSR' })
            }
            d.markModified("achievements")
            await d.save()
        })
    }
}