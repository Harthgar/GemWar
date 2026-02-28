import Phaser from 'phaser';
import { Board } from './Board';
import { GemSprite } from './GemSprite';
import { ResolveStep } from './GravityResolver';
import { GridPos } from '../util/GridPosition';
import { CELL_SIZE, SWAP_DURATION, FALL_DURATION_PER_CELL, MATCH_CLEAR_DELAY } from '../game/constants';

export class BoardRenderer {
  private scene: Phaser.Scene;
  private board: Board;
  private container: Phaser.GameObjects.Container;
  private gemSprites: Map<number, GemSprite>; // gem.id -> sprite
  private originX: number;
  private originY: number;
  private highlightRect: Phaser.GameObjects.Rectangle | null = null;

  constructor(
    scene: Phaser.Scene,
    board: Board,
    originX: number,
    originY: number,
  ) {
    this.scene = scene;
    this.board = board;
    this.originX = originX;
    this.originY = originY;
    this.container = scene.add.container(originX, originY);
    this.gemSprites = new Map();
    this.createBoardBackground();
    this.createInitialSprites();
  }

  /** Convert grid position to pixel position relative to the container */
  gridToPixel(row: number, col: number): { x: number; y: number } {
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  /** Convert world pixel position to grid position */
  worldToGrid(worldX: number, worldY: number): GridPos | null {
    const col = Math.floor((worldX - this.originX) / CELL_SIZE);
    const row = Math.floor((worldY - this.originY) / CELL_SIZE);
    if (row < 0 || row >= this.board.rows || col < 0 || col >= this.board.cols) {
      return null;
    }
    return { row, col };
  }

  private createBoardBackground(): void {
    // Draw grid background
    const bg = this.scene.add.rectangle(
      (this.board.cols * CELL_SIZE) / 2,
      (this.board.rows * CELL_SIZE) / 2,
      this.board.cols * CELL_SIZE,
      this.board.rows * CELL_SIZE,
      0x222222, 0.5
    );
    this.container.add(bg);

    // Draw subtle grid lines
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0x444444, 0.3);
    for (let r = 0; r <= this.board.rows; r++) {
      graphics.lineBetween(0, r * CELL_SIZE, this.board.cols * CELL_SIZE, r * CELL_SIZE);
    }
    for (let c = 0; c <= this.board.cols; c++) {
      graphics.lineBetween(c * CELL_SIZE, 0, c * CELL_SIZE, this.board.rows * CELL_SIZE);
    }
    this.container.add(graphics);
  }

  private createInitialSprites(): void {
    this.board.forEachGem((gem, row, col) => {
      const sprite = new GemSprite(this.scene, gem, this.gridToPixel(row, col));
      this.container.add(sprite.gameObject);
      this.gemSprites.set(gem.id, sprite);
    });
  }

  highlightGem(pos: GridPos): void {
    this.clearHighlight();
    const { x, y } = this.gridToPixel(pos.row, pos.col);
    this.highlightRect = this.scene.add.rectangle(
      x, y, CELL_SIZE - 2, CELL_SIZE - 2
    );
    this.highlightRect.setStrokeStyle(3, 0xffffff, 0.8);
    this.highlightRect.setFillStyle(0xffffff, 0.15);
    this.container.add(this.highlightRect);
  }

  clearHighlight(): void {
    if (this.highlightRect) {
      this.highlightRect.destroy();
      this.highlightRect = null;
    }
  }

  /** Animate two gems swapping positions */
  async animateSwap(posA: GridPos, posB: GridPos): Promise<void> {
    const gemA = this.board.gemAt(posA.row, posA.col);
    const gemB = this.board.gemAt(posB.row, posB.col);

    const spriteA = gemA ? this.gemSprites.get(gemA.id) : null;
    const spriteB = gemB ? this.gemSprites.get(gemB.id) : null;

    const pixA = this.gridToPixel(posA.row, posA.col);
    const pixB = this.gridToPixel(posB.row, posB.col);

    const promises: Promise<void>[] = [];
    if (spriteA) promises.push(spriteA.tweenTo(pixA.x, pixA.y, SWAP_DURATION));
    if (spriteB) promises.push(spriteB.tweenTo(pixB.x, pixB.y, SWAP_DURATION));

    await Promise.all(promises);
  }

  /** Update the locked visual for a gem by its id */
  setGemLocked(gemId: number, locked: boolean): void {
    const sprite = this.gemSprites.get(gemId);
    if (sprite) sprite.setLocked(locked);
  }

  /** Update all gem sprite colors to match the board data (used after shuffle) */
  refreshColors(): void {
    this.board.forEachGem((gem) => {
      const sprite = this.gemSprites.get(gem.id);
      if (sprite) sprite.setColor(gem.color);
    });
  }

  /** Animate one step of the cascade resolution */
  async animateResolveStep(step: ResolveStep): Promise<void> {
    // 0. Update unlocked gem visuals (before match removal animation)
    for (const gem of step.unlockedGems) {
      this.setGemLocked(gem.id, false);
    }

    // 1. Flash and remove matched gems
    const removePromises: Promise<void>[] = [];
    for (const gem of step.removedGems) {
      const sprite = this.gemSprites.get(gem.id);
      if (sprite) {
        removePromises.push(sprite.animateDestroy(MATCH_CLEAR_DELAY));
        this.gemSprites.delete(gem.id);
      }
    }
    await Promise.all(removePromises);

    // 2. Animate gravity (existing gems falling)
    const fallPromises: Promise<void>[] = [];
    for (const move of step.gravityMoves) {
      const sprite = this.gemSprites.get(move.gem.id);
      if (sprite) {
        const target = this.gridToPixel(move.toRow, move.gem.col);
        const duration = Math.abs(move.toRow - move.fromRow) * FALL_DURATION_PER_CELL;
        fallPromises.push(sprite.tweenTo(target.x, target.y, duration));
      }
    }

    // 3. Create and animate new gems entering
    const isEnemy = this.board.owner === 'enemy';
    for (const spawn of step.spawnedGems) {
      const targetPixel = this.gridToPixel(spawn.targetRow, spawn.gem.col);
      let startY: number;
      let duration: number;

      if (isEnemy) {
        // Enemy: new gems enter from below the board (battlefield-facing side)
        startY = this.board.rows * CELL_SIZE + (spawn.spawnOffset * CELL_SIZE) - CELL_SIZE / 2;
        duration = (spawn.spawnOffset + (this.board.rows - 1 - spawn.targetRow)) * FALL_DURATION_PER_CELL;
      } else {
        // Player: new gems fall in from above
        startY = -(spawn.spawnOffset * CELL_SIZE) + CELL_SIZE / 2;
        duration = (spawn.spawnOffset + spawn.targetRow) * FALL_DURATION_PER_CELL;
      }

      const sprite = new GemSprite(this.scene, spawn.gem, {
        x: targetPixel.x,
        y: startY,
      });
      this.container.add(sprite.gameObject);
      this.gemSprites.set(spawn.gem.id, sprite);
      fallPromises.push(sprite.tweenTo(targetPixel.x, targetPixel.y, duration));
    }

    await Promise.all(fallPromises);
  }
}
