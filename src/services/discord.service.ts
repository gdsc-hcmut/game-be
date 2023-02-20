import { injectable, inject } from 'inversify';
import { ObjectId, Types } from 'mongoose';
import DiscordActivity, {
    DiscordActivityDocument,
} from '../models/discord_activity';
import Transaction, { TransactionDocument } from '../models/transaction.model';
import { UserDocument } from '../models/user.model';
import { ServiceType } from '../types';
import { UserService } from './user.service';

@injectable()
export class DiscordService {
    constructor(@inject(ServiceType.User) private userService: UserService) {}

    async createNewTransaction(
        userId: Types.ObjectId,
        discordId: string,
    ): Promise<DiscordActivityDocument> {
        // TODO: apply mongoose transaction
        const newDiscordActivity = new DiscordActivity({ userId, discordId });
        return newDiscordActivity;
    }

    async getDiscordActivity(
        discordId: string,
    ): Promise<DiscordActivityDocument> {
        return await DiscordActivity.findOne({ discordId: discordId });
    }
}
