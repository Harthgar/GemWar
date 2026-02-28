import { Gem } from './Gem';
import { GemColor, BOARD_ROWS, BOARD_COLS, GEM_COLORS } from '../game/constants';
import { GridPos, areAdjacent } from '../util/GridPosition';

export type BoardOwner = 'player' | 'enemy';

export class Board {
  readonly owner: BoardOwner;
  readonly rows: number;
  readonly cols: number;
  private grid: (Gem | null)[][];

  constructor(owner: BoardOwner, rows = BOARD_ROWS, cols = BOARD_COLS) {
    this.owner = owner;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.fillInitial();
  }

  gemAt(row: number, col: number): Gem | null {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
    return this.grid[row][col];
  }

  setGem(row: number, col: number, gem: Gem | null): void {
    this.grid[row][col] = gem;
    if (gem) {
      gem.row = row;
      gem.col = col;
    }
  }

  private fillInitial(): void {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let color: GemColor;
        do {
          color = Math.floor(Math.random() * GEM_COLORS) as GemColor;
        } while (this.wouldMatchAt(r, c, color));
        const gem = new Gem(color, r, c);
        this.grid[r][c] = gem;
      }
    }
  }

  private wouldMatchAt(row: number, col: number, color: GemColor): boolean {
    // Check horizontal: do the 2 gems to the left match?
    if (col >= 2 &&
        this.grid[row][col - 1]?.color === color &&
        this.grid[row][col - 2]?.color === color) {
      return true;
    }
    // Check vertical: do the 2 gems above match?
    if (row >= 2 &&
        this.grid[row - 1][col]?.color === color &&
        this.grid[row - 2][col]?.color === color) {
      return true;
    }
    return false;
  }

  trySwap(posA: GridPos, posB: GridPos): boolean {
    if (!areAdjacent(posA, posB)) return false;

    const gemA = this.gemAt(posA.row, posA.col);
    const gemB = this.gemAt(posB.row, posB.col);
    if (!gemA || !gemB) return false;
    if (gemA.locked || gemB.locked) return false;

    this.setGem(posA.row, posA.col, gemB);
    this.setGem(posB.row, posB.col, gemA);
    return true;
  }

  undoSwap(posA: GridPos, posB: GridPos): void {
    const gemA = this.gemAt(posA.row, posA.col);
    const gemB = this.gemAt(posB.row, posB.col);
    this.setGem(posA.row, posA.col, gemB);
    this.setGem(posB.row, posB.col, gemA);
  }

  removeGems(positions: GridPos[]): Gem[] {
    const removed: Gem[] = [];
    for (const pos of positions) {
      const gem = this.gemAt(pos.row, pos.col);
      if (gem) {
        removed.push(gem);
        this.grid[pos.row][pos.col] = null;
      }
    }
    return removed;
  }

  applyGravity(): Array<{ gem: Gem; fromRow: number; toRow: number }> {
    const moves: Array<{ gem: Gem; fromRow: number; toRow: number }> = [];

    for (let c = 0; c < this.cols; c++) {
      let writeRow = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        const gem = this.grid[r][c];
        if (gem !== null) {
          if (r !== writeRow) {
            moves.push({ gem, fromRow: r, toRow: writeRow });
            this.grid[writeRow][c] = gem;
            this.grid[r][c] = null;
            gem.row = writeRow;
          }
          writeRow--;
        }
      }
    }
    return moves;
  }

  spawnNewGems(): Array<{ gem: Gem; targetRow: number; spawnOffset: number }> {
    const spawned: Array<{ gem: Gem; targetRow: number; spawnOffset: number }> = [];

    for (let c = 0; c < this.cols; c++) {
      let emptyCount = 0;
      for (let r = 0; r < this.rows; r++) {
        if (this.grid[r][c] === null) {
          emptyCount++;
        }
      }
      for (let i = 0; i < emptyCount; i++) {
        const r = emptyCount - 1 - i;
        const color = Math.floor(Math.random() * GEM_COLORS) as GemColor;
        const gem = new Gem(color, r, c);
        this.grid[r][c] = gem;
        spawned.push({
          gem,
          targetRow: r,
          spawnOffset: emptyCount - i,
        });
      }
    }
    return spawned;
  }

  forEachGem(callback: (gem: Gem, row: number, col: number) => void): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const gem = this.grid[r][c];
        if (gem) callback(gem, r, c);
      }
    }
  }

  lockGem(row: number, col: number): Gem | null {
    const gem = this.gemAt(row, col);
    if (gem) gem.locked = true;
    return gem;
  }

  unlockGem(row: number, col: number): Gem | null {
    const gem = this.gemAt(row, col);
    if (gem) gem.locked = false;
    return gem;
  }

  /** Find the first unlocked gem in a column, scanning from the given direction.
   *  'bottom' scans row 7→0 (for attacks arriving from below).
   *  'top' scans row 0→7 (for attacks arriving from above). */
  findFirstUnlockedGem(col: number, from: 'top' | 'bottom'): Gem | null {
    if (from === 'bottom') {
      for (let r = this.rows - 1; r >= 0; r--) {
        const gem = this.grid[r][col];
        if (gem && !gem.locked) return gem;
      }
    } else {
      for (let r = 0; r < this.rows; r++) {
        const gem = this.grid[r][col];
        if (gem && !gem.locked) return gem;
      }
    }
    return null;
  }

  /** True if all gems in the column exist and are locked */
  isColumnFullyLocked(col: number): boolean {
    for (let r = 0; r < this.rows; r++) {
      const gem = this.grid[r][col];
      if (!gem || !gem.locked) return false;
    }
    return true;
  }

  /** Unlock locked gems adjacent to any of the given positions. Returns newly unlocked gems. */
  unlockGemsAdjacentTo(positions: GridPos[]): Gem[] {
    const unlocked: Gem[] = [];
    const seen = new Set<number>();
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const pos of positions) {
      for (const [dr, dc] of deltas) {
        const gem = this.gemAt(pos.row + dr, pos.col + dc);
        if (gem && gem.locked && !seen.has(gem.id)) {
          gem.locked = false;
          seen.add(gem.id);
          unlocked.push(gem);
        }
      }
    }
    return unlocked;
  }

  findAllValidMoves(): Array<[GridPos, GridPos]> {
    const moves: Array<[GridPos, GridPos]> = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (c < this.cols - 1) {
          const a: GridPos = { row: r, col: c };
          const b: GridPos = { row: r, col: c + 1 };
          if (this.testSwapProducesMatch(a, b)) {
            moves.push([a, b]);
          }
        }
        if (r < this.rows - 1) {
          const a: GridPos = { row: r, col: c };
          const b: GridPos = { row: r + 1, col: c };
          if (this.testSwapProducesMatch(a, b)) {
            moves.push([a, b]);
          }
        }
      }
    }
    return moves;
  }

  private testSwapProducesMatch(a: GridPos, b: GridPos): boolean {
    const gemA = this.gemAt(a.row, a.col);
    const gemB = this.gemAt(b.row, b.col);
    if (!gemA || !gemB || gemA.locked || gemB.locked) return false;

    this.setGem(a.row, a.col, gemB);
    this.setGem(b.row, b.col, gemA);

    const hasMatch = this.hasMatchAt(a) || this.hasMatchAt(b);

    this.setGem(a.row, a.col, gemA);
    this.setGem(b.row, b.col, gemB);

    return hasMatch;
  }

  private hasMatchAt(pos: GridPos): boolean {
    const gem = this.gemAt(pos.row, pos.col);
    if (!gem) return false;
    const color = gem.color;

    let hCount = 1;
    let c = pos.col - 1;
    while (c >= 0 && this.gemAt(pos.row, c)?.color === color && !this.gemAt(pos.row, c)!.locked) { hCount++; c--; }
    c = pos.col + 1;
    while (c < this.cols && this.gemAt(pos.row, c)?.color === color && !this.gemAt(pos.row, c)!.locked) { hCount++; c++; }
    if (hCount >= 3) return true;

    let vCount = 1;
    let r = pos.row - 1;
    while (r >= 0 && this.gemAt(r, pos.col)?.color === color && !this.gemAt(r, pos.col)!.locked) { vCount++; r--; }
    r = pos.row + 1;
    while (r < this.rows && this.gemAt(r, pos.col)?.color === color && !this.gemAt(r, pos.col)!.locked) { vCount++; r++; }
    if (vCount >= 3) return true;

    return false;
  }
}
