import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { AuthService } from '../services';
import passport from 'passport';
import { UserDocument } from '../models/user.model';
import { GameService } from '../services';
@injectable()
export class GameController extends Controller {
    public readonly router = Router();
    public readonly path = '/game';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Game) private gameService: GameService,
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
}
