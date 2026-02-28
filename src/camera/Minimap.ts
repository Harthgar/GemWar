import Phaser from 'phaser';
import { ViewportManager } from './ViewportManager';
import {
  MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT,
  WORLD_HEIGHT, PLAYER_BOARD_Y, BOARD_PIXEL_HEIGHT,
  ENEMY_BOARD_Y, BOARD_X, BOARD_PIXEL_WIDTH,
  BOARD_COLS, CELL_SIZE, WALL_HEIGHT, BATTLEFIELD_Y,
  WALL_SEGMENT_HP,
} from '../game/constants';

export interface MinimapEntity {
  owner: 'player' | 'enemy';
  worldX: number;
  worldY: number;
}

export interface MinimapWallData {
  segments: number[]; // HP per column
}

export interface MinimapLockedGem {
  owner: 'player' | 'enemy';
  row: number;
  col: number;
}

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
  private entityGfx: Phaser.GameObjects.Graphics;
  private dragging = false;

  // Full world scale: minimap pixels per world pixel
  private readonly scale = MINIMAP_HEIGHT / WORLD_HEIGHT;

  // Minimap center X in world coordinates
  private readonly centerX = MINIMAP_X + MINIMAP_WIDTH / 2;

  // Horizontal scale: map board-width columns onto minimap width
  private readonly xScale = (MINIMAP_WIDTH - 12) / BOARD_PIXEL_WIDTH;
  private readonly xOffset = MINIMAP_X + 6; // left padding

  constructor(scene: Phaser.Scene, viewport: ViewportManager) {
    this.scene = scene;
    this.viewport = viewport;

    this.container = scene.add.container(0, 0);
    this.container.setDepth(2000);

    this.createBackground();
    this.createBoardMarkers();
    this.viewIndicator = this.createViewIndicator();

    // Graphics layer for dynamic entities (units, attacks)
    this.entityGfx = scene.add.graphics();
    this.container.add(this.entityGfx);

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

  /** Convert a world position to minimap screen coordinates */
  private worldToMinimap(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: this.xOffset + (worldX - BOARD_X) * this.xScale,
      y: MINIMAP_Y + worldY * this.scale,
    };
  }

  update(
    units: MinimapEntity[],
    attacks: MinimapEntity[],
    playerWall: MinimapWallData,
    enemyWall: MinimapWallData,
    lockedGems: MinimapLockedGem[],
  ): void {
    // Update viewport indicator
    const viewTop = this.viewport.worldCameraViewTop;
    const viewH = this.viewport.worldCameraViewHeight;

    const indicatorY = MINIMAP_Y + viewTop * this.scale;
    const indicatorH = Math.max(viewH * this.scale, 6);

    this.viewIndicator.setPosition(
      this.centerX,
      indicatorY + indicatorH / 2
    );
    this.viewIndicator.setSize(MINIMAP_WIDTH - 6, indicatorH);

    // Draw entities
    this.entityGfx.clear();

    // Walls: horizontal bars per column segment
    const colW = (MINIMAP_WIDTH - 12) / BOARD_COLS;
    this.drawWall(enemyWall, BATTLEFIELD_Y, colW);
    this.drawWall(playerWall, PLAYER_BOARD_Y - WALL_HEIGHT, colW);

    // Locked gems: small colored rectangles on the board markers
    for (const lg of lockedGems) {
      const boardY = lg.owner === 'enemy' ? ENEMY_BOARD_Y : PLAYER_BOARD_Y;
      const worldX = BOARD_X + lg.col * CELL_SIZE + CELL_SIZE / 2;
      const worldY = boardY + lg.row * CELL_SIZE + CELL_SIZE / 2;
      const pos = this.worldToMinimap(worldX, worldY);
      const gemW = Math.max(colW - 1, 2);
      const gemH = Math.max(CELL_SIZE * this.scale, 2);
      this.entityGfx.fillStyle(0xffaa00, 0.7);
      this.entityGfx.fillRect(pos.x - gemW / 2, pos.y - gemH / 2, gemW, gemH);
    }

    // Units: filled circles (3px radius)
    for (const u of units) {
      const pos = this.worldToMinimap(u.worldX, u.worldY);
      const color = u.owner === 'player' ? 0x4488ff : 0xff4444;
      this.entityGfx.fillStyle(color, 0.9);
      this.entityGfx.fillCircle(pos.x, pos.y, 3);
    }

    // Attacks: smaller bright dots (2px radius)
    for (const a of attacks) {
      const pos = this.worldToMinimap(a.worldX, a.worldY);
      const color = a.owner === 'player' ? 0x88ccff : 0xffaa44;
      this.entityGfx.fillStyle(color, 1);
      this.entityGfx.fillCircle(pos.x, pos.y, 2);
    }
  }

  private drawWall(wall: MinimapWallData, worldY: number, colW: number): void {
    const wallH = Math.max(WALL_HEIGHT * this.scale, 2);
    for (let c = 0; c < BOARD_COLS; c++) {
      const hp = wall.segments[c];
      if (hp <= 0) continue;
      const frac = Math.min(hp / WALL_SEGMENT_HP, 1);
      // Green when full, yellow at half, red when low
      const r = frac < 0.5 ? 255 : Math.floor(255 * (1 - frac) * 2);
      const g = frac > 0.5 ? 255 : Math.floor(255 * frac * 2);
      const color = (r << 16) | (g << 8);
      const worldX = BOARD_X + c * CELL_SIZE + CELL_SIZE / 2;
      const pos = this.worldToMinimap(worldX, worldY + WALL_HEIGHT / 2);
      this.entityGfx.fillStyle(color, 0.8);
      this.entityGfx.fillRect(pos.x - colW / 2 + 0.5, pos.y - wallH / 2, colW - 1, wallH);
    }
  }
}
