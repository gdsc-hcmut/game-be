import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _, { random } from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import {
    AuthService,
    ClubDayService,
    ItemService,
    MarketplaceItemService,
    TransactionService,
    UserService,
} from '../services';
import passport from 'passport';
import { UserDocument, USER_ROLES } from '../models/user.model';
import { GameService } from '../services';
import { ErrorInvalidData } from '../lib/errors';
import { ItemDocument } from '../models/item.model';
import { BOX_PRICE, GIFT_THRESHOLD, SYSTEM_ACCOUNT_ID } from '../config';
import RandomPool from '../models/random_pool.model';
import BookFair from '../models/book_fair';
import { generateGameField } from '../game/game-logic';
import levels from '../game/levels.json';
import { LevelInfo } from '../models/game_session.modal';
@injectable()
export class ClubDayController extends Controller {
    public readonly router = Router();
    public readonly path = '/clubday';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Game) private gameService: GameService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.ClubDay) private clubdayService: ClubDayService,
    ) {
        super();

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.get('/private/', this.getClubDay.bind(this));
        this.router.post('/private/', this.createClubDay.bind(this));
        this.router.patch('/private/', this.updateClubDay.bind(this));
        this.router.post('/private/verify', this.verifyGame.bind(this));
    }

    async getClubDay(req: Request, res: Response) {
        try {
            let clubDay = await this.clubdayService.getUserClubDay(
                req.tokenMeta.userId.toString(),
            );

            res.composer.success(clubDay);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async createClubDay(req: Request, res: Response) {
        try {
            let userClubday = await this.clubdayService.getUserClubDay(
                req.tokenMeta.userId.toString(),
            );
            if (userClubday) {
                res.composer.badRequest('');
                return;
            }

            if (!req.body.name || !req.body.studentId) {
                throw Error('Miss Field');
            }

            var clubDay = await this.clubdayService.createClubDay(
                req.tokenMeta.userId.toString(),
                req.body.name,
                req.body.studentId,
            );

            res.composer.success(clubDay);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async updateClubDay(req: Request, res: Response) {
        try {
            let userClubday = await this.clubdayService.getUserClubDay(
                req.tokenMeta.userId.toString(),
            );
            if (!userClubday) {
                res.composer.badRequest('');
                return;
            }
            var clubDay = await this.clubdayService.updateClubDay(
                req.tokenMeta.userId.toString(),
                req.body?.name,
                req.body?.studentId,
            );

            res.composer.success(clubDay);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async verifyGame(req: Request, res: Response) {
        try {
            let user = req.user as UserDocument;

            if (!_.includes(user.roles, USER_ROLES.STAFF_CLUBDAY_VERIFY)) {
                throw Error('You are not Staff of Club Day');
            }

            let clubDay;
            if (req.body.type === 'key_matching')
                clubDay = await this.clubdayService.verifyKeyMatching(
                    req.tokenMeta.userId.toString(),
                );
            else
                clubDay = await this.clubdayService.verifyCheckIn(
                    req.tokenMeta.userId.toString(),
                );
            res.composer.success('Success');
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
