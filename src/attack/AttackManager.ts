import Phaser from 'phaser';
import { Attack } from './Attack';
import { AttackSprite } from './AttackSprite';
import { Board } from '../board/Board';
import { Wall } from '../wall/Wall';
import { EventBus, GameEvents } from '../util/EventBus';
import { BATTLEFIELD_Y, PLAYER_BOARD_Y, WALL_HEIGHT } from '../game/constants';

interface ActiveAttack {
  attack: Attack;
  sprite: AttackSprite;
}

export class AttackManager {
  private scene: Phaser.Scene;
  private active: ActiveAttack[] = [];
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

  fireAttack(owner: 'player' | 'enemy', column: number, power: number, color: number): void {
    const attack = new Attack(owner, column, power, color);
    const sprite = new AttackSprite(this.scene, attack);

    this.active.push({ attack, sprite });

    console.log(
      `[${owner}] Attack fired: col=${column} power=${power} color=${color}`
    );

    EventBus.emit(GameEvents.ATTACK_FIRED, {
      owner,
      column,
      power,
      color,
    });
  }

  update(delta: number): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const { attack, sprite } = this.active[i];
      const arrived = attack.update(delta);

      // Check wall collision
      const wall = attack.owner === 'player' ? this.enemyWall : this.playerWall;
      const wallY = attack.owner === 'player'
        ? BATTLEFIELD_Y + WALL_HEIGHT   // bottom face of enemy wall
        : PLAYER_BOARD_Y - WALL_HEIGHT; // top face of player wall
      const passedWall = attack.owner === 'player'
        ? attack.worldY <= wallY
        : attack.worldY >= wallY;

      if (passedWall && !wall.isDestroyed(attack.column)) {
        // Wall absorbs attack
        const remainingHp = wall.damage(attack.column, attack.power);
        console.log(
          `[${attack.owner}] Attack hit wall col=${attack.column} ` +
          `power=${attack.power} wallHP=${remainingHp}`
        );
        EventBus.emit(GameEvents.WALL_HIT, {
          wallOwner: wall.owner,
          column: attack.column,
          damage: attack.power,
          remainingHp,
        });
        sprite.destroy();
        this.active.splice(i, 1);
      } else if (arrived) {
        // Attack passed through destroyed wall — lock a gem on the target board
        const targetBoard = attack.owner === 'player' ? this.enemyBoard : this.playerBoard;
        // Player attacks travel up → hit enemy board from below (lock bottom-up)
        // Enemy attacks travel down → hit player board from above (lock top-down)
        const lockFrom = attack.owner === 'player' ? 'bottom' : 'top';
        const gem = targetBoard.findFirstUnlockedGem(attack.column, lockFrom);

        if (gem) {
          targetBoard.lockGem(gem.row, gem.col);
          console.log(
            `[${attack.owner}] Locked gem at row=${gem.row} col=${attack.column} on ${targetBoard.owner} board`
          );
          EventBus.emit(GameEvents.GEM_LOCKED, {
            boardOwner: targetBoard.owner,
            gemId: gem.id,
            row: gem.row,
            col: attack.column,
          });
        } else if (targetBoard.isColumnFullyLocked(attack.column)) {
          // Column fully locked — attack passes through entirely, game over
          console.log(
            `[${attack.owner}] WINS! Column ${attack.column} fully locked on ${targetBoard.owner} board`
          );
          EventBus.emit(GameEvents.GAME_OVER, {
            winner: attack.owner,
            column: attack.column,
          });
        }

        sprite.destroy();
        this.active.splice(i, 1);
      } else {
        sprite.update(attack.worldY);
      }
    }
  }
}
