import { injectable, inject } from 'inversify';
import { ObjectId, Types } from 'mongoose';
import DiscordActivity, {
    DiscordActivityDocument,
} from '../models/discord_activity';
import DiscordBattle, { DiscordBattleDocument } from '../models/discord_battle';
import Transaction, { TransactionDocument } from '../models/transaction.model';
import { UserDocument } from '../models/user.model';
import { ServiceType } from '../types';
import { TransactionService } from './transaction.service';
import { UserService } from './user.service';

@injectable()
export class DiscordService {
    constructor(
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
        @inject(ServiceType.User) private userService: UserService,
    ) {}

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

    async createBattle(
        player1DiscordId: string,
        player2DiscordId: string,
        point: number,
    ): Promise<DiscordBattleDocument> {
        const userBattle1 = await DiscordBattle.findOne({
            discordId: player1DiscordId,
            winner: '',
        });
        const userBattle2 = await DiscordBattle.findOne({
            discordId: player2DiscordId,
            winner: '',
        });
        if (userBattle1) {
            throw Error('Player 1 already in other battle');
        }
        if (userBattle2) {
            throw Error('Player 2 already in other battle');
        }
        const battle = new DiscordBattle({
            player1DiscordId: player1DiscordId,
            player2DiscordId: player2DiscordId,
            point: point,
            winner: '',
            createdAt: Date.now(),
        });
        battle.save();
        return battle;
    }

    async endBattle(
        battleId: Types.ObjectId,
        winnerDiscordId: string,
    ): Promise<DiscordBattleDocument> {
        const battle = await DiscordBattle.findById(battleId);
        if (!battle) {
            throw Error('battle not existed');
        }
        if (battle.winner != '') {
            throw Error('Battle has already Finished');
        }
        battle.winner = winnerDiscordId;
        let loser = '';
        if (battle.winner == battle.player1DiscordId)
            loser = battle.player1DiscordId;
        else loser = battle.player2DiscordId;
        await this.transactionService.createNewTransactionByDiscordIdP2PBattle(
            loser,
            winnerDiscordId,
            battle.point,
        );
        battle.save();
        return battle;
    }
}
