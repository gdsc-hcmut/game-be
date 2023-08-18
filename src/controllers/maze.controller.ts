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
        this.router.get('/maze/round/:id', this.createNewMap.bind(this));
        this.router.get('/maze/start', this.startSession.bind(this));
    }

    async createNewMap(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const newMap = await this.mazeService.createMap(id);
            res.composer.success(newMap);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async startSession(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);

            const session = await this.mazeService.startSession(userId);
            res.composer.success(session);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
