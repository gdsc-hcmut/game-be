import mongoose, { Types, Document, Schema } from "mongoose";

export type GICAchievementDocument = Document & {
    userId: Types.ObjectId
    achievements: number[]
    R_Pack: number
    SR_PremiumPack: number
}

const gicAchievementSchema = new Schema<GICAchievementDocument>({
    userId: Schema.Types.ObjectId,
    achievements: Array<Number>,
    R_Pack: { type: Number, default: 0 },
    SR_PremiumPack: { type: Number, default: 0 }
})

const GICAchievementModel = mongoose.model<GICAchievementDocument>("gic_achievements", gicAchievementSchema)
export default GICAchievementModel