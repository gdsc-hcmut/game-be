import { injectable } from 'inversify';
import { Types } from 'mongoose';
import Session, { sessionMazeGame } from '../models/session_maze_game.model';
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
        const user = await Session.findOne({ userId: userId });

        if (user) throw Error('User existed');

        const newSession = new Session({
            userId: userId,
        });
        await newSession.save();
        return newSession;
    }
}
