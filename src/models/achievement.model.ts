import mongoose, { Schema, Types } from "mongoose";

export type Achievement = {
    type: number,
    name: string,
    GCoin: number,
    target: number,
    hidden: boolean,
    point: number,
    arena: string,
    limit: string,
};

export type UserAchievementDocument = Document & {
    type: number,
    userId: Types.ObjectId,
    progress: number,
    updatedAt: number,
};

const userAchievementSchema = new Schema<UserAchievementDocument>({
    type: Number,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    updatedAt: Number
});

const UserAchievement = mongoose.model<UserAchievementDocument>('achievement', userAchievementSchema);

export default UserAchievement;
