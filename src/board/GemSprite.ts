import Phaser from 'phaser';
import { Gem } from './Gem';
import { CELL_SIZE, GEM_TEXTURE_KEYS } from '../game/constants';

/** Fallback colors used when gem textures aren't loaded */
export const COLOR_MAP: Record<number, number> = {
  0: 0xff4444,  // Red
  1: 0x4488ff,  // Blue
  2: 0x44cc44,  // Green
  3: 0xffcc00,  // Yellow
  4: 0xaa44ff,  // Purple
  5: 0xeeeeee,  // White
};

export class GemSprite {
  private scene: Phaser.Scene;
  readonly gem: Gem;
  readonly gameObject: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, gem: Gem, pos: { x: number; y: number }) {
    this.scene = scene;
    this.gem = gem;

    const textureKey = GEM_TEXTURE_KEYS[gem.color];
    if (textureKey && scene.textures.exists(textureKey)) {
      const img = scene.add.image(pos.x, pos.y, textureKey);
      // Scale the 128px texture to fit within the cell (with a small margin)
      const targetSize = CELL_SIZE - 6;
      img.setDisplaySize(targetSize, targetSize);
      img.setOrigin(0.5, 0.5);
      this.gameObject = img;
    } else {
      // Fallback to colored rectangle if texture not loaded
      const rect = scene.add.rectangle(
        pos.x, pos.y,
        CELL_SIZE - 6, CELL_SIZE - 6,
        COLOR_MAP[gem.color] ?? 0xffffff
      );
      rect.setOrigin(0.5, 0.5);
      this.gameObject = rect;
    }
  }

  tweenTo(x: number, y: number, duration: number): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: this.gameObject,
        x, y,
        duration,
        ease: 'Bounce.easeOut',
        onComplete: () => resolve(),
      });
    });
  }

  setColor(color: number): void {
    const textureKey = GEM_TEXTURE_KEYS[color];
    if (textureKey && this.gameObject instanceof Phaser.GameObjects.Image) {
      this.gameObject.setTexture(textureKey);
    } else if (this.gameObject instanceof Phaser.GameObjects.Rectangle) {
      this.gameObject.setFillStyle(COLOR_MAP[color] ?? 0xffffff);
    }
  }

  setLocked(locked: boolean): void {
    if (locked) {
      this.gameObject.setAlpha(0.4);
      if (this.gameObject instanceof Phaser.GameObjects.Rectangle) {
        this.gameObject.setStrokeStyle(3, 0x888888);
      }
    } else {
      this.gameObject.setAlpha(1);
      if (this.gameObject instanceof Phaser.GameObjects.Rectangle) {
        this.gameObject.setStrokeStyle(0);
      }
    }
  }

  animateDestroy(duration: number): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: this.gameObject,
        scaleX: 0, scaleY: 0,
        alpha: 0,
        duration,
        onComplete: () => {
          this.gameObject.destroy();
          resolve();
        },
      });
    });
  }
}
