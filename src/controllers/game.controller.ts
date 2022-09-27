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
        this.router.post('/private/wheel', this.spinWheel.bind(this));
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

    async spinWheel(req: Request, res: Response) {
        try {
            console.log('spinnnnnnnnnnn');

            const userId = req.tokenMeta.userId.toString();
            const balance = await this.userService.getUserBalance(userId);
            // TODO: Extract to CONSTANT
            if (balance < 1000) {
                throw new ErrorInvalidData('Not enough balance');
            }
            const wheelItems = ['A', 'B', 'C', 'D', 'E', 'F'];
            function getRandomIndex(min: number = 0, max: number = 6) {
                return Math.round(Math.random() * (max - min) + min);
            }
            const idx = getRandomIndex();
            const newItem: ItemDocument = {
                ownerId: userId,
                name: `Chu ${wheelItems[idx]}`,
                imgUrl: 'https://drive.google.com/file/d/1nnlqFKLJntnqOugrtYVl7JQT9JvR1Ayf/view?usp=sharing',
                description: 'Hihiihihihi',
                value: wheelItems[idx],
            } as any;

            const nItem = await this.itemService.createNewItem(newItem);
            const newTransaction =
                await this.transactionService.createNewTransaction(
                    userId,
                    '633015d8913376839c72e7f0',
                    1000,
                );
            res.composer.success(nItem);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
