import { MapCell } from '../constant/maze/map/cellClass';
import { Cell, Character } from '../models/maze_game.model';
import {
    Direction,
    MazeGameSessionDocument,
    Status,
} from '../models/maze_game_session.model';

export interface Score {
    score: number;
}

export interface sessionInfo {
    session: MazeGameSessionDocument;
    time_left: number;
}

export interface MoveEffected {
    status: Status;
    cells_affected: [
        {
            position: number;
            object: Cell;
        },
    ];
    character: Character;
}

export interface MultipleMoveResult {
    status: Status;
    map: Cell[];
    character: Character;
    can_show_animation: boolean;
    score: number;
    moves: Direction[];
}

export function handleMove(
    session: MazeGameSessionDocument,
    move: string,
): MoveEffected {
    const character: Character = session.character;
    const map: Cell[] = session.map;
    const { width, height } = session.size;
    let nextPosition: number;

    character.stamina--;

    switch (move) {
        case Direction.Up:
            nextPosition = character.position + width;
            if (nextPosition > width * height - 1)
                throw Error('Move out of the map');
            break;
        case Direction.Down:
            nextPosition = character.position - width;
            if (nextPosition < 0) throw Error('Move out of the map');
            break;
        case Direction.Right:
            nextPosition = character.position + 1;
            if (nextPosition % width === 0) throw Error('Move out of the map');
            break;
        case Direction.Left:
            nextPosition = character.position - 1;
            if (character.position % width === 0)
                throw Error('Move out of the map');
            break;
        default:
            throw Error('Wrong key submission');
    }

    session.moves = [...session.moves, move as Direction];

    if (MapCell.handle(character, map[nextPosition])) {
        character.position = nextPosition;
    }

    if (character.hp <= 0 || character.stamina <= 0)
        session.status = Status.Lose;
    else if (map[nextPosition].property === 'end') session.status = Status.Win;

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

export function handleMultipleMoves(
    session: MazeGameSessionDocument,
    moves: string[],
): void {
    const character: Character = session.character;
    const map: Cell[] = session.map;
    const { width, height } = session.size;
    let nextPosition: number;

    for (let i = 0; i < moves.length; i++) {
        character.stamina--;
        switch (moves[i]) {
            case Direction.Up:
                nextPosition = character.position + width;
                if (nextPosition > width * height - 1) continue;
                break;
            case Direction.Down:
                nextPosition = character.position - width;
                if (nextPosition < 0) continue;
                break;
            case Direction.Right:
                nextPosition = character.position + 1;
                if (nextPosition % width === 0) continue;
                break;
            case Direction.Left:
                nextPosition = character.position - 1;
                if ((nextPosition + 1) % width === 0) continue;
                break;
            default:
                continue;
        }
        session.moves = [...session.moves, moves[i] as Direction];

        if (MapCell.handle(character, map[nextPosition])) {
            character.position = nextPosition;
        }

        if (character.hp <= 0 || character.stamina <= 0)
            session.status = Status.Lose;
        else if (map[nextPosition].property === 'end')
            session.status = Status.Win;

        if (session.status !== Status.InProgress) return;
    }

    // if (session.status === Status.InProgress) session.status = Status.Lose;
}

export function getScore(session: MazeGameSessionDocument): number {
    if (session.status !== Status.Win) return 0;
    const { character } = session;
    return character.hp + character.stamina * 50 + session.level * 100;
}
