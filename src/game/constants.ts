// Board dimensions
export const BOARD_COLS = 8;
export const BOARD_ROWS = 8;
export const GEM_COLORS = 6;

// Gem types
export enum GemColor {
  Red = 0,
  Blue = 1,
  Green = 2,
  Yellow = 3,
  Purple = 4,
  White = 5,
}

// Gem texture keys (maps GemColor → Phaser texture key / filename stem)
export const GEM_TEXTURE_KEYS: Record<number, string> = {
  [GemColor.Red]: 'gem_red',
  [GemColor.Blue]: 'gem_blue',
  [GemColor.Green]: 'gem_green',
  [GemColor.Yellow]: 'gem_yellow',
  [GemColor.Purple]: 'gem_purple',
  [GemColor.White]: 'gem_white',
};

// Visual sizing
export const CELL_SIZE = 64;
export const BOARD_PIXEL_WIDTH = BOARD_COLS * CELL_SIZE;
export const BOARD_PIXEL_HEIGHT = BOARD_ROWS * CELL_SIZE;

// Animation timing (ms)
export const SWAP_DURATION = 200;
export const FALL_DURATION_PER_CELL = 80;
export const MATCH_CLEAR_DELAY = 150;

// Battlefield
export const BATTLEFIELD_HEIGHT_IN_CELLS = 80;
export const BATTLEFIELD_PIXEL_HEIGHT = BATTLEFIELD_HEIGHT_IN_CELLS * CELL_SIZE;

// World layout (y coordinates, top to bottom)
export const ENEMY_BOARD_Y = 0;
export const BATTLEFIELD_Y = BOARD_PIXEL_HEIGHT;                           // 512
export const PLAYER_BOARD_Y = BATTLEFIELD_Y + BATTLEFIELD_PIXEL_HEIGHT;    // 5632
export const WORLD_HEIGHT = PLAYER_BOARD_Y + BOARD_PIXEL_HEIGHT;           // 6144

// Game dimensions (mobile-friendly tall aspect ratio)
export const GAME_WIDTH = 700;
export const GAME_HEIGHT = 1136;

// Minimap: full height on the right side
export const MINIMAP_WIDTH = 120;
export const MINIMAP_PADDING = 8;
export const MINIMAP_X = GAME_WIDTH - MINIMAP_WIDTH;
export const MINIMAP_Y = MINIMAP_PADDING;
export const MINIMAP_HEIGHT = GAME_HEIGHT - MINIMAP_PADDING * 2;

// Camera area: left of the minimap
export const CAMERA_WIDTH = GAME_WIDTH - MINIMAP_WIDTH;                    // 580

// Board horizontal centering in camera area
export const BOARD_X = (CAMERA_WIDTH - BOARD_PIXEL_WIDTH) / 2;            // 34

// Wall (must be before zoom calculation)
export const WALL_SEGMENT_HP = 100;
export const WALL_DISPLAY_DIVISOR = 10; // display HP in increments of 10
export const WALL_HEIGHT = 32;

// Viewport split: board = bottom third, world = top two thirds
export const BOARD_VIEW_HEIGHT = Math.floor(GAME_HEIGHT / 3);              // 378
export const WORLD_VIEW_HEIGHT = GAME_HEIGHT - BOARD_VIEW_HEIGHT;          // 758

// Board camera zoom to fit board + player wall into the board view
export const BOARD_CAMERA_WORLD_HEIGHT = BOARD_PIXEL_HEIGHT + WALL_HEIGHT; // 544
export const BOARD_CAMERA_ZOOM = BOARD_VIEW_HEIGHT / BOARD_CAMERA_WORLD_HEIGHT; // ~0.695

// Enemy auto-play
export const ENEMY_MOVE_INTERVAL_MIN = 1500;
export const ENEMY_MOVE_INTERVAL_MAX = 3000;

// Attack power scaling: 10 * 2^(matchLength - 3)
export function attackPower(matchLength: number): number {
  return 10 * Math.pow(2, matchLength - 3);
}

// Attacks
export const ATTACK_TRAVEL_MS = 1500;
export const ATTACK_SPEED = BATTLEFIELD_PIXEL_HEIGHT / ATTACK_TRAVEL_MS; // world px per ms

// Shuffle
export const SHUFFLE_IDLE_MS = 10000;

// Units
export const UNIT_TRAVEL_MS = 45000;
export const UNIT_SPEED = BATTLEFIELD_PIXEL_HEIGHT / UNIT_TRAVEL_MS; // ~0.114 px/ms
export const UNIT_ROW_STAGGER = CELL_SIZE; // 64px spacing between formation rows
export const UNIT_ATTACK_INTERVAL = 1000; // ms between attacks
export const UNIT_HP_MULTIPLIER = 3; // HP = strength * this

export enum UnitType {
  BasicMelee = 'BasicMelee',
  Shield2 = 'Shield2',
  Shield3 = 'Shield3',
  Spearman = 'Spearman',
  Spearman2 = 'Spearman2',
  Archer = 'Archer',
  Archer2 = 'Archer2',
  Wizard = 'Wizard',
  Wizard2 = 'Wizard2',
}

