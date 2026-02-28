import Phaser from 'phaser';
import { Unit } from './Unit';
import { UnitSprite } from './UnitSprite';
import { Board } from '../board/Board';
import { Wall } from '../wall/Wall';
import { EventBus, GameEvents } from '../util/EventBus';
import {
  BATTLEFIELD_Y, PLAYER_BOARD_Y, WALL_HEIGHT,
  UnitType, CELL_SIZE, UNIT_ATTACK_INTERVAL,
} from '../game/constants';

export interface ActiveUnit {
  unit: Unit;
  sprite: UnitSprite;
}

export class UnitManager {
  private scene: Phaser.Scene;
  private active: ActiveUnit[] = [];
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
    // 1. Resolve unit-vs-unit combat (periodic, respects cooldowns)
    this.resolveUnitCombat();

    // 2. Update each unit based on state
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

    sprite.update(unit.worldY, unit.hp);
  }

  private updateAttackingWall(unit: Unit, sprite: UnitSprite): void {
    const wall = unit.owner === 'player' ? this.enemyWall : this.playerWall;

    // Wall destroyed? Resume marching
    if (wall.isDestroyed(unit.column)) {
      unit.state = 'marching';
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

    sprite.update(unit.worldY, unit.hp);
  }

  private updateAttackingBoard(unit: Unit, sprite: UnitSprite): void {
    const targetBoard = unit.owner === 'player' ? this.enemyBoard : this.playerBoard;

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

    sprite.update(unit.worldY, unit.hp);
  }

  private resolveUnitCombat(): void {
    const COLLISION_THRESHOLD = CELL_SIZE * 0.5;

    const playerUnits = this.active.filter(a => a.unit.owner === 'player' && !a.unit.isDead);
    const enemyUnits = this.active.filter(a => a.unit.owner === 'enemy' && !a.unit.isDead);

    for (const pu of playerUnits) {
      for (const eu of enemyUnits) {
        if (pu.unit.isDead || eu.unit.isDead) continue;
        if (pu.unit.column !== eu.unit.column) continue;

        const dist = Math.abs(pu.unit.worldY - eu.unit.worldY);
        if (dist < COLLISION_THRESHOLD) {
          // Both units stop marching while in combat
          // Attack each other on cooldown
          if (pu.unit.attackCooldown <= 0) {
            eu.unit.hp -= pu.unit.strength;
            pu.unit.attackCooldown = UNIT_ATTACK_INTERVAL;
          }
          if (eu.unit.attackCooldown <= 0) {
            pu.unit.hp -= eu.unit.strength;
            eu.unit.attackCooldown = UNIT_ATTACK_INTERVAL;
          }
        }
      }
    }
  }
}
