import mongoose, { Document, Schema, Types } from 'mongoose';

export type Character = {
    hp: number;
    armor: number;
    stamina: number;
    position: number;
    key: number;
};

// export enum CellType {
//     path,
//     wall,
//     lava,
//     end,
//     hp_portion,
//     stamina_portion,
//     armor,
//     baron,
//     dragon,
//     trap,
//     key,
//     lock_gate,
// }

export type CellType =
    | 'path'
    | 'wall'
    | 'lava'
    | 'end'
    | 'hp_portion'
    | 'stamina_portion'
    | 'armor'
    | 'baron'
    | 'dragon'
    | 'trap'
    | 'key'
    | 'lock_gate'
    | 'portal';

export interface CellObject {
    property: CellType;
    isHidden: boolean;
    hp?: number;
    armor?: number;
    attack?: number;
    stamina?: number;
    to?: number;
}

export type MazeGameDocument = Document & {
    map: CellObject[];
    character: Character;
    size: {
        width: number;
        height: number;
    };
};

const mazeGameSchema = new Schema<MazeGameDocument>({
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
});

const mazeGameModel = mongoose.model<MazeGameDocument>(
    'MazeGame',
    mazeGameSchema,
);
export default mazeGameModel;
