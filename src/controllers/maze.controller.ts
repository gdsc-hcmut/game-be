import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from './controller';

import { Request, Response, ServiceType } from '../types';
import { AuthService, MazeService } from '../services';
import { Types } from 'mongoose';

@injectable()
export class MazeController extends Controller {
    public readonly router = Router();
    public readonly path = '/';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Maze) private mazeService: MazeService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate());
        // this.router.get('/maze/start', this.mazeService.startGame());
        this.router.get('/maze/start', this.createNewSession.bind(this));
        this.router.get('/maze/round/:id', this.createNewSession.bind(this));
    }

    async createNewSession(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);

            const newSession = await this.mazeService.startGame(userId);
            res.composer.success(newSession);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async createNewRound(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const round = req.params.id;
            const newRoundGame = await this.mazeService.startRound(
                round,
                userId,
            );
            res.composer.success(newRoundGame);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
