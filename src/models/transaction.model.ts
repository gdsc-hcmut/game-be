import mongoose, { Document, ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

export type TransactionDocument = Document & {
    fromUser: ObjectId;
    toUser: ObjectId;
    amount: number;
    message: string;
    createdAt: number;
};

const transactionSchema = new Schema<TransactionDocument>({
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    message: String,
    createdAt: Number,
});

const Transaction = mongoose.model<TransactionDocument>(
    'Transaction',
    transactionSchema,
);

export default Transaction;
