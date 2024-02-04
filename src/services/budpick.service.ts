import { injectable } from 'inversify';
import { FilterQuery, ProjectionType, QueryOptions, Types } from 'mongoose';
import BudPick, { BudPickDocument } from '../models/budpick.model';

@injectable()
export class BudPickService {
    constructor() {
        console.info(`[BudPickService] Initializing...`);
    }

    public async recordBudPick(
        userId: Types.ObjectId,
        day: number,
        coinsReceived: number,
    ): Promise<BudPickDocument> {
        console.info(
            `[BudPickService] Recording BudPick for user ${userId} (got ${coinsReceived} coins)`,
        );

        const createdAt = Date.now();

        const createdDocument = await BudPick.create({
            userId,
            day,
            coinsReceived,
            createdAt,
        });

        return createdDocument;
    }

    public async getOne(
        query: FilterQuery<BudPickDocument>,
        projection: ProjectionType<BudPickDocument> = {},
        options: QueryOptions<BudPickDocument> = {},
    ): Promise<BudPickDocument | null> {
        return BudPick.findOne(query, projection, options);
    }

    public async getBudPickByUserAndDay(
        userId: Types.ObjectId,
        day: number,
    ): Promise<BudPickDocument | null> {
        return this.getOne({ userId, day });
    }

    public async userHasPickedBudOnDay(
        userId: Types.ObjectId,
        day: number,
    ): Promise<boolean> {
        return (await this.getBudPickByUserAndDay(userId, day)) !== null;
    }

    public async count(filter: FilterQuery<BudPickDocument>) {
        return await BudPick.count(filter);
    }

    public async countBudPicksOnDay(day: number) {
        return await this.count({ day });
    }

    public async countUserBudPicks(userId: Types.ObjectId) {
        return await this.count({ userId });
    }

    public async get(
        query: FilterQuery<BudPickDocument>,
        projection: ProjectionType<BudPickDocument> = {},
        options: QueryOptions<BudPickDocument> = {},
    ) {
        return await BudPick.find(query, projection, options);
    }

    public async getBudPicksOnDay(
        day: number,
        projection: ProjectionType<BudPickDocument> = {},
        options: QueryOptions<BudPickDocument> = {},
    ) {
        return await this.get({ day }, projection, options);
    }
}
