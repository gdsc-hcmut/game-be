import { injectable } from 'inversify';
import _ from 'lodash';
import ClubDay, { ClubDayDocument } from '../models/club_day';

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
