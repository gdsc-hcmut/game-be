import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _, { random } from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import {
    AuthService,
    ClubDayService,
    DiscordService,
    ItemService,
    MarketplaceItemService,
    TransactionService,
    UserService,
} from '../services';
import passport from 'passport';
import { UserDocument, USER_ROLES } from '../models/user.model';
import { GameService } from '../services';
import { Reward } from '../models/club_day';
import { SYSTEM_ACCOUNT_ID } from '../config';
import { randomIntFromInterval } from '../lib/helper';
@injectable()
export class DiscordController extends Controller {
    public readonly router = Router();
    public readonly path = '/discord';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Game) private gameService: GameService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.ClubDay) private clubdayService: ClubDayService,
        @inject(ServiceType.Discord) private discordService: DiscordService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
    ) {
        super();

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.get(
            '/private/:discordId',
            this.getDiscordActivityInformation.bind(this),
        );
        this.router.post('/private/daily', this.discordDaily.bind(this));
        this.router.post('/private/work', this.discordWork.bind(this));
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
            coin = randomIntFromInterval(streak * 5, streak * 10);
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
            coin = randomIntFromInterval(100, 250);
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
                lastWorkat: dis.lastWorkAt,
            });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
