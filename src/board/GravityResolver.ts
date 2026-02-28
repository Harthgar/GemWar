import { Board } from './Board';
import { MatchDetector, MatchGroup } from './MatchDetector';
import { Gem } from './Gem';
import { GridPos } from '../util/GridPosition';

/** One step of the resolve loop */
export interface ResolveStep {
  matches: MatchGroup[];
  removedGems: Gem[];
  unlockedGems: Gem[];
  gravityMoves: Array<{ gem: Gem; fromRow: number; toRow: number }>;
  spawnedGems: Array<{ gem: Gem; targetRow: number; spawnOffset: number }>;
}

/**
 * Resolves cascades after a swap.
 * Returns an array of steps — each is one "wave" of matches + gravity.
 * The renderer animates each wave sequentially.
 */
export function resolveBoard(board: Board): ResolveStep[] {
  const steps: ResolveStep[] = [];

  while (true) {
    const matches = MatchDetector.findMatches(board);
    if (matches.length === 0) break;

    // Collect all positions to clear (deduplicated)
    const allPositions: GridPos[] = [];
    const seen = new Set<string>();
    for (const group of matches) {
      for (const pos of group.allPositions) {
        const key = `${pos.row},${pos.col}`;
        if (!seen.has(key)) {
          seen.add(key);
          allPositions.push(pos);
        }
      }
    }

    // Unlock locked gems adjacent to matched positions (before removal)
    const unlockedGems = board.unlockGemsAdjacentTo(allPositions);

    const removedGems = board.removeGems(allPositions);
    const gravityMoves = board.applyGravity();
    const spawnedGems = board.spawnNewGems();

    steps.push({ matches, removedGems, unlockedGems, gravityMoves, spawnedGems });
  }

  return steps;
}
