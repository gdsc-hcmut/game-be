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
        newTransaction.save();
        return newTransaction;
    }

    async getUserTransaction(
        userId: Types.ObjectId,
    ): Promise<TransactionDocument[]> {
        // TODO: apply mongoose transaction
        const trans = Transaction.find({
            $or: [{ toUser: userId }, { fromUser: userId }],
        })
            .populate('toUser')
            .populate('fromUser');

        return trans;
    }

    async createNewTransactionGame(
        fromUser: Types.ObjectId,
        toUser: Types.ObjectId,
        amount: number,
        message: string,
    ): Promise<TransactionDocument | boolean> {
        // TODO: apply mongoose transaction
        const isTransfer = await this.userService.transferBalanceGame(
            fromUser,
            toUser,
            amount,
        );
        if (!isTransfer) {
            return true;
        }
        const newTransaction = new Transaction({
            fromUser,
            toUser,
            amount,
            message,
            createdAt: Date.now(),
        });
        newTransaction.save();
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

    async createNewTransactionByDiscordIdP2PBattle(
        fromUserDiscordId: string,
        toUserDiscordId: string,
        amount: number,
    ): Promise<TransactionDocument> {
        // TODO: apply mongoose transaction
        const {
            fromUser,
            toUser,
        }: { fromUser: UserDocument; toUser: UserDocument } =
            await this.userService.transferBalanceByDiscordIdP2P(
                fromUserDiscordId,
                toUserDiscordId,
                amount,
            );
        let message = `End Battle ${fromUser.name} transfer to ${toUser.name} ${amount}Gcoin`;
        const newTransaction = new Transaction({
            fromUser: fromUser._id,
            toUser: toUser._id,
            amount,
            message,
            createdAt: Date.now(),
        });
        newTransaction.save();

        return newTransaction;
    }
}
