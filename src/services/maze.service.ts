import { injectable } from 'inversify';
import mongoose, { Types } from 'mongoose';
import MazeGame, {
    Cell,
    Character,
    MazeGameDocument,
} from '../models/maze_game.model';
import {
    // initMapLevel1,
    // initMapLevel2,
    // initMapLevel3,
    initMapLevel4,
    max_time,
} from '../constant/maze/map';
import { initCharacter1 } from '../constant/maze/character';
import MazeGameSession, {
    MazeGameSessionDocument,
    Status,
} from '../models/maze_game_session.model';
import mazeChapterSession, {
    ChapterStatus,
} from '../models/maze_game_chapter_session.model';

// import { MapCell } from '../constant/maze/map/cellClass';
import { Direction } from '../models/maze_game_session.model';
import {
    MoveEffected,
    MultipleMoveResult,
    Score,
    getScore,
    handleMove,
    handleMultipleMoves,
    sessionInfo,
} from '../maze_game';

@injectable()
export class MazeService {
    async createMap(level: number): Promise<MazeGameDocument> {
        let newMap: Cell[] = initMapLevel4;

        const newCharacter: Character = initCharacter1;

        const newMazeGame = new MazeGame({
            map: newMap,
            character: newCharacter,
            size: {
                width: 3,
                height: 6,
            },
            level: level,
        });

        await newMazeGame.save();

        return newMazeGame;
    }

    async startOrCreateSession(
        userId: Types.ObjectId,
        level: number,
        chapterSessionId: Types.ObjectId = null,
    ): Promise<sessionInfo> {
        const currentSession = await MazeGameSession.findOne({
            userId: userId,
            status: Status.InProgress,
        });

        if (currentSession) {
            console.log('Find another in Progress session');
            return {
                session: currentSession,
                time_left: max_time - Date.now() + currentSession.startTime,
            };
        }

        const [newMazeGame] = await MazeGame.aggregate<MazeGameSessionDocument>(
            [{ $match: { level: level } }, { $sample: { size: 1 } }],
        );

        const newSession = new MazeGameSession({
            map: newMazeGame.map,
            character: newMazeGame.character,
            size: newMazeGame.size,
            userId: userId,
            chapterSessionId: chapterSessionId,
            status: Status.InProgress,
            mapId: newMazeGame._id,
            level: level,
        });

        await newSession.save();
        return {
            session: newSession,
            time_left: max_time,
        };
    }

    async getCurrentSession(
        userId: Types.ObjectId,
    ): Promise<MazeGameSessionDocument> {
        const currentSession = await MazeGameSession.findOne({
            userId: userId,
            status: Status.InProgress,
        });

        if (!currentSession) {
            throw Error('Session not found');
        }

        return currentSession;
    }

    async submitSingleMove(
        sessionId: mongoose.Types.ObjectId,
        userId: Types.ObjectId,
        move: string,
    ): Promise<MoveEffected> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        if (currentSession.status !== Status.InProgress) {
            throw Error('Session has been done');
        }

        const result = handleMove(currentSession, move);

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                    moves: currentSession.moves,
                },
            },
        );

        return result;
    }

    async getCharacterInfo(
        sessionId: mongoose.Types.ObjectId,
        userId: Types.ObjectId,
    ): Promise<Character> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        return currentSession.character;
    }

    async getMapInfo(
        sessionId: mongoose.Types.ObjectId,
        userId: Types.ObjectId,
    ): Promise<Cell[]> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        return currentSession.map;
    }

    async getMovesHistory(
        sessionId: mongoose.Types.ObjectId,
        userId: Types.ObjectId,
    ): Promise<Direction[]> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        return currentSession.moves;
    }

    async endMazeSession(
        sessionId: mongoose.Types.ObjectId,
        userId: Types.ObjectId,
    ): Promise<MazeGameSessionDocument> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        currentSession.status = Status.Lose;

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    status: Status.Lose,
                },
            },
        );

        return currentSession;
    }

    async submitMultipleMove(
        sessionId: Types.ObjectId,
        userId: Types.ObjectId,
        moves: string[],
        useHelp: boolean,
    ): Promise<MultipleMoveResult> {
        const currentSession = await MazeGameSession.findById(sessionId);

        // if (currentSession.status === Status.InProgress)

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        if (currentSession.status !== Status.InProgress) {
            throw Error('Session has been done');
        }
        handleMultipleMoves(currentSession, moves);

        if (currentSession.status === Status.InProgress) {
            currentSession.status = Status.Lose;
        }

        const currentChapterSession = await mazeChapterSession
            .findById(currentSession.chapterSessionId)
            .populate('chapterId');

        let isHelp: boolean = false;

        if (currentChapterSession) {
            const newRound = currentChapterSession.currentRound + 1;
            const maxRound = currentChapterSession.chapterId.roundLevels.length;
            let helpCount = currentChapterSession.helpCount;
            console.log(maxRound);

            let newStatus: ChapterStatus = ChapterStatus.InProgress;

            if (newRound > maxRound) newStatus = ChapterStatus.Done;

            if (useHelp && helpCount > 0) {
                helpCount--;
                isHelp = true;
            }

            await mazeChapterSession.updateOne(
                { _id: currentSession.chapterSessionId },
                {
                    $set: {
                        currentRound: newRound,
                        status: newStatus,
                        helpCount: helpCount,
                    },
                },
            );
        }

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    status: currentSession.status,
                    map: currentSession.map,
                    character: currentSession.character,
                    moves: currentSession.moves,
                },
            },
        );

        const score = getScore(currentSession);

        return {
            status: currentSession.status,
            map: currentSession.map,
            character: currentSession.character,
            can_show_animation: isHelp,
            moves: currentSession.moves,
            score: score,
        };
    }

    async getScore(sessionId: Types.ObjectId): Promise<Score> {
        const session = await MazeGameSession.findById(sessionId);

        if (!session) return { score: 0 };

        if (session.status !== Status.Win) return { score: 0 };

        const score = getScore(session);

        return { score: score };
    }
}
