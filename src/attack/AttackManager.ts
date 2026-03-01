import Phaser from 'phaser';
import { Attack } from './Attack';
import { AttackSprite } from './AttackSprite';
import { Board } from '../board/Board';
import { Wall } from '../wall/Wall';
import { EventBus, GameEvents } from '../util/EventBus';
import {
  BATTLEFIELD_Y, PLAYER_BOARD_Y, WALL_HEIGHT, CELL_SIZE,
  AttackType,
  FIREBALL_SPLASH_RADIUS,
  FROSTBOLT_SLOW_FACTOR, FROSTBOLT_SLOW_BASE_MS, FROSTBOLT_SLOW_PER_LEVEL_MS,
  POISON_DOT_BASE_DAMAGE, POISON_DOT_TICK_MS, POISON_DOT_DURATION_MS,
  LIGHTNING_CHAINS, LIGHTNING_CHAIN_RANGE_BASE, LIGHTNING_CHAIN_RANGE_PER_LEVEL,
} from '../game/constants';
import { UnitManager, ActiveUnit } from '../unit/UnitManager';
import { Unit } from '../unit/Unit';

interface ActiveAttack {
  attack: Attack;
  sprite: AttackSprite;
}

const COLLISION_THRESHOLD = CELL_SIZE * 0.8;

export class AttackManager {
  private scene: Phaser.Scene;
  private active: ActiveAttack[] = [];
  private playerWall: Wall;
  private enemyWall: Wall;
  private playerBoard: Board;
  private enemyBoard: Board;
  private unitManager: UnitManager | null = null;

  constructor(
    scene: Phaser.Scene,
    playerWall: Wall, enemyWall: Wall,
    playerBoard: Board, enemyBoard: Board,
  ) {
    this.scene = scene;
    this.playerWall = playerWall;
    this.enemyWall = enemyWall;
    this.playerBoard = playerBoard;
    this.enemyBoard = enemyBoard;
  }

  getActiveAttacks(): { owner: 'player' | 'enemy'; worldX: number; worldY: number }[] {
    return this.active.map(a => ({
      owner: a.attack.owner,
      worldX: a.attack.worldX,
      worldY: a.attack.worldY,
    }));
  }

  setUnitManager(um: UnitManager): void {
    this.unitManager = um;
  }

  fireAttack(
    owner: 'player' | 'enemy',
    column: number,
    power: number,
    color: number,
    matchLength: number,
  ): void {
    const attack = new Attack(owner, column, power, color, matchLength);

    console.log(
      `[${owner}] Attack fired: col=${column} type=${attack.attackType} ` +
      `level=${attack.level} power=${attack.basePower}`
    );

    EventBus.emit(GameEvents.ATTACK_FIRED, {
      owner, column, power: attack.basePower, color,
    });

    // Holy Beam resolves instantly — no traveling projectile
    if (attack.isInstant) {
      this.resolveInstantBeam(attack);
      const sprite = new AttackSprite(this.scene, attack);
      sprite.flashAndDestroy();
      return;
    }

    const sprite = new AttackSprite(this.scene, attack);
    this.active.push({ attack, sprite });
  }

  update(delta: number): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const { attack, sprite } = this.active[i];
      const arrived = attack.update(delta);

      // Type-specific unit collision
      if (this.unitManager) {
        const consumed = this.resolveAttackVsUnits(attack);
        if (consumed) {
          sprite.destroy();
          this.active.splice(i, 1);
          continue;
        }
      }

