import Phaser from 'phaser';
import { Projectile } from './Projectile';
import { COLOR_MAP } from '../board/GemSprite';

const ARROW_WIDTH = 6;
const ARROW_HEIGHT = 16;
const ORB_RADIUS = 10;

export class ProjectileSprite {
  private scene: Phaser.Scene;
  private body: Phaser.GameObjects.Shape;
  private glow: Phaser.GameObjects.Shape;

  constructor(scene: Phaser.Scene, projectile: Projectile) {
    this.scene = scene;
    const color = COLOR_MAP[projectile.color] ?? 0xffffff;

    if (projectile.isAoe) {
      // Wizard orb: circle with larger glow
      this.glow = scene.add.circle(
        projectile.worldX, projectile.worldY,
        ORB_RADIUS * 2, color, 0.2,
      );
      this.body = scene.add.circle(
        projectile.worldX, projectile.worldY,
        ORB_RADIUS, color, 0.9,
      );
    } else {
      // Archer arrow: thin rectangle with subtle glow
      this.glow = scene.add.rectangle(
        projectile.worldX, projectile.worldY,
        ARROW_WIDTH * 2, ARROW_HEIGHT * 1.5,
        color, 0.2,
      );
      this.body = scene.add.rectangle(
        projectile.worldX, projectile.worldY,
        ARROW_WIDTH, ARROW_HEIGHT,
        color, 0.9,
      );
    }
  }

  update(worldX: number, worldY: number): void {
    this.body.setPosition(worldX, worldY);
    this.glow.setPosition(worldX, worldY);
  }

  destroy(): void {
    this.scene.tweens.add({
      targets: [this.body, this.glow],
      scaleX: 1.5, scaleY: 0,
      alpha: 0,
      duration: 100,
      onComplete: () => {
        this.body.destroy();
        this.glow.destroy();
      },
    });
  }
}