// Unit spritesheet texture keys (maps UnitType → Phaser texture key / filename stem)
export const UNIT_TEXTURE_KEYS: Record<UnitType, string> = {
  [UnitType.BasicMelee]: 'unit_basic_melee',
  [UnitType.Shield2]: 'unit_shield2',
  [UnitType.Shield3]: 'unit_shield3',
  [UnitType.Spearman]: 'unit_spearman',
  [UnitType.Spearman2]: 'unit_spearman2',
  [UnitType.Archer]: 'unit_archer',
  [UnitType.Archer2]: 'unit_archer2',
  [UnitType.Wizard]: 'unit_wizard',
  [UnitType.Wizard2]: 'unit_wizard2',
};

// Spritesheet frame dimensions (48x80 sheet = 3 cols x 4 rows → 16x20 per frame)
export const UNIT_FRAME_WIDTH = 16;
export const UNIT_FRAME_HEIGHT = 20;

// Walk animation: RPGMaker layout has 4 directions (rows: down, left, right, up) x 3 frames
// For units marching up (player) or down (enemy), we use the appropriate row
export const UNIT_ANIM_FRAMES_PER_DIR = 3;
export const UNIT_ANIM_ROW_DOWN = 0;
export const UNIT_ANIM_ROW_LEFT = 1;
export const UNIT_ANIM_ROW_RIGHT = 2;
export const UNIT_ANIM_ROW_UP = 3;

export const UNIT_STRENGTH: Record<UnitType, number> = {
  [UnitType.BasicMelee]: 1,
  [UnitType.Shield2]: 2,
  [UnitType.Shield3]: 4,
  [UnitType.Spearman]: 4,
  [UnitType.Spearman2]: 8,
  [UnitType.Archer]: 16,
  [UnitType.Archer2]: 32,
  [UnitType.Wizard]: 64,
  [UnitType.Wizard2]: 128,
};

export function horizontalMatchUnitType(matchLength: number): UnitType {
  if (matchLength <= 3) return UnitType.BasicMelee;
  if (matchLength === 4) return UnitType.Shield2;
  return UnitType.Shield3;
}

export function horizontalMatchRowCount(matchLength: number): number {
  if (matchLength <= 5) return 1;
  if (matchLength === 6) return 2;
  if (matchLength === 7) return 4;
  return 8;
}

export function specialUnitType(verticalLength: number): UnitType {
  if (verticalLength <= 3) return UnitType.Spearman;
  if (verticalLength === 4) return UnitType.Spearman2;
  if (verticalLength === 5) return UnitType.Archer;
  if (verticalLength === 6) return UnitType.Archer2;
  if (verticalLength === 7) return UnitType.Wizard;
  return UnitType.Wizard2;
}

// Engagement ranges (world pixels)
export const UNIT_ENGAGE_RANGE: Record<UnitType, number> = {
  [UnitType.BasicMelee]: CELL_SIZE * 0.5,   // 32px
  [UnitType.Shield2]:    CELL_SIZE * 0.5,    // 32px
  [UnitType.Shield3]:    CELL_SIZE * 0.5,    // 32px
  [UnitType.Spearman]:   CELL_SIZE * 1.5,    // 96px
  [UnitType.Spearman2]:  CELL_SIZE * 2.0,    // 128px
  [UnitType.Archer]:     CELL_SIZE * 4.0,    // 256px
  [UnitType.Archer2]:    CELL_SIZE * 5.0,    // 320px
  [UnitType.Wizard]:     CELL_SIZE * 6.0,    // 384px
  [UnitType.Wizard2]:    CELL_SIZE * 7.0,    // 448px
};

// Which units fire visible projectiles (vs direct melee damage)
export const UNIT_IS_RANGED: Record<UnitType, boolean> = {
  [UnitType.BasicMelee]: false, [UnitType.Shield2]: false, [UnitType.Shield3]: false,
  [UnitType.Spearman]: false, [UnitType.Spearman2]: false,
  [UnitType.Archer]: true, [UnitType.Archer2]: true,
  [UnitType.Wizard]: true, [UnitType.Wizard2]: true,
};

// Which units have AoE splash (col-1, col, col+1)
export const UNIT_IS_AOE: Record<UnitType, boolean> = {
  [UnitType.BasicMelee]: false, [UnitType.Shield2]: false, [UnitType.Shield3]: false,
  [UnitType.Spearman]: false, [UnitType.Spearman2]: false,
  [UnitType.Archer]: false, [UnitType.Archer2]: false,
  [UnitType.Wizard]: true, [UnitType.Wizard2]: true,
};

// Cross-column targeting reach (number of columns to each side)
export const UNIT_COLUMN_REACH: Record<UnitType, number> = {
  [UnitType.BasicMelee]: 0, [UnitType.Shield2]: 0, [UnitType.Shield3]: 0,
  [UnitType.Spearman]: 1, [UnitType.Spearman2]: 1,
  [UnitType.Archer]: 2, [UnitType.Archer2]: 2,
  [UnitType.Wizard]: 3, [UnitType.Wizard2]: 3,
};

// Projectile speed for arrows/orbs (px/ms)
export const UNIT_PROJECTILE_SPEED = 1.5;

