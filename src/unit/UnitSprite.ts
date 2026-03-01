import Phaser from 'phaser';
import { Unit } from './Unit';
import { CELL_SIZE, UNIT_TEXTURE_KEYS } from '../game/constants';
import { COLOR_MAP } from '../board/GemSprite';

const UNIT_DISPLAY_SCALE = 1.25; // 48x60 frames, 25% larger

export class UnitSprite {
  private scene: Phaser.Scene;
  readonly body: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;
  private hpText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, unit: Unit) {
    this.scene = scene;

    const textureKey = UNIT_TEXTURE_KEYS[unit.unitType];
    const hasTexture = textureKey && scene.textures.exists(textureKey);

    if (hasTexture) {
      const sprite = scene.add.sprite(unit.worldX, unit.worldY, textureKey);
      sprite.setScale(UNIT_DISPLAY_SCALE);
      sprite.setOrigin(0.5, 0.5);

      // Play walk animation based on direction
      const animKey = unit.owner === 'player'
        ? `${textureKey}_walk_up`
        : `${textureKey}_walk_down`;
      sprite.play(animKey);

      // Light tint with gem color so the unit's original colors show through
      const tintColor = COLOR_MAP[unit.color];
      if (tintColor !== undefined) {
        // Blend toward white for a subtle tint (Phaser tint multiplies, so
        // lighter values preserve more of the original sprite colors)
        const r = ((tintColor >> 16) & 0xff);
        const g = ((tintColor >> 8) & 0xff);
        const b = (tintColor & 0xff);
        // Mix 30% gem color + 70% white
        const tr = Math.min(255, Math.floor(r * 0.3 + 255 * 0.7));
        const tg = Math.min(255, Math.floor(g * 0.3 + 255 * 0.7));
        const tb = Math.min(255, Math.floor(b * 0.3 + 255 * 0.7));
        sprite.setTint((tr << 16) | (tg << 8) | tb);
      }

      this.body = sprite;
    } else {
      // Fallback to colored rectangle
      const color = COLOR_MAP[unit.color] ?? 0xffffff;
      const rect = scene.add.rectangle(
        unit.worldX, unit.worldY,
        CELL_SIZE * 0.7, CELL_SIZE * 0.7,
        color, 0.8
      );
      rect.setStrokeStyle(2, 0xffffff, 0.5);
      this.body = rect;
    }

    // HP text below the unit
    this.hpText = scene.add.text(unit.worldX + 12, unit.worldY + 38, `${unit.hp}`, {
      fontSize: '14px',
      color: '#ffff88',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.hpText.setOrigin(0.5, 0.5);
  }

  update(worldY: number, hp: number, unit?: Unit): void {
    const x = unit ? unit.worldX : this.body.x;
    this.body.setPosition(x, worldY);
    this.hpText.setPosition(x + 12, worldY + 38);
    this.hpText.setText(`${Math.ceil(hp)}`);

    // Status effect tints
    if (unit && this.body instanceof Phaser.GameObjects.Sprite) {
      if (unit.slowDuration > 0) {
        this.body.setTint(0x88aaff); // blue tint for frozen
      } else if (unit.poisonTimeRemaining > 0) {
        this.body.setTint(0x44cc44); // green tint for poisoned
      } else {
        this.body.clearTint();
      }
    }
  }

  destroy(): void {
    this.scene.tweens.add({
      targets: [this.body, this.hpText],
      scaleX: 1.5, scaleY: 0,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.body.destroy();
        this.hpText.destroy();
      },
    });
  }
}
