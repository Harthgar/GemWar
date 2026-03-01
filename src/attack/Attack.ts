import {
  BOARD_X, CELL_SIZE,
  PLAYER_BOARD_Y, ENEMY_BOARD_Y, BOARD_PIXEL_HEIGHT,
  ATTACK_SPEED, AttackType, GemColor, GEM_ATTACK_TYPE,
  ATTACK_SPEED_MULTIPLIER, attackLevel,
  FROSTBOLT_PIERCE, POISON_PASSTHROUGH,
  VOID_PULSE_PIERCE, VOID_PULSE_DAMAGE_MULT,
  HOLY_BEAM_POWER_MULT,
} from '../game/constants';

let nextId = 0;

export class Attack {
  readonly id: number;
  readonly owner: 'player' | 'enemy';
  readonly column: number;
  readonly color: number;
  readonly attackType: AttackType;
  readonly level: number;
  readonly basePower: number;
  readonly worldX: number;
  readonly targetY: number;
  readonly speed: number;
  readonly isInstant: boolean;
  worldY: number;

  // Mutable state for piercing/pass-through
  power: number;
  pierceRemaining: number;
  readonly hitUnitIds: Set<number> = new Set();

  constructor(
    owner: 'player' | 'enemy',
    column: number,
    power: number,
    color: number,
    matchLength: number,
  ) {
    this.id = nextId++;
    this.owner = owner;
    this.column = column;
    this.color = color;
    this.attackType = GEM_ATTACK_TYPE[color as GemColor];
    this.level = attackLevel(matchLength);
    this.worldX = BOARD_X + column * CELL_SIZE + CELL_SIZE / 2;

    const li = this.level - 1; // 0-based level index

    // Type-specific power modifications
    if (this.attackType === AttackType.VoidPulse) {
      this.basePower = Math.floor(power * VOID_PULSE_DAMAGE_MULT);
    } else if (this.attackType === AttackType.HolyBeam) {
      this.basePower = Math.floor(power * HOLY_BEAM_POWER_MULT[li]);
    } else {
      this.basePower = power;
    }
    this.power = this.basePower;

    // Initialize pierce counts
    switch (this.attackType) {
      case AttackType.FrostBolt:
        this.pierceRemaining = FROSTBOLT_PIERCE[li];
        break;
      case AttackType.PoisonShot:
        this.pierceRemaining = POISON_PASSTHROUGH[li];
        break;
      case AttackType.VoidPulse:
        this.pierceRemaining = VOID_PULSE_PIERCE[li];
        break;
      default:
        this.pierceRemaining = 0;
        break;
    }

    // Speed
    const speedMult = ATTACK_SPEED_MULTIPLIER[this.attackType];
    this.isInstant = speedMult === 0;

    if (owner === 'player') {
      this.worldY = PLAYER_BOARD_Y;
      this.targetY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
      this.speed = -(ATTACK_SPEED * speedMult);
    } else {
      this.worldY = ENEMY_BOARD_Y + BOARD_PIXEL_HEIGHT;
      this.targetY = PLAYER_BOARD_Y;
      this.speed = ATTACK_SPEED * speedMult;
    }
  }

  /** Advance position. Returns true if the attack has arrived at its target. */
  update(delta: number): boolean {
    if (this.isInstant) return true;

    this.worldY += this.speed * delta;

    if (this.owner === 'player') {
      return this.worldY <= this.targetY;
    } else {
      return this.worldY >= this.targetY;
    }
  }
}
