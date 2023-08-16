import {
    Cell,
    Character,
    cellProperties,
} from '../../../models/round_maze_game.model';

export class Path extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'path';
    }

    handler(character: Character): boolean {
        return true;
    }
}

export class Wall extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'wall';
    }

    handler(character: Character): boolean {
        return false;
    }
}

export class Lava extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'lava';
    }

    handler(character: Character): boolean {
        character.hp = 0;
        return true;
    }
}

export class End extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'end';
    }

    // chưa xong ...
    handler(character: Character): boolean {
        return true;
    }
}

export class HpPortion extends Cell {
    hp: number;

    constructor(isHidden: boolean, hp: number) {
        super(isHidden);
        this.property = 'hp_portion';
        this.hp = hp;
    }

    handler(character: Character): boolean {
        character.hp += this.hp;
        this.isValid = false;
        return true;
    }
}

export class StaminaPortion extends Cell {
    stamina: number;

    constructor(isHidden: boolean, stamina: number) {
        super(isHidden);
        this.property = 'stamina_portion';
        this.stamina = stamina;
    }

    handler(character: Character): boolean {
        character.stamina += this.stamina;
        this.isValid = false;
        return true;
    }
}

export class Armor extends Cell {
    armor: number;

    constructor(isHidden: boolean, armor: number) {
        super(isHidden);
        this.property = 'armor';
        this.armor = armor;
    }

    handler(character: Character): boolean {
        character.stamina += this.armor;
        this.isValid = false;
        return true;
    }
}

export class Baron extends Cell {
    // Baron gây sát thương chuẩn :Đ
    stamina: number;
    HpConsuming: number;

    constructor(isHidden: boolean, stamina: number, hp: number) {
        super(isHidden);
        this.property = 'baron';
        this.stamina = stamina;
        this.HpConsuming = hp;
    }

    handler(character: Character): boolean {
        character.hp -= this.HpConsuming;
        if (character.hp > 0) {
            this.stamina += this.stamina;
            this.isValid = false;
        }

        return true;
    }
}

export class Dragon extends Cell {
    stamina: number;
    HpConsuming: number;

    constructor(isHidden: boolean, stamina: number, hp: number) {
        super(isHidden);
        this.property = 'dragon';
        this.stamina = stamina;
        this.HpConsuming = hp;
    }

    handler(character: Character): boolean {
        if (character.armor >= this.HpConsuming) {
            character.armor -= this.HpConsuming;
        } else {
            this.HpConsuming -= character.armor;
            character.armor = 0;
            character.hp -= this.HpConsuming;
        }

        if (character.hp > 0) {
            this.stamina += this.stamina;
            this.isValid = false;
        }

        return true;
    }
}

export class Trap extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'trap';
    }

    handler(character: Character): boolean {
        character.hp -= 1;
        return true;
    }
}

// export class Rock extends Cell {
//     handler(character: Character): boolean {

//     }
// }

export class Key extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'key';
    }

    handler(character: Character): boolean {
        character.hasKey = true;
        this.isValid = false;
        return true;
    }
}

export class LockGate extends Cell {
    constructor(isHidden: boolean) {
        super(isHidden);
        this.property = 'gate';
    }

    handler(character: Character): boolean {
        if (character.hasKey) {
            character.hasKey = false;
            this.isValid = false;
            return true;
        }
        return false;
    }
}

export class Portal extends Cell {
    destination: Array<number>;

    constructor(isHidden: boolean, destination: Array<number>) {
        super(isHidden);
        this.property = 'portal';
        this.destination = destination;
    }

    handler(character: Character): boolean {
        character.position[0] = this.destination[0];
        character.position[1] = this.destination[1];
        return true;
    }
}
