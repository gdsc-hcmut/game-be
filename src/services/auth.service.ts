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
import mongoose from 'mongoose';
import passportGoogle from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, USER_WHITE_LIST } from '../config';
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
import { getBearerTokenFromAuthHeader, hashingPassword } from '../lib/helper';
import admin from 'firebase-admin';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import serviceAccountJSON from '../serviceAccount.json';

const serviceAccount = JSON.stringify(serviceAccountJSON);

@injectable()
export class AuthService {
    @lazyInject(ServiceType.User) private userService: UserService;
    private app: admin.app.App;
    private auth: admin.auth.Auth;
    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService,
    ) {
        console.log('[Auth Service] Construct');

        // Init Firebase
        this.app = admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });

        this.auth = getAuth(this.app);
        console.log('[Firebase] Connected')
    }

    authenticate(block = true) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const idToken = getBearerTokenFromAuthHeader(req);

                if (!idToken) throw Error("Invalid Token");

                const idTokenPayload = await this.auth.verifyIdToken(idToken)
                    .catch(() => {
                        res.composer.unauthorized();
                        return;
                    }) as DecodedIdToken;

                // TODO: Check email verified and phone number
                // TODO: Session

                if (process.env.ENV == 'dev' && !_.includes(
                    USER_WHITE_LIST.map((e) => e.email),
                    idTokenPayload.email,
                )) res.redirect(`https://fessior.com/notpermission`);

                let user: UserDocument = await this.userService.findOne({ email: idTokenPayload.email });

                if (!user) {
                    user = new User({
                        name: idTokenPayload?.name || idTokenPayload?.email,
                        email: idTokenPayload.email,
                        picture: idTokenPayload.picture,
                        phone: idTokenPayload.phone_number,
                        roles: USER_ROLES.USER,
                    });

                    if (idTokenPayload.firebase?.identities["google.com"]?.length > 0) {
                        user.googleId = idTokenPayload.firebase?.identities["google.com"][0];
                    }

                    user.save();
                }

                let tokenMeta: TokenDocument = await Token.findOne({ userId: user._id });

                if (!tokenMeta) tokenMeta = await Token.create({
                    userId: user._id,
                    createdAt: idTokenPayload.iat,
                    expiredAt: idTokenPayload.exp,
                    roles: user.roles,
                })

                req.tokenMeta = tokenMeta;

                req.user = user;

                next();
            } catch (err: any) {
                res.composer.badRequest(err);
            }
        };
    }
}
