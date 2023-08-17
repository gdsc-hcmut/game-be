import { injectable } from 'inversify';
import { Types } from 'mongoose';
import Session, { sessionMazeGame } from '../models/session_maze_game.model';
import Round, { roundMazeGame } from '../models/round_maze_game.model';
import initMapLevel1 from '../constant/maze/map';
import { Character, cellProperties } from '../models/round_maze_game.model';
import { characters } from '../constant/maze/character';
// import { Session } from 'inspector';

// export interface Resp {
//     payload: any;
//     code: number;
//     message: string;
//     success: boolean;
// }

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

    async startRound(round: string, userId: Types.ObjectId) {
        console.log(round);

        const userInfo = await Session.findOne({ userId: userId });

        if (!userInfo) throw Error('User has not been start game');

        const newMap: cellProperties[] = initMapLevel1;
        const newCharacter: Character = characters[0];

        const newRoundGame = new Round({
            map: newMap,
            character: newCharacter,
            userId: userId,
            order: 1,
            roundState: 'inProgress',
        });

        await newRoundGame.save();

        return newRoundGame;

        // if (round > userInfo.currentRound)
    }
}
