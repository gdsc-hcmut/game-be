import { inject, injectable } from 'inversify';
import MazeGameChapterSession, {
    ChapterStatus,
    MazeGameChapterSessionDocument,
} from '../models/maze_game_chapter_session.model';
import MazeGameChapter, {
    MazeGameChapterDocument,
} from '../models/maze_game_chapter.model';
import User from '../models/user.model';
import MazeGameSession, {
    MazeGameSessionDocument,
    Status,
} from '../models/maze_game_session.model';
import { Types } from 'mongoose';
import { MazeService } from './maze.service';
import { ServiceType } from '../types';
import teamSchemaModel from '../models/recruitment_team.model';
import { sessionInfo } from '../maze_game';
import { max_time } from '../constant/maze/map';
// import { ServiceType } from '../types';

interface Score {
    score: number;
}

@injectable()
export class MazeChapterSessionService {
    constructor(@inject(ServiceType.Maze) private mazeService: MazeService) {}

    async startChapterSession(
        teamId: Types.ObjectId,
        chapterLevel: number = 1,
    ): Promise<MazeGameChapterSessionDocument> {
        const team = await teamSchemaModel.findById(teamId);

        if (!team) {
            throw Error('Team name is not valid');
        }

        // if (!team.leadId.equals(userId)) {
        //     throw Error('Only leader has permission to start chapter session!');
        // }

        // let isNewChapter = false;

        // const user = await User.findById(team._id)
        //     .populate('currentMazeChapter')
        //     .exec();
        // const { currentMazeChapter } = user;

        if (chapterLevel <= 0) {
            throw Error('This chapter is not available!');
        }

        // if (!currentMazeChapter && chapterLevel > 1) {
        //     throw Error(
        //         'This chapter will be unlocked when you finish all the previous chapter!',
        //     );
        // } else if (!currentMazeChapter && chapterLevel === 1) {
        //     isNewChapter = true;
        // } else if (
        //     currentMazeChapter &&
        //     chapterLevel > currentMazeChapter.chapterLevel + 1
        // ) {
        //     throw Error(
        //         'This chapter will be unlocked when you finish all the previous chapter!',
        //     );
        // } else if (chapterLevel === currentMazeChapter.chapterLevel + 1) {
        //     const currentChapter = await MazeGameChapterSession.findOne({
        //         userId: team._id,
        //         status: ChapterStatus.Done,
        //     });

        //     if (!currentChapter)
        //         throw Error(
        //             'This chapter will be unlocked when you finish all the previous chapter!',
        //         );
        //     else isNewChapter = true;
        // }

        const chapter = await MazeGameChapter.findOne({
            chapterLevel: chapterLevel,
        });

        if (!chapter) {
            throw Error('Could not find chapter');
        }

        // Check whether any InProgress session with that chapter, if yes, throw false.
        const currentChapterSession = await MazeGameChapterSession.findOne({
            userId: team._id,
            chapterId: chapter._id,
        });

        if (currentChapterSession) {
            // if (currentChapterSession.status === ChapterStatus.Done) {
            //     throw Error('Team has finished chapter!');
            // }
            // console.log('Find another in-progress chapter');
            // );
            return currentChapterSession;
        }

        // if (isNewChapter) {
        //     await User.updateOne(
        //         { _id: userId },
        //         {
        //             $set: {
        //                 currentMazeChapter: chapter._id,
        //             },
        //         },
        //     );
        // }

        const newChapterSession = new MazeGameChapterSession({
            chapterId: chapter._id,
            helpCount: chapter.helpCount,
            currentRound: 1,
            userId: team._id,
            rounds: [],
            status: ChapterStatus.InProgress,
            team: team._id,
        });

        await newChapterSession.save();
        return newChapterSession;
    }

