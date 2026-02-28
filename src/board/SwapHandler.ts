import { Board } from './Board';
import { BoardRenderer } from './BoardRenderer';
import { MatchDetector } from './MatchDetector';
import { MatchGroupType } from './MatchDetector';
import { resolveBoard } from './GravityResolver';
import { GridPos, areAdjacent } from '../util/GridPosition';
import { EventBus, GameEvents } from '../util/EventBus';

export class SwapHandler {
  private board: Board;
  private renderer: BoardRenderer;
  private selectedGem: GridPos | null = null;
  private processing = false;

  constructor(board: Board, renderer: BoardRenderer) {
    this.board = board;
    this.renderer = renderer;
  }

  /** Called when a cell is clicked/tapped */
  onCellSelected(pos: GridPos): void {
    if (this.processing) return;

    if (this.selectedGem === null) {
      // First selection
      const gem = this.board.gemAt(pos.row, pos.col);
      if (gem && !gem.locked) {
        this.selectedGem = pos;
        this.renderer.highlightGem(pos);
      }
    } else {
      // Second selection
      const from = this.selectedGem;
      this.selectedGem = null;
      this.renderer.clearHighlight();

      if (areAdjacent(from, pos)) {
        this.attemptSwap(from, pos);
      } else {
        // Clicked non-adjacent gem — select it instead
        const gem = this.board.gemAt(pos.row, pos.col);
        if (gem && !gem.locked) {
          this.selectedGem = pos;
          this.renderer.highlightGem(pos);
        }
      }
    }
  }

  private async attemptSwap(posA: GridPos, posB: GridPos): Promise<void> {
    this.processing = true;

    const swapped = this.board.trySwap(posA, posB);
    if (!swapped) {
      this.processing = false;
      return;
    }

    // Animate the swap
    await this.renderer.animateSwap(posA, posB);

    // Check for matches after swap
    const matches = MatchDetector.findMatches(this.board);
    if (matches.length === 0) {
      // No matches — undo swap
      this.board.undoSwap(posA, posB);
      await this.renderer.animateSwap(posB, posA);
      this.processing = false;
      return;
    }

    // Resolve all cascades
    // The board already has the swap applied and matches exist.
    // resolveBoard will find those matches, clear them, apply gravity, and repeat.
    const steps = resolveBoard(this.board);

    // Animate each resolve step and emit events
    for (const step of steps) {
      for (const matchGroup of step.matches) {
        const typeName = MatchGroupType[matchGroup.type];
        console.log(
          `[${this.board.owner}] Match: ${typeName} ` +
          `H=${matchGroup.horizontalLength} V=${matchGroup.verticalLength} ` +
          `cols=[${matchGroup.horizontalColumns}] vCol=${matchGroup.verticalColumn}`
        );

        EventBus.emit(GameEvents.MATCH_RESOLVED, {
          owner: this.board.owner,
          group: matchGroup,
        });
      }

      await this.renderer.animateResolveStep(step);
    }

    this.processing = false;
  }
}
