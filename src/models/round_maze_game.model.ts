import mongoose, { Document, Schema, Types } from 'mongoose';

export type Character = {
    hp: number;
    armor: number;
    stamina: number;
    position: Array<number>;
    hasKey: boolean;
};

export type cellProperties =
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
    | 'rock'
    | 'key'
    | 'gate'
    | 'portal'
    | 'fog';

export abstract class Cell {
    property: cellProperties;
    isHidden: boolean;
    isValid: boolean;
    constructor(isHidden: boolean) {
        // this.property = property;
        this.isHidden = isHidden;
        this.isValid = true;
    }
    // abstract handler(character: Character): boolean; // Check whether the move step can be done.
}

// export type MazeMap = {
//     [key: number]: cellProperties;
// };

export type RoundState = 'inProgress' | 'Win' | 'Lose';

export type roundMazeGame = Document & {
    map: cellProperties[];
    character: Character;
    userId: Types.ObjectId;
    order: number;
    roundState: RoundState;
};

const roundMazeGameSchema = new Schema<roundMazeGame>({
    map: [String],
    character: {
        hp: Number,
        stamina: Number,
        position: Array<number>,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    order: Number,
    roundState: String,
});

const roundMazeGameModel = mongoose.model<roundMazeGame>(
    'Round',
    roundMazeGameSchema,
);
export default roundMazeGameModel;
