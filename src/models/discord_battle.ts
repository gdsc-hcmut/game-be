import mongoose, { Document, Types } from 'mongoose';

const Schema = mongoose.Schema;

export type DiscordActivityDocument = Document & {
    player1DiscordId: string;
    player2DiscordId: string;
    point: number;
    winner: string;
    detailData: string;
    createdAt: number;
};

const discordActivitySchema = new Schema<DiscordActivityDocument>({
    player1DiscordId: String,
    player2DiscordId: String,
    point: Number,
    winner: String,
    detailData: String,
    createdAt: String,
});

const BookFair = mongoose.model<DiscordActivityDocument>(
    'DiscordActivity',
    discordActivitySchema,
);

export default BookFair;
