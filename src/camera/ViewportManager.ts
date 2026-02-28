import Phaser from 'phaser';
import {
  GAME_HEIGHT, CAMERA_WIDTH,
  BOARD_VIEW_HEIGHT, WORLD_VIEW_HEIGHT,
  BOARD_CAMERA_ZOOM,
  BOARD_PIXEL_WIDTH, BOARD_PIXEL_HEIGHT,
  BOARD_X, PLAYER_BOARD_Y,
  MINIMAP_X, MINIMAP_WIDTH,
  WALL_HEIGHT,
} from '../game/constants';

/**
 * Manages the triple-camera viewport system:
 *
 * - World camera: top two-thirds of screen, scrollable through battlefield
 * - Board camera: bottom third, fixed on player board
 * - UI camera: right strip, fixed, renders the minimap
 *
 * Both game cameras use the same zoom so everything looks like one
 * continuous view at a single scale. The board camera just keeps the
 * player's board anchored at the bottom when scrolled.
 */
export class ViewportManager {
  private worldCamera: Phaser.Cameras.Scene2D.Camera;
  private boardCamera: Phaser.Cameras.Scene2D.Camera;
  private uiCamera: Phaser.Cameras.Scene2D.Camera;
  private separator: Phaser.GameObjects.Rectangle;

  private readonly defaultScrollY: number;
  private readonly minScrollY: number;
  private readonly cameraScrollX: number;
  private scrollSpeed = 70;

