import mongoose, { Document, Schema, Types } from 'mongoose';

export type sessionMazeGame = Document & {
    userId: Types.ObjectId;
    currentRound: number;
    helpCount: number;
    totalScore: number;
};

const sessionMazeGameSchema = new Schema<sessionMazeGame>({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    currentRound: { type: Number, default: null },
    helpCount: { type: Number, default: 3 },
    totalScore: { type: Number, default: 0 },
});

const sessionMazeGameModel = mongoose.model<sessionMazeGame>(
    'Round',
    sessionMazeGameSchema,
);
export default sessionMazeGameModel;
