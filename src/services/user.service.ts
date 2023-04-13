import { injectable, inject } from 'inversify';
import { Collection, ObjectID } from 'mongodb';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';
import mongoose, { ObjectId, Types } from 'mongoose';
import { DatabaseService } from './database.service';
import { USER_FORBIDDEN_FIELDS } from '../models/user.model';
import { ErrorBalance, ErrorBidInvalid, ErrorUserInvalid } from '../lib/errors';
import {
    HASH_ROUNDS,
    SocialAccountType,
    VERIRY_CODE_TTL,
    VERIFY_CODE_LENGTH,
    EMAIL_SENDER,
} from '../config';
// import { BundleService } from './bundle.service';
import { ServiceType } from '../types';
import { randomPassword, encodeObjectId } from '../lib/helper';
// import { MailService } from '.';
import User, { UserDocument } from '../models/user.model';
import { TransactionService } from './transaction.service';

const USER_CREATE_ALLOW_FIELDS = [
    'password',
    'email',
    'username',
    'firstName',
    'lastName',
];

@injectable()
export class UserService {
    private userCollection: Collection;

    constructor() {
    }

    async create(user: any): Promise<UserDocument> {
        if (_.isEmpty(user.password) || _.isEmpty(user.username)) {
            throw new ErrorUserInvalid('Missing input fields');
        }

        user.password = await bcrypt.hash(user.password, HASH_ROUNDS);
        const addedUser = await this.userCollection.insertOne(user);

        return addedUser.ops[0];
    }

    async verifyAccountRequest(email: string) {
        let user = null;
        try {
            user = await this.findOne({ email }, true);
        } catch (err) {
            throw new Error(
                `The email address that you've entered doesn't match any account.`,
            );
        }

        const verifyAccountCode = crypto
            .randomBytes(VERIFY_CODE_LENGTH)
            .toString('hex');
        await this.updateOne(user._id, { verifyAccountCode });
    }

    async updateOne(userId: ObjectID, data: any) { }

    async transferBalance(
        fromUser: Types.ObjectId,
        toUser: Types.ObjectId,
        amount: number,
    ): Promise<boolean> {
        const fromUserDoc = await User.findById(fromUser);
        if (fromUserDoc.balance < amount) {
            throw new ErrorBalance();
        }
        fromUserDoc.balance = fromUserDoc.balance - amount;
        fromUserDoc.save();
        await User.findByIdAndUpdate(toUser, { $inc: { balance: amount } });
        return true;
    }

    async transferBalanceGame(
        fromUser: Types.ObjectId,
        toUser: Types.ObjectId,
        amount: number,
    ): Promise<boolean> {
        const targetUser = await User.findById(toUser);
        if (targetUser.highestScoreMathQuiz < amount) {
            targetUser.highestScoreMathQuiz = amount;
        }
        if (targetUser.availableReceiving <= 0) {
            targetUser.save();
            return false;
        }
        targetUser.balance = amount + targetUser.balance;
        await User.findByIdAndUpdate(fromUser, { $inc: { balance: -amount } });

        targetUser.availableReceiving = targetUser.availableReceiving - amount;
        targetUser.markModified('balance');
        targetUser.markModified('availableReceiving');
        targetUser.save();
        return true;
    }

    async transferBalanceByDiscordId(
        fromUser: Types.ObjectId,
        toUserDiscordId: string,
        amount: number,
    ): Promise<Types.ObjectId> {
        const fromUserDoc = await User.findById(fromUser);
        if (fromUserDoc.balance < amount) {
            throw new ErrorBalance();
        }
        fromUserDoc.balance = fromUserDoc.balance - amount;
        fromUserDoc.save();
        const toUser = await User.findOneAndUpdate(
            { discordId: toUserDiscordId },
            { $inc: { balance: amount } },
        );
        return toUser._id;
    }

    async transferBalanceByDiscordIdP2P(
        fromUserId: Types.ObjectId,
        toUserDiscordId: string,
        amount: number,
    ): Promise<{ toUser: UserDocument; fromUser: UserDocument }> {
        const fromUserDoc = await User.findById(fromUserId);
        if (fromUserDoc.balance < amount) {
            throw new ErrorBalance();
        }
        fromUserDoc.balance = fromUserDoc.balance - amount;
        const toUser = await User.findOneAndUpdate(
            { discordId: toUserDiscordId },
            { $inc: { balance: amount } },
        );
        if (!fromUserDoc || !toUser) {
            throw Error('Some Error');
        }
        fromUserDoc.save();
        return { toUser: toUser, fromUser: fromUserDoc };
    }

    async getUserBalance(userId: Types.ObjectId): Promise<number> {
        const { balance } = await User.findById(userId, { balance: 1 });
        return balance;
    }

    async find(): Promise<UserDocument[]> {
        const users = await User.find({});
        return users;
    }

    async findById(
        userId: Types.ObjectId | string,
        keepAll = false,
    ): Promise<UserDocument> {
        const user = await User.findById(userId);

        // if (_.isEmpty(user)) throw new ErrorUserInvalid('User not found');
        return user;
    }

    async findOne(query: any = {}, keepAll = false): Promise<UserDocument> {
        const user = (await User.findOne(query)) as UserDocument;

        if (_.isEmpty(user)) throw new ErrorUserInvalid('User not found');
        return keepAll
            ? user
            : (_.omit(user, USER_FORBIDDEN_FIELDS) as UserDocument);
    }

    async updatePrivate(
        userId: Types.ObjectId,
        update: {
            email: string;
            name: string;
            phone: string;
            university: string;
            studentId: string;
            dob: string;
        },
    ): Promise<UserDocument> {
        const updatedUser = await User.findByIdAndUpdate(userId, update, {
            new: true,
        });
        //trigger
        return updatedUser;
    }

    async resetPrivate(): Promise<void> {
        await User.find().updateMany({ highestScoreMathQuiz: 0 });
    }

    async resetAvailableCoin(): Promise<void> {
        await User.find().updateMany({ availableReceiving: 1000 });
    }

    async triggerLeaderboard(): Promise<UserDocument[]> {
        const users = await User.find().sort({ highestScoreMathQuiz: -1 });
        return users;
    }

    async getUserInfoByDiscordId(discordId: string): Promise<UserDocument> {
        const user = await User.findOne({ discordId: discordId });
        return user;
    }
}
