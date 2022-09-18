import { ObjectID } from 'mongodb';
import _ from 'lodash';
import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;

export type TokenDocument = Document & {
    userId: ObjectID;
    createdAt: number;
    expiredAt: number;
};

const tokenSchema = new Schema<TokenDocument>({
    userId: ObjectID,
    createdAt: Number,
    expiredAt: Number,
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
