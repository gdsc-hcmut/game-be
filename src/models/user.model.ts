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
    type: String,
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
