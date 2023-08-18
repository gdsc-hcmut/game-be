import { CellObject, Character } from '../../../models/maze_game.model';

export abstract class Cell {
    isHidden: boolean;
    isValid: boolean;

    constructor(isHidden: boolean) {
        this.isHidden = isHidden;
    }

    abstract handler(character: Character): boolean; // Check whether the move step can be done.

    static createCell(cellInfo: CellObject): Cell {
        var cell: Cell;

        switch (cellInfo.property) {
            case 'path':
                cell = new Path(cellInfo);
                break;
            case 'wall':
                cell = new Wall(cellInfo);
                break;
            case 'lava':
                cell = new Lava(cellInfo);
                break;
            case 'hp_portion':
                cell = new HpPortion(cellInfo);
                break;
            case 'stamina_portion':
                cell = new StaminaPortion(cellInfo);
                break;
            case 'end':
                cell = new End(cellInfo);
                break;
            case 'armor':
                cell = new Armor(cellInfo);
                break;
            case 'baron':
                cell = new Baron(cellInfo);
                break;
            case 'dragon':
                cell = new Dragon(cellInfo);
                break;
            case 'trap':
                cell = new Trap(cellInfo);
                break;
            case 'key':
                cell = new Key(cellInfo);
                break;
            case 'lock_gate':
                cell = new LockGate(cellInfo);
                break;
            case 'portal':
                cell = new Portal(cellInfo);
                break;
            default:
                break;
        }

        return cell;
    }
}

export class Path extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
    }

    handler(character: Character): boolean {
        return true;
    }
}

export class Wall extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
    }

    handler(character: Character): boolean {
        return false;
    }
}

export class Lava extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
    }

    handler(character: Character): boolean {
        character.hp = 0;
        return true;
    }
}

export class End extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
    }

    handler(character: Character): boolean {
        return true;
    }
}

export class HpPortion extends Cell {
    hp: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        const newCell: CellObject = {
            property: 'path',
            isHidden: cellInfo.isHidden,
        };
        cellInfo = newCell;
        this.hp = cellInfo.hp;
    }

    handler(character: Character): boolean {
        character.hp += this.hp;
        this.isValid = false;
        return true;
    }
}

export class StaminaPortion extends Cell {
    stamina: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
        this.stamina = cellInfo.stamina;
    }

    handler(character: Character): boolean {
        character.stamina += this.stamina;
        this.isValid = false;
        return true;
    }
}

export class Armor extends Cell {
    armor: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
        this.armor = cellInfo.armor;
    }

    handler(character: Character): boolean {
        character.armor += this.armor;
        this.isValid = false;
        return true;
    }
}

export class Baron extends Cell {
    // Baron gây sát thương chuẩn :Đ
    stamina: number;
    hpConsuming: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
        this.stamina = cellInfo.stamina;
        this.hpConsuming = cellInfo.attack;
    }

    handler(character: Character): boolean {
        character.hp -= this.hpConsuming;
        if (character.hp > 0) {
            character.stamina += this.stamina;
            this.isValid = false;
        }

        return true;
    }
}

export class Dragon extends Cell {
    stamina: number;
    hpConsuming: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
        this.stamina = cellInfo.stamina;
        this.hpConsuming = cellInfo.attack;
    }

    handler(character: Character): boolean {
        if (character.armor >= this.hpConsuming) {
            character.armor -= this.hpConsuming;
        } else {
            this.hpConsuming -= character.armor;
            character.armor = 0;
            character.hp -= this.hpConsuming;
        }

        if (character.hp > 0) {
            character.stamina += this.stamina;
        }

        return true;
    }
}

export class Trap extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
    }

    handler(character: Character): boolean {
        character.hp -= 1;
        return true;
    }
}

export class Key extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
    }

    handler(character: Character): boolean {
        character.key++;
        this.isValid = false;
        return true;
    }
}

export class LockGate extends Cell {
    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        cellInfo.property = 'path';
    }

    handler(character: Character): boolean {
        if (!character.key) {
            return false;
        }
        character.key++;
        this.isValid = false;
        return true;
    }
}

export class Portal extends Cell {
    to: number;

    constructor(cellInfo: CellObject) {
        super(cellInfo.isHidden);
        // this.property = 'portal';
        this.to = cellInfo.to;
    }

    handler(character: Character): boolean {
        character.position = this.to;
        return false;
    }
}
