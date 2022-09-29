import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _, { random } from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import {
    AuthService,
    ItemService,
    MarketplaceItemService,
    TransactionService,
    UserService,
} from '../services';
import passport from 'passport';
import { UserDocument } from '../models/user.model';
import { GameService } from '../services';
import { ErrorInvalidData } from '../lib/errors';
import { ItemDocument } from '../models/item.model';
import { BOX_PRICE, SYSTEM_ACCOUNT_ID } from '../config';
import RandomPool from '../models/random_pool.model';
@injectable()
export class GameController extends Controller {
    public readonly router = Router();
    public readonly path = '/game';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Game) private gameService: GameService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
    ) {
        super();

        // Confing child routes
        this.router.post(
            '/public/session',
            this.createNewSessionWithoutLogin.bind(this),
        );
        this.router.post(
            '/public/session/:sessionId/next',
            this.nextLevelWithoutLogin.bind(this),
        );
        this.router.get(
            '/public/session/:sessionId',
            this.getSessionById.bind(this),
        );

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/private/session', this.createNewSession.bind(this));
        this.router.post(
            '/private/session/:sessionId/finish',
            this.finishSession.bind(this),
        );
        this.router.post(
            '/private/session/:sessionId/next',
            this.nextLevel.bind(this),
        );
        this.router.post('/private/box', this.openMysteryBox.bind(this));
    }

    async createNewSessionWithoutLogin(req: Request, res: Response) {
        try {
            let newSession =
                await this.gameService.createGameSessionWithoutUser();
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async createNewSession(req: Request, res: Response) {
        try {
            let user = req.user as UserDocument;

            let newSession =
                await this.gameService.createGameSessionWithUserLogin(user.id);
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getSessionById(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;

            let newSession = await this.gameService.getSessionById(sessionId);
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async nextLevel(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;

            let user = req.user as UserDocument;

            let newSession = await this.gameService.nextLevel(
                user.id,
                sessionId,
            );
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async nextLevelWithoutLogin(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;

            let newSession = await this.gameService.nextLevelWithoutLogin(
                sessionId,
            );
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async finishSession(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;

            let newSession = await this.gameService.finishSession(sessionId);
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async openMysteryBox(req: Request, res: Response) {
        try {
            console.log('open mystery box... 🧃');
            const userId = req.tokenMeta.userId.toString();
            const balance = await this.userService.getUserBalance(userId);
            if (balance < BOX_PRICE) {
                throw new ErrorInvalidData('Not enough balance');
            }

            const randomPool = await RandomPool.findOne();

            function getRandomIndex(min: number = 0, max: number) {
                return Math.round(Math.random() * (max - min) + min);
            }

            const idx = getRandomIndex(0, randomPool.itemIds.length);
            const item = await this.itemService.getItemById(
                randomPool.itemIds[idx],
            );
            item.ownerId = userId;
            await item.save();
            const newTransaction =
                await this.transactionService.createNewTransaction(
                    userId,
                    SYSTEM_ACCOUNT_ID,
                    BOX_PRICE,
                );
            res.composer.success(item);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
