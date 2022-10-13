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
}

const Schema = mongoose.Schema;

export type UserDocument = Document & {
    username: string;
    email: string;
    googleId: string;
    balance: number;
    highestScoreMathQuiz: number;
    roles: USER_ROLES[];
};

const userSchema = new Schema<UserDocument>({
    username: String,
    email: String,
    googleId: String,
    balance: { type: Number, default: 0 },
    highestScoreMathQuiz: { type: Number, default: 0 },
    roles: Array<USER_ROLES>,
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
