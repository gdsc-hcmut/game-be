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
                req.params.discordId,
            );
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }
            if (dis.isDaily) {
                throw Error('You have already get the daily coin today');
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

            res.composer.success(dis);
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
                req.params.discordId,
            );
            if (!dis) {
                throw Error(
                    'DiscordId not existed, user may need to connect to GDSC Game by /connect <email>',
                );
            }
            if (dis.isDaily) {
                throw Error('You have already get the daily coin today');
            }
            let coin = 0;
            coin = randomIntFromInterval(dis.streak * 5, dis.streak * 10);
            await this.transactionService.createNewTransactionByDiscordId(
                SYSTEM_ACCOUNT_ID,
                discordId,
                coin,
                `You receive ${coin} from discord daily`,
            );
            dis.isDaily = true;
            dis.streak = dis.streak + 1;

            res.composer.success(dis);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
