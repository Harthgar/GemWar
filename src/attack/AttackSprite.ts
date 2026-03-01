import Phaser from 'phaser';
import { Attack } from './Attack';
import { COLOR_MAP } from '../board/GemSprite';
import {
  CELL_SIZE, AttackType,
  PLAYER_BOARD_Y, ENEMY_BOARD_Y, BOARD_PIXEL_HEIGHT,
} from '../game/constants';

const PROJECTILE_WIDTH = CELL_SIZE * 0.4;
const PROJECTILE_HEIGHT = CELL_SIZE * 0.6;

export class AttackSprite {
  private scene: Phaser.Scene;
  private gameObjects: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, attack: Attack) {
    this.scene = scene;
    const color = COLOR_MAP[attack.color] ?? 0xffffff;

    switch (attack.attackType) {
      case AttackType.Fireball:
        this.createFireball(scene, attack, color);
        break;
      case AttackType.FrostBolt:
        this.createFrostBolt(scene, attack, color);
        break;
      case AttackType.PoisonShot:
        this.createPoisonShot(scene, attack, color);
        break;
      case AttackType.Lightning:
        this.createLightning(scene, attack, color);
        break;
      case AttackType.VoidPulse:
        this.createVoidPulse(scene, attack, color);
        break;
      case AttackType.HolyBeam:
        this.createBeamFlash(scene, attack, color);
        break;
    }
  }

  private createFireball(scene: Phaser.Scene, attack: Attack, color: number): void {
    const size = CELL_SIZE * (0.3 + attack.level * 0.08);
    const glow = scene.add.circle(attack.worldX, attack.worldY, size * 2, color, 0.2);
    const body = scene.add.circle(attack.worldX, attack.worldY, size, color, 0.9);
    body.setStrokeStyle(2, 0xffffff, 0.5);
    this.gameObjects.push(glow, body);
  }

  private createFrostBolt(scene: Phaser.Scene, attack: Attack, color: number): void {
    const w = PROJECTILE_WIDTH * 0.7;
    const h = PROJECTILE_HEIGHT * 1.2;
    const glow = scene.add.rectangle(attack.worldX, attack.worldY, w * 2, h * 1.5, color, 0.2);
    const body = scene.add.rectangle(attack.worldX, attack.worldY, w, h, color);
    body.setStrokeStyle(1, 0xffffff, 0.8);
    this.gameObjects.push(glow, body);
  }

  private createPoisonShot(scene: Phaser.Scene, attack: Attack, color: number): void {
    const r = CELL_SIZE * 0.25;
    const glow = scene.add.circle(attack.worldX, attack.worldY, r * 2.5, color, 0.15);
    const body = scene.add.circle(attack.worldX, attack.worldY, r, color, 0.85);
    body.setStrokeStyle(1, 0x224422, 0.6);
    this.gameObjects.push(glow, body);
  }

  private createLightning(scene: Phaser.Scene, attack: Attack, color: number): void {
    const w = PROJECTILE_WIDTH * 0.5;
    const h = PROJECTILE_HEIGHT * 1.5;
    const glow = scene.add.rectangle(attack.worldX, attack.worldY, w * 3, h * 2, color, 0.3);
    const body = scene.add.rectangle(attack.worldX, attack.worldY, w, h, 0xffffff);
    body.setStrokeStyle(2, color, 1.0);
    this.gameObjects.push(glow, body);
  }

  private createVoidPulse(scene: Phaser.Scene, attack: Attack, color: number): void {
    const w = CELL_SIZE * 0.8;
    const h = CELL_SIZE * 0.3;
    const glow = scene.add.ellipse(attack.worldX, attack.worldY, w * 1.8, h * 2, color, 0.2);
    const body = scene.add.ellipse(attack.worldX, attack.worldY, w, h, color, 0.7);
    body.setStrokeStyle(1, 0xffffff, 0.4);
    this.gameObjects.push(glow, body);
  }

  private createBeamFlash(scene: Phaser.Scene, attack: Attack, color: number): void {
    const beamWidth = CELL_SIZE * 0.6;
    // Span from origin to target
    const startY = attack.owner === 'player' ? PLAYER_BOARD_Y : ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
    const endY = attack.owner === 'player' ? ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT : PLAYER_BOARD_Y;
    const beamHeight = Math.abs(endY - startY);
    const beamCenterY = (startY + endY) / 2;

    const beam = scene.add.rectangle(
      attack.worldX, beamCenterY, beamWidth, beamHeight, color, 0.8
    );
    beam.setStrokeStyle(3, 0xffffff, 0.9);
    this.gameObjects.push(beam);
  }

  update(worldY: number): void {
    for (const go of this.gameObjects) {
      const shape = go as Phaser.GameObjects.Shape;
      shape.setPosition(shape.x, worldY);
    }
  }

  destroy(): void {
    this.scene.tweens.add({
      targets: this.gameObjects,
      scaleX: 2, scaleY: 0,
      alpha: 0,
      duration: 120,
      onComplete: () => {
        for (const go of this.gameObjects) go.destroy();
      },
    });
  }

  /** For instant attacks: flash brightly then fade out. */
  flashAndDestroy(): void {
    this.scene.tweens.add({
      targets: this.gameObjects,
      alpha: 0,
      scaleX: 0.3,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        for (const go of this.gameObjects) go.destroy();
      },
    });
  }
}
