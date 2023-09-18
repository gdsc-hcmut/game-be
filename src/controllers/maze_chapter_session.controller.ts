import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from './controller';

import { Request, Response, ServiceType } from '../types';
import { AuthService, MazeChapterSessionService } from '../services';
import { Types } from 'mongoose';

@injectable()
export class MazeChapterSessionController extends Controller {
    public readonly router = Router();
    public readonly path = '/maze-chapter-session';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.MazeChapterSession)
        private mazeChapterSessionService: MazeChapterSessionService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate());
        this.router.post('/', this.startChapterSession.bind(this));
        this.router.post('/:id/maze-session', this.startMazeSession.bind(this));
        // this.router.get('/:id', this.getChapterSession.bind(this));
        // this.router.get('/score/total', this.getTotalScore.bind(this));
        this.router.get('/:id/score', this.getChapterScore.bind(this));
    }

    async startChapterSession(req: Request, res: Response) {
        try {
            // console.log(req.tokenMeta.userId);
            // const userId = new Types.ObjectId(req.body.userId);
            const { chapterLevel, team } = req.body;
            const teamId = new Types.ObjectId(team);

            const result =
                await this.mazeChapterSessionService.startChapterSession(
                    // userId,
                    teamId,
                    chapterLevel,
                );

            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async startMazeSession(req: Request, res: Response) {
        try {
            const teamId = new Types.ObjectId(req.body.teamId);
            const chapterId = new Types.ObjectId(req.params.id);

            const { round } = req.body;

            const result =
                await this.mazeChapterSessionService.startMazeSession(
                    teamId,
                    chapterId,
                    round,
                );

            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getChapterScore(req: Request, res: Response) {
        try {
            const chapterSessionId = new Types.ObjectId(req.params.id);

            const result = await this.mazeChapterSessionService.getChapterScore(
                chapterSessionId,
            );

            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    // async getTotalScore(req: Request, res: Response) {
    //     try {
    //         const userId = new Types.ObjectId(req.tokenMeta.userId);

    //         console.log(userId);
    //         const result = await this.mazeChapterSessionService.getTotalScore(
    //             userId,
    //         );
    //         console.log(result);

    //         res.composer.success(result);
    //     } catch (error) {
    //         console.log(error);
    //         res.composer.badRequest(error.message);
    //     }
    // }
}
