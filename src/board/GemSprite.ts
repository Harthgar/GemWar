import Phaser from 'phaser';
import { Gem } from './Gem';
import { CELL_SIZE } from '../game/constants';

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
  readonly gameObject: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, gem: Gem, pos: { x: number; y: number }) {
    this.scene = scene;
    this.gem = gem;

    this.gameObject = scene.add.rectangle(
      pos.x, pos.y,
      CELL_SIZE - 6, CELL_SIZE - 6,
      COLOR_MAP[gem.color] ?? 0xffffff
    );
    this.gameObject.setOrigin(0.5, 0.5);
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
    this.gameObject.setFillStyle(COLOR_MAP[color] ?? 0xffffff);
  }

  setLocked(locked: boolean): void {
    if (locked) {
      this.gameObject.setAlpha(0.4);
      this.gameObject.setStrokeStyle(3, 0x888888);
    } else {
      this.gameObject.setAlpha(1);
      this.gameObject.setStrokeStyle(0);
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
