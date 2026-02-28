import {
  BOARD_X, CELL_SIZE,
  PLAYER_BOARD_Y, ENEMY_BOARD_Y, BOARD_PIXEL_HEIGHT,
  ATTACK_SPEED,
} from '../game/constants';

let nextId = 0;

export class Attack {
  readonly id: number;
  readonly owner: 'player' | 'enemy';
  readonly column: number;
  readonly power: number;
  readonly color: number;
  readonly worldX: number;
  readonly targetY: number;
  readonly speed: number; // world px per ms (negative = up, positive = down)
  worldY: number;

  constructor(owner: 'player' | 'enemy', column: number, power: number, color: number) {
    this.id = nextId++;
    this.owner = owner;
    this.column = column;
    this.power = power;
    this.color = color;
    this.worldX = BOARD_X + column * CELL_SIZE + CELL_SIZE / 2;

    if (owner === 'player') {
      // Player attacks travel UP (decreasing Y)
      this.worldY = PLAYER_BOARD_Y;
      this.targetY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
      this.speed = -ATTACK_SPEED;
    } else {
      // Enemy attacks travel DOWN (increasing Y)
      this.worldY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
      this.targetY = PLAYER_BOARD_Y;
      this.speed = ATTACK_SPEED;
    }
  }

  /** Advance position. Returns true if the attack has arrived at its target. */
  update(delta: number): boolean {
    this.worldY += this.speed * delta;

    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }
}
