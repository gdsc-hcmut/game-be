import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';

import { DatabaseService } from './database.service';
import { USER_FORBIDDEN_FIELDS } from '../models/user.model';
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
import GameSession, { GameSessionDocument } from '../models/game_session.modal';

@injectable()
export class GameService {
    private userCollection: Collection;

    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService, // @inject(ServiceType.Bundle) private bundleService: BundleService, // @inject(ServiceType.Mail) private mailService: MailService,
    ) {}

    async createGameSessionWithoutUser(): Promise<GameSessionDocument> {
        let newGameSession = new GameSession();
        newGameSession.level = 1;
        newGameSession.createdAt = Date.now();
        await newGameSession.save();
        return newGameSession;
    }

    async createGameSessionWithUserLogin(
        userId: string,
    ): Promise<GameSessionDocument> {
        let newGameSession = new GameSession();
        newGameSession.level = 1;
        newGameSession.createdAt = Date.now();
        newGameSession.userId = userId;
        await newGameSession.save();
        return newGameSession;
    }

    async nextLevel(
        userId: string,
        sessionId: string,
    ): Promise<GameSessionDocument> {
        let newGameSession = await GameSession.findById(sessionId);
        if (newGameSession.userId != userId) {
            throw new ErrorUserInvalid('Missing input fields');
        }
        newGameSession.level = newGameSession.level + 1;
        await newGameSession.save();
        return newGameSession;
    }

    async getSessionById(sessionId: string): Promise<GameSessionDocument> {
        let newGameSession = await GameSession.findById(sessionId);
        return newGameSession;
    }

    async nextLevelWithoutLogin(
        sessionId: string,
    ): Promise<GameSessionDocument> {
        let newGameSession = await GameSession.findById(sessionId);
        if (newGameSession.userId) {
            throw new ErrorUserInvalid('Missing input fields');
        }
        newGameSession.level = newGameSession.level + 1;
        await newGameSession.save();
        return newGameSession;
    }

    async finishSession(sessionId: string): Promise<GameSessionDocument> {
        let newGameSession = await GameSession.findById(sessionId);
        newGameSession.finishAt = Date.now();
        await newGameSession.save();
        return newGameSession;
    }

    async getUserSessions(userId: string): Promise<GameSessionDocument[]> {
        const sessions = await GameSession.find({ userId }, { level: -1 });
        return sessions;
    }
}