  constructor(scene: Phaser.Scene) {
    const zoom = BOARD_CAMERA_ZOOM;
    const boardCenterX = BOARD_X + BOARD_PIXEL_WIDTH / 2;
    // Board camera shows player wall + board: center on the midpoint of that region
    const boardCenterY = PLAYER_BOARD_Y - WALL_HEIGHT + (BOARD_PIXEL_HEIGHT + WALL_HEIGHT) / 2;

    // Phaser's scrollY is NOT a pure world coordinate. It relates to the view by:
    //   midPoint = scrollY + (viewportHeight / 2)     [screen pixels]
    //   viewTop  = midPoint - (displayHeight / 2)     [world pixels]
    //   viewBot  = midPoint + (displayHeight / 2)
    // where displayHeight = viewportHeight / zoom (world pixels visible).
    // So: viewTop = scrollY + halfViewH - halfDisplayH
    //     viewBot = scrollY + halfViewH + halfDisplayH
    const halfViewH = WORLD_VIEW_HEIGHT / 2;              // 300 (screen px)
    const halfDisplayH = (WORLD_VIEW_HEIGHT / zoom) / 2;  // ~544 (world px)

    // Board camera top edge = PLAYER_BOARD_Y - WALL_HEIGHT (wall top)
    // Default: world camera bottom = wall top →  scrollY = (PLAYER_BOARD_Y - WALL_HEIGHT) - halfViewH - halfDisplayH
    // Minimum: viewTop = 0 (enemy board)      →  scrollY = halfDisplayH - halfViewH
    this.defaultScrollY = (PLAYER_BOARD_Y - WALL_HEIGHT) - halfViewH - halfDisplayH;
    this.minScrollY = halfDisplayH - halfViewH;

    // --- Board camera first (bottom third, fixed on player board) ---
    // Use centerOn for accurate centering, then read back its scrollX
    // so the world camera uses the exact same value.
    this.boardCamera = scene.cameras.add(
      0, WORLD_VIEW_HEIGHT, CAMERA_WIDTH, BOARD_VIEW_HEIGHT,
      false, 'boardCamera'
    );
    this.boardCamera.setZoom(zoom);
    this.boardCamera.centerOn(boardCenterX, boardCenterY);
    this.cameraScrollX = this.boardCamera.scrollX;

    // --- World camera (top two-thirds, left of minimap) ---
    this.worldCamera = scene.cameras.main;
    this.worldCamera.setViewport(0, 0, CAMERA_WIDTH, WORLD_VIEW_HEIGHT);
    this.worldCamera.setZoom(zoom);
    this.worldCamera.setScroll(this.cameraScrollX, this.defaultScrollY);

    // Enforce vertical scroll bounds at the engine level.
    // World camera range ends at the wall top (board camera handles wall + board).
    this.worldCamera.setBounds(
      -99999, 0,
      199998, PLAYER_BOARD_Y - WALL_HEIGHT
    );

    // --- UI camera (right strip for minimap, no zoom, no scroll) ---
    this.uiCamera = scene.cameras.add(
      MINIMAP_X, 0, MINIMAP_WIDTH, GAME_HEIGHT,
      false, 'uiCamera'
    );
    this.uiCamera.setScroll(MINIMAP_X, 0);

    // --- Separator line (visible when scrolled away from default) ---
    this.separator = scene.add.rectangle(
      boardCenterX, PLAYER_BOARD_Y - WALL_HEIGHT,
      BOARD_PIXEL_WIDTH + 200, 4, 0x666688
    );
    this.separator.setDepth(1000);
    this.separator.setAlpha(0);

    // Mouse wheel scrolling
    scene.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
      this.scroll(deltaY);
    });
  }

  /** Make the world and board cameras ignore the given game objects (used for minimap) */
  ignoreFromGameCameras(objects: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]): void {
    this.worldCamera.ignore(objects);
    this.boardCamera.ignore(objects);
  }

  scroll(deltaY: number): void {
    const newScrollY = Phaser.Math.Clamp(
      this.worldCamera.scrollY + deltaY * (this.scrollSpeed / 100),
      this.minScrollY,
      this.defaultScrollY
    );
    this.worldCamera.setScroll(this.cameraScrollX, newScrollY);

    const distFromDefault = Math.abs(newScrollY - this.defaultScrollY);
    this.separator.setAlpha(distFromDefault > 5 ? 0.8 : 0);
  }

  snapToDefault(): void {
    this.worldCamera.setScroll(this.cameraScrollX, this.defaultScrollY);
    this.separator.setAlpha(0);
  }

  scrollToWorldY(worldY: number): void {
    // To center the view on worldY: midPoint = worldY → scrollY = worldY - halfViewH
    const targetScrollY = Phaser.Math.Clamp(
      worldY - WORLD_VIEW_HEIGHT / 2,
      this.minScrollY,
      this.defaultScrollY
    );
    this.worldCamera.setScroll(this.cameraScrollX, targetScrollY);

    const distFromDefault = Math.abs(targetScrollY - this.defaultScrollY);
    this.separator.setAlpha(distFromDefault > 5 ? 0.8 : 0);
  }

  /** Convert a screen pointer position to world coordinates */
  pointerToWorld(pointer: Phaser.Input.Pointer): { x: number; y: number; inBoard: boolean } {
    if (pointer.y >= WORLD_VIEW_HEIGHT) {
      // Pointer is in the board camera area
      const worldPoint = this.boardCamera.getWorldPoint(pointer.x, pointer.y);
      return { x: worldPoint.x, y: worldPoint.y, inBoard: true };
    } else {
      // Pointer is in the world camera area
      const worldPoint = this.worldCamera.getWorldPoint(pointer.x, pointer.y);
      return { x: worldPoint.x, y: worldPoint.y, inBoard: false };
    }
  }

  /** The actual world Y at the top of the world camera viewport */
  get worldCameraViewTop(): number {
    return this.worldCamera.getWorldPoint(0, 0).y;
  }

  /** The actual world Y at the bottom of the world camera viewport */
  get worldCameraViewBottom(): number {
    return this.worldCamera.getWorldPoint(0, WORLD_VIEW_HEIGHT).y;
  }

  get worldCameraViewHeight(): number {
    return this.worldCameraViewBottom - this.worldCameraViewTop;
  }

  get defaultScroll(): number {
    return this.defaultScrollY;
  }

}
