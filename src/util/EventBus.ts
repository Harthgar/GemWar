import Phaser from 'phaser';

export const EventBus = new Phaser.Events.EventEmitter();

export const GameEvents = {
  MATCH_RESOLVED: 'match-resolved',
  ATTACK_FIRED: 'attack-fired',
  UNIT_SPAWNED: 'unit-spawned',
  WALL_HIT: 'wall-hit',
  GEM_LOCKED: 'gem-locked',
  GEM_UNLOCKED: 'gem-unlocked',
  GAME_OVER: 'game-over',
} as const;
