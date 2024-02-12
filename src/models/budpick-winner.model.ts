import mongoose, { Document, Schema, Types } from 'mongoose';

export enum BudPickPrize {
    CONSOLATION = 'CONSOLATION',
    THIRD = 'THIRD',
    SECOND = 'SECOND',
    FIRST = 'FIRST',
}

export type BudPickResultDocument = Document & {
    winners: {
        userId: Types.ObjectId;
        prize: BudPickPrize;
        showed: boolean;
    }[];
    createdAt: number;
    currentSession: boolean;
};

const budPickResultSchema = new Schema<BudPickResultDocument>({
    winners: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            prize: { type: String, enum: BudPickPrize },
            showed: false,
        },
    ],
    createdAt: { type: Number, default: Date.now() },
    currentSession: { type: Boolean, default: true },
});

budPickResultSchema.index({ newest: 'hashed' });

const BudPickResult = mongoose.model<BudPickResultDocument>(
    'discord_bud_pick_result',
    budPickResultSchema,
);

export default BudPickResult;
