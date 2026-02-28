import Phaser from 'phaser';
import {
  GEM_TEXTURE_KEYS, UNIT_TEXTURE_KEYS, UNIT_FRAME_WIDTH, UNIT_FRAME_HEIGHT,
  UNIT_ANIM_FRAMES_PER_DIR, UNIT_ANIM_ROW_UP, UNIT_ANIM_ROW_DOWN, UnitType,
} from '../game/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Gem images
    for (const key of Object.values(GEM_TEXTURE_KEYS)) {
      this.load.image(key, `assets/gems/${key}.png`);
    }

    // Unit spritesheets (48x80, 3 cols x 4 rows = 16x20 per frame)
    for (const key of Object.values(UNIT_TEXTURE_KEYS)) {
      this.load.spritesheet(key, `assets/units/${key}.png`, {
        frameWidth: UNIT_FRAME_WIDTH,
        frameHeight: UNIT_FRAME_HEIGHT,
      });
    }
  }

  create(): void {
    // Create walk animations for each unit type
    for (const unitType of Object.values(UnitType)) {
      const key = UNIT_TEXTURE_KEYS[unitType];
      if (!key) continue;

      // "walk up" animation (player units marching toward enemy)
      this.anims.create({
        key: `${key}_walk_up`,
        frames: this.anims.generateFrameNumbers(key, {
          start: UNIT_ANIM_ROW_UP * UNIT_ANIM_FRAMES_PER_DIR,
          end: UNIT_ANIM_ROW_UP * UNIT_ANIM_FRAMES_PER_DIR + UNIT_ANIM_FRAMES_PER_DIR - 1,
        }),
        frameRate: 4,
        repeat: -1,
      });

      // "walk down" animation (enemy units marching toward player)
      this.anims.create({
        key: `${key}_walk_down`,
        frames: this.anims.generateFrameNumbers(key, {
          start: UNIT_ANIM_ROW_DOWN * UNIT_ANIM_FRAMES_PER_DIR,
          end: UNIT_ANIM_ROW_DOWN * UNIT_ANIM_FRAMES_PER_DIR + UNIT_ANIM_FRAMES_PER_DIR - 1,
        }),
        frameRate: 4,
        repeat: -1,
      });
    }

    this.scene.start('GameScene');
  }
}
