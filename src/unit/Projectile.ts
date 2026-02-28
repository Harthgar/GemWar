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
  readonly targetY: number;
  readonly speed: number; // px/ms, negative = up, positive = down
  worldX: number;
  worldY: number;

  private readonly startX: number;
  private readonly startY: number;
  private readonly targetX: number;
  private readonly totalYDist: number;

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
    targetX: number,
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
    this.startX = startX;
    this.startY = startY;
    this.worldX = startX;
    this.worldY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.totalYDist = Math.abs(targetY - startY) || 1;
    this.speed = owner === 'player' ? -UNIT_PROJECTILE_SPEED : UNIT_PROJECTILE_SPEED;
  }

  /** Advance position. Returns true when projectile has reached or passed targetY. */
  update(delta: number): boolean {
    this.worldY += this.speed * delta;

    // Interpolate X based on Y progress
    const yProgress = Math.abs(this.worldY - this.startY) / this.totalYDist;
    const t = Math.min(yProgress, 1);
    this.worldX = this.startX + (this.targetX - this.startX) * t;

    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }
}
