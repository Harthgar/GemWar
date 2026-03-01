import Phaser from 'phaser';
import { Board } from '../board/Board';
import { BoardRenderer } from '../board/BoardRenderer';
import { SwapHandler } from '../board/SwapHandler';
import { ViewportManager } from '../camera/ViewportManager';
import { Minimap } from '../camera/Minimap';
import { BattlefieldRenderer } from '../battlefield/BattlefieldRenderer';
import { AttackManager } from '../attack/AttackManager';
import { Wall } from '../wall/Wall';
import { WallRenderer } from '../wall/WallRenderer';
import { EventBus, GameEvents } from '../util/EventBus';
import { MatchGroup, MatchGroupType } from '../board/MatchDetector';
import { GridPos, areAdjacent } from '../util/GridPosition';
import { UnitManager } from '../unit/UnitManager';
import {
  BOARD_X, BOARD_COLS, CELL_SIZE,
  BOARD_PIXEL_HEIGHT,
  ENEMY_BOARD_Y, PLAYER_BOARD_Y, BATTLEFIELD_Y,
  ENEMY_MOVE_INTERVAL_MIN, ENEMY_MOVE_INTERVAL_MAX,
  MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT,
  WALL_HEIGHT, attackPower, SHUFFLE_IDLE_MS,
  horizontalMatchUnitType, horizontalMatchRowCount,
  specialUnitType, UNIT_ROW_STAGGER,
} from '../game/constants';

export class GameScene extends Phaser.Scene {
  // Player
  private playerBoard!: Board;
  private playerRenderer!: BoardRenderer;
  private playerSwapHandler!: SwapHandler;

  // Enemy
  private enemyBoard!: Board;
  private enemyRenderer!: BoardRenderer;
  private enemySwapHandler!: SwapHandler;
  private enemyMoveTimer = 0;
  private gameOver = false;

  // Shuffle system
  private playerIdleTimer = 0;
  private enemyIdleTimer = 0;
  private shuffleButton!: Phaser.GameObjects.Container;
  private shuffleVisible = false;

  // Systems
  private viewport!: ViewportManager;
  private minimap!: Minimap;
  private attackManager!: AttackManager;
  private unitManager!: UnitManager;
  private playerWall!: Wall;
  private enemyWall!: Wall;
  private playerWallRenderer!: WallRenderer;
  private enemyWallRenderer!: WallRenderer;

  constructor() {
    super('GameScene');
  }

