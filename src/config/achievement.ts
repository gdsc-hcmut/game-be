import {
    AchievementInfo,
    AchievementProgressDocument,
    BattleAchievementInfo,
    BidAchievementInfo,
    BidResultAchievemnetInfo,
    ConnectDiscordAchievementInfo,
    DailyEarningAchievementInfo,
    GameLevelAcheivementInfo,
    LeaderboardAchievementInfo,
    PlayGameAchievementInfo,
    StreakAchievementInfo,
    WorkAchievementInfo,
} from '../models/achievement.model';

export type TAchievement = {
    id: number;
    type: string;
    name: string;
    GCoin: number;
    hidden: boolean;
    point: number;
    arena: string;
    update: (
        info: AchievementInfo,
        userProgress: AchievementProgressDocument,
    ) => Promise<void>;
    check: (
        info: AchievementInfo,
        userProgress: AchievementProgressDocument,
    ) => Promise<Boolean>;
};

export const achievementList: TAchievement[] = [
    {
        id: 0,
        type: 'streak',
        name: '/streak reaches 5',
        GCoin: 100,
        hidden: false,
        point: 5,
        arena: 'Discord',
        update: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.streak >= 5,
    },
    {
        id: 1,
        type: 'streak',
        name: '/streak reaches 20',
        GCoin: 500,
        hidden: false,
        point: 10,
        arena: 'Discord',
        update: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.streak >= 20,
    },
    {
        id: 2,
        type: 'streak',
        name: '/streak reaches 50',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Discord',
        update: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.streak >= 50,
    },
    {
        id: 3,
        type: 'streak',
        name: '/streak reaches 100',
        GCoin: 4000,
        hidden: false,
        point: 40,
        arena: 'Discord',
        update: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: StreakAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.streak >= 100,
    },
    {
        id: 4,
        type: 'battle',
        name: 'Use /rps, /hangman, /guess and win 3 times',
        GCoin: 100,
        hidden: false,
        point: 5,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.battleWin >= 3;
        },
    },
    {
        id: 5,
        type: 'battle',
        name: 'Use /rps, /hangman, /guess and win 10 times',
        GCoin: 500,
        hidden: false,
        point: 10,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.battleWin >= 10;
        },
    },
    {
        id: 6,
        type: 'battle',
        name: 'Use /rps, /hangman, /guess and win 50 times',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.battleWin >= 20;
        },
    },
    {
        id: 7,
        type: 'battle',
        name: 'Use /rps, /hangman, /guess and win 100 times',
        GCoin: 4000,
        hidden: false,
        point: 40,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.battleWin >= 100;
        },
    },
    {
        id: 8,
        type: 'work',
        name: 'Use /work once',
        GCoin: 100,
        hidden: false,
        point: 5,
        arena: 'Discord',
        update: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.workCount++;
            userProgress.trackingData.workToday++;
            await userProgress.save();
        },
        check: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.workCount >= 1;
        },
    },
    {
        id: 9,
        type: 'work',
        name: 'Use /work 20 times ',
        GCoin: 500,
        hidden: false,
        point: 10,
        arena: 'Discord',
        update: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.workCount++;
            userProgress.trackingData.workToday++;
            await userProgress.save();
        },
        check: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.workCount >= 20;
        },
    },
    {
        id: 10,
        type: 'work',
        name: 'Use /work 50 times ',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Discord',
        update: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.workCount++;
            userProgress.trackingData.workToday++;
            await userProgress.save();
        },
        check: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.workCount >= 50;
        },
    },
    {
        id: 11,
        type: 'work',
        name: 'Use /work more than 15 times in one day',
        GCoin: 4000,
        hidden: false,
        point: 40,
        arena: 'Discord',
        update: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.workCount++;
            userProgress.trackingData.workToday++;
            await userProgress.save();
        },
        check: async (
            info: WorkAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            return userProgress.trackingData.workToday >= 15;
        },
    },
    {
        id: 12,
        type: 'battle',
        name: 'Lose 5000 GCoin or more in 1 battle',
        GCoin: 500,
        hidden: false,
        point: 5,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.maxLossFromBattle >= 5000,
    },
    {
        id: 13,
        type: 'battle',
        name: 'Win in 1 turn in /hangman or /guess',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Discord',
        update: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.win) {
                userProgress.trackingData.battleWin++;
                await userProgress.save();
            } else {
                userProgress.trackingData.maxLossFromBattle = Math.max(
                    userProgress.trackingData.maxLossFromBattle,
                    info.coin,
                );
            }
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.win && info.turn == 1,
    },
    {
        id: 14,
        type: 'connect_discord',
        name: 'Connect your account to Discord',
        GCoin: 100,
        hidden: false,
        point: 10,
        arena: 'Web game',
        update: async (
            info: ConnectDiscordAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.isConnectDiscord = true;
            await userProgress.save();
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.isConnectDiscord,
    },
    {
        id: 15,
        type: 'play_game',
        name: 'Play game in GDSC Game once',
        GCoin: 100,
        hidden: false,
        point: 10,
        arena: 'Web game',
        update: async (
            info: PlayGameAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.webGamePlayed++;
            await userProgress.save();
        },
        check: async (
            info: BattleAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.webGamePlayed > 0,
    },
    {
        id: 16,
        type: 'game_level',
        name: 'Reach level 10 in GDSC Quiz',
        GCoin: 500,
        hidden: false,
        point: 10,
        arena: 'Web game',
        update: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.game === 'quiz') {
                userProgress.trackingData.maxLevelQuiz = Math.max(userProgress.trackingData.maxLevelQuiz, info.level);
                await userProgress.save();
            }
        },
        check: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.maxLevelQuiz >= 10,
    },
    {
        id: 17,
        type: 'game_level',
        name: 'Reach level 50 in GDSC Quiz',
        GCoin: 1000,
        hidden: false,
        point: 10,
        arena: 'Web game',
        update: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.game === 'quiz') {
                userProgress.trackingData.maxLevelQuiz = Math.max(userProgress.trackingData.maxLevelQuiz, info.level);
                await userProgress.save();
            }
        },
        check: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.maxLevelQuiz >= 50,
    },
    {
        id: 18,
        type: 'game_level',
        name: 'Reach level 100 in GDSC Quiz',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Web game',
        update: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            if (info.game === 'quiz') {
                userProgress.trackingData.maxLevelQuiz = Math.max(userProgress.trackingData.maxLevelQuiz, info.level);
                await userProgress.save();
            }
        },
        check: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.maxLevelQuiz >= 100,
    },
    {
        id: 20,
        type: 'bid',
        name: 'Place a Bid',
        GCoin: 100,
        hidden: false,
        point: 100,
        arena: 'Web game',
        update: async (
            info: BidAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.bidCount++;
            await userProgress.save();
        },
        check: async (
            info: BidAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.bidCount >= 1,
    },
    {
        id: 21,
        type: 'bid_result',
        name: 'Win a Bid',
        GCoin: 500,
        hidden: false,
        point: 20,
        arena: 'Web game',
        update: async (
            info: BidResultAchievemnetInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.wonBids++;
            await userProgress.save();
        },
        check: async (
            info: BidResultAchievemnetInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.wonBids >= 1,
    },
    {
        id: 22,
        type: 'bid_result',
        name: 'Win 10 Bids',
        GCoin: 2000,
        hidden: false,
        point: 40,
        arena: 'Web game',
        update: async (
            info: BidResultAchievemnetInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.wonBids++;
            await userProgress.save();
        },
        check: async (
            info: BidResultAchievemnetInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.wonBids >= 10,
    },
    {
        id: 23,
        type: 'bid_result',
        name: 'Win 10 Bids',
        GCoin: 100,
        hidden: false,
        point: 10,
        arena: 'Web game',
        update: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.wonBids++;
            await userProgress.save();
        },
        check: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.wonBids >= 10,
    },
    {
        id: 24,
        type: 'daily_earning',
        name: 'Clear Daily Earnings 1 week in a row',
        GCoin: 1000,
        hidden: false,
        point: 20,
        arena: 'Web game',
        update: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.dailyEarnings++;
            userProgress.trackingData.dailyEarningsStreak++;
            await userProgress.save();
        },
        check: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.dailyEarningsStreak >= 7,
    },
    {
        id: 25,
        type: 'daily_earning',
        name: 'Clear Daily Earnings 1 month in a row',
        GCoin: 4000,
        hidden: false,
        point: 40,
        arena: 'Web game',
        update: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.dailyEarnings++;
            userProgress.trackingData.dailyEarningsStreak++;
            await userProgress.save();
        },
        check: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.dailyEarningsStreak >= 30,
    },
    {
        id: 25,
        type: 'daily_earning',
        name: 'Clear Daily Earnings 1 month in a row',
        GCoin: 4000,
        hidden: false,
        point: 40,
        arena: 'Web game',
        update: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => {
            userProgress.trackingData.dailyEarnings++;
            userProgress.trackingData.dailyEarningsStreak++;
            await userProgress.save();
        },
        check: async (
            info: DailyEarningAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => userProgress.trackingData.dailyEarningsStreak >= 30,
    },
    {
        id: 26,
        type: 'leaderboard',
        name: 'Get first place in GDSC Quiz Leaderboard',
        GCoin: 1000,
        hidden: false,
        point: 40,
        arena: 'Web game',
        update: async (
            info: LeaderboardAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: LeaderboardAchievementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.rank === 1,
    },
    {
        id: 27,
        type: 'leaderboard',
        name: 'Lose GDSC Quiz/Fast to G on the first stage',
        GCoin: 50,
        hidden: false,
        point: 5,
        arena: 'Web game',
        update: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => { },
        check: async (
            info: GameLevelAcheivementInfo,
            userProgress: AchievementProgressDocument,
        ) => info.level == 0,
    },
];
