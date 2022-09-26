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

export const USER_TYPES = {
    SYSTEM: 'SYSTEM',
    USER: 'USER',
};

const Schema = mongoose.Schema;

export type UserDocument = Document & {
    username: string;
    email: string;
    googleId: string;
    balance: number;
    type: string;
};

const userSchema = new Schema<UserDocument>({
    username: String,
    email: String,
    googleId: String,
    balance: Number,
    type: {
        type: String,
        enum: Object.values(USER_TYPES),
        default: USER_TYPES.USER,
    },
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
