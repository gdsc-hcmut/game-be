import { injectable, inject } from 'inversify';
import crypto from 'crypto';
import passport from 'passport';
import {
    Strategy,
    ExtractJwt,
    StrategyOptions,
    VerifiedCallback,
} from 'passport-jwt';
import jwt from 'jwt-simple';
import { NextFunction } from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import moment from 'moment';
// import { Collection, ObjectID, ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import passportGoogle from 'passport-google-oauth20';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    WhitelistDomain,
} from '../config';
import User, { UserDocument, USER_ROLES } from '../models/user.model';
import { parseTokenMeta } from '../models/token.model';
const GoogleStrategy = passportGoogle.Strategy;

import {
    JWT_SECRET,
    TOKEN_TTL,
    SocialAccountType,
    FE_ADDRESS,
    EMAIL_SENDER,
    HASH_ROUNDS,
} from '../config';
import { Request, Response, ServiceType } from '../types';
import { ErrorUserInvalid } from '../lib/errors';

import { DatabaseService } from './database.service';
import { UserService } from './user.service';
import Token, { TokenDocument } from '../models/token.model';
import { FacebookAPI } from '../apis/facebook';
import { ZaloZPI } from '../apis/zalo';
// import { MailService } from '.';
import { lazyInject } from '../container';
import { hashingPassword } from '../lib/helper';
import PingHistoryModel from '../models/user-ping.model';
@injectable()
export class AuthService {
    @lazyInject(ServiceType.User) private userService: UserService;
    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService, // @inject(ServiceType.Mail) private mailService: MailService,
    ) {
        console.log('[Auth Service] Construct');
    }

    applyMiddleware() {
        const options: StrategyOptions = {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        const strategyJwt = new Strategy(
            options,
            this.verifyAccountCode.bind(this),
        );
        passport.use(strategyJwt);

        const strategy = new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/redirect',
            },
            async (accessToken, refreshToken, profile, done) => {
                const user = await User.findOne({ googleId: profile.id });
                // If user doesn't exist creates a new user. (similar to sign up)
                if (!user) {
                    const newUser = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0].value,
                        picture: profile._json.picture,
                        roles: USER_ROLES.USER,
                        // we are using optional chaining because profile.emails may be undefined.
                    });
                    if (newUser) {
                        done(null, newUser);
                    }
                } else {
                    console.log(profile._json.picture);
                    if (user.picture !== profile._json.picture) {
                        user.picture = profile._json.picture;
                        user.save();
                    }
                    done(null, user);
                }
                // console.log('Profile', profile);
            },
        );

        passport.use(strategy);

        passport.serializeUser((user: UserDocument, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            const user: UserDocument = await User.findById(id);
            done(null, user);
        });

        return passport.initialize();
    }

    async verifyAccountCode(payload: any, done: VerifiedCallback) {
        const tokenMeta = parseTokenMeta(payload);

        try {
            const token = await Token.findOne({
                _id: tokenMeta._id,
            });
            if (token) {
                return done(null, tokenMeta);
            }

            return done(null, false, 'Invalid token');
        } catch (error) {
            done(error, null);
        }
    }

    authenticate(block = true) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                passport.authenticate('jwt', async (err, tokenMeta, info) => {
                    req.tokenMeta = tokenMeta;

                    if (block && _.isEmpty(tokenMeta)) {
                        res.composer.unauthorized();
                        PingHistoryModel.create({
                            userId: '',
                            pingAt: Date.now(),
                            domain: WhitelistDomain.gic,
                        });
                        return;
                    }
                    PingHistoryModel.create({
                        userId: new Types.ObjectId(tokenMeta?.userId),
                        pingAt: Date.now(),
                        domain: WhitelistDomain.gic,
                    });

                    next();
                })(req, res, next);
            } catch (err: any) {
                console.log(err);
            }
        };
    }

    private async createToken(
        userId: string,
        googleId: string,
        userAgent: string,
        roles: Array<USER_ROLES>,
    ) {
        const result = await Token.create({
            googleId,
            userAgent,
            userId,
            createdAt: moment().unix(),
            expiredAt: moment().unix() + TOKEN_TTL,
            roles,
        });
        const EncodeToken = jwt.encode(
            {
                _id: result._id,
                googleId,
                userAgent,
                userId,
                createdAt: moment().unix(),
                expiredAt: moment().unix() + TOKEN_TTL,
                roles,
            },
            JWT_SECRET,
        );

        // const createdToken = result.ops[0] as TokenDocument;
        return EncodeToken;
    }

    async generateTokenUsingUsername(
        userId: string,
        googleId: string,
        email: string,
        roles: Array<USER_ROLES>,
    ) {
        return await this.createToken(userId, googleId, email, roles);
    }

    async generateTokenGoogle(user: UserDocument, roles: Array<USER_ROLES>) {
        if (_.isEmpty(user)) {
            throw new ErrorUserInvalid('User not exist');
        }

        return await this.createToken(
            user._id,
            user.googleId,
            user.email,
            roles,
        );
    }

    async generateTokenUsingSocialAccount(
        type: SocialAccountType,
        accessToken: string,
        userAgent: string,
        roles: Array<USER_ROLES>,
    ) {
        // Verify token
        let queryResponse = null;

        switch (type) {
            case SocialAccountType.Facebook:
                queryResponse = await FacebookAPI.queryUserData(accessToken);
                break;
            case SocialAccountType.Zalo:
                queryResponse = await ZaloZPI.queryUserData(accessToken);
                break;
            default:
                throw new Error('Invalid Social type');
        }

        const userData = queryResponse.data;

        console.log(`[${type}] User Data`, userData);
        const { id } = userData;

        if (_.isEmpty(id)) {
            throw new Error('Invalid id / Login error');
        }

        let userId = null;
        try {
            const user = await this.userService.findOne(
                { [`social.${type}.id`]: id },
                true,
            );
            userId = user._id;
        } catch (error) {
            console.log('[Social Login Error]');
            console.log('Create user record for Facebook');
            // userId = (await this.userService.createSocial(type, userData))._id;
        }

        return await this.createToken(userId, userId, userAgent, roles);
    }

    async recoverPasswordRequest(email: string) {
        let user = null;
        try {
            user = await this.userService.findOne({ email }, true);
        } catch (err) {
            throw new Error(
                `The email address that you've entered doesn't match any account.`,
            );
        }

        const recoverPasswordCode = crypto.randomBytes(20).toString('hex');

        await this.userService.updateOne(user._id, {
            recoverPasswordCode,
            recoverPasswordExpires: moment().add(2, 'hours').unix(),
        });

        const msgTitle = `Bugs account recovery link`;
        const msgContent = `Hello Bugdy,
    
We received a request to recover your password.
Click on the following link (existing in the 2 hours) to reset your password:
${FE_ADDRESS}auth/recover-password?recoverPasswordCode=${recoverPasswordCode}

Thanks!
- Team BUGS -`;

        // await this.mailService.send(EMAIL_SENDER, email, msgTitle, msgContent);
    }

    async recoverPassword(recoverPasswordCode: string, newPassword: string) {
        let user = null;
        try {
            user = await this.userService.findOne(
                { recoverPasswordCode },
                true,
            );
        } catch (err) {
            throw new Error(
                `The email address that you've entered doesn't match any account.`,
            );
        }

        // if (user.recoverPasswordCode != recoverPasswordCode)
        //     throw new Error(
        //         `The link you have followed has expired or invalid.`,
        //     );

        newPassword = await bcrypt.hash(newPassword, HASH_ROUNDS);

        await this.userService.updateOne(user._id, {
            password: newPassword,
            recoverPasswordCode: null,
            recoverPasswordExpires: 0,
        });

        // await this.tokenCollection.remove({ userId: user._id });
    }

    // async generateTokenForZalo(accessToken: string, userAgent: string) {
    //     // Verify token
    //     const queryResponse = await ZaloZPI.queryUserData(accessToken);
    //     const userData = queryResponse.data;

    //     console.log('User Data', userData);
    //     const { id, name } = userData;

    //     if (_.isEmpty(id)) {
    //         throw new Error('Invalid id / Login error');
    //     }

    //     let user = await UserService.findOne({ social: { facebook: '', zalo: id, gmail: '' } });
    //     if (_.isEmpty(user)) {
    //         console.log('Create user record for Zalo');
    //         user = await UserService.createZalo(id, name);
    //     }

    //     const token = await TokenModel.create({ userId: user._id, userAgent });
    //     const payload = { id: user._id, tokenId: token.id };

    //     return jwt.encode(payload, JWT_SECRET);
    // }
}
