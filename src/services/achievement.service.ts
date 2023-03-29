import { inject, injectable } from "inversify";
import _ from "lodash";
import mongoose, { Types } from "mongoose";
import UserAchievement, { Achievement, UserAchievementDocument } from "../models/achievement.model";
import { ServiceType } from "../types";
import { UserService } from "./user.service";
import { achievementList } from "../config/achievement";
import User from "../models/user.model";
import { TransactionService } from "./transaction.service";
import { SYSTEM_ACCOUNT_ID } from "../config";

@injectable()
export class AchievementService {
    private readonly achievementList: Achievement[];
    constructor(
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Transaction) private transactionService: TransactionService,
    ) {
        this.achievementList = achievementList;
    }

    private async onSuccess(
        userId: string,
        type: number
    ) {
        const achievement = this.achievementList[type];
        await this.transactionService.createNewTransaction(
            SYSTEM_ACCOUNT_ID,
            new Types.ObjectId(userId),
            achievement.GCoin,
            `You claimed "${achievement.name}" achievement.`
        )

        const user = await User.findById(userId);
        user.achievementPoint += achievement.point;
        await user.save();

        // TODO: Notify user
    }

    async update(userId: string, type: number, gain: number): Promise<UserAchievementDocument> {
        const achievement: Achievement = this.achievementList[type];
        const currentDate: number = Date.now();
        let userAchievement: UserAchievementDocument = await UserAchievement.findOne({ userId, type });

        if (!achievement)
            throw Error("Achievement not found!");

        if (gain < 0)
            throw Error("Progress cannot be negative!");

        if (!userAchievement)
            userAchievement = new UserAchievement({
                type,
                userId,
                progress: 0,
                updatedAt: currentDate,
            });

        if (userAchievement.progress >= achievement.target)
            return userAchievement;

        userAchievement.progress += gain;
        userAchievement.updatedAt = currentDate;

        await userAchievement.save();

        if (userAchievement.progress >= achievement.target) {
            this.onSuccess(userId, type);
        }

        return userAchievement;
    }

    async updateMany(
        userId: string,
        achievementEvent: {
            type: number,
            gain: number
        }[]
    ) {
        const currentDate: number = Date.now();
    }

    async findAllByUser(userId: string) {
        const userAchievementList: UserAchievementDocument[] = await UserAchievement.find({ userId });

        return this.achievementList
            .filter((achievement: Achievement) => !achievement.hidden)
            .map((achievement: Achievement) => {
                const userAchievement: UserAchievementDocument = _.find(
                    userAchievementList,
                    (e) => e.type === achievement.type
                );

                return {
                    ...achievement,
                    userId,
                    progress: userAchievement?.progress ? userAchievement.progress : 0,
                    updatedAt: userAchievement?.updatedAt ? userAchievement.updatedAt : 0,
                };
            });
    }

    async findOne(userId: string, type: number) {
        let userAchievement: UserAchievementDocument = await UserAchievement.findOne({
            userId,
            type
        });

        return {
            ...this.achievementList[type],
            userId,
            progress: userAchievement?.progress ? userAchievement.progress : 0,
            updatedAt: userAchievement?.updatedAt ? userAchievement.updatedAt : 0,
        }
    }

    async reset(userId: string, type: number, progress: number = 0): Promise<void> {
        let userAchievement = await UserAchievement.findOne({
            userId,
            type
        });
        const currentDate = new Date().getTime();

        if (!userAchievement)
            throw Error("Achievement not found!");

        userAchievement.progress = progress;
        userAchievement.updatedAt = currentDate;

        await userAchievement.save();
    }

    async checkUserAchievements(userId: string) {
        // TODO: Check which achievement has the user's accomplished
    }
}
