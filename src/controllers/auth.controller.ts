import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import User, { USER_ROLES } from '../models/user.model';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { AuthService, TransactionService } from '../services';
import passport from 'passport';
import { UserDocument } from '../models/user.model';
import { TokenDocument } from '../models/token.model';
import { SYSTEM_ACCOUNT_ID, USER_WHITE_LIST, WhitelistDomain } from '../config';
import DiscordBattle from '../models/discord_battle';
import DiscordActivity from '../models/discord_activity';
import LoginHistoryModel from '../models/login-history.model';
import { Types } from 'mongoose';

@injectable()
export class AuthController extends Controller {
    public readonly router = Router();
    public readonly path = '/auth';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
    ) {
        super();

        // Confing child routes
        this.router.post('/login', this.login.bind(this));
        this.router.get(
            '/google',
            passport.authenticate('google', {
                scope: ['email', 'profile'],
            }),
        );
        this.router.get(
            '/google/redirect',
            passport.authenticate('google', {
                scope: ['email', 'profile'],
            }),
            async (req, res) => {
                try {
                    let user = req.user as UserDocument;
                    let token =
                        await this.authService.generateTokenUsingUsername(
                            user._id,
                            user.googleId,
                            user.email,
                            user.roles,
                        );
                    let redirectDomain: WhitelistDomain =
                        (req?.query?.domain as WhitelistDomain) ??
                        WhitelistDomain.game;

                    // track login information
                    await LoginHistoryModel.create({
                        userId: new Types.ObjectId(user._id),
                        email: user.email,
                        loginAt: Date.now(),
                        domain: redirectDomain,
                    });

                    if (process.env.ENV != 'dev') {
                        res.redirect(
                            `https://${redirectDomain}/login?token=${token}`,
                        );
                    }
                    if (
                        _.includes(
                            USER_WHITE_LIST.map((e) => e.email),
                            user.email,
                        )
                    ) {
                        res.redirect(
                            `https://dev.${redirectDomain}/login?token=${token}`,
                        );
                    } else res.redirect(`https://fessior.com/notpermission`);
                } catch (err) {
                    res.send(err);
                }
            },
        );
        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/discordconnect', this.discordConnect.bind(this));
        this.router.post('/verify', this.verify.bind(this));
        this.router.post('/code', this.code.bind(this));
        this.router.get('/syncnewmodal', this.syncNewModal.bind(this));
        this.router.post('/unconnectdiscord', this.unConnectDiscord.bind(this));
        this.router.post('/transgcoin', this.transGcoinFromDiscord.bind(this));
        this.router.get('/ping', (req, res) => {
            res.send('Success');
        });
        // this.router.post('/logout', AuthService.authenticate, this.logout);
        this.router.post(
            '/recover-password-request',
            this.recoverPasswordRequest.bind(this),
        );
        this.router.post('/recover-password', this.recoverPassword.bind(this));
    }

    async login(req: Request, res: Response) {
        const { username, password, accessToken } = req.body;
        let token = '';

        try {
            // token = await this.authService.generateTokenUsingUsername(
            //     username,
            //     password,
            //     req.useragent.source,
            // );

            res.composer.success({ hi: 123 });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async recoverPasswordRequest(req: Request, res: Response) {
        const { email: rawEmail } = req.body;
        const email = _.trim(rawEmail).toLowerCase().toString();

        try {
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async discordConnect(req: Request, res: Response) {
        const { discordId, email } = req.body;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }
            const user = await User.findOne({ email: email });
            const discord = await User.findOne({ discordId: discordId });

            if (discord) {
                throw Error(
                    `Your account discord already link to ${discord.email}`,
                );
            }

            if (!user) {
                throw Error(
                    'Please sign up first with your email at https://game.gdsc.app/, then back to discord type /connect <email> again',
                );
            }

            if (user.verifyDiscordCodeAt) {
                throw Error('Email already linked to GDSC Game');
            }

            if (user.verifyDiscordCode) {
                throw Error(
                    'Verify code already created, please go to https://game.gdsc.app/connect to get your code, then back to discord type /verify <code> to link your account',
                );
            }

            user.discordId = discordId;
            user.verifyDiscordCode = Math.floor(
                100000 + Math.random() * 900000,
            );
            user.save();
            res.composer.success(
                'A verify code has been created. Please check https://game.gdsc.app/connect to get the code, then back type /verify <code> to link your account',
            );
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async unConnectDiscord(req: Request, res: Response) {
        const { discordId, code } = req.body;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }
            const user = await User.findOne({ discordId: discordId });

            user.verifyDiscordCode = 0;
            user.verifyDiscordCodeAt = 0;
            user.discordId = '';
            user.save();
            res.composer.success('Verify discord code success');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async syncNewModal(req: Request, res: Response) {
        const { discordId, code } = req.body;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }
            const users = await User.find();
            users.map(async (e) => {
                if (e.discordId) {
                    const dis = await DiscordActivity.findOne({
                        discordId: e.discordId,
                    });
                    if (dis) return;
                    new DiscordActivity({
                        discordId: e.discordId,
                        userId: e._id,
                    }).save();
                }
            });
            res.composer.success('Sync success');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async transGcoinFromDiscord(req: Request, res: Response) {
        type DiscordReceive = {
            discordId: string;
            point: number;
        };
        const data: DiscordReceive[] = req.body.data;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }
            data.map(async (e) => {
                await this.transactionService.createNewTransactionByDiscordId(
                    SYSTEM_ACCOUNT_ID,
                    e.discordId,
                    e.point,
                    `You have received ${e.point} from Discord Bot because you play the Weekly Minigame`,
                );
            });
            res.composer.success('Update Success all user');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async verify(req: Request, res: Response) {
        const { discordId, code } = req.body;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }
            const user = await User.findOne({ discordId: discordId });

            if (!user) {
                throw Error(
                    'Please first sign up in https://game.gdsc.app/, user not exist',
                );
            }

            if (!user.verifyDiscordCode) {
                throw Error(
                    'Verify code not existed, please type /connect <email> to connect to GDSC Game',
                );
            }

            if (user.verifyDiscordCodeAt) {
                throw Error('Your account has been linked.');
            }

            if (code != user.verifyDiscordCode) {
                throw Error('Verify code not match!');
            }

            user.verifyDiscordCodeAt = Date.now();
            user.save();
            const discord = new DiscordActivity({
                userId: user._id,
                discordId: discordId,
            });
            discord.save();
            res.composer.success(
                'Verification successful! Welcome to GDSC Game',
            );
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async code(req: Request, res: Response) {
        const { discordId } = req.body;
        let { roles, userId } = req.tokenMeta as TokenDocument;

        try {
            const user = await User.findById(userId);
            if (!user) {
                throw Error(
                    'Please first sign up in https://game.gdsc.app/, user not exist',
                );
            }

            if (!user.verifyDiscordCode) {
                throw Error(
                    'Verify code not existed, please type /connect on discord',
                );
            }

            if (user.verifyDiscordCodeAt) {
                throw Error('Email already linked to GDSC Game');
            }

            res.composer.success({ verifyCode: user.verifyDiscordCode });
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async recoverPassword(req: Request, res: Response) {
        const { password, recoverPasswordCode } = req.body;

        try {
            await this.authService.recoverPassword(
                recoverPasswordCode,
                password,
            );
            res.composer.success('Password recovered');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
}
