import { injectable } from 'inversify';
import mongoose, { Types } from 'mongoose';
import MazeGame, {
    CellObject,
    Character,
    MazeGameDocument,
} from '../models/maze_game.model';
import {
    initMapLevel1,
    initMapLevel2,
    initMapLevel3,
    initMapLevel4,
} from '../constant/maze/map';
import { initCharacter1 } from '../constant/maze/character';
import MazeGameSession, {
    MazeGameSessionDocument,
    Status,
} from '../models/maze_game_session.model';
import { Cell } from '../constant/maze/map/cellClass';

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

type Direction = 'up' | 'down' | 'left' | 'right';

function handleMove(
    session: MazeGameSessionDocument,
    moveDirection: Direction,
): MoveEffected {
    const character: Character = session.character;
    const map: CellObject[] = session.map;
    const { width, height } = session.size;
    var nextPosition: number;

    character.stamina--;
    // character.armor++;

    switch (moveDirection) {
        case 'up':
            nextPosition = character.position + session.size.width;
            if (nextPosition > width * height - 1)
                throw Error('Move out of the map');
            break;
        case 'down':
            nextPosition = character.position - session.size.width;
            if (nextPosition < 0) throw Error('Move out of the map');
            break;
        case 'right':
            nextPosition = character.position + 1;
            if (nextPosition % session.size.width === 0)
                throw Error('Move out of the map');
            break;
        case 'left':
            nextPosition = character.position - 1;
            if (character.position % session.size.width === 0)
                throw Error('Move out of the map');
            break;
        default:
            break;
    }

    const newCell: Cell = Cell.createCell(map[nextPosition]);

    if (newCell.handler(character)) {
        character.position = nextPosition;
    }

    if (character.hp <= 0 || character.stamina <= 0) session.status = 'Lose';
    else if (map[nextPosition].property === 'end') session.status = 'Win';

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
    async createMap(id: string): Promise<MazeGameDocument> {
        var newMap: CellObject[] = initMapLevel4;
        // if (id === 3) {
        //     newMap = initMapLevel1;
        // } else newMap = initMapLevel2;

        const newCharacter: Character = initCharacter1;

        const newMazeGame = new MazeGame({
            map: newMap,
            character: newCharacter,
            size: {
                width: 3,
                height: 6,
            },
            index: Number(id),
        });

        await newMazeGame.save();

        return newMazeGame;
    }

    async startSession(
        userId: Types.ObjectId,
    ): Promise<MazeGameSessionDocument> {
        const prevSession = await MazeGameSession.findOne({
            userId: userId,
            status: 'InProgress',
        });

        if (prevSession) {
            return prevSession;
        }

        // const randomNumber: number = Math.floor(Math.random() * 2) + 1;

        const newMazeGame: MazeGameDocument = await MazeGame.findOne({
            // index: randomNumber,
            index: 4,
        });

        const newSession = new MazeGameSession({
            map: newMazeGame.map,
            character: newMazeGame.character,
            size: newMazeGame.size,
            userId: userId,
            status: 'InProgress',
        });

        await newSession.save();
        return newSession;
    }

    async moveUp(sessionId: mongoose.Types.ObjectId): Promise<MoveEffected> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        if (currentSession.status !== 'InProgress') {
            throw Error('Session has been done');
        }

        const result = handleMove(currentSession, 'up');

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                },
            },
        );

        return result;
    }

    async moveRight(sessionId: mongoose.Types.ObjectId): Promise<MoveEffected> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        console.log(currentSession);

        if (currentSession.status !== 'InProgress') {
            throw Error('Session has been done');
        }

        const result = handleMove(currentSession, 'right');

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                },
            },
        );

        return result;
    }

    async moveLeft(sessionId: mongoose.Types.ObjectId): Promise<MoveEffected> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        console.log(currentSession);

        if (currentSession.status !== 'InProgress') {
            throw Error('Session has been done');
        }

        const result = handleMove(currentSession, 'left');

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                },
            },
        );

        return result;
    }

    async moveDown(sessionId: mongoose.Types.ObjectId): Promise<MoveEffected> {
        const currentSession = await MazeGameSession.findById(sessionId);

        if (!currentSession) {
            throw Error('Could not find session');
        }

        console.log(currentSession);

        if (currentSession.status !== 'InProgress') {
            throw Error('Session has been done');
        }

        const result = handleMove(currentSession, 'down');

        await MazeGameSession.updateOne(
            { _id: sessionId },
            {
                $set: {
                    map: currentSession.map,
                    character: currentSession.character,
                    status: currentSession.status,
                },
            },
        );

        return result;
    }
}
