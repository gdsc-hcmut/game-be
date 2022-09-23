import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type GameSessionDocument = Document & {
    level: number;
    userId?: string;
    createdAt: number;
    finishAt: number;
};

const gameSessionSchema = new Schema<GameSessionDocument>({
    level: Number,
    userId: String,
    createdAt: Number,
    finishAt: Number,
});

const GameSession = mongoose.model<GameSessionDocument>(
    'GameSession',
    gameSessionSchema,
);

export default GameSession;
