import mongoose, { Types, Document, Schema } from "mongoose";

export type GICAchievementDocument = Document & {
    userId: Types.ObjectId
    achievements: number[]
    R_Pack: number
    SR_PremiumPack: number
    FLASK3_PremiumPack: number
    packCount: number
    premiumPackCount: number
}

const gicAchievementSchema = new Schema<GICAchievementDocument>({
    userId: Schema.Types.ObjectId,
    achievements: Array<Number>,
    R_Pack: { type: Number, default: 0 },
    SR_PremiumPack: { type: Number, default: 0 },
    FLASK3_PremiumPack: { type: Number, default: 0 },
    packCount: { type: Number, default: 0 },
    premiumPackCount: { type: Number, default: 0 }
})

const GICAchievementModel = mongoose.model<GICAchievementDocument>("gic_achievements", gicAchievementSchema)
export default GICAchievementModel
