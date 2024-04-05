import { injectable } from 'inversify';
import _ from 'lodash';
import ClubDay, { ClubDayDocument } from '../models/club_day';

interface CheckMaze {
    canPlay: boolean;
}

@injectable()
export class ClubDayService {
    constructor() {}

    async createClubDay(
        userId: string,
        name: string,
        studentId: string,
    ): Promise<ClubDayDocument> {
        let newClubDay = new ClubDay();
        newClubDay.userId = userId;
        ``;
        newClubDay.name = name;
        newClubDay.studentId = studentId;
        newClubDay.save();
        return newClubDay;
    }

    async updateClubDay(
        userId: string,
        name?: string,
        studentId?: string,
    ): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });
        if (name) clubDay.name = name;
        if (studentId) clubDay.studentId = studentId;
        clubDay.save();
        return clubDay;
    }

    async getUserClubDay(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });
        return clubDay;
    }

    async getAllReceivedClubDay(): Promise<Array<ClubDayDocument>> {
        let clubDay = await ClubDay.find({ claimAt: { $gte: 1 } });
        return clubDay;
    }

    async verifyCheckIn(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not Existed');
        }

        if (clubDay.isFinishCheckIn) {
            throw Error('Already Finish');
        }

        clubDay.isFinishCheckIn = true;
        clubDay.save();
        return clubDay;
    }

    async verifyActivity(
        userId: string,
        name: string,
        isWin: boolean,
    ): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not Existed');
        }

        if (name == 'key_matching') {
            if (clubDay.isFinishKeyMatching) {
                throw Error('Already Finish');
            }
            clubDay.isFinishKeyMatching = true;
        } else if (name == 'check_in') {
            if (clubDay.isFinishCheckIn) {
                throw Error('Already Finish');
            }
            clubDay.isFinishCheckIn = true;
        } else if (name == 'game') {
            if (clubDay.isFinishGame) {
                throw Error('Already Finish');
            }
            clubDay.isFinishGame = true;
        } else if (name == 'math_quiz') {
            if (clubDay.isFinishMathQuiz) {
                throw Error('Already Finish');
            }
            clubDay.isFinishMathQuiz = true;
        } else if (name == 'maze') {
            if (clubDay.isFinishMaze) {
                throw Error('Already Finish');
            }
            clubDay.isFinishMaze = true;
        } else if (name == 'o_an_quan') {
            if (clubDay.isFinishOAnQuan) {
                throw Error('Already Finish');
            }
            clubDay.isFinishOAnQuan = true;
        } else if (name == 'thay_da') {
            if (clubDay.isFinishThayDa) {
                throw Error('Already Finish');
            }
            clubDay.isFinishThayDa = true;
        } else if (name == 'cu_quay') {
            if (clubDay.isFinishCuQuay) {
                throw Error('Already Finish');
            }
            clubDay.isFinishCuQuay = true;
        } else {
            throw Error('Invalid activity');
        }
        clubDay.save();
        return clubDay;
    }

    async verifyMazeGame(userId: string): Promise<CheckMaze> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not existed');
        }

        if (!clubDay.isFinishMaze) return { canPlay: true };

        return { canPlay: false };
    }

    async updateFinishMaze(userId: string): Promise<void> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not existed');
        }

        // console.log(clubDay);

        // clubDay.isFinishMaze = true;
        await ClubDay.updateOne(
            { _id: clubDay._id },
            { $set: { isFinishMaze: true } },
        );
    }

    async verifyKeyMatching(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not Existed');
        }

        if (clubDay.isFinishKeyMatching) {
            throw Error('Already Finish');
        }

        clubDay.isFinishKeyMatching = true;
        clubDay.save();
        return clubDay;
    }

    async verifyGame(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not Existed');
        }

        if (clubDay.isFinishGame) {
            throw Error('Already Finish');
        }

        clubDay.isFinishGame = true;
        clubDay.save();
        return clubDay;
    }

    async verifyMathQuiz(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });

        if (!clubDay) {
            throw Error('Not Existed');
        }

        if (clubDay.isFinishMathQuiz) {
            throw Error('Already Finish');
        }

        clubDay.isFinishMathQuiz = true;
        await clubDay.save();
        return clubDay;
    }
}
