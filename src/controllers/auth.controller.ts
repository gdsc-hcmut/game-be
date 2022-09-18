import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { AuthService } from '../services';
import passport from 'passport';
import { UserDocument } from '../models/user.model';
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
                );
                console.log(req.user, 'Ahihi');
                res.redirect(`http://localhost:3000/login?token=${token}`);
            },
        );
        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
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
            await this.authService.recoverPasswordRequest(email);
            res.composer.success('Email sent');
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
