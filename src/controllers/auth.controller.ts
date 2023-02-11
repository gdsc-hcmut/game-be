import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import User, { USER_ROLES } from '../models/user.model';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { AuthService } from '../services';
import passport from 'passport';
import { UserDocument } from '../models/user.model';
import { TokenDocument } from '../models/token.model';
@injectable()
export class AuthController extends Controller {
    public readonly router = Router();
    public readonly path = '/auth';

    constructor(@inject(ServiceType.Auth) private authService: AuthService) {
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
                let user = req.user as UserDocument;
                let token = await this.authService.generateTokenUsingUsername(
                    user._id,
                    user.googleId,
                    user.email,
                    user.roles,
                );
                res.redirect(`https://game.gdsc.app/login?token=${token}`);
            },
        );
        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/discordconnect', this.discordConnect.bind(this));
        this.router.post('/verify', this.verify.bind(this));
        this.router.post('/code', this.code.bind(this));
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

            if (!user) {
                throw Error(
                    'Please first sign up in https://game.gdsc.app/, user not exist',
                );
            }

            if (user.verifyDiscordCode) {
                throw Error(
                    'Verify code already created, please go to https://game.gdsc.app/connect to connect',
                );
            }

            if (user.verifyDiscordCodeAt) {
                throw Error('Email already linked to GDSC Game');
            }

            user.discordId = discordId;
            user.verifyDiscordCode = Math.floor(
                100000 + Math.random() * 900000,
            );
            user.save();
            res.composer.success('Verify discord code created');
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

    async transGcoinFromDiscord(req: Request, res: Response) {
        const { discordId, code } = req.body;
        let { roles } = req.tokenMeta as TokenDocument;

        try {
            if (!_.includes(roles, USER_ROLES.SYSTEM)) {
                throw Error('Permission Error');
            }

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
                throw Error('Verify code not existed, please type /connect');
            }

            if (user.verifyDiscordCodeAt) {
                throw Error('Email already linked to GDSC Game');
            }

            if (code != user.verifyDiscordCode) {
                throw Error('Verify code not match!');
            }

            user.verifyDiscordCodeAt = Date.now();
            user.save();
            res.composer.success('Verify discord code success');
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