  create(): void {
    // Create battlefield background (between the two boards)
    new BattlefieldRenderer(this);

    // Create enemy board at the top of the world
    this.enemyBoard = new Board('enemy');
    this.enemyRenderer = new BoardRenderer(
      this, this.enemyBoard,
      BOARD_X, ENEMY_BOARD_Y
    );
    this.enemySwapHandler = new SwapHandler(this.enemyBoard, this.enemyRenderer);

    // Create player board at the bottom of the world
    this.playerBoard = new Board('player');
    this.playerRenderer = new BoardRenderer(
      this, this.playerBoard,
      BOARD_X, PLAYER_BOARD_Y
    );
    this.playerSwapHandler = new SwapHandler(this.playerBoard, this.playerRenderer);

    // Wall system
    this.enemyWall = new Wall('enemy');
    this.playerWall = new Wall('player');
    this.enemyWallRenderer = new WallRenderer(this, this.enemyWall, BATTLEFIELD_Y + WALL_HEIGHT / 2);
    this.playerWallRenderer = new WallRenderer(this, this.playerWall, PLAYER_BOARD_Y - WALL_HEIGHT / 2);

    EventBus.on(GameEvents.WALL_HIT, (data: { wallOwner: string; column: number }) => {
      const renderer = data.wallOwner === 'player'
        ? this.playerWallRenderer : this.enemyWallRenderer;
      renderer.updateSegment(data.column);
    });

    // Attack system
    this.attackManager = new AttackManager(
      this, this.playerWall, this.enemyWall, this.playerBoard, this.enemyBoard
    );

    // Unit system
    this.unitManager = new UnitManager(
      this, this.playerWall, this.enemyWall, this.playerBoard, this.enemyBoard
    );
    this.attackManager.setUnitManager(this.unitManager);

    // Gem locking: update board renderer when a gem is locked
    EventBus.on(GameEvents.GEM_LOCKED, (data: { boardOwner: string; gemId: number }) => {
      const renderer = data.boardOwner === 'player'
        ? this.playerRenderer : this.enemyRenderer;
      renderer.setGemLocked(data.gemId, true);
    });

    // Game over
    EventBus.on(GameEvents.GAME_OVER, (data: { winner: string; column: number }) => {
      this.showGameOver(data.winner, data.column);
    });

    EventBus.on(GameEvents.MATCH_RESOLVED, (data: { owner: string; group: MatchGroup }) => {
      // Reset idle timers on successful match
      if (data.owner === 'player') {
        this.playerIdleTimer = 0;
        this.hideShuffleButton();
      } else {
        this.enemyIdleTimer = 0;
      }

      const owner = data.owner as 'player' | 'enemy';
      const group = data.group;

      // Vertical component: pure vertical → attack, L/T → special unit (not attack)
      if (group.verticalColumn !== null) {
        if (group.type === MatchGroupType.LShape || group.type === MatchGroupType.TShape) {
          const special = specialUnitType(group.verticalLength);
          this.unitManager.spawnUnit(owner, group.verticalColumn, special, group.color);
        } else {
          const power = attackPower(group.verticalLength);
          this.attackManager.fireAttack(owner, group.verticalColumn, power, group.color, group.verticalLength);
        }
      }

      // Horizontal matches spawn regular units (skip vertical column in L/T — special unit replaces it)
      if (group.horizontalColumns.length > 0 && group.horizontalLength >= 3) {
        const unitType = horizontalMatchUnitType(group.horizontalLength);
        const rowCount = horizontalMatchRowCount(group.horizontalLength);
        const skipCol = (group.type === MatchGroupType.LShape || group.type === MatchGroupType.TShape)
          ? group.verticalColumn : null;
        for (let row = 0; row < rowCount; row++) {
          const stagger = row * UNIT_ROW_STAGGER;
          for (const col of group.horizontalColumns) {
            if (col === skipCol) continue;
            this.unitManager.spawnUnit(owner, col, unitType, group.color, stagger);
          }
        }
      }

      // Square matches heal own wall
      if (group.squareColumns.length > 0) {
        const wall = owner === 'player' ? this.playerWall : this.enemyWall;
        const renderer = owner === 'player'
          ? this.playerWallRenderer : this.enemyWallRenderer;
        for (const col of group.squareColumns) {
          wall.heal(col, 10);
          renderer.updateSegment(col);
          console.log(
            `[${owner}] Square healed wall col=${col} HP=${wall.segments[col]}`
          );
        }
      }
    });

    // Set up camera system (must happen after boards are created)
    this.viewport = new ViewportManager(this);

    // Set up minimap — game cameras must ignore it (rendered by UI camera only)
    this.minimap = new Minimap(this, this.viewport);
    this.viewport.ignoreFromGameCameras(this.minimap.container);

    // Add board labels
    this.addBoardLabels();

    // Player input: click/tap and swipe on the board area
    let dragStartGrid: GridPos | null = null;
    let didSwipe = false;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isMinimapClick(pointer)) return;
      dragStartGrid = null;
      didSwipe = false;

      const world = this.viewport.pointerToWorld(pointer);
      if (world.inBoard) {
        dragStartGrid = this.playerRenderer.worldToGrid(world.x, world.y);
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown || !dragStartGrid || didSwipe) return;

      const world = this.viewport.pointerToWorld(pointer);
      if (!world.inBoard) return;

      const currentGrid = this.playerRenderer.worldToGrid(world.x, world.y);
      if (!currentGrid) return;

