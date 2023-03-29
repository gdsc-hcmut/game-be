import { Document, Types } from "mongoose";
import { UserRanking } from "./leaderboard.model";

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
    | DailyEarningAchievementInfo
    | LeaderboardAchievementInfo

export type AchievementProgressDocument = Document & {
    userId: Types.ObjectId,
    updatedAt: number,
    trackingData: {
        // Discord
        workCount: number,
        workToday: number,
        gameWin: number,
        maxLossFromBattle: number,

        // Web game
        isConnectDiscord: boolean,
        gamePlayed: number,
        maxLevelQuiz: number,
        wonBids: number,
        lostBids: number,
        dailyEarnings: number,
        dailyEarningsStreak: number,
    },
    achievements: {
        id: number,
        acquiredAt: number,
    }[]
}
