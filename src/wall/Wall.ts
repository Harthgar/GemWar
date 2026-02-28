import { BOARD_COLS, WALL_SEGMENT_HP } from '../game/constants';

export class Wall {
  readonly owner: 'player' | 'enemy';
  readonly segments: number[];

  constructor(owner: 'player' | 'enemy') {
    this.owner = owner;
    this.segments = new Array(BOARD_COLS).fill(WALL_SEGMENT_HP);
  }

  /** Deal damage to a wall segment. Returns remaining HP (clamped to 0). */
  damage(column: number, power: number): number {
    this.segments[column] = Math.max(0, this.segments[column] - power);
    return this.segments[column];
  }

  isDestroyed(column: number): boolean {
    return this.segments[column] <= 0;
  }

  allDestroyed(): boolean {
    return this.segments.every(hp => hp <= 0);
  }
}
