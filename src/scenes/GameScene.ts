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
import { MatchGroup } from '../board/MatchDetector';
import {
  BOARD_X, BOARD_COLS, CELL_SIZE,
  ENEMY_BOARD_Y, PLAYER_BOARD_Y, BATTLEFIELD_Y,
  ENEMY_MOVE_INTERVAL_MIN, ENEMY_MOVE_INTERVAL_MAX,
  MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT,
  WALL_HEIGHT, attackPower,
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

  // Systems
  private viewport!: ViewportManager;
  private minimap!: Minimap;
  private attackManager!: AttackManager;
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
      if (data.group.verticalColumn !== null) {
        const power = attackPower(data.group.verticalLength);
        this.attackManager.fireAttack(
          data.owner as 'player' | 'enemy',
          data.group.verticalColumn,
          power,
          data.group.color
        );
      }
    });

    // Set up camera system (must happen after boards are created)
    this.viewport = new ViewportManager(this);

    // Set up minimap — game cameras must ignore it (rendered by UI camera only)
    this.minimap = new Minimap(this, this.viewport);
    this.viewport.ignoreFromGameCameras(this.minimap.container);

    // Add board labels
    this.addBoardLabels();

    // Player input: click/tap on the board area
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Don't handle board clicks if clicking on the minimap
      if (this.isMinimapClick(pointer)) return;

      const world = this.viewport.pointerToWorld(pointer);
      if (world.inBoard) {
        const gridPos = this.playerRenderer.worldToGrid(world.x, world.y);
        if (gridPos) {
          this.playerSwapHandler.onCellSelected(gridPos);
        }
      }
    });

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

    // Advance attacks
    this.attackManager.update(delta);

    // Update minimap
    this.minimap.update();
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
