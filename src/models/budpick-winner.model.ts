import mongoose, { Document, Schema, Types } from 'mongoose';

export enum BudPickPrize {
    CONSOLATION = 'CONSOLATION',
    THIRD = 'THIRD',
    SECOND = 'SECOND',
    FIRST = 'FIRST',
}

export type BudPickWinnerDocument = Document & {
    userId: Types.ObjectId;
    prize: BudPickPrize;
    showed: boolean;
};

const budPickWinnerSchema = new Schema<BudPickWinnerDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    prize: {
        type: String,
        enum: Object.values(BudPickPrize),
        required: true,
    },
    showed: { type: Boolean, default: false },
});

const BudPickWinner = mongoose.model<BudPickWinnerDocument>(
    'discord_bud_pick_winners',
    budPickWinnerSchema,
);

export default BudPickWinner;
