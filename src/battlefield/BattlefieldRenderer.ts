import Phaser from 'phaser';
import {
  BOARD_COLS, CELL_SIZE, BOARD_X,
  BATTLEFIELD_Y, BATTLEFIELD_PIXEL_HEIGHT,
  BOARD_PIXEL_WIDTH,
} from '../game/constants';

/**
 * Renders the battlefield area between the two boards.
 * For now, draws subtle column guides and a background gradient.
 */
export class BattlefieldRenderer {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(BOARD_X, BATTLEFIELD_Y);
    this.createBackground();
    this.createColumnGuides();
  }

  private createBackground(): void {
    // Semi-transparent battlefield background
    const bg = this.scene.add.rectangle(
      BOARD_PIXEL_WIDTH / 2,
      BATTLEFIELD_PIXEL_HEIGHT / 2,
      BOARD_PIXEL_WIDTH,
      BATTLEFIELD_PIXEL_HEIGHT,
      0x0a0a1a, 0.3
    );
    this.container.add(bg);
  }

  private createColumnGuides(): void {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0x222244, 0.15);

    // Vertical column guides extending through the battlefield
    for (let c = 0; c <= BOARD_COLS; c++) {
      const x = c * CELL_SIZE;
      graphics.lineBetween(x, 0, x, BATTLEFIELD_PIXEL_HEIGHT);
    }

    // Horizontal markers every 10 cells for distance reference
    graphics.lineStyle(1, 0x222244, 0.08);
    for (let r = 0; r <= BATTLEFIELD_PIXEL_HEIGHT; r += CELL_SIZE * 10) {
      graphics.lineBetween(0, r, BOARD_PIXEL_WIDTH, r);
    }

    this.container.add(graphics);
  }
}
