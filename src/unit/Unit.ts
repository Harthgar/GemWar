import {
  BOARD_X, CELL_SIZE,
  PLAYER_BOARD_Y, ENEMY_BOARD_Y, BOARD_PIXEL_HEIGHT,
  UNIT_SPEED, UNIT_STRENGTH, UNIT_HP_MULTIPLIER, UnitType,
} from '../game/constants';

let nextId = 0;

export type UnitState = 'marching' | 'attacking_wall' | 'attacking_board';

export class Unit {
  readonly id: number;
  readonly owner: 'player' | 'enemy';
  readonly column: number;
  readonly unitType: UnitType;
  readonly color: number;
  readonly worldX: number;
  readonly targetY: number;
  readonly speed: number; // world px per ms (negative = up, positive = down)
  readonly strength: number; // damage per attack (readonly)
  worldY: number;
  hp: number; // takes damage, unit dies when <= 0
  state: UnitState = 'marching';
  attackCooldown = 0; // ms until next attack
  inCombat = false; // set each frame by resolveUnitCombat
  combatTargetId: number | null = null; // id of current combat target

  constructor(
    owner: 'player' | 'enemy',
    column: number,
    unitType: UnitType,
    color: number,
    staggerOffset: number = 0,
  ) {
    this.id = nextId++;
    this.owner = owner;
    this.column = column;
    this.unitType = unitType;
    this.color = color;
    this.strength = UNIT_STRENGTH[unitType];
    this.hp = this.strength * UNIT_HP_MULTIPLIER;
    this.worldX = BOARD_X + column * CELL_SIZE + CELL_SIZE / 2;

    if (owner === 'player') {
      this.worldY = PLAYER_BOARD_Y + staggerOffset;
      this.targetY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
      this.speed = -UNIT_SPEED;
    } else {
      this.worldY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT - staggerOffset;
      this.targetY = PLAYER_BOARD_Y;
      this.speed = UNIT_SPEED;
    }
  }

  /** Advance position. Returns true if the unit has reached its target edge. */
  update(delta: number): boolean {
    this.worldY += this.speed * delta;

    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }
}
