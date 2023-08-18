// import { MazeMap } from '../../../models/round_maze_game.model';
// import mongoose from 'mongoose';
import { CellObject } from '../../../models/maze_game.model';

// export const ID_OF_RECORDS: String[] = [
//     '64df0a9997bd7120fb5c968f',
//     '64df0b1397bd7120fb5c9695',
// ];

export const NUMBER_OF_MAPS: number = 2;

export const initMapLevel1: CellObject[] = [
    // Map 4x4
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'wall',
        isHidden: false,
    },
];

export const initMapLevel2: CellObject[] = [
    {
        property: 'dragon',
        isHidden: false,
    },
    {
        property: 'baron',
        isHidden: false,
    },
];
