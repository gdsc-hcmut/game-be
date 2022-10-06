import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type ClubDayDocument = Document & {
    userId: string;
    email: string;
    isFinishGame: boolean;
    isFinishCheckIn: boolean;
    isFinishKeyMatching: boolean;
    claimAt: number;
    gifts: number[];
};

const clubDaySchema = new Schema<ClubDayDocument>({
    userId: String,
    email: String,
    isFinishGame: Boolean,
    isFinishCheckIn: Boolean,
    isFinishKeyMatching: Boolean,
    claimAt: Number,
    gifts: Array<Number>,
});

const BookFair = mongoose.model<ClubDayDocument>('BookFair', clubDaySchema);

export default BookFair;
