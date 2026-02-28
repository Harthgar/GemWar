import Phaser from 'phaser';
import { Unit } from './Unit';
import { UnitType, CELL_SIZE } from '../game/constants';
import { COLOR_MAP } from '../board/GemSprite';

const UNIT_SIZE = CELL_SIZE * 1.0; // 64px base

const UNIT_SHAPE_CONFIG: Record<UnitType, { width: number; height: number; label: string }> = {
  [UnitType.BasicMelee]:  { width: UNIT_SIZE * 0.7,  height: UNIT_SIZE * 0.7,  label: 'M' },
  [UnitType.Shield2]:     { width: UNIT_SIZE * 0.8,  height: UNIT_SIZE * 0.8,  label: 'S2' },
  [UnitType.Shield3]:     { width: UNIT_SIZE * 0.9,  height: UNIT_SIZE * 0.9,  label: 'S3' },
  [UnitType.Spearman]:    { width: UNIT_SIZE * 0.5,  height: UNIT_SIZE * 1.2,  label: 'Sp' },
  [UnitType.Spearman2]:   { width: UNIT_SIZE * 0.6,  height: UNIT_SIZE * 1.3,  label: 'Sp2' },
  [UnitType.Archer]:      { width: UNIT_SIZE * 0.6,  height: UNIT_SIZE * 1.0,  label: 'A' },
  [UnitType.Archer2]:     { width: UNIT_SIZE * 0.7,  height: UNIT_SIZE * 1.1,  label: 'A2' },
  [UnitType.Wizard]:      { width: UNIT_SIZE * 0.8,  height: UNIT_SIZE * 1.0,  label: 'W' },
  [UnitType.Wizard2]:     { width: UNIT_SIZE * 0.9,  height: UNIT_SIZE * 1.1,  label: 'W2' },
};

export class UnitSprite {
  private scene: Phaser.Scene;
  readonly body: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private strengthText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, unit: Unit) {
    this.scene = scene;
    const color = COLOR_MAP[unit.color] ?? 0xffffff;
    const config = UNIT_SHAPE_CONFIG[unit.unitType];

    this.body = scene.add.rectangle(
      unit.worldX, unit.worldY,
      config.width, config.height,
      color, 0.8
    );
    this.body.setStrokeStyle(2, 0xffffff, 0.5);

    this.label = scene.add.text(unit.worldX, unit.worldY - 12, config.label, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.label.setOrigin(0.5, 0.5);

    this.strengthText = scene.add.text(unit.worldX, unit.worldY + 12, `${unit.hp}`, {
      fontSize: '18px',
      color: '#ffff88',
      fontFamily: 'monospace',
    });
    this.strengthText.setOrigin(0.5, 0.5);
  }

  update(worldY: number, hp: number): void {
    this.body.setPosition(this.body.x, worldY);
    this.label.setPosition(this.label.x, worldY - 12);
    this.strengthText.setPosition(this.strengthText.x, worldY + 12);
    this.strengthText.setText(`${Math.ceil(hp)}`);
  }

  destroy(): void {
    this.scene.tweens.add({
      targets: [this.body, this.label, this.strengthText],
      scaleX: 1.5, scaleY: 0,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.body.destroy();
        this.label.destroy();
        this.strengthText.destroy();
      },
    });
  }
}
