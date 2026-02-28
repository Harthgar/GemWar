import Phaser from 'phaser';
import { ViewportManager } from './ViewportManager';
import {
  MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT,
  WORLD_HEIGHT, PLAYER_BOARD_Y, BOARD_PIXEL_HEIGHT,
  ENEMY_BOARD_Y,
} from '../game/constants';

/**
 * Full-height minimap/scrollbar on the right side of the screen.
 * Objects are placed at world coordinates visible to the UI camera.
 * The world and board cameras must ignore this container.
 *
 * The minimap maps the full world height to its height. Board markers
 * show both boards at correct proportions. The viewport rectangle shows
 * where the world camera (the scrollable part of the split view) is looking.
 */
export class Minimap {
  private scene: Phaser.Scene;
  private viewport: ViewportManager;
  readonly container: Phaser.GameObjects.Container;
  private viewIndicator: Phaser.GameObjects.Rectangle;
  private dragging = false;

  // Full world scale: minimap pixels per world pixel
  private readonly scale = MINIMAP_HEIGHT / WORLD_HEIGHT;

  // Minimap center X in world coordinates
  private readonly centerX = MINIMAP_X + MINIMAP_WIDTH / 2;

  constructor(scene: Phaser.Scene, viewport: ViewportManager) {
    this.scene = scene;
    this.viewport = viewport;

    this.container = scene.add.container(0, 0);
    this.container.setDepth(2000);

    this.createBackground();
    this.createBoardMarkers();
    this.viewIndicator = this.createViewIndicator();
    this.setupInput();
  }

  private createBackground(): void {
    const bg = this.scene.add.rectangle(
      this.centerX,
      MINIMAP_Y + MINIMAP_HEIGHT / 2,
      MINIMAP_WIDTH, MINIMAP_HEIGHT,
      0x0d0d1a, 0.85
    );
    bg.setStrokeStyle(1, 0x333355);
    this.container.add(bg);
  }

  private createBoardMarkers(): void {
    // Enemy board marker (top of minimap)
    const enemyTop = ENEMY_BOARD_Y * this.scale;
    const enemyH = Math.max(BOARD_PIXEL_HEIGHT * this.scale, 4);
    const enemyMarker = this.scene.add.rectangle(
      this.centerX,
      MINIMAP_Y + enemyTop + enemyH / 2,
      MINIMAP_WIDTH - 10, enemyH,
      0xff4444, 0.4
    );
    enemyMarker.setStrokeStyle(1, 0xff4444, 0.6);
    this.container.add(enemyMarker);

    // Player board marker (bottom of minimap)
    const playerTop = PLAYER_BOARD_Y * this.scale;
    const playerH = Math.max(BOARD_PIXEL_HEIGHT * this.scale, 4);
    const playerMarker = this.scene.add.rectangle(
      this.centerX,
      MINIMAP_Y + playerTop + playerH / 2,
      MINIMAP_WIDTH - 10, playerH,
      0x4488ff, 0.4
    );
    playerMarker.setStrokeStyle(1, 0x4488ff, 0.6);
    this.container.add(playerMarker);
  }

  private createViewIndicator(): Phaser.GameObjects.Rectangle {
    const indicator = this.scene.add.rectangle(
      this.centerX, 0,
      MINIMAP_WIDTH - 6, 10,
      0xffffff, 0.3
    );
    indicator.setStrokeStyle(2, 0xffffff, 0.8);
    this.container.add(indicator);
    return indicator;
  }

  private setupInput(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInMinimapBounds(pointer.x, pointer.y)) {
        this.dragging = true;
        this.scrollToPointer(pointer.y);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.dragging) {
        this.scrollToPointer(pointer.y);
      }
    });

    this.scene.input.on('pointerup', () => {
      this.dragging = false;
    });
  }

  private isInMinimapBounds(x: number, y: number): boolean {
    return x >= MINIMAP_X && x <= MINIMAP_X + MINIMAP_WIDTH &&
           y >= MINIMAP_Y && y <= MINIMAP_Y + MINIMAP_HEIGHT;
  }

  private scrollToPointer(screenY: number): void {
    const fraction = Phaser.Math.Clamp(
      (screenY - MINIMAP_Y) / MINIMAP_HEIGHT,
      0, 1
    );
    const worldY = fraction * WORLD_HEIGHT;
    this.viewport.scrollToWorldY(worldY);
  }

  update(): void {
    // Use the actual world coordinates at the top/bottom of the viewport,
    // not camera.scrollY which may be offset by camera origin
    const viewTop = this.viewport.worldCameraViewTop;
    const viewH = this.viewport.worldCameraViewHeight;

    const indicatorY = MINIMAP_Y + viewTop * this.scale;
    const indicatorH = Math.max(viewH * this.scale, 6);

    this.viewIndicator.setPosition(
      this.centerX,
      indicatorY + indicatorH / 2
    );
    this.viewIndicator.setSize(MINIMAP_WIDTH - 6, indicatorH);
  }
}
