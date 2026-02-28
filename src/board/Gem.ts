import { GemColor } from '../game/constants';
import { GridPos } from '../util/GridPosition';

let nextGemId = 0;

export class Gem {
  readonly id: number;
  color: GemColor;
  row: number;
  col: number;
  locked: boolean;

  constructor(color: GemColor, row: number, col: number) {
    this.id = nextGemId++;
    this.color = color;
    this.row = row;
    this.col = col;
    this.locked = false;
  }

  get pos(): GridPos {
    return { row: this.row, col: this.col };
  }
}
