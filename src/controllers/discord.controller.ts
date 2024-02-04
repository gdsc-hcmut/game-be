import { NextFunction, Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import {
    AuthService,
    BudPickService,
    DiscordService,
    TransactionService,
    UserService,
} from '../services';
import { SYSTEM_ACCOUNT_ID } from '../config';
import { randomIntFromInterval } from '../lib/helper';
import { Types } from 'mongoose';
import Leaderboard from '../models/leaderboard.model';
@injectable()
export class DiscordController extends Controller {
    public readonly router = Router();
    public readonly path = '/discord';

    private readonly BUDPICK_EVENT_DURATION_DAYS = 7;
    private readonly BUDPICK_DATE_TIMESTAMP = [
        new Date('2024-02-09T00:00:00.0+07:00').getTime(),
    ];

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Discord) private discordService: DiscordService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
        @inject(ServiceType.BudPick) private budPickService: BudPickService,
    ) {
        super();

        this.initializeBudPickTimestamps();

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.all('*', this.validateSystemAccountToken.bind(this));
        this.router.get('/public/board', this.discordLeaderboard.bind(this));
        this.router.get(
            '/private/:discordId',
            this.getDiscordActivityInformation.bind(this),
        );
        this.router.get(
            '/private/users/:discordId',
            this.getUserInfo.bind(this),
        );
        this.router.post('/private/daily', this.discordDaily.bind(this));
        this.router.post('/private/work', this.discordWork.bind(this));
        this.router.post('/private/battle/start', this.startBattle.bind(this));
        this.router.post('/private/battle/end', this.endBattle.bind(this));

        // Bud pick event
        this.router.post('/private/bud/pick', this.budPick.bind(this));
        this.router.get(
            '/public/bud/statistics/previous_day',
            this.getPreviousDayBudPickStatistics.bind(this),
        );
    }

    private initializeBudPickTimestamps() {
        for (let i = 0; i < this.BUDPICK_EVENT_DURATION_DAYS; i++) {
            const date = new Date(
                _.last(this.BUDPICK_DATE_TIMESTAMP) + 24 * 60 * 60 * 1000,
            );
            this.BUDPICK_DATE_TIMESTAMP.push(date.getTime());
        }
        console.debug(
            `Timestamps for Bud Pick event:`,
            _.map(this.BUDPICK_DATE_TIMESTAMP, (timestamp) =>
                new Date(timestamp).toLocaleString('vi-VN'),
            ),
        );
    }

    private async validateSystemAccountToken(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        if (
            _.isNil(request.tokenMeta?.userId) ||
            request.tokenMeta.userId !== SYSTEM_ACCOUNT_ID.toString()
        ) {
            response.composer.unauthorized(
                `Only the system account can perform this action`,
            );
            return;
        }

        next();
    }

    private getBudPickDayAccordingToTimestamp(timestamp: number): number {
        const range = _.range(this.BUDPICK_EVENT_DURATION_DAYS);
        const day = _.find(
            range,
            (index) =>
                this.BUDPICK_DATE_TIMESTAMP[index] <= timestamp &&
                timestamp < this.BUDPICK_DATE_TIMESTAMP[index + 1],
        );
        if (timestamp < _.first(this.BUDPICK_DATE_TIMESTAMP)) {
            return -1;
        } else if (timestamp >= _.last(this.BUDPICK_DATE_TIMESTAMP)) {
            return this.BUDPICK_EVENT_DURATION_DAYS;
        } else {
            return day;
        }
    }

    public async budPick(request: Request, response: Response) {
        try {
            if (_.isNil(request.body.discordId)) {
                throw Error(`Field 'discordId' is required`);
            }

            const { discordId } = request.body;
            const user = await this.userService.getUserInfoByDiscordId(
                discordId,
            );
            if (_.isNil(user)) {
                throw Error(
                    `User with Discord ID ${discordId} not found. Account linking (with /connect) may be required`,
                );
            }
            const userId: Types.ObjectId = user._id;
            const now = Date.now();

            const day = this.getBudPickDayAccordingToTimestamp(now);

            if (day < 0 || day >= this.BUDPICK_EVENT_DURATION_DAYS) {
                throw Error(`Bud Pick event is not available at the moment`);
            }

            const alreadyPicked =
                await this.budPickService.userHasPickedBudOnDay(userId, day);

            if (alreadyPicked) {
                throw Error(`You have already picked a bud on day ${day + 1}`);
            }

            const coinsReceived = _.random(1000, 5000, false);
            await this.budPickService.recordBudPick(userId, day, coinsReceived);
            await this.transactionService.createNewTransactionFromSystem(
                userId,
                coinsReceived,
                `You received ${coinsReceived} coins from Bud Pick event`,
            );

            response.composer.success({
                coinsReceived,
                day: day + 1,
                daysLeft: this.BUDPICK_EVENT_DURATION_DAYS - day - 1,
            });
        } catch (error) {
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    public async getPreviousDayBudPickStatistics(
        _request: Request,
        response: Response,
    ) {
        try {
            const now = Date.now();

            const day = this.getBudPickDayAccordingToTimestamp(now);
            if (day <= 0) {
                throw Error(`No previous data found`);
            }

            const previousDay = day - 1;
            const budPicksCount = await this.budPickService.countBudPicksOnDay(
                previousDay,
            );

            response.composer.success({
                from: new Date(
                    this.BUDPICK_DATE_TIMESTAMP[previousDay],
                ).toISOString(),
                to: new Date(
                    this.BUDPICK_DATE_TIMESTAMP[previousDay + 1],
                ).toISOString(),
                day: previousDay + 1,
                budPicksCount,
            });
        } catch (error) {
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    async getDiscordActivityInformation(req: Request, res: Response) {
        try {
            const { discordId } = req.params;
            if (!discordId) {
                throw Error('Miss Discord ID');
            }
            let dis = await this.discordService.getDiscordActivity(
                req.params.discordId,
            );
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }

            res.composer.success(dis);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async discordDaily(req: Request, res: Response) {
        try {
            const { discordId } = req.body;
            if (!discordId) {
                throw Error('Miss Discord ID');
            }
            let dis = await this.discordService.getDiscordActivity(
                req.body.discordId,
            );
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }
            if (dis.isDaily) {
                res.composer.success({
                    isSuccess: false,
                    isDaily: true,
                });
                return;
            }
            const { streak } = dis;
            let coin = 0;
            coin = randomIntFromInterval((streak + 1) * 5, (streak + 1) * 10);
            await this.transactionService.createNewTransactionByDiscordId(
                SYSTEM_ACCOUNT_ID,
                discordId,
                coin,
                `You receive ${coin} from discord daily`,
            );
            dis.isDaily = true;
            dis.streak = dis.streak + 1;
            dis.save();
            res.composer.success({
                isSuccess: true,
                coin: coin,
                isDaily: true,
            });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async discordWork(req: Request, res: Response) {
        try {
            const { discordId } = req.body;
            if (!discordId) {
                throw Error('Miss Discord ID');
            }
            let dis = await this.discordService.getDiscordActivity(
                req.body.discordId,
            );
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }
            if (Date.now() - dis.lastWorkAt < 3600000) {
                var diff = 3600000 - Date.now() - dis.lastWorkAt;

                var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                diff -= days * (1000 * 60 * 60 * 24);

                var hours = Math.floor(diff / (1000 * 60 * 60));
                diff -= hours * (1000 * 60 * 60);

                var mins = Math.floor(diff / (1000 * 60));
                diff -= mins * (1000 * 60);

                var seconds = Math.floor(diff / 1000);
                diff -= seconds * 1000;
                res.composer.success({
                    isSuccess: false,
                    lastWorkat: dis.lastWorkAt,
                });
                return;
            }
            let coin = 0;
            coin = randomIntFromInterval(50, 150);
            await this.transactionService.createNewTransactionByDiscordId(
                SYSTEM_ACCOUNT_ID,
                discordId,
                coin,
                `You receive ${coin} from discord work`,
            );
            dis.lastWorkAt = Date.now();
            dis.save();
            res.composer.success({
                isSuccess: true,
                coin: coin,
                lastWorkat: dis.lastWorkAt,
            });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async startBattle(req: Request, res: Response) {
        try {
            const { player1DiscordId, player2DiscordId, point } = req.body;
            if (!player1DiscordId || !player2DiscordId || !point) {
                throw Error('Miss field');
            }
            let battle = await this.discordService.createBattle(
                player1DiscordId,
                player2DiscordId,
                point,
            );
            res.composer.success({
                isSuccess: true,
                battle,
            });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async endBattle(req: Request, res: Response) {
        try {
            const { winnerDiscordID, battleId } = req.body;
            if (!winnerDiscordID || !battleId) {
                throw Error('Miss field');
            }
            let battle = await this.discordService.endBattle(
                new Types.ObjectId(battleId),
                winnerDiscordID,
            );
            res.composer.success({
                isSuccess: true,
                battle,
            });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getUserInfo(req: Request, res: Response) {
        try {
            const { discordId } = req.params;
            if (!discordId) {
                throw Error('Miss Discord ID');
            }
            let dis = await this.userService.getUserInfoByDiscordId(discordId);
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }

            res.composer.success(dis);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async discordLeaderboard(req: Request, res: Response) {
        try {
            const leaderboard = await Leaderboard.find()
                .sort({ createdAt: -1 })
                .limit(1);
            res.composer.success(leaderboard);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
