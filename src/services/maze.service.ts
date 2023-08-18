import { injectable } from 'inversify';
import { Types } from 'mongoose';
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

        const randomNumber: number = Math.floor(Math.random() * 2) + 1;

        const newMazeGame: MazeGameDocument = await MazeGame.findOne({
            index: randomNumber,
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
}
