import { AchievementInfo, AchievementProgressDocument, StreakAchievementInfo } from "../models/achievement.model";

export type TAchievement = {
    id: number,
    type: string,
    name: string,
    GCoin: number,
    hidden: boolean,
    point: number,
    arena: string,
    handler: (
        info: AchievementInfo,
        userProgress: AchievementProgressDocument
    ) => Promise<Boolean>,
};

export const achievementList: TAchievement[] = [
    {
        id: 0,
        type: "streak",
        name: "/streak reaches 5",
        GCoin: 100,
        hidden: false,
        point: 5,
        arena: 'Discord',
        handler: async (info: StreakAchievementInfo, userProgress: AchievementProgressDocument) => info.streak === 5
    }
];
