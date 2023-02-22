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
    TransactionService,
} from '../services';
import { ObjectID, ObjectId } from 'mongodb';
import { EMAIL_SENDER, LIMIT_PAGING, SYSTEM_ACCOUNT_ID } from '../config';
import { Bundle } from '../models/bundle.model';
import { LeetCode } from 'leetcode-query';
import User, { UserDocument, USER_ROLES } from '../models/user.model';
import { ErrorNotFound, ErrorUserInvalid } from '../lib/errors';
import { Types } from 'mongoose';
import { scheduleJob } from 'node-schedule';

@injectable()
export class UserController extends Controller {
    public readonly router = Router();
    public readonly path = '/users';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
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
        this.router.post('/resetAllScore', this.resetAllScore.bind(this));
        this.router.post('/triggerreset', this.triggerResetDaily.bind(this));
        this.router.post(
            '/triggerleaderboard',
            this.triggerLeaderboard.bind(this),
        );
        this.router.get('/transaction', this.getUserTransaction.bind(this));
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

        // START JOB
        scheduleJob('42 * * * * *', function async() {
            this.triggerResetDaily.bind(this)();
            this.triggerLeaderboard.bind(this)();
            this.resetAllScore.bind(this)();
            console.log('The answer to life, the universe, and everything!');
        });
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

    async getUserTransaction(req: Request, res: Response) {
        try {
            const trans = await this.transactionService.getUserTransaction(
                new Types.ObjectId(req.tokenMeta.userId),
            );
            res.composer.success(trans);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async resetAllScore() {
        try {
            await this.userService.resetPrivate();
        } catch (error) {}
    }

    async triggerResetDaily() {
        try {
            await this.userService.resetAvailableCoin();
        } catch (error) {}
    }

    async triggerLeaderboard() {
        try {
            const users = await this.userService.triggerLeaderboard();
            if (users.length > 0)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[0]._id,
                    700,
                    `Receive 700Gcoin for 1st place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 1)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[1]._id,
                    500,
                    `Receive 500Gcoin for 2nd place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 2)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[2]._id,
                    300,
                    `Receive 300Gcoin for 3rd place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 3)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[3]._id,
                    200,
                    `Receive 100Gcoin for 4th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 4)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[4]._id,
                    200,
                    `Receive 200Gcoin for 5th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 5)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[5]._id,
                    200,
                    `Receive 200Gcoin for 6th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 6)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[6]._id,
                    200,
                    `Receive 200Gcoin for 7th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 7)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[7]._id,
                    200,
                    `Receive 200Gcoin for 8th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 8)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[8]._id,
                    200,
                    `Receive 200Gcoin for 9th place in Math Quiz Leaderboard Daily`,
                );
            if (users.length > 9)
                await this.transactionService.createNewTransaction(
                    SYSTEM_ACCOUNT_ID,
                    users[9]._id,
                    200,
                    `Receive 200Gcoin for 10st place in Math Quiz Leaderboard Daily`,
                );
        } catch (error) {}
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
            const users = await this.userService.find();
            res.composer.success(users);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getUserBalance(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const balance = await this.userService.getUserBalance(userId);

            res.composer.success({ balance });
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const user = await this.userService.findById(userId);

            res.composer.success(user);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async updatePrivate(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new ErrorNotFound('User not found');
            }

            const update = _.pick(req.body, [
                'email',
                'name',
                'phone',
                'university',
                'studentId',
                'dob',
            ]);
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
