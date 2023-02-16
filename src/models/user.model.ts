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
};

const userSchema = new Schema<UserDocument>({
    username: String,
    email: String,
    googleId: String,
    balance: { type: Number, default: 0 },
    highestScoreMathQuiz: { type: Number, default: 0 },
    picture: String,
    name: String,
    discordId: String,
    verifyDiscordCode: Number,
    verifyDiscordCodeAt: Number,
    availableReceiving: { type: Number, default: 300 },
    roles: Array<USER_ROLES>,
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
