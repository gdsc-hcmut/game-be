import { ObjectID } from 'mongodb';
import _ from 'lodash';
import mongoose, { Document } from 'mongoose';
import { USER_ROLES } from './user.model';
const Schema = mongoose.Schema;

export type TokenDocument = Document & {
    userId: string;
    createdAt: number;
    expiredAt: number;
    roles: USER_ROLES[];
};

const tokenSchema = new Schema<TokenDocument>({
    userId: String,
    createdAt: Number,
    expiredAt: Number,
    roles: Array<USER_ROLES>,
});

export function parseTokenMeta(tokenMeta: any): TokenDocument {
    return {
        ...tokenMeta,
        _id: ObjectID.createFromHexString(tokenMeta._id),
        userId: ObjectID.createFromHexString(tokenMeta.userId),
    };
}

const Token = mongoose.model<TokenDocument>('token', tokenSchema);

export default Token;
