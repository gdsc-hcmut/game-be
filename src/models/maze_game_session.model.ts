import mongoose, { Document, Schema, Types } from 'mongoose';
import { CellObject, Character } from './maze_game.model';

export enum Status {
    InProgress = 'in_progress',
    Win = 'win',
    Lose = 'lose',
}

export enum Direction {
    Up = 'up',
    Down = 'down',
    Right = 'right',
    Left = 'left',
}

export type MazeGameSessionDocument = Document & {
    map: CellObject[];
    character: Character;
    size: {
        width: number;
        height: number;
    };
    userId: Types.ObjectId;
    status: Status;
    mapId: Types.ObjectId;
    moves: Direction[];
};

const mazeGameSessionSchema = new Schema<MazeGameSessionDocument>({
    map: [
        {
            property: String,
            isHidden: Boolean,
            hp: {
                type: Number,
                required: false,
            },
            armor: {
                type: Number,
                required: false,
            },
            stamina: {
                type: Number,
                required: false,
            },
            attack: {
                type: Number,
                required: false,
            },
            to: {
                type: Number,
                required: false,
            },
        },
    ],
    character: {
        hp: Number,
        armor: Number,
        stamina: Number,
        position: Number,
        key: Number,
    },
    size: {
        width: { type: Number },
        height: { type: Number },
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: String,
    mapId: { type: Schema.Types.ObjectId, ref: 'maze_game' },
    moves: [{ type: String, default: [] }],
});

const mazeGameSchemaModel = mongoose.model<MazeGameSessionDocument>(
    'maze_game_session',
    mazeGameSessionSchema,
);

export default mazeGameSchemaModel;