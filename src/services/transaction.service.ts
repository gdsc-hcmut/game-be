import { injectable, inject } from 'inversify';
import { ObjectId, Types } from 'mongoose';
import Transaction, { TransactionDocument } from '../models/transaction.model';
import { UserDocument } from '../models/user.model';
import { ServiceType } from '../types';
import { UserService } from './user.service';

@injectable()
export class TransactionService {
    constructor(@inject(ServiceType.User) private userService: UserService) {}

    async createNewTransaction(
        fromUser: Types.ObjectId,
        toUser: Types.ObjectId,
        amount: number,
        message: string,
    ): Promise<TransactionDocument> {
        // TODO: apply mongoose transaction
        await this.userService.transferBalance(fromUser, toUser, amount);
        const newTransaction = new Transaction({
            fromUser,
            toUser,
            amount,
            message,
            createdAt: Date.now(),
        });

        return newTransaction;
    }

    async createNewTransactionGame(
        fromUser: Types.ObjectId,
        toUser: Types.ObjectId,
        amount: number,
        message: string,
    ): Promise<TransactionDocument> {
        // TODO: apply mongoose transaction
        await this.userService.transferBalance(fromUser, toUser, amount);
        const newTransaction = new Transaction({
            fromUser,
            toUser,
            amount,
            message,
            createdAt: Date.now(),
        });

        return newTransaction;
    }

    async createNewTransactionByDiscordId(
        fromUser: Types.ObjectId,
        toUserDiscordId: string,
        amount: number,
        message: string,
    ): Promise<TransactionDocument> {
        // TODO: apply mongoose transaction
        const userId = await this.userService.transferBalanceByDiscordId(
            fromUser,
            toUserDiscordId,
            amount,
        );
        const newTransaction = new Transaction({
            fromUser,
            toUser: userId,
            amount,
            message,
            createdAt: Date.now(),
        });
        newTransaction.save();

        return newTransaction;
    }
}
