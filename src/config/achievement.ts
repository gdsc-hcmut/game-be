import { Query } from "mongoose";
import { AchievementInfo } from "../models/achievement.model";

export type Achievement = {
    id: number,
    type: string,
    name: string,
    GCoin: number,
    hidden: boolean,
    point: number,
    arena: string,
    handler: (
        info: AchievementInfo,
        docs: Query<any, any, {}, any>
    ) => Promise<Boolean>,
};

const achievementList = [];
