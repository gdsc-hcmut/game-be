import { injectable } from 'inversify';
import { FilterQuery, ProjectionType, QueryOptions, Types } from 'mongoose';
import BudPick, { BudPickDocument } from '../models/budpick.model';
import _ from 'lodash';
import BudPickResult, {
    BudPickPrize,
    BudPickResultDocument,
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

    // EB + Lead
    private PROHIBITED_PARTICIPANTS = [
        '336711717448843267', // Head of PO
        '567337639682899978', // Community Manager
        '340643391618547712', // Head of External Relations
        '478038832252715008', // Head of Marketing
        '894972466282258463', // Chapter Lead
        '599258471279624193', // Head of Event
        '1154390707461705839', // Head of External Relations - other account
        '313167703894654976', // Jupiter
        '706762387235274835', // Gryffindor
        '520517880408965121', // Capybara
        '407157823571492864', // Alpha
    ];

    // Organizers
    private REDUCED_WINRATE_PARTICIPANTS = [
        // Event
        '911447575545147424',
        '906823569126866966',
        '673524693453504574',
        '826467840466485289',
        '236739935866978304',
        '1033032095221678141',
        '882631711605792768',

        // Marketing
        '526638215290028032',
        '849573475802021888',
        '900581273582592040',

        // External Relations
        '719188355216048219',
        '1158806700321681408',
        '1176153698603380807',
        '1158773207655002162',

        // PO
        '742776516064051201',
        '996334622340296765',

        // Fessior
        '734391788718129205',
        '764464167833960498',
        '490531810162507786',
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
        const eligibleUsers: EligibleBudPickPlayerDto[] =
            await BudPick.aggregate([
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

        return eligibleUsers;
    }

    private async getCurrentSessionBudPickResult(
        filter: FilterQuery<BudPickResultDocument>,
        projection: ProjectionType<BudPickResultDocument> = {},
        options: QueryOptions<BudPickResultDocument> = {},
    ) {
        return await BudPickResult.findOne(
            { ...filter, currentSession: true },
            projection,
            options,
        );
    }

    private async invalidateCurrentSessionBudPickResult() {
        await BudPickResult.findOneAndUpdate(
            { currentSession: true },
            { currentSession: false },
        );
    }

    private ensureFairness(
        eligibleUsers: EligibleBudPickPlayerDto[],
    ): EligibleBudPickPlayerDto[] {
        // Ensure that prohibited participants are not in the list
        const shuffledUsers = _.shuffle(
            _.filter(
                eligibleUsers,
                (user) =>
                    !this.PROHIBITED_PARTICIPANTS.includes(user.discordId),
            ),
        );

        // Ensure that a maximum of 1 winner is from the reduced winrate list
        // While first 5 elements have more than 1 reduced winrate participant, we take the first
        // reduced winrate participant and swap it with a good participant from the 6th position to the end
        const countBadParticipantsInTop5 = () =>
            _.filter(
                shuffledUsers,
                (user, index) =>
                    index < 5 &&
                    this.REDUCED_WINRATE_PARTICIPANTS.includes(user.discordId),
            ).length;

        while (countBadParticipantsInTop5() > 1) {
            const firstBadIndex = _.findIndex(shuffledUsers, (user) =>
                this.REDUCED_WINRATE_PARTICIPANTS.includes(user.discordId),
            );
            const lastGoodIndex = _.findLastIndex(
                shuffledUsers,
                (user, index) =>
                    index >= 5 &&
                    !this.REDUCED_WINRATE_PARTICIPANTS.includes(user.discordId),
            );

            if (_.isNil(lastGoodIndex)) {
                // Shouldn't happen, but just in case
                break;
            }

            const temp = shuffledUsers[firstBadIndex];
            shuffledUsers[firstBadIndex] = shuffledUsers[lastGoodIndex];
            shuffledUsers[lastGoodIndex] = temp;
        }

        return shuffledUsers;
    }

    private async createNewBudPickSession() {
        const eligibleUsers = await this.getUsersEligibleForBudPickPrize();
        const fairUsers = this.ensureFairness(eligibleUsers);

        const winners = _.take(fairUsers, 5);

        const PRIZE_MAP = [
            BudPickPrize.FIRST,
            BudPickPrize.SECOND,
            BudPickPrize.THIRD,
            BudPickPrize.CONSOLATION,
            BudPickPrize.CONSOLATION,
        ];

        await BudPickResult.create({
            winners: _.map(winners, (winner, index) => ({
                userId: winner.userId,
                prize: PRIZE_MAP[index],
                showed: false,
            })),
            createdAt: Date.now(),
            newest: true,
        });
    }

    public async getNextBudPickWinner(): Promise<BudPickWinnerDto | null> {
        const currentSession = await this.getCurrentSessionBudPickResult(
            {},
            {},
            {
                populate: {
                    path: 'winners.userId',
                    select: '_id name discordId',
                },
            },
        );
        if (_.isNil(currentSession)) {
            throw new Error(`No prize session currently in progress`);
        }

        const winners = currentSession.winners;
        const nextWinner = _.last(
            _.filter(winners, (winner) => winner.showed === false),
        );

        if (_.isNil(nextWinner)) {
            return null;
        }

        nextWinner.showed = true;
        currentSession.markModified('winners');
        await currentSession.save();

        return {
            userId: _.get(nextWinner, 'userId._id'),
            name: _.get(nextWinner, 'userId.name'),
            discordId: _.get(nextWinner, 'userId.discordId'),
            prize: nextWinner.prize,
        };
    }

    public async getShowedBudPickWinners(): Promise<BudPickWinnerByPrizeDto> {
        const currentSession = await this.getCurrentSessionBudPickResult(
            {},
            {},
            {
                populate: {
                    path: 'winners.userId',
                    select: '_id name discordId',
                },
            },
        );
        if (_.isNil(currentSession)) {
            throw new Error(`No prize session currently in progress`);
        }

        const winnersByPrize = await Promise.all(
            _.map(this.PRIZE_ORDER_ASCENDING, (prize) =>
                (async () => {
                    const winners = _.filter(
                        currentSession.winners,
                        (winner) => winner.prize === prize && winner.showed,
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

    public async startNewBudPickPrizeSession() {
        const currentSession = await this.getCurrentSessionBudPickResult({});
        if (!_.isNil(currentSession)) {
            throw new Error(`Prize session already in progress`);
        }
        await this.createNewBudPickSession();
    }

    public async endCurrentBudPickPrizeSession() {
        const currentSession = await this.getCurrentSessionBudPickResult({});
        if (_.isNil(currentSession)) {
            throw new Error(`No prize session currently in progress`);
        }
        await this.invalidateCurrentSessionBudPickResult();
    }
}
