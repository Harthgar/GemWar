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

// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 900;

// Minimap: full height on the right side
export const MINIMAP_WIDTH = 80;
export const MINIMAP_PADDING = 8;
export const MINIMAP_X = GAME_WIDTH - MINIMAP_WIDTH;
export const MINIMAP_Y = MINIMAP_PADDING;
export const MINIMAP_HEIGHT = GAME_HEIGHT - MINIMAP_PADDING * 2;

// Camera area: left of the minimap
export const CAMERA_WIDTH = GAME_WIDTH - MINIMAP_WIDTH;                    // 740

// Wall (must be before zoom calculation)
export const WALL_SEGMENT_HP = 10;
export const WALL_HEIGHT = 32;

// Viewport split: board = bottom third, world = top two thirds
export const BOARD_VIEW_HEIGHT = Math.floor(GAME_HEIGHT / 3);              // 300
export const WORLD_VIEW_HEIGHT = GAME_HEIGHT - BOARD_VIEW_HEIGHT;          // 600

// Board camera zoom to fit board + player wall into the board view
export const BOARD_CAMERA_WORLD_HEIGHT = BOARD_PIXEL_HEIGHT + WALL_HEIGHT; // 544
export const BOARD_CAMERA_ZOOM = BOARD_VIEW_HEIGHT / BOARD_CAMERA_WORLD_HEIGHT; // ~0.551

// Board horizontal centering in world space
export const BOARD_X = (GAME_WIDTH - BOARD_PIXEL_WIDTH) / 2;

// Enemy auto-play
export const ENEMY_MOVE_INTERVAL_MIN = 1500;
export const ENEMY_MOVE_INTERVAL_MAX = 3000;

// Attack power scaling: power = 2^(matchLength - 3)
export function attackPower(matchLength: number): number {
  return Math.pow(2, matchLength - 3);
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

