import Phaser from 'phaser';
import { Unit } from './Unit';
import { UnitSprite } from './UnitSprite';
import { Projectile } from './Projectile';
import { ProjectileSprite } from './ProjectileSprite';
import { Board } from '../board/Board';
import { Wall } from '../wall/Wall';
import { EventBus, GameEvents } from '../util/EventBus';
import {
  BATTLEFIELD_Y, PLAYER_BOARD_Y, WALL_HEIGHT,
  UnitType, UNIT_ATTACK_INTERVAL, CELL_SIZE,
  UNIT_ENGAGE_RANGE, UNIT_IS_RANGED, UNIT_IS_AOE,
  UNIT_COLUMN_REACH,
} from '../game/constants';

export interface ActiveUnit {
  unit: Unit;
  sprite: UnitSprite;
}

interface ActiveProjectile {
  projectile: Projectile;
  sprite: ProjectileSprite;
}

export class UnitManager {
  private scene: Phaser.Scene;
  private active: ActiveUnit[] = [];
  private projectiles: ActiveProjectile[] = [];
  private playerWall: Wall;
  private enemyWall: Wall;
  private playerBoard: Board;
  private enemyBoard: Board;

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

  spawnUnit(
    owner: 'player' | 'enemy',
    column: number,
    unitType: UnitType,
    color: number,
    staggerOffset: number = 0,
  ): void {
    const unit = new Unit(owner, column, unitType, color, staggerOffset);
    const sprite = new UnitSprite(this.scene, unit);
    this.active.push({ unit, sprite });

    console.log(
      `[${owner}] Unit spawned: col=${column} type=${unitType} ` +
      `str=${unit.strength} hp=${unit.hp} stagger=${staggerOffset}`
    );

    EventBus.emit(GameEvents.UNIT_SPAWNED, {
      owner,
      column,
      unitType,
      strength: unit.strength,
      color,
    });
  }

  /** Public API for attack-vs-unit collision */
  getActiveUnits(): ActiveUnit[] {
    return this.active;
  }

  update(delta: number): void {
    // 0. Clear inCombat flags
    for (const { unit } of this.active) {
      unit.inCombat = false;
      unit.combatTargetId = null;
    }

    // 0b. Tick status effects (poison, slow)
    for (const { unit } of this.active) {
      unit.updateStatusEffects(delta);
    }

    // 1. Resolve unit-vs-unit combat (range-aware, fires projectiles or melee)
    this.resolveUnitCombat();

    // 2. Update projectiles in flight
    this.updateProjectiles(delta);

    // 3. Update each unit based on state
    for (let i = this.active.length - 1; i >= 0; i--) {
      const { unit, sprite } = this.active[i];

      // Remove dead units
      if (unit.isDead) {
        sprite.destroy();
        this.active.splice(i, 1);
        continue;
      }

      // Tick attack cooldown
      unit.attackCooldown = Math.max(0, unit.attackCooldown - delta);

      switch (unit.state) {
        case 'marching':
          this.updateMarching(unit, sprite, delta);
          break;
        case 'attacking_wall':
          this.updateAttackingWall(unit, sprite);
          break;
        case 'attacking_board':
          this.updateAttackingBoard(unit, sprite);
          break;
      }
    }
  }

  private updateMarching(unit: Unit, sprite: UnitSprite, delta: number): void {
    const wall = unit.owner === 'player' ? this.enemyWall : this.playerWall;
    const wallY = unit.owner === 'player'
      ? BATTLEFIELD_Y + WALL_HEIGHT
      : PLAYER_BOARD_Y - WALL_HEIGHT;

    // If in combat, halt movement
    if (unit.inCombat) {
      sprite.update(unit.worldY, unit.hp, unit);
      return;
    }

    // Move
    unit.worldY += unit.speed * delta;

    // Clamp to wall if we'd pass through it
    if (!wall.isDestroyed(unit.column)) {
      if (unit.owner === 'player' && unit.worldY <= wallY) {
        unit.worldY = wallY;
        unit.state = 'attacking_wall';
      } else if (unit.owner === 'enemy' && unit.worldY >= wallY) {
        unit.worldY = wallY;
        unit.state = 'attacking_wall';
      }
    }

    // Clamp to target if we'd pass through board
    if (unit.state === 'marching') {
      if (unit.owner === 'player' && unit.worldY <= unit.targetY) {
        unit.worldY = unit.targetY;
        unit.state = 'attacking_board';
      } else if (unit.owner === 'enemy' && unit.worldY >= unit.targetY) {
        unit.worldY = unit.targetY;
        unit.state = 'attacking_board';
      }
    }

    sprite.update(unit.worldY, unit.hp, unit);
  }

  private updateAttackingWall(unit: Unit, sprite: UnitSprite): void {
    const wall = unit.owner === 'player' ? this.enemyWall : this.playerWall;

    // Wall destroyed? Resume marching
    if (wall.isDestroyed(unit.column)) {
      unit.state = 'marching';
      return;
    }

    // If in combat with a unit, fight the unit instead of the wall
    if (unit.inCombat) {
      sprite.update(unit.worldY, unit.hp, unit);
      return;
    }

    // Attack wall on cooldown
    if (unit.attackCooldown <= 0) {
      const remainingHp = wall.damage(unit.column, unit.strength);
      EventBus.emit(GameEvents.WALL_HIT, {
        wallOwner: wall.owner,
        column: unit.column,
        damage: unit.strength,
        remainingHp,
      });
      unit.attackCooldown = UNIT_ATTACK_INTERVAL;
    }

    sprite.update(unit.worldY, unit.hp, unit);
  }

