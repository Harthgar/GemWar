import Phaser from 'phaser';
import { Wall } from './Wall';
import { BOARD_X, BOARD_COLS, CELL_SIZE, WALL_HEIGHT } from '../game/constants';

const WALL_COLOR = 0x667788;
const WALL_DESTROYED_ALPHA = 0.15;

interface SegmentVisual {
  rect: Phaser.GameObjects.Rectangle;
  hpText: Phaser.GameObjects.Text;
}

export class WallRenderer {
  readonly container: Phaser.GameObjects.Container;
  private segments: SegmentVisual[] = [];

  constructor(scene: Phaser.Scene, private wall: Wall, wallY: number) {
    this.container = scene.add.container(BOARD_X, wallY - WALL_HEIGHT / 2);

    for (let col = 0; col < BOARD_COLS; col++) {
      const x = col * CELL_SIZE + CELL_SIZE / 2;
      const y = WALL_HEIGHT / 2;

      const rect = scene.add.rectangle(
        x, y,
        CELL_SIZE - 2, WALL_HEIGHT,
        WALL_COLOR
      );
      rect.setStrokeStyle(1, 0x8899aa);

      const hpText = scene.add.text(x, y, `${wall.segments[col]}`, {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'monospace',
      });
      hpText.setOrigin(0.5, 0.5);

      this.container.add([rect, hpText]);
      this.segments.push({ rect, hpText });
    }
  }

  updateSegment(column: number): void {
    const hp = this.wall.segments[column];
    const visual = this.segments[column];

    if (hp <= 0) {
      visual.rect.setAlpha(WALL_DESTROYED_ALPHA);
      visual.hpText.setText('');
    } else {
      visual.hpText.setText(`${hp}`);
    }
  }
}
