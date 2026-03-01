import {
  BOARD_X, BOARD_COLS, CELL_SIZE,
  PLAYER_BOARD_Y, ENEMY_BOARD_Y, BOARD_PIXEL_HEIGHT,
  UNIT_SPEED, UNIT_STRENGTH, UNIT_HP_MULTIPLIER, UnitType,
} from '../game/constants';

let nextId = 0;

export type UnitState = 'marching' | 'attacking_wall' | 'attacking_board';

export class Unit {
  readonly id: number;
  readonly owner: 'player' | 'enemy';
  column: number;
  readonly unitType: UnitType;
  readonly color: number;
  worldX: number;
  readonly targetY: number;
  readonly speed: number; // world px per ms (negative = up, positive = down)
  readonly strength: number; // damage per attack (readonly)
  worldY: number;
  hp: number; // takes damage, unit dies when <= 0
  state: UnitState = 'marching';
  attackCooldown = 0; // ms until next attack
  inCombat = false; // set each frame by resolveUnitCombat
  combatTargetId: number | null = null; // id of current combat target

  // Status effects
  slowFactor = 1.0;          // 1.0 = normal, lower = slower
  slowDuration = 0;          // ms remaining
  poisonDmgPerTick = 0;
  poisonTickInterval = 0;
  poisonTimeRemaining = 0;
  poisonTickCooldown = 0;

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
    const effectiveSpeed = this.speed * this.slowFactor;
    this.worldY += effectiveSpeed * delta;

    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  applySlow(factor: number, duration: number): void {
    if (factor < this.slowFactor || duration > this.slowDuration) {
      this.slowFactor = factor;
      this.slowDuration = duration;
    }
  }

  applyPoison(dmgPerTick: number, tickInterval: number, totalDuration: number): void {
    this.poisonDmgPerTick = dmgPerTick;
    this.poisonTickInterval = tickInterval;
    this.poisonTimeRemaining = totalDuration;
    this.poisonTickCooldown = tickInterval;
  }

  /** Shift unit 1 column sideways. Clamped to board bounds. */
  displace(direction: number): void {
    const newCol = Math.max(0, Math.min(BOARD_COLS - 1, this.column + direction));
    if (newCol !== this.column) {
      this.column = newCol;
      this.worldX = BOARD_X + this.column * CELL_SIZE + CELL_SIZE / 2;
    }
  }

  /** Tick status effects each frame. */
  updateStatusEffects(delta: number): void {
    // Slow decay
    if (this.slowDuration > 0) {
      this.slowDuration -= delta;
      if (this.slowDuration <= 0) {
        this.slowFactor = 1.0;
        this.slowDuration = 0;
      }
    }

    // Poison ticks
    if (this.poisonTimeRemaining > 0) {
      this.poisonTimeRemaining -= delta;
      this.poisonTickCooldown -= delta;
      if (this.poisonTickCooldown <= 0) {
        this.hp -= this.poisonDmgPerTick;
        this.poisonTickCooldown += this.poisonTickInterval;
      }
      if (this.poisonTimeRemaining <= 0) {
        this.poisonDmgPerTick = 0;
        this.poisonTimeRemaining = 0;
      }
    }
  }
}