      // Wall and board resolution
      const resolved = this.resolveWallAndBoard(attack, arrived);
      if (resolved) {
        sprite.destroy();
        this.active.splice(i, 1);
      } else {
        sprite.update(attack.worldY);
      }
    }
  }

  // ── Type dispatch ──────────────────────────────────────────────

  private resolveAttackVsUnits(attack: Attack): boolean {
    switch (attack.attackType) {
      case AttackType.Fireball:
        return this.resolveFireball(attack);
      case AttackType.FrostBolt:
        return this.resolveFrostBolt(attack);
      case AttackType.PoisonShot:
        return this.resolvePoisonShot(attack);
      case AttackType.Lightning:
        return this.resolveLightning(attack);
      case AttackType.VoidPulse:
        return this.resolveVoidPulse(attack);
      case AttackType.HolyBeam:
        return false; // handled instantly in fireAttack
    }
  }

  // ── Red — Fireball ─────────────────────────────────────────────

  private resolveFireball(attack: Attack): boolean {
    const hit = this.findFirstUnitInColumn(attack);
    if (!hit) return false;

    hit.unit.hp -= attack.power;

    // AoE splash
    const splashRadius = FIREBALL_SPLASH_RADIUS[attack.level - 1] * CELL_SIZE;
    this.applySplashDamage(attack, splashRadius, hit.unit);

    return true;
  }

  private applySplashDamage(
    attack: Attack, radiusPx: number, primaryTarget?: Unit,
  ): void {
    if (!this.unitManager) return;
    for (const au of this.unitManager.getActiveUnits()) {
      if (au.unit.owner === attack.owner) continue;
      if (au.unit.isDead) continue;
      if (primaryTarget && au.unit === primaryTarget) continue;

      const dx = au.unit.worldX - attack.worldX;
      const dy = au.unit.worldY - attack.worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radiusPx) {
        au.unit.hp -= attack.power;
      }
    }
  }

  // ── Blue — Frost Bolt ──────────────────────────────────────────

  private resolveFrostBolt(attack: Attack): boolean {
    if (!this.unitManager) return false;

    for (const au of this.unitManager.getActiveUnits()) {
      if (au.unit.owner === attack.owner) continue;
      if (au.unit.isDead) continue;
      if (au.unit.column !== attack.column) continue;
      if (attack.hitUnitIds.has(au.unit.id)) continue;

      const dist = Math.abs(au.unit.worldY - attack.worldY);
      if (dist >= COLLISION_THRESHOLD) continue;

      attack.hitUnitIds.add(au.unit.id);
      au.unit.hp -= attack.power;

      const slowDur = FROSTBOLT_SLOW_BASE_MS +
        FROSTBOLT_SLOW_PER_LEVEL_MS * (attack.level - 1);
      au.unit.applySlow(FROSTBOLT_SLOW_FACTOR, slowDur);

      if (attack.pierceRemaining > 0) {
        attack.pierceRemaining--;
        // Continue traveling
      } else {
        return true; // consumed
      }
    }
    return false;
  }

  // ── Green — Poison Shot ────────────────────────────────────────

  private resolvePoisonShot(attack: Attack): boolean {
    const hit = this.findFirstUnitInColumn(attack);
    if (!hit) return false;

    attack.hitUnitIds.add(hit.unit.id);
    const hpBefore = hit.unit.hp;
    hit.unit.hp -= attack.power;

    if (hit.unit.isDead && attack.pierceRemaining > 0) {
      // Passed through: subtract HP consumed
      attack.power -= hpBefore;
      attack.pierceRemaining--;
      if (attack.power <= 0) return true; // exhausted
      return false; // continue
    }

    // Stopped on this unit: apply poison DoT
    const dotMultiplier = Math.pow(2, attack.level - 1);
    hit.unit.applyPoison(
      POISON_DOT_BASE_DAMAGE * dotMultiplier,
      POISON_DOT_TICK_MS,
      POISON_DOT_DURATION_MS,
    );
    return true;
  }

  // ── Yellow — Lightning ─────────────────────────────────────────

  private resolveLightning(attack: Attack): boolean {
    const primaryTarget = this.findFirstUnitInColumn(attack);
    if (!primaryTarget) return false;

    primaryTarget.unit.hp -= attack.power;
    attack.hitUnitIds.add(primaryTarget.unit.id);

    // Chain to nearby enemies
    const chainCount = LIGHTNING_CHAINS[attack.level - 1];
    const chainRange = (LIGHTNING_CHAIN_RANGE_BASE +
      LIGHTNING_CHAIN_RANGE_PER_LEVEL * (attack.level - 1)) * CELL_SIZE;

    if (!this.unitManager) return true;

    let lastHit = primaryTarget.unit;
    for (let c = 0; c < chainCount; c++) {
      let nearest: ActiveUnit | null = null;
      let nearestDist = Infinity;

      for (const au of this.unitManager.getActiveUnits()) {
        if (au.unit.owner === attack.owner) continue;
        if (au.unit.isDead) continue;
        if (attack.hitUnitIds.has(au.unit.id)) continue;

        const dx = au.unit.worldX - lastHit.worldX;
        const dy = au.unit.worldY - lastHit.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist && dist <= chainRange) {
          nearestDist = dist;
          nearest = au;
        }
      }

      if (!nearest) break;

      nearest.unit.hp -= attack.power;
      attack.hitUnitIds.add(nearest.unit.id);
      lastHit = nearest.unit;
    }

    return true; // always consumed on primary hit
  }

  // ── Purple — Void Pulse ────────────────────────────────────────

  private resolveVoidPulse(attack: Attack): boolean {
    if (!this.unitManager) return false;

    for (const au of this.unitManager.getActiveUnits()) {
      if (au.unit.owner === attack.owner) continue;
      if (au.unit.isDead) continue;
      if (au.unit.column !== attack.column) continue;
      if (attack.hitUnitIds.has(au.unit.id)) continue;

      const dist = Math.abs(au.unit.worldY - attack.worldY);
      if (dist >= COLLISION_THRESHOLD) continue;

      attack.hitUnitIds.add(au.unit.id);
      au.unit.hp -= attack.power;

      // Push toward nearest board edge
      const direction = au.unit.column >= 4 ? 1 : -1;
      au.unit.displace(direction);

      attack.pierceRemaining--;
      if (attack.pierceRemaining <= 0) {
        return true; // exhausted
      }
    }
    return false;
  }

  // ── White — Holy Beam (instant) ────────────────────────────────

  private resolveInstantBeam(attack: Attack): void {
    // Damage all enemy units in the column
    if (this.unitManager) {
      for (const au of this.unitManager.getActiveUnits()) {
        if (au.unit.owner === attack.owner) continue;
        if (au.unit.isDead) continue;
        if (au.unit.column !== attack.column) continue;

        // Check if unit is between origin and target
        if (attack.owner === 'player') {
          if (au.unit.worldY <= attack.worldY && au.unit.worldY >= attack.targetY) {
            au.unit.hp -= attack.power;
          }
        } else {
          if (au.unit.worldY >= attack.worldY && au.unit.worldY <= attack.targetY) {
            au.unit.hp -= attack.power;
          }
        }
      }
    }

    // Resolve wall and board
    this.resolveWallAndBoardImmediate(attack);
  }

  // ── Wall / Board resolution ────────────────────────────────────

  /** Returns true if the attack was consumed by wall or board arrival. */
  private resolveWallAndBoard(attack: Attack, arrived: boolean): boolean {
    const wall = attack.owner === 'player' ? this.enemyWall : this.playerWall;
    const wallY = attack.owner === 'player'
      ? BATTLEFIELD_Y + WALL_HEIGHT
      : PLAYER_BOARD_Y - WALL_HEIGHT;
    const passedWall = attack.owner === 'player'
      ? attack.worldY <= wallY
      : attack.worldY >= wallY;

    if (passedWall && !wall.isDestroyed(attack.column)) {
      const remainingHp = wall.damage(attack.column, attack.power);
      EventBus.emit(GameEvents.WALL_HIT, {
        wallOwner: wall.owner,
        column: attack.column,
        damage: attack.power,
        remainingHp,
      });

      // Fireball splashes on wall impact too
      if (attack.attackType === AttackType.Fireball) {
        const splashRadius = FIREBALL_SPLASH_RADIUS[attack.level - 1] * CELL_SIZE;
        this.applySplashDamage(attack, splashRadius);
      }

      return true;
    }

    if (arrived) {
      this.lockGemOnBoard(attack);

      // Fireball splashes on board arrival too
      if (attack.attackType === AttackType.Fireball) {
        const splashRadius = FIREBALL_SPLASH_RADIUS[attack.level - 1] * CELL_SIZE;
        this.applySplashDamage(attack, splashRadius);
      }

      return true;
    }

    return false;
  }

  /** For instant attacks: resolve wall/board without position checks. */
  private resolveWallAndBoardImmediate(attack: Attack): void {
    const wall = attack.owner === 'player' ? this.enemyWall : this.playerWall;

    if (!wall.isDestroyed(attack.column)) {
      const remainingHp = wall.damage(attack.column, attack.power);
      EventBus.emit(GameEvents.WALL_HIT, {
        wallOwner: wall.owner,
        column: attack.column,
        damage: attack.power,
        remainingHp,
      });
    } else {
      this.lockGemOnBoard(attack);
    }
  }

  private lockGemOnBoard(attack: Attack): void {
    const targetBoard = attack.owner === 'player' ? this.enemyBoard : this.playerBoard;
    const lockFrom = attack.owner === 'player' ? 'bottom' : 'top';
    const gem = targetBoard.findFirstUnlockedGem(attack.column, lockFrom);

    if (gem) {
      targetBoard.lockGem(gem.row, gem.col);
      console.log(
        `[${attack.owner}] Locked gem at row=${gem.row} col=${attack.column} ` +
        `on ${targetBoard.owner} board`
      );
      EventBus.emit(GameEvents.GEM_LOCKED, {
        boardOwner: targetBoard.owner,
        gemId: gem.id,
        row: gem.row,
        col: attack.column,
      });
    } else if (targetBoard.isColumnFullyLocked(attack.column)) {
      console.log(
        `[${attack.owner}] WINS! Column ${attack.column} fully locked ` +
        `on ${targetBoard.owner} board`
      );
      EventBus.emit(GameEvents.GAME_OVER, {
        winner: attack.owner,
        column: attack.column,
      });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────

  private findFirstUnitInColumn(attack: Attack): ActiveUnit | null {
    if (!this.unitManager) return null;

    let closest: ActiveUnit | null = null;
    let closestDist = Infinity;

    for (const au of this.unitManager.getActiveUnits()) {
      if (au.unit.owner === attack.owner) continue;
      if (au.unit.isDead) continue;
      if (au.unit.column !== attack.column) continue;
      if (attack.hitUnitIds.has(au.unit.id)) continue;

      const dist = Math.abs(au.unit.worldY - attack.worldY);
      if (dist < COLLISION_THRESHOLD && dist < closestDist) {
        closestDist = dist;
        closest = au;
      }
    }
    return closest;
  }
}
