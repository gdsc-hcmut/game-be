import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type TransactionDocument = Document & {
    fromUser: string;
    toUser: string;
    amount: number;
    createdAt: number;
};

const transactionSchema = new Schema<TransactionDocument>({
    fromUser: String,
    toUser: String,
    amount: Number,
    createdAt: Number,
});

const Transaction = mongoose.model<TransactionDocument>(
    'Transaction',
    transactionSchema,
);

export default Transaction;
