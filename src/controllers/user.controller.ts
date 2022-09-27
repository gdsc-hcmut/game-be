import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';

// import { User } from '../models/user.model';
import {
    UserService,
    // BundleService,
    // MailService,
    AuthService,
} from '../services';
import { ObjectID, ObjectId } from 'mongodb';
import { EMAIL_SENDER, LIMIT_PAGING } from '../config';
import { Bundle } from '../models/bundle.model';
import { LeetCode } from 'leetcode-query';
import User, { UserDocument } from '../models/user.model';
import { ErrorNotFound, ErrorUserInvalid } from '../lib/errors';

@injectable()
export class UserController extends Controller {
    public readonly router = Router();
    public readonly path = '/users';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService,
    ) {
        super();

        // Confing child routes
        this.router.post('/', this.createUser.bind(this));
        this.router.get(
            '/leetcode/:username',
            this.findLeetcodeUser.bind(this),
        );

        // this.router.post(
        //     '/verify-account-request',
        //     this.verifyAccountRequest.bind(this),
        // );
        // this.router.post('/verify-account', this.verifyAccount.bind(this));

        this.router.all('*', this.authService.authenticate(false));

        this.router.get('/', this.getUsers.bind(this));
        this.router.get('/me', this.getMe.bind(this));
        this.router.patch('/me', this.updatePrivate.bind(this));
        this.router.get('/balance', this.getUserBalance.bind(this));
        this.router.patch('/balance', this.increaseBalance.bind(this)); // TODO: Test only
        this.router.get('/search', this.getByKeyword.bind(this));
        this.router.get('/:username', this.getByUsername.bind(this));
        this.router.get('/:userid/bundles', this.getBundles.bind(this));
        this.router.get('/:userid/following', this.getFollowing.bind(this));
        this.router.get('/:userid/followers', this.getFollower.bind(this));
    }

    // public async shouldFilterData(req: Request) {
    //     const { userid } = req.params;
    //     const { userId: tokenUserId } = req.tokenMeta;
    //     const user = await this.userService.findOne({
    //         _id: ObjectID.createFromHexString(userid),
    //     });

    //     return !(tokenUserId && userid == tokenUserId.toHexString());
    // }

    async createUser(req: Request, res: Response) {
        // const user: UserDocument = _.pick(req.body, [
        //     'username',
        //     'password',
        // ]) as any;
        // try {
        //     const createdUser = await this.userService.create(user);
        //     // await this.userService.verifyAccountRequest(createdUser.email);
        //     res.composer.success(createdUser._id);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async verifyAccountRequest(req: Request, res: Response) {
        // const { email: rawEmail } = req.body;
        // const email = _.trim(rawEmail).toLowerCase().toString();
        // try {
        //     res.composer.success(
        //         await this.userService.verifyAccountRequest(email),
        //     );
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async verifyAccount(req: Request, res: Response) {
        // const { verifyAccountCode } = req.body;
        // try {
        //     res.composer.success(
        //         await this.userService.verifyAccount(verifyAccountCode),
        //     );
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getByUsername(req: Request, res: Response) {
        // const { username } = req.params;
        // const { userId: tokenUserId } = req.tokenMeta;
        // try {
        //     const user = await this.userService.findOne({ username });
        //     if (!user) {
        //         res.composer.notFound('User not found');
        //     }
        //     // if (!user.isPublishedProfile && !_.isEqual(tokenUserId, user._id)) {
        //     //     res.composer.notFound('User not published');
        //     //     return;
        //     // }
        //     // if (!user.isPublishedContact && !_.isEqual(tokenUserId, user._id)) {
        //     //     delete user.contact;
        //     // }
        //     // delete user.isPublishedProfile;
        //     // delete user.isPublishedContact;
        //     res.composer.success(user);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getByKeyword(req: Request, res: Response) {
        // const { keyword } = req.body;
        // try {
        //     const users = await this.userService.find({
        //         $text: { $search: keyword },
        //     });
        //     res.composer.success(users);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getBundles(req: Request, res: Response) {
        // const { startAfter } = req.query;
        // let { limit = LIMIT_PAGING } = req.query;
        // limit = Math.min(limit, LIMIT_PAGING);
        // const { userid } = req.params;
        // const queryCommand = {
        //     isDeleted: false,
        //     files: { $exists: true, $ne: <any>[] },
        //     user: ObjectID.createFromHexString(userid),
        //     privacy: PrivacyType.PUBLIC,
        //     ...(startAfter && { _id: { $lt: ObjectID.createFromHexString(startAfter) } }),
        // };
        // try {
        //     const bundles =
        //         await this.shouldFilterData(req)
        //             ? []
        //             : await this.bundleService.find(queryCommand, true, +limit);
        //     res.composer.success(bundles);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollowing(req: Request, res: Response) {
        // const { userid } = req.params;
        // const user = await this.userService.findOne({
        //     _id: ObjectID.createFromHexString(userid),
        // });
        // try {
        //     const followingUsers = (await this.shouldFilterData(req))
        //         ? []
        //         : await this.userService.find({ _id: { $in: user.following } });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollower(req: Request, res: Response) {
        // const { userid } = req.params;
        // const user = await this.userService.findOne({
        //     _id: ObjectID.createFromHexString(userid),
        // });
        // try {
        //     const followingUsers = (await this.shouldFilterData(req))
        //         ? []
        //         : await this.userService.find({ _id: { $in: user.followers } });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async findLeetcodeUser(req: Request, res: Response) {
        const { username } = req.params;
        console.log('Ahi');
        try {
            const leetcode = new LeetCode();
            const userProfile = await leetcode.user(username);

            res.composer.success({ userProfile });
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            console.log('req.user', req.user);
            console.log('req.tokenMeta', req.tokenMeta);

            const users = await this.userService.find();
            res.composer.success(users);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getUserBalance(req: Request, res: Response) {
        try {
            const userId = req.tokenMeta.userId.toString();
            const balance = await this.userService.getUserBalance(userId);

            res.composer.success({ balance });
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            const userId = req.tokenMeta.userId.toString();
            const user = await this.userService.findById(userId);

            res.composer.success(user);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async updatePrivate(req: Request, res: Response) {
        try {
            const userId = req.tokenMeta.userId.toString();
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new ErrorNotFound('User not found');
            }
            if (user.type !== 'SYSTEM') {
                throw new ErrorUserInvalid('Permission denied');
            }

            const update = _.pick(req.body, ['balance', 'type']);
            const updatedUser = await this.userService.updatePrivate(
                userId,
                update,
            );
            res.composer.success(updatedUser);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async increaseBalance(req: Request, res: Response) {
        try {
            const { userId, amount } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    balance: amount,
                },
                { new: true },
            );
            res.composer.success(updatedUser);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
