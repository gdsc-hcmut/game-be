import { injectable } from 'inversify';
import mongoose, { Types } from 'mongoose';
import MazeGame, {
    CellObject,
    Character,
    MazeGameDocument,
} from '../models/maze_game.model';
import {
    // initMapLevel1,
    // initMapLevel2,
    // initMapLevel3,
    initMapLevel4,
} from '../constant/maze/map';
import { initCharacter1 } from '../constant/maze/character';
import MazeGameSession, {
    MazeGameSessionDocument,
    Status,
} from '../models/maze_game_session.model';
import mazeChapterSession, {
    ChapterStatus,
} from '../models/maze_game_chapter_session.model';

import { Cell } from '../constant/maze/map/cellClass';
import { Direction } from '../models/maze_game_session.model';

interface Score {
    score: number;
}

interface MoveEffected {
    status: Status;
    cells_affected: [
        {
            position: number;
            object: CellObject;
        },
    ];
    character: Character;
}

interface MultipleMoveResult {
    status: Status;
    map: CellObject[];
    character: Character;
    isHelp: boolean;
}

function handleMove(
    session: MazeGameSessionDocument,
    move: string,
): MoveEffected {
    const character: Character = session.character;
    const map: CellObject[] = session.map;
    const { width, height } = session.size;
    var nextPosition: number;

    character.stamina--;

    switch (move) {
        case Direction.Up:
            nextPosition = character.position + width;
            if (nextPosition > width * height - 1)
                throw Error('Move out of the map');
            session.moves = [...session.moves, move];
            break;
        case Direction.Down:
            nextPosition = character.position - width;
            if (nextPosition < 0) throw Error('Move out of the map');
            session.moves = [...session.moves, move];
            break;
        case Direction.Right:
            nextPosition = character.position + 1;
            if (nextPosition % width === 0) throw Error('Move out of the map');
            session.moves = [...session.moves, move];
            break;
        case Direction.Left:
            nextPosition = character.position - 1;
            if (character.position % width === 0)
                throw Error('Move out of the map');
            session.moves = [...session.moves, move];
            break;
        default:
            break;
    }

    if (Cell.handle(character, map[nextPosition])) {
        character.position = nextPosition;
    }

    if (character.hp <= 0 || character.stamina <= 0)
        session.status = Status.Lose;
    else if (map[nextPosition].property === 'end') session.status = Status.Win;

    const result: MoveEffected = {
        status: session.status,
        cells_affected: [
            {
                position: nextPosition,
                object: map[nextPosition],
            },
        ],
        character: character,
    };

    return result;
}

function handleMultipleMove(
    session: MazeGameSessionDocument,
    moves: string[],
): void {
    const character: Character = session.character;
    const map: CellObject[] = session.map;
    const { width, height } = session.size;
    var nextPosition: number;

    for (var i = 0; i < moves.length; i++) {
        character.stamina--;
        switch (moves[i]) {
            case Direction.Up:
                nextPosition = character.position + width;
                if (nextPosition > width * height - 1) continue;
                session.moves = [...session.moves, Direction.Up];
                break;
            case Direction.Down:
                nextPosition = character.position - width;
                if (nextPosition < 0) continue;
                session.moves = [...session.moves, Direction.Down];
                break;
            case Direction.Right:
                nextPosition = character.position + 1;
                if (nextPosition % width === 0) continue;
                session.moves = [...session.moves, Direction.Right];
                break;
            case Direction.Left:
                nextPosition = character.position - 1;
                if ((nextPosition - 1) % width === 0) continue;
                session.moves = [...session.moves, Direction.Left];
                break;
            default:
                continue;
        }

        if (Cell.handle(character, map[nextPosition])) {
            character.position = nextPosition;
        }

        if (character.hp <= 0 || character.stamina <= 0)
            session.status = Status.Lose;
        else if (map[nextPosition].property === 'end')
            session.status = Status.Win;

        if (session.status !== Status.InProgress) return;
    }

    if (session.status === Status.InProgress) session.status = Status.Lose;
}

// function handleMultipleMove()

@injectable()
export class MazeService {
    async createMap(level: number): Promise<MazeGameDocument> {
        var newMap: CellObject[] = initMapLevel4;

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

    async startSession(
        userId: Types.ObjectId,
        level: number,
        chapterSessionId: Types.ObjectId = null,
    ): Promise<MazeGameSessionDocument> {
        const currentSession = await MazeGameSession.findOne({
            userId: userId,
            status: Status.InProgress,
        });

        if (currentSession) {
            throw Error('Find another in Progress session');
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
        return newSession;
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

        // var moveDirection: Direction;
        // switch (move) {
        //     case 'w':
        //         moveDirection = Direction.Up;
        //         break;

        //     case 's':
        //         moveDirection = Direction.Down;
        //         break;

        //     case 'd':
        //         moveDirection = Direction.Right;
        //         break;

        //     case 'a':
        //         moveDirection = Direction.Left;
        //         break;

        //     default:
        //         throw Error('wrong key submission');
        // }

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
    ): Promise<CellObject[]> {
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

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (!currentSession.userId.equals(userId))
            throw Error('Could not access to session');

        if (currentSession.status !== Status.InProgress) {
            throw Error('Session has been done');
        }
        handleMultipleMove(currentSession, moves);

        const currentChapterSession = await mazeChapterSession
            .findById(currentSession.chapterSessionId)
            .populate('chapterId');
        if (currentChapterSession) {
            const newRound = currentChapterSession.currentRound + 1;
            const maxRound = currentChapterSession.chapterId.roundLevels.length;
            var helpCount = currentChapterSession.helpCount;
            console.log(maxRound);

            var newStatus: ChapterStatus = ChapterStatus.InProgress;

            if (newRound > maxRound) newStatus = ChapterStatus.Done;

            var isHelp: boolean = false;
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
                },
            },
        );

        return {
            status: currentSession.status,
            map: currentSession.map,
            character: currentSession.character,
            isHelp: isHelp,
        };
    }

    async getScore(sessionId: Types.ObjectId): Promise<Score> {
        const session = await MazeGameSession.findById(sessionId);

        if (!session) return { score: 0 };

        if (session.status !== Status.Win) return { score: 0 };

        const score =
            session.character.hp +
            session.character.stamina * 10 +
            session.level * 100;

        return { score: score };
    }
}
