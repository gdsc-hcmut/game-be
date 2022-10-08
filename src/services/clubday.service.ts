import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';

import { DatabaseService } from './database.service';
import User, { USER_FORBIDDEN_FIELDS } from '../models/user.model';
import { ErrorUserInvalid } from '../lib/errors';
import {
    HASH_ROUNDS,
    SocialAccountType,
    VERIRY_CODE_TTL,
    VERIFY_CODE_LENGTH,
    EMAIL_SENDER,
} from '../config';
// import { BundleService } from './bundle.service';
import { ServiceType } from '../types';
import { randomPassword, encodeObjectId } from '../lib/helper';
// import { MailService } from '.';
import { UserDocument } from '../models/user.model';
import GameSession, {
    GameSessionDocument,
    LevelInfo,
} from '../models/game_session.modal';
import levels from '../game/levels.json';
import { generateGameField } from '../game/game-logic';
import ClubDay, { ClubDayDocument } from '../models/club_day';

let INIT_LEVEL = 0;
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
        clubDay.save();
        return clubDay;
    }
}
