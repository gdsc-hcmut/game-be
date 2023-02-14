import { injectable, inject } from 'inversify';
import { ObjectId } from 'mongoose';
import Transaction, { TransactionDocument } from '../models/transaction.model';
import { ServiceType } from '../types';
import { UserService } from './user.service';

@injectable()
export class TransactionService {
    constructor(@inject(ServiceType.User) private userService: UserService) {}

    async createNewTransaction(
        fromUser: ObjectId,
        toUser: ObjectId,
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
}
