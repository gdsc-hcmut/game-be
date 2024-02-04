import mongoose, { Document, Schema, Types } from 'mongoose';

export type BudPickDocument = Document & {
    userId: Types.ObjectId;
    coinsReceived: number;
    day: number;
    createdAt: number;
};

const budPickSchema = new Schema<BudPickDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    coinsReceived: {
        type: Number,
        required: true,
    },
    day: { type: Number, required: false },
    createdAt: {
        type: Number,
        default: Date.now,
    },
});

const BudPick = mongoose.model<BudPickDocument>(
    'discord_bud_picks',
    budPickSchema,
);
export default BudPick;
