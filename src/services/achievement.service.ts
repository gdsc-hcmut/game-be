import { inject, injectable } from 'inversify';
import { SYSTEM_ACCOUNT_ID } from '../config';
import { achievementList } from '../config/achievement';
import {
    Achievement,
    AchievementInfo,
    AchievementProgress,
    AchievementProgressDocument,
} from '../models/achievement.model';
import { ServiceType } from '../types';
import { TransactionService } from './transaction.service';

@injectable()
export class AchievementService {
    constructor(
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
    ) { }

    async update(info: AchievementInfo): Promise<void> {
        const currentDate: number = Date.now();
        let achievementProgress: AchievementProgressDocument =
            await AchievementProgress.findOne({ userId: info.userId });

        if (!achievementProgress) {
            achievementProgress = new AchievementProgress({
                userId: info.userId,
                updatedAt: currentDate,
            });
            await achievementProgress.save();
        }

        let typesUpdated = new Set<string>();

        for (let achievement of achievementList) {
            if (achievement.type === info.achievementType) {
                if (!typesUpdated.has(achievement.type)) {
                    await achievement.update(info, achievementProgress);
                    typesUpdated.add(achievement.type);
                }

                if (
                    !achievementProgress.achievements.some(
                        (x) => x.id === achievement.id,
                    ) &&
                    (await achievement.check(info, achievementProgress))
                ) {

                    achievementProgress.achievements.push({
                        id: achievement.id,
                        acquiredAt: currentDate,
                    });
                    achievementProgress.point += achievement.point;
                    achievementProgress.markModified('achievements');

                    await achievementProgress.save();

                    let ach = await Achievement.findOne({ id: achievement.id });
                    if (!ach) {
                        ach = new Achievement({
                            id: achievement.id,
                        });
                        await ach.save();
                    }

                    ach.history.push({
                        userId: info.userId,
                        date: currentDate,
                        status: 'gain',
                    });
                    ach.owners.push(info.userId);
                    await ach.save();

                    await this.transactionService.createNewTransaction(
                        SYSTEM_ACCOUNT_ID,
                        info.userId,
                        achievement.GCoin,
                        `You have received ${achievement.GCoin} from "${achievement.name}" achievement`,
                    );
                }
            }
        }
    }
}
