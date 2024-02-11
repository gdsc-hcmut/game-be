import { injectable } from 'inversify';
import { FilterQuery, ProjectionType, QueryOptions, Types } from 'mongoose';
import BudPick, { BudPickDocument } from '../models/budpick.model';
import _ from 'lodash';
import BudPickWinner, {
    BudPickPrize,
    BudPickWinnerDocument,
} from '../models/budpick-winner.model';

type EligibleBudPickPlayerDto = {
    userId: Types.ObjectId;
    name: string;
    discordId: string;
    pickCount: number;
};

type BudPickWinnerDto = {
    userId: Types.ObjectId;
    name: string;
    discordId: string;
    prize: BudPickPrize;
};

type BudPickWinnerByPrizeDto = {
    [key in BudPickPrize]: BudPickWinnerDto[];
};

@injectable()
export class BudPickService {
    private MINIMUM_BUDPICKS_FOR_RANDOM = 4;
    private PRIZE_ORDER_ASCENDING = [
        BudPickPrize.CONSOLATION,
        BudPickPrize.THIRD,
        BudPickPrize.SECOND,
        BudPickPrize.FIRST,
    ];

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

    public getMinimumBudPicksForRandom() {
        return this.MINIMUM_BUDPICKS_FOR_RANDOM;
    }

    public async getUsersEligibleForBudPickPrize() {
        const eligibleUsers = await BudPick.aggregate([
            {
                $group: {
                    _id: '$userId',
                    pickCount: { $count: {} },
                },
            },
            {
                $match: {
                    pickCount: { $gte: this.getMinimumBudPicksForRandom() },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    name: { $first: '$user.name' },
                    discordId: { $first: '$user.discordId' },
                    pickCount: '$pickCount',
                },
            },
        ]);

        return eligibleUsers as EligibleBudPickPlayerDto[];
    }

    private async getBudPickWinners(
        filter: FilterQuery<BudPickWinnerDocument>,
        projection: ProjectionType<BudPickWinnerDocument> = {},
        options: QueryOptions<BudPickWinnerDocument> = {},
    ) {
        return await BudPickWinner.find(filter, projection, options);
    }

    private async generateBudPickWinnersIfNone() {
        const alreadyExistingWinners = await this.getBudPickWinners({});
        if (alreadyExistingWinners.length > 0) {
            return;
        }

        const eligibleUsers = await this.getUsersEligibleForBudPickPrize();
        const winners = _.take(_.shuffle(eligibleUsers), 5);

        const PRIZE_MAP = [
            BudPickPrize.FIRST,
            BudPickPrize.SECOND,
            BudPickPrize.THIRD,
            BudPickPrize.CONSOLATION,
            BudPickPrize.CONSOLATION,
        ];

        await Promise.all(
            _.map(winners, (winner, index) =>
                BudPickWinner.create({
                    userId: winner.userId,
                    prize: PRIZE_MAP[index],
                }),
            ),
        );
    }

    public async getNextBudPickWinner(): Promise<BudPickWinnerDto | null> {
        await this.generateBudPickWinnersIfNone();

        const winners = await this.getBudPickWinners(
            { showed: false },
            {},
            {
                populate: {
                    path: 'userId',
                    select: '_id name discordId',
                },
            },
        );
        const nextWinner = _.first(
            _.sortBy(winners, (winner) =>
                _.indexOf(this.PRIZE_ORDER_ASCENDING, winner.prize),
            ),
        );

        if (_.isNil(nextWinner)) {
            return null;
        }

        nextWinner.showed = true;
        await nextWinner.save();

        return {
            userId: _.get(nextWinner, 'userId._id'),
            name: _.get(nextWinner, 'userId.name'),
            discordId: _.get(nextWinner, 'userId.discordId'),
            prize: nextWinner.prize,
        };
    }

    public async getShowedBudPickWinners(): Promise<BudPickWinnerByPrizeDto> {
        await this.generateBudPickWinnersIfNone();

        const winnersByPrize = await Promise.all(
            _.map(this.PRIZE_ORDER_ASCENDING, (prize) =>
                (async () => {
                    const winners = await this.getBudPickWinners(
                        { prize, showed: true },
                        {},
                        {
                            populate: {
                                path: 'userId',
                                select: '_id name discordId',
                            },
                        },
                    );

                    return {
                        [prize]: _.map(winners, (winner) => ({
                            userId: _.get(winner, 'userId._id'),
                            name: _.get(winner, 'userId.name'),
                            discordId: _.get(winner, 'userId.discordId'),
                            prize,
                        })),
                    };
                })(),
            ),
        );

        const mergedWinners = _.reduce(
            winnersByPrize,
            (acc, prizeWinners) => _.merge(acc, prizeWinners),
            {} as BudPickWinnerByPrizeDto,
        );

        return mergedWinners;
    }
}
