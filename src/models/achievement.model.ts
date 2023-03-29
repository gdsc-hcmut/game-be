import mongoose, { Document, Schema, Types } from "mongoose";

export type Achievement = {
    type: number,
    name: string,
    GCoin: number,
    target: number, // REach level x -> target 
    hidden: boolean,
    point: number,
    arena: string,
    limit: string, // TODO: change to specific user's role
    // TODO: iterationTime: number (ms)
};
// TODO: Create an Achievement modelA
// TODO: Array of (EVENTS*) -> satisfy (and how ?)
// TODO: Events ?? 

export type UserAchievementDocument = Document & {
    type: number,
    userId: Types.ObjectId,
    progress: number,
    updatedAt: number,
    isActivated: boolean,
};

const userAchievementSchema = new Schema<UserAchievementDocument>({
    type: Number,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    updatedAt: Number,
    isActivated: Boolean,
});

const UserAchievement = mongoose.model<UserAchievementDocument>('achievement', userAchievementSchema);

export default UserAchievement;
