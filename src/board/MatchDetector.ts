import { Board } from './Board';
import { GridPos, posKey } from '../util/GridPosition';

/** A contiguous run of matching gems in one direction */
export interface MatchRun {
  positions: GridPos[];
  direction: 'horizontal' | 'vertical';
  color: number;
}

/** Classification of what a match group produces */
export enum MatchGroupType {
  Horizontal,  // Pure horizontal — spawns units
  Vertical,    // Pure vertical — fires attack
  LShape,      // L-shape — horizontal spawns units, vertical spawns special unit
  TShape,      // T-shape — same effect as L, classified separately for future use
}

/** A group of connected match runs that share cells */
export interface MatchGroup {
  type: MatchGroupType;
  color: number;
  allPositions: GridPos[];
  horizontalRuns: MatchRun[];
  verticalRuns: MatchRun[];
  horizontalLength: number;    // Length of longest horizontal run (0 if none)
  verticalLength: number;      // Length of longest vertical run (0 if none)
  horizontalColumns: number[]; // Columns covered by horizontal runs (for unit spawning)
  verticalColumn: number | null; // Column of vertical run (for attack/special unit)
}

export class MatchDetector {

  /** Find all match groups on the board */
  static findMatches(board: Board): MatchGroup[] {
    const runs = this.findAllRuns(board);
    if (runs.length === 0) return [];

    const groups = this.groupConnectedRuns(runs);
    return groups.map(runSet => this.classifyGroup(runSet));
  }

  /** Scan the entire board for runs of 3+ matching non-locked gems */
  private static findAllRuns(board: Board): MatchRun[] {
    const runs: MatchRun[] = [];

    // Horizontal runs
    for (let r = 0; r < board.rows; r++) {
      let runStart = 0;
      while (runStart < board.cols) {
        const gem = board.gemAt(r, runStart);
        if (!gem || gem.locked) { runStart++; continue; }

        let runEnd = runStart + 1;
        while (runEnd < board.cols) {
          const next = board.gemAt(r, runEnd);
          if (!next || next.locked || next.color !== gem.color) break;
          runEnd++;
        }

        if (runEnd - runStart >= 3) {
          const positions: GridPos[] = [];
          for (let c = runStart; c < runEnd; c++) {
            positions.push({ row: r, col: c });
          }
          runs.push({ positions, direction: 'horizontal', color: gem.color });
        }
        runStart = runEnd;
      }
    }

    // Vertical runs
    for (let c = 0; c < board.cols; c++) {
      let runStart = 0;
      while (runStart < board.rows) {
        const gem = board.gemAt(runStart, c);
        if (!gem || gem.locked) { runStart++; continue; }

        let runEnd = runStart + 1;
        while (runEnd < board.rows) {
          const next = board.gemAt(runEnd, c);
          if (!next || next.locked || next.color !== gem.color) break;
          runEnd++;
        }

        if (runEnd - runStart >= 3) {
          const positions: GridPos[] = [];
          for (let r = runStart; r < runEnd; r++) {
            positions.push({ row: r, col: c });
          }
          runs.push({ positions, direction: 'vertical', color: gem.color });
        }
        runStart = runEnd;
      }
    }

    return runs;
  }

  /**
   * Group runs that share at least one cell and are the same color.
   * Uses Union-Find for efficient merging.
   */
  private static groupConnectedRuns(runs: MatchRun[]): MatchRun[][] {
    const n = runs.length;
    const parent = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(a: number, b: number): void {
      parent[find(a)] = find(b);
    }

    // Map each cell to which runs contain it
    const cellToRuns = new Map<string, number[]>();
    for (let i = 0; i < n; i++) {
      for (const pos of runs[i].positions) {
        const key = posKey(pos);
        if (!cellToRuns.has(key)) cellToRuns.set(key, []);
        cellToRuns.get(key)!.push(i);
      }
    }

    // Union runs that share a cell and have the same color
    for (const indices of cellToRuns.values()) {
      for (let i = 1; i < indices.length; i++) {
        if (runs[indices[0]].color === runs[indices[i]].color) {
          union(indices[0], indices[i]);
        }
      }
    }

    // Collect into groups
    const groupMap = new Map<number, MatchRun[]>();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!groupMap.has(root)) groupMap.set(root, []);
      groupMap.get(root)!.push(runs[i]);
    }

    return Array.from(groupMap.values());
  }

  /** Classify a group of connected runs and compute derived properties */
  private static classifyGroup(runs: MatchRun[]): MatchGroup {
    const horizontalRuns = runs.filter(r => r.direction === 'horizontal');
    const verticalRuns = runs.filter(r => r.direction === 'vertical');

    // Collect all unique positions
    const posSet = new Set<string>();
    const allPositions: GridPos[] = [];
    for (const run of runs) {
      for (const pos of run.positions) {
        const key = posKey(pos);
        if (!posSet.has(key)) {
          posSet.add(key);
          allPositions.push(pos);
        }
      }
    }

    // Determine type
    let type: MatchGroupType;
    if (verticalRuns.length === 0) {
      type = MatchGroupType.Horizontal;
    } else if (horizontalRuns.length === 0) {
      type = MatchGroupType.Vertical;
    } else {
      type = this.classifyCompositeShape(horizontalRuns, verticalRuns);
    }

    // Derived properties
    const horizontalLength = horizontalRuns.reduce(
      (max, run) => Math.max(max, run.positions.length), 0
    );
    const verticalLength = verticalRuns.reduce(
      (max, run) => Math.max(max, run.positions.length), 0
    );

    const hColSet = new Set<number>();
    for (const run of horizontalRuns) {
      for (const pos of run.positions) {
        hColSet.add(pos.col);
      }
    }
    const horizontalColumns = Array.from(hColSet).sort((a, b) => a - b);

    let verticalColumn: number | null = null;
    if (verticalRuns.length > 0) {
      verticalColumn = verticalRuns[0].positions[0].col;
    }

    const color = runs[0].color;

    return {
      type,
      color,
      allPositions,
      horizontalRuns,
      verticalRuns,
      horizontalLength,
      verticalLength,
      horizontalColumns,
      verticalColumn,
    };
  }

  /**
   * Determine if a composite shape is L or T.
   * T-shape: vertical column is strictly between horizontal endpoints.
   * L-shape: vertical column is at a horizontal endpoint.
   */
  private static classifyCompositeShape(
    hRuns: MatchRun[],
    vRuns: MatchRun[]
  ): MatchGroupType {
    for (const hRun of hRuns) {
      const hCols = hRun.positions.map(p => p.col);
      const minCol = Math.min(...hCols);
      const maxCol = Math.max(...hCols);

      for (const vRun of vRuns) {
        const vCol = vRun.positions[0].col;
        if (vCol > minCol && vCol < maxCol) {
          return MatchGroupType.TShape;
        }
      }
    }
    return MatchGroupType.LShape;
  }
}
