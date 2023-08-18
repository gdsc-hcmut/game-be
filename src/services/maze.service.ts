import { injectable } from 'inversify';
import { Types } from 'mongoose';
import Session, { sessionMazeGame } from '../models/session_maze_game.model';
import MazeGame, {
    CellObject,
    Character,
    MazeGameDocument,
} from '../models/maze_game.model';
import { initMapLevel1, initMapLevel2 } from '../constant/maze/map';
import { initCharacter1 } from '../constant/maze/character';
import MazeGameSession, {
    MazeGameSessionDocument,
} from '../models/maze_game_session.model';

@injectable()
export class MazeService {
    async startGame(userId: Types.ObjectId): Promise<sessionMazeGame> {
        const userInfo = await Session.findOne({ userId: userId });

        if (userInfo) throw Error('User existed');

        const newSession = new Session({
            userId: userId,
        });
        await newSession.save();
        return newSession;
    }

    async createMap(id: string): Promise<MazeGameDocument> {
        var newMap: CellObject[];
        if (id === '1') {
            newMap = initMapLevel1;
        } else newMap = initMapLevel2;

        const newCharacter: Character = initCharacter1;

        const newMazeGame = new MazeGame({
            map: newMap,
            character: newCharacter,
            size: {
                width: 2,
                height: 1,
            },
        });

        await newMazeGame.save();

        return newMazeGame;
    }

    async createOrFindSession(
        userId: Types.ObjectId,
    ): Promise<MazeGameSessionDocument> {
        const prevSession = await MazeGameSession.findOne({
            userId: userId,
            status: 'InProgress',
        });

        if (prevSession) {
            return prevSession;
        }

        const newMap: CellObject[] =
            Math.floor(Math.random() * 2) == 1 ? initMapLevel1 : initMapLevel2;

        const newCharacter: Character = initCharacter1;

        const newSession = new MazeGameSession({
            map: newMap,
            character: newCharacter,
            size: {
                width: 2,
                height: 1,
            },
            userId: userId,
            status: 'InProgress',
        });

        return newSession;
    }
}
