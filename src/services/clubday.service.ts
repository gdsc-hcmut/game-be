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
        email: string,
        name: string,
        studentId: string,
    ): Promise<ClubDayDocument> {
        let newClubDay = new ClubDay();
        newClubDay.userId = userId;
        newClubDay.email = email;
        newClubDay.name = name;
        newClubDay.studentId = studentId;
        newClubDay.save();
        return newClubDay;
    }

    async updateClubDay(
        userId: string,
        email?: string,
        name?: string,
        studentId?: string,
    ): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });
        if (email) clubDay.email = email;
        if (name) clubDay.name = name;
        if (studentId) clubDay.studentId = studentId;
        clubDay.save();
        return clubDay;
    }

    async getUserClubDay(userId: string): Promise<ClubDayDocument> {
        let clubDay = await ClubDay.findOne({ userId: userId });
        return clubDay;
    }
}
