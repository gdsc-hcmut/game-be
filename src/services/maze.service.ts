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
import { Cell } from '../constant/maze/map/cellClass';
import { Direction } from '../models/maze_game_session.model';

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

function handleMove(
    session: MazeGameSessionDocument,
    moveDirection: Direction,
): MoveEffected {
    const character: Character = session.character;
    const map: CellObject[] = session.map;
    const { width, height } = session.size;
    var nextPosition: number;

    character.stamina--;

    switch (moveDirection) {
        case 'up':
            nextPosition = character.position + width;
            if (nextPosition > width * height - 1)
                throw Error('Move out of the map');
            break;
        case 'down':
            nextPosition = character.position - width;
            if (nextPosition < 0) throw Error('Move out of the map');
            break;
        case 'right':
            nextPosition = character.position + 1;
            if (nextPosition % width === 0) throw Error('Move out of the map');
            break;
        case 'left':
            nextPosition = character.position - 1;
            if (character.position % width === 0)
                throw Error('Move out of the map');
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

@injectable()
export class MazeService {
    async createMap(): Promise<MazeGameDocument> {
        var newMap: CellObject[] = initMapLevel4;

        const newCharacter: Character = initCharacter1;

        const newMazeGame = new MazeGame({
            map: newMap,
            character: newCharacter,
            size: {
                width: 3,
                height: 6,
            },
        });

        await newMazeGame.save();

        return newMazeGame;
    }

    async startSession(
        userId: Types.ObjectId,
    ): Promise<MazeGameSessionDocument> {
        const prevSession = await MazeGameSession.findOne({
            userId: userId,
            status: Status.InProgress,
        });

        if (prevSession) {
            return prevSession;
        }

        const [newMazeGame] = await MazeGame.aggregate([
            { $sample: { size: 1 } },
        ]);

        const newSession = new MazeGameSession({
            map: newMazeGame.map,
            character: newMazeGame.character,
            size: newMazeGame.size,
            userId: userId,
            status: Status.InProgress,
            mapId: newMazeGame._id,
        });

        await newSession.save();
        return newSession;
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

        var moveDirection: Direction;
        switch (move) {
            case 'w':
                moveDirection = Direction.Up;
                break;

            case 's':
                moveDirection = Direction.Down;
                break;

            case 'd':
                moveDirection = Direction.Right;
                break;

            case 'a':
                moveDirection = Direction.Left;
                break;

            default:
                throw Error('wrong key submission');
        }

        const result = handleMove(currentSession, moveDirection);

        const newMoves: Direction[] = [...currentSession.moves, moveDirection];

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                    moves: newMoves,
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
}
