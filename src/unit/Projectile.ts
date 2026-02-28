import { UNIT_PROJECTILE_SPEED } from '../game/constants';

let nextProjectileId = 0;

export class Projectile {
  readonly id: number;
  readonly owner: 'player' | 'enemy';
  readonly sourceUnitId: number;
  readonly targetUnitId: number;
  readonly damage: number;
  readonly isAoe: boolean;
  readonly column: number;
  readonly color: number;
  readonly worldX: number;
  readonly targetY: number;
  readonly speed: number; // px/ms, negative = up, positive = down
  worldY: number;

  constructor(
    owner: 'player' | 'enemy',
    sourceUnitId: number,
    targetUnitId: number,
    damage: number,
    isAoe: boolean,
    column: number,
    color: number,
    startX: number,
    startY: number,
    targetY: number,
  ) {
    this.id = nextProjectileId++;
    this.owner = owner;
    this.sourceUnitId = sourceUnitId;
    this.targetUnitId = targetUnitId;
    this.damage = damage;
    this.isAoe = isAoe;
    this.column = column;
    this.color = color;
    this.worldX = startX;
    this.worldY = startY;
    this.targetY = targetY;
    this.speed = owner === 'player' ? -UNIT_PROJECTILE_SPEED : UNIT_PROJECTILE_SPEED;
  }

  /** Advance position. Returns true when projectile has reached or passed targetY. */
  update(delta: number): boolean {
    this.worldY += this.speed * delta;
    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }
}
