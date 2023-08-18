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

export const initMapLevel3: CellObject[] = [
    {
        property: 'hp_portion',
        isHidden: false,
        hp: 100,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'stamina_portion',
        isHidden: false,
        stamina: 5,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'key',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'armor',
        isHidden: false,
        armor: 10,
    },
];

export const initMapLevel4: CellObject[] = [
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'portal',
        isHidden: false,
        to: 9,
    },
    {
        property: 'baron',
        isHidden: false,
        attack: 500,
        stamina: 5,
    },
    {
        property: 'dragon',
        isHidden: false,
        attack: 500,
        stamina: 5,
    },
    {
        property: 'stamina_portion',
        isHidden: false,
        stamina: 5,
    },
    {
        property: 'hp_portion',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'portal',
        isHidden: false,
        to: 2,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'trap',
        isHidden: false,
    },
    {
        property: 'wall',
        isHidden: false,
    },
    {
        property: 'wall',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'end',
        isHidden: false,
    },
];

export const initMapLevel5: CellObject[] = [
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'portal',
        isHidden: false,
        to: 9,
    },
    {
        property: 'baron',
        isHidden: false,
        attack: 500,
        stamina: 5,
    },
    {
        property: 'dragon',
        isHidden: false,
        attack: 500,
        stamina: 5,
    },
    {
        property: 'stamina_portion',
        isHidden: false,
        stamina: 5,
    },
    {
        property: 'hp_portion',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'portal',
        isHidden: false,
        to: 2,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'trap',
        isHidden: false,
    },
    {
        property: 'wall',
        isHidden: false,
    },
    {
        property: 'wall',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'path',
        isHidden: false,
    },
    {
        property: 'end',
        isHidden: false,
    },
];
