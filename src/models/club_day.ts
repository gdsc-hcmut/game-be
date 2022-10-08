import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type ClubDayDocument = Document & {
    userId: string;
    name: string;
    studentId: string;
    isFinishGame: boolean;
    isFinishMathQuiz: boolean;
    isFinishCheckIn: boolean;
    isFinishKeyMatching: boolean;
    claimAt: number;
    gifts: number[];
};

const clubDaySchema = new Schema<ClubDayDocument>({
    userId: String,
    name: String,
    studentId: String,
    isFinishGame: {
        type: Boolean,
        default: false,
    },
    isFinishMathQuiz: {
        type: Boolean,
        default: false,
    },
    isFinishCheckIn: {
        type: Boolean,
        default: false,
    },
    isFinishKeyMatching: {
        type: Boolean,
        default: false,
    },
    claimAt: Number,
    gifts: Array<Number>,
});

const ClubDay = mongoose.model<ClubDayDocument>('ClubDay', clubDaySchema);

export default ClubDay;