    async startMazeSession(
        userId: Types.ObjectId,
        chapterSessionId: Types.ObjectId,
        round: number,
    ): Promise<sessionInfo> {
        const chapterSession = await MazeGameChapterSession.findById(
            chapterSessionId,
        );

        if (!chapterSession) {
            throw Error('Could not find chapter');
        }

        if (!chapterSession.userId.equals(userId)) {
            throw Error('Could not access to these chapter');
        }

        let { currentRound } = chapterSession;

        if (round !== currentRound)
            throw Error(
                // 'This round will be unlocked when you finish all the previous round!',
                'You can not start these round!',
            );

        const { roundLevels } = await MazeGameChapter.findById(
            chapterSession.chapterId,
        );

        // return currentSession if it is InProgress
        if (chapterSession.rounds[round - 1]) {
            const currentSession = await MazeGameSession.findById(
                chapterSession.rounds[round - 1],
            );

            if (currentSession) {
                if (currentSession.status === Status.InProgress)
                    return {
                        session: currentSession,
                        time_left:
                            max_time + Date.now() - currentSession.startTime,
                    };
            }
        }

        const newSession = await this.mazeService.startSession(
            userId,
            roundLevels[round - 1], // level of session
            chapterSessionId,
        );

        // const sessionId = new Types.ObjectId(newSession._id);
        chapterSession.rounds[round - 1] = newSession.session._id;

        await MazeGameChapterSession.updateOne(
            { _id: chapterSessionId },
            {
                $set: {
                    rounds: chapterSession.rounds,
                    currentRound: currentRound,
                    status: chapterSession.status,
                },
            },
        );

        return newSession;
    }

    async getChapterSession(
        userId: Types.ObjectId,
        chapterSessionId: Types.ObjectId,
    ): Promise<MazeGameChapterSessionDocument> {
        const chapterSession = await MazeGameChapterSession.findById(
            chapterSessionId,
        );

        if (!chapterSession) {
            throw Error('Could not find chapter session!');
        }

        if (!chapterSession.userId.equals(userId)) {
            throw Error('Could not access to these chapter session!');
        }

        return chapterSession;
    }

    async getChapterScore(chapterSessionId: Types.ObjectId): Promise<Score> {
        const chapterSession = await MazeGameChapterSession.findById(
            chapterSessionId,
        );

        if (!chapterSession) {
            throw Error('Could not find chapter session!');
        }

        let chapterScore = 0;

        for (const sessionId of chapterSession.rounds) {
            const roundScore = await this.mazeService.getScore(sessionId);
            chapterScore += roundScore.score;
        }
        return { score: chapterScore };
    }

    // async getTotalScore(userId: Types.ObjectId): Promise<Score> {
    //     const user = await User.findById(userId)
    //         .populate('currentMazeChapter')
    //         .exec();

    //     if (!user) {
    //         throw Error('User does not exist!');
    //     }

    //     if (!user.currentMazeChapter) {
    //         throw Error('User has not been started maze game!');
    //     }

    //     const { chapterLevel } = user.currentMazeChapter;
    //     let totalScore = 0;
    //     let chapterScore: number;
    //     let roundScore: { score: number };
    //     let chapterSession: MazeGameChapterSessionDocument;
    //     let chapter: MazeGameChapterDocument;

    //     for (let i = 1; i <= chapterLevel; i++) {
    //         chapter = await MazeGameChapter.findOne({
    //             chapterLevel: i,
    //         });

    //         if (!chapter) continue;

    //         chapterSession = await MazeGameChapterSession.findOne({
    //             userId: userId,
    //             chapterId: chapter._id,
    //         });
    //         if (!chapterSession) continue;

    //         chapterScore = 0;
    //         for (const sessionId of chapterSession.rounds) {
    //             const roundScore = await this.mazeService.getScore(sessionId);
    //             // console.log('>>>', sessionId);
    //             chapterScore += roundScore.score;
    //         }
    //         totalScore += chapterScore;
    //     }

    //     return { score: totalScore };
    // }
}
