import Phaser from 'phaser';
import { Attack } from './Attack';
import { COLOR_MAP } from '../board/GemSprite';
import { CELL_SIZE } from '../game/constants';

const PROJECTILE_WIDTH = CELL_SIZE * 0.4;
const PROJECTILE_HEIGHT = CELL_SIZE * 0.6;

export class AttackSprite {
  private scene: Phaser.Scene;
  readonly gameObject: Phaser.GameObjects.Rectangle;
  private glow: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, attack: Attack) {
    this.scene = scene;
    const color = COLOR_MAP[attack.color] ?? 0xffffff;

    // Glow behind the projectile
    this.glow = scene.add.rectangle(
      attack.worldX, attack.worldY,
      PROJECTILE_WIDTH * 1.8, PROJECTILE_HEIGHT * 1.5,
      color, 0.25
    );

    // Main projectile body
    this.gameObject = scene.add.rectangle(
      attack.worldX, attack.worldY,
      PROJECTILE_WIDTH, PROJECTILE_HEIGHT,
      color
    );
    this.gameObject.setStrokeStyle(2, 0xffffff, 0.6);
  }

  update(worldY: number): void {
    this.gameObject.setPosition(this.gameObject.x, worldY);
    this.glow.setPosition(this.glow.x, worldY);
  }

  destroy(): void {
    // Brief flash then remove
    this.scene.tweens.add({
      targets: [this.gameObject, this.glow],
      scaleX: 2, scaleY: 0,
      alpha: 0,
      duration: 120,
      onComplete: () => {
        this.gameObject.destroy();
        this.glow.destroy();
      },
    });
  }
}