      // If pointer moved to a different adjacent cell, trigger swipe
      if (currentGrid.row !== dragStartGrid.row || currentGrid.col !== dragStartGrid.col) {
        if (areAdjacent(dragStartGrid, currentGrid)) {
          didSwipe = true;
          this.playerSwapHandler.onSwipe(dragStartGrid, currentGrid);
        }
      }
    });

    this.input.on('pointerup', (_pointer: Phaser.Input.Pointer) => {
      // If no swipe occurred, treat as a click
      if (!didSwipe && dragStartGrid) {
        this.playerSwapHandler.onCellSelected(dragStartGrid);
      }
      dragStartGrid = null;
      didSwipe = false;
    });

    // Shuffle button (world space, left of player board)
    this.createShuffleButton();

    // Keyboard: Space to snap back to board view
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.viewport.snapToDefault();
    });

    // Schedule first enemy move
    this.scheduleEnemyMove();
  }

  update(_time: number, delta: number): void {
    if (this.gameOver) return;

    // Enemy auto-play
    this.enemyMoveTimer -= delta;
    if (this.enemyMoveTimer <= 0) {
      this.makeEnemyMove();
      this.scheduleEnemyMove();
    }

    // Player idle timer (only counts when not processing)
    if (!this.playerSwapHandler.isProcessing) {
      this.playerIdleTimer += delta;
    }
    if (this.playerIdleTimer >= SHUFFLE_IDLE_MS && !this.shuffleVisible) {
      this.showShuffleButton();
    }

    // Enemy idle timer
    if (!this.enemySwapHandler.isProcessing) {
      this.enemyIdleTimer += delta;
    }
    if (this.enemyIdleTimer >= SHUFFLE_IDLE_MS) {
      this.doEnemyShuffle();
    }

    // Advance attacks and units
    this.attackManager.update(delta);
    this.unitManager.update(delta);

    // Update minimap with unit, attack, wall, and locked gem data
    const units = this.unitManager.getActiveUnits().map(au => ({
      owner: au.unit.owner,
      worldX: au.unit.worldX,
      worldY: au.unit.worldY,
    }));
    const attacks = this.attackManager.getActiveAttacks();

    const lockedGems: Array<{ owner: 'player' | 'enemy'; row: number; col: number }> = [];
    this.playerBoard.forEachGem((gem, row, col) => {
      if (gem.locked) lockedGems.push({ owner: 'player', row, col });
    });
    this.enemyBoard.forEachGem((gem, row, col) => {
      if (gem.locked) lockedGems.push({ owner: 'enemy', row, col });
    });

    this.minimap.update(
      units, attacks,
      { segments: this.playerWall.segments },
      { segments: this.enemyWall.segments },
      lockedGems,
    );
  }

  private addBoardLabels(): void {
    const centerX = BOARD_X + (BOARD_COLS * CELL_SIZE) / 2;

    // Enemy label just below the enemy board
    const enemyLabel = this.add.text(
      centerX, ENEMY_BOARD_Y + BOARD_COLS * CELL_SIZE + 15,
      'ENEMY', { fontSize: '18px', color: '#ff6666', fontFamily: 'monospace' }
    );
    enemyLabel.setOrigin(0.5, 0);

    // Player label just above the player board
    const playerLabel = this.add.text(
      centerX, PLAYER_BOARD_Y - 15,
      'PLAYER', { fontSize: '18px', color: '#6688ff', fontFamily: 'monospace' }
    );
    playerLabel.setOrigin(0.5, 1);
  }

  private isMinimapClick(pointer: Phaser.Input.Pointer): boolean {
    return pointer.x >= MINIMAP_X && pointer.x <= MINIMAP_X + MINIMAP_WIDTH &&
           pointer.y >= MINIMAP_Y && pointer.y <= MINIMAP_Y + MINIMAP_HEIGHT;
  }

  private scheduleEnemyMove(): void {
    this.enemyMoveTimer = Phaser.Math.Between(
      ENEMY_MOVE_INTERVAL_MIN, ENEMY_MOVE_INTERVAL_MAX
    );
  }

  private showGameOver(winner: string, column: number): void {
    this.gameOver = true;

    const centerX = BOARD_X + (BOARD_COLS * CELL_SIZE) / 2;
    const centerY = PLAYER_BOARD_Y + (BOARD_COLS * CELL_SIZE) / 2;

    const message = winner === 'player' ? 'YOU WIN!' : 'YOU LOSE!';
    const color = winner === 'player' ? '#44ff44' : '#ff4444';

    const text = this.add.text(centerX, centerY, message, {
      fontSize: '48px',
      color,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    text.setOrigin(0.5, 0.5);
    text.setScrollFactor(0);
    text.setDepth(1000);

    const subtext = this.add.text(centerX, centerY + 60, `Column ${column} breached`, {
      fontSize: '20px',
      color: '#cccccc',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3,
    });
    subtext.setOrigin(0.5, 0.5);
    subtext.setScrollFactor(0);
    subtext.setDepth(1000);
  }

  private createShuffleButton(): void {
    const x = BOARD_X - 90;
    const y = PLAYER_BOARD_Y + BOARD_PIXEL_HEIGHT / 2;

    const bg = this.add.rectangle(0, 0, 160, 120, 0x335577);
    bg.setStrokeStyle(3, 0x6699bb);

    const label = this.add.text(0, 0, 'SHUFFLE', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    label.setOrigin(0.5, 0.5);

    this.shuffleButton = this.add.container(x, y, [bg, label]);
    this.shuffleButton.setSize(160, 120);
    this.shuffleButton.setInteractive();
    this.shuffleButton.on('pointerdown', () => this.doPlayerShuffle());
    this.shuffleButton.setVisible(false);
  }

  private showShuffleButton(): void {
    this.shuffleVisible = true;
    this.shuffleButton.setVisible(true);
  }

  private hideShuffleButton(): void {
    this.shuffleVisible = false;
    this.shuffleButton.setVisible(false);
  }

  private doPlayerShuffle(): void {
    this.playerBoard.shuffle();
    this.playerRenderer.refreshColors();
    this.playerIdleTimer = 0;
    this.hideShuffleButton();
  }

  private doEnemyShuffle(): void {
    this.enemyBoard.shuffle();
    this.enemyRenderer.refreshColors();
    this.enemyIdleTimer = 0;
    console.log('[enemy] Auto-shuffled board');
  }

  private makeEnemyMove(): void {
    const moves = this.enemyBoard.findAllValidMoves();
    if (moves.length === 0) return;

    const [posA, posB] = moves[Phaser.Math.Between(0, moves.length - 1)];
    this.enemySwapHandler.onCellSelected(posA);
    // Small delay before selecting second gem for visual clarity
    this.time.delayedCall(100, () => {
      this.enemySwapHandler.onCellSelected(posB);
    });
  }
}
