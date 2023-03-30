import mongoose, { Document, Schema, Types } from "mongoose";

export type StreakAchievementInfo = {
    achievementType: 'streak',
    userId: Types.ObjectId,
    streak: number,
};

export type BattleAchievementInfo = {
    achievementType: 'battle',
    userId: Types.ObjectId,
    opponentId: Types.ObjectId,
    win: boolean,
    turn?: number,
    game: 'rps' | 'hangman' | 'guess',
    coin: number,
};

export type WorkAchievementInfo = {
    achievementType: 'work',
    userId: Types.ObjectId,
    coin: number
}

export type ConnectDiscordAchievementInfo = {
    achievementType: 'connect_discord',
    userId: Types.ObjectId
}

export type PlayGameAchievementInfo = {
    achievementType: 'play_game',
    userId: Types.ObjectId
}

export type GameLevelAcheivementInfo = {
    achievementType: 'game_level',
    userId: Types.ObjectId,
    game: 'quiz' | 'fast_to_g',
    level: number,
    coin: number
}

export type BidAchievementInfo = {
    achievementType: 'bid',
    userId: Types.ObjectId,
    coin: number,
}

export type BidResultAchievemnetInfo = {
    achievementType: 'bid_result',
    userId: Types.ObjectId,
}

export type DailyEarningAchievementInfo = {
    achievementType: 'daily_earning',
    userId: Types.ObjectId
}

export type LeaderboardAchievementInfo = {
    achievementType: 'leaderboard',
    userId: Types.ObjectId,
    rank: number
}

export type AchievementInfo =
    StreakAchievementInfo
    | BattleAchievementInfo
    | WorkAchievementInfo
    | ConnectDiscordAchievementInfo
    | PlayGameAchievementInfo
    | GameLevelAcheivementInfo
    | BidAchievementInfo
    | BidResultAchievemnetInfo
    | DailyEarningAchievementInfo
    | LeaderboardAchievementInfo

export type AchievementProgressDocument = Document & {
    userId: Types.ObjectId,
    updatedAt: number,
    point: number,
    trackingData: {
        // Discord
        workCount: number,
        workToday: number,
        battleWin: number,
        maxLossFromBattle: number,

        // Web game
        isConnectDiscord: boolean,
        webGamePlayed: number,
        maxLevelQuiz: number,
        bidCount: number,
        wonBids: number,
        dailyEarnings: number,
        dailyEarningsStreak: number,
    },
    achievements: {
        id: number,
        acquiredAt: number,
    }[]
}

const achivementSchema = new Schema<AchievementProgressDocument>({
    userId: Types.ObjectId,
    updatedAt: Number,
    point: { types: Number, default: 0 },
    trackingData: {
        // Discord
        workCount: { types: Number, default: 0 },
        workToday: { types: Number, default: 0 },
        battleWin: { types: Number, default: 0 },
        maxLossFromBattle: { types: Number, default: 0 },

        // Web game
        isConnectDiscord: { types: Boolean, default: false },
        webGamePlayed: { types: Number, default: 0 },
        maxLevelQuiz: { types: Number, default: 0 },
        bidCount: { types: Number, default: 0 },
        wonBids: { types: Number, default: 0 },
        dailyEarnings: { types: Number, default: 0 },
        dailyEarningsStreak: { types: Number, default: 0 },
    },
    achievements: Array<{
        id: Number,
        acquiredAt: Number,
    }>
})

export const AchievementProgress = mongoose.model<AchievementProgressDocument>(
    'achievementProgress',
    achivementSchema
);

export type AchievementDocument = Document & {
    id: number,
    history: Array<{
        userId: Types.ObjectId,
        date: number,
        status: 'gain' | 'reset'
    }>,
    owners: Array<Types.ObjectId>
};

const achievementSchema = new Schema<AchievementDocument>({
    id: Number,
    history: Array<{
        userId: Types.ObjectId,
        date: number,
        status: 'gain' | 'reset'
    }>,
    owners: Array<Types.ObjectId>
});

export const Achievement = mongoose.model<AchievementDocument>(
    'achievement',
    achievementSchema
)