  private updateAttackingBoard(unit: Unit, sprite: UnitSprite): void {
    const targetBoard = unit.owner === 'player' ? this.enemyBoard : this.playerBoard;

    // If in combat with a unit, fight the unit instead of the board
    if (unit.inCombat) {
      sprite.update(unit.worldY, unit.hp, unit);
      return;
    }

    // Attack board on cooldown — lock a gem
    if (unit.attackCooldown <= 0) {
      const lockFrom = unit.owner === 'player' ? 'bottom' : 'top';
      const gem = targetBoard.findFirstUnlockedGem(unit.column, lockFrom);

      if (gem) {
        targetBoard.lockGem(gem.row, gem.col);
        console.log(
          `[${unit.owner}] Unit locked gem at row=${gem.row} col=${unit.column} ` +
          `on ${targetBoard.owner} board`
        );
        EventBus.emit(GameEvents.GEM_LOCKED, {
          boardOwner: targetBoard.owner,
          gemId: gem.id,
          row: gem.row,
          col: unit.column,
        });
      } else if (targetBoard.isColumnFullyLocked(unit.column)) {
        console.log(
          `[${unit.owner}] WINS! Column ${unit.column} fully locked ` +
          `on ${targetBoard.owner} board`
        );
        EventBus.emit(GameEvents.GAME_OVER, {
          winner: unit.owner,
          column: unit.column,
        });
      }

      unit.attackCooldown = UNIT_ATTACK_INTERVAL;
    }

    sprite.update(unit.worldY, unit.hp, unit);
  }

  /**
   * Range-aware combat resolution.
   * Each unit independently checks if nearest enemy is within its engagement range.
   * Shorter-range units keep marching; longer-range units get free hits.
   */
  private resolveUnitCombat(): void {
    const playerUnits = this.active.filter(a => a.unit.owner === 'player' && !a.unit.isDead);
    const enemyUnits = this.active.filter(a => a.unit.owner === 'enemy' && !a.unit.isDead);

    // Each side independently evaluates engagement
    this.engageUnitsAgainstOpponents(playerUnits, enemyUnits);
    this.engageUnitsAgainstOpponents(enemyUnits, playerUnits);
  }

  private engageUnitsAgainstOpponents(
    attackers: ActiveUnit[],
    defenders: ActiveUnit[],
  ): void {
    for (const attacker of attackers) {
      const u = attacker.unit;
      if (u.isDead) continue;

      const myRange = UNIT_ENGAGE_RANGE[u.unitType];
      const myColumnReach = UNIT_COLUMN_REACH[u.unitType];

      // Find nearest enemy within column reach, using Euclidean distance
      let nearestEnemy: ActiveUnit | null = null;
      let nearestDist = Infinity;

      for (const defender of defenders) {
        const e = defender.unit;
        if (e.isDead) continue;

        const colDiff = Math.abs(e.column - u.column);
        if (colDiff > myColumnReach) continue;

        // Euclidean distance using world positions
        const dx = e.worldX - u.worldX;
        const dy = e.worldY - u.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestEnemy = defender;
        }
      }

      if (nearestEnemy && nearestDist <= myRange) {
        // Target in range — stop and fight
        u.inCombat = true;
        u.combatTargetId = nearestEnemy.unit.id;

        // Attack on cooldown
        if (u.attackCooldown <= 0) {
          if (UNIT_IS_RANGED[u.unitType]) {
            // Fire a visible projectile
            this.fireProjectile(u, nearestEnemy.unit, UNIT_IS_AOE[u.unitType]);
          } else {
            // Direct melee/spear damage
            nearestEnemy.unit.hp -= u.strength;
          }
          u.attackCooldown = UNIT_ATTACK_INTERVAL;
        }
      }
    }
  }

  private fireProjectile(source: Unit, target: Unit, isAoe: boolean): void {
    const projectile = new Projectile(
      source.owner,
      source.id,
      target.id,
      source.strength,
      isAoe,
      source.column,
      source.color,
      source.worldX,
      source.worldY,
      target.worldX,
      target.worldY,
    );
    const sprite = new ProjectileSprite(this.scene, projectile);
    this.projectiles.push({ projectile, sprite });
  }

  private updateProjectiles(delta: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const { projectile, sprite } = this.projectiles[i];
      const arrived = projectile.update(delta);

      if (arrived) {
        this.resolveProjectileHit(projectile);
        sprite.destroy();
        this.projectiles.splice(i, 1);
      } else {
        sprite.update(projectile.worldX, projectile.worldY);
      }
    }
  }

  private resolveProjectileHit(projectile: Projectile): void {
    if (projectile.isAoe) {
      // Wizard AoE: damage all enemies within splash radius of impact point
      const splashRadius = CELL_SIZE * 1.5; // 1.5 cells around impact

      for (const au of this.active) {
        const e = au.unit;
        if (e.owner === projectile.owner) continue;
        if (e.isDead) continue;

        const dx = e.worldX - projectile.worldX;
        const dy = e.worldY - projectile.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= splashRadius) {
          e.hp -= projectile.damage;
        }
      }
    } else {
      // Single-target arrow: hit original target if still alive
      const target = this.active.find(a => a.unit.id === projectile.targetUnitId);
      if (target && !target.unit.isDead) {
        target.unit.hp -= projectile.damage;
      }
    }
  }
}
