import mongoose, { Document } from 'mongoose';

export const USER_FORBIDDEN_FIELDS = [
    'password',
    'isArchived',
    'isActivated',
    'isVerified',
    'recoverPasswordCode',
    'recoverPasswordExpires',
    'verifyAccountCode',
];

export enum USER_ROLES {
    SYSTEM = 'SYSTEM',
    STAFF_CLUBDAY_VERIFY = 'STAFF_CLUBDAY_VERIFY',
    STAFF_CLUBDAY_GIFT = 'STAFF_CLUBDAY_GIFT',
    USER = 'USER',
    GAME_BOT = 'GAME_BOT',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

const Schema = mongoose.Schema;

export type UserDocument = Document & {
    username: string;
    email: string;
    phone: string;
    university: string;
    studentId: string;
    dob: number;
    googleId: string;
    balance: number;
    highestScoreMathQuiz: number;
    picture: string;
    name: string;
    discordId: string;
    verifyDiscordCode: number;
    verifyDiscordCodeAt: number;
    availableReceiving: number;
    roles: USER_ROLES[];
    isPrecheckAchievement: boolean;
    achievementPoint: number;
};

const userSchema = new Schema<UserDocument>({
    username: String,
    email: String,
    phone: String,
    studentId: String,
    university: String,
    dob: Number,
    googleId: String,
    balance: { type: Number, default: 0 },
    highestScoreMathQuiz: { type: Number, default: 0 },
    picture: String,
    name: String,
    discordId: String,
    verifyDiscordCode: Number,
    verifyDiscordCodeAt: Number,
    availableReceiving: { type: Number, default: 1000 },
    roles: Array<USER_ROLES>,
    isPrecheckAchievement: { type: Boolean, default: false },
    achievementPoint: { type: Number, default: 0 },
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
