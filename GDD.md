# GemWar — Game Design Document

## 1. Overview

**Genre:** Match-3 Strategy / Auto-Battler Hybrid
**Platform:** Browser (desktop-first), with future mobile support planned
**Tech Stack:** Phaser 3 + TypeScript
**Players:** 1 (vs AI), with potential for PvP later

GemWar is a real-time competitive match-3 game where two opponents each control their own gem board. Matches create attacks and spawn units that travel across a large battlefield toward the enemy. The goal is to break through the enemy's defenses, lock down an entire column of their board, and push an attack or unit through to win.

---

## 2. Playing Field Layout

### Boards
- Two 8x8 gem boards — one for the player (bottom), one for the enemy (top)
- Each board contains gems of 6 colors
- Standard match-3 gravity: gems fall downward to fill gaps after matches

### Battlefield
- A large continuous (non-grid) space between the two boards
- Height: 10 full board-heights (equivalent to 80 board squares tall)
- Units and attacks travel through this space
- This distance is a tunable parameter and may be adjusted for balance

### Walls
- Each player starts with a wall directly in front of their board
- The wall has 8 segments (one per column), each with independent health
- Wall segments absorb the first several low-to-mid-level attacks before breaking
- Once a wall segment in a column is destroyed, attacks and units in that column can reach the board
- Wall health values are a tuning parameter (TBD: exact HP values)

### Viewport & Camera
- The player's board is always visible, occupying roughly the bottom third of the screen
- A scrollbar/minimap on the side shows a simplified view of the entire battlefield
- Default view: the player sees their board and the battlefield area directly above it (no visual split)
- When the player scrolls: the view splits — the board remains anchored at the bottom, and the area above shows wherever the player has scrolled to
- The minimap doubles as the scroll control

---

## 3. Core Match-3 Mechanics

### Gem Colors
- 6 gem colors in the prototype, all functionally equivalent
- Future: each color maps to a distinct attack type and unit variant (see Section 10)

### Swapping
- Standard match-3 swap: the player swaps two adjacent gems to create a line of 3+ matching gems
- Swaps that do not result in a match are rejected (gems swap back)

### Gravity & Cascades
- After a match clears, gems above fall downward to fill empty spaces
- New gems spawn at the top of the board to fill remaining gaps
- Cascading matches (chain reactions from falling gems) resolve automatically
- During cascade resolution, the player cannot make new swaps (natural cooldown)

### Real-Time Play
- Both players act simultaneously in real time
- There are no discrete turns — the player can swap gems as soon as the board settles from the previous action
- Chain reactions and gem-fall animations create a natural pacing between moves

---

## 4. Vertical Matches — Attacks

A vertical match (3+ gems in the same column) fires a projectile attack upward from that column toward the enemy.

### Attack Power Scaling
| Match Length | Power | Notes |
|---|---|---|
| 3 | 1x | Basic attack |
| 4 | 2x | |
| 5 | 4x | |
| 6 | 8x | |
| 7 | 16x | |
| 8 | 32x | Full-column match |

Each additional gem roughly doubles the attack power.

### Attack Behavior
- **Travel:** Attacks are projectiles that travel through the battlefield at high speed — fast but not instant (roughly 1-2 seconds to cross the full field). This creates a small window for interception
- **Column-locked:** Attacks travel in the column where the match occurred
- **Unit interaction:** Attacks can strike enemy units in their path, stopping or partially diminishing the attack based on the unit's strength
- **Wall interaction:** Attacks hit wall segments and deal damage proportional to their power
- **Board interaction:** If an attack reaches the enemy board, it locks one gem square at the point of impact (the lowest unlocked gem in that column)
- **Locked square pass-through:** If the target gem is already locked, the attack passes through and locks the next unlocked gem above it
- **Visual style:** TBD per gem color (e.g., fireball, lightning bolt, ice shard). Prototype uses a generic projectile

---

## 5. Horizontal Matches — Units

A horizontal match (3+ gems in the same row) spawns combat units that march across the battlefield toward the enemy.

### Unit Spawning Rules
| Match Length | Result |
|---|---|
| 3 | 3 basic melee units, one per matched column |
| 4 | 4 level 2 shield units, one per matched column |
| 5 | 5 level 3 shield units, one per matched column |
| 6 | 2 rows of level 3 shield units (12 total across matched columns) |
| 7 | 4 rows of level 3 shield units |
| 8 | 8 rows of level 3 shield units |

- Units spawn at the top edge of the player's board in the columns where the gems matched
- Units march forward (upward for the player, downward for the enemy) through the battlefield

### Unit Types (Horizontal Spawns)
| Unit | Relative Strength | Notes |
|---|---|---|
| Basic melee | 1x | No special abilities |
| Level 2 shield | ~2x | Carries a shield, more durable |
| Level 3 shield | ~4x | Stronger shield |

---

## 6. L-Shaped and T-Shaped Matches — Special Units

When a match forms an L or T shape, it has both horizontal and vertical components. Each component follows its own rules:

### Horizontal Component
- Counts only the horizontal width of the match
- Follows the same unit spawning rules as Section 5
- Units spawn in the horizontally-matched columns

### Vertical Component — Special Unit Spawns
The vertical portion of an L/T match spawns a single special unit in that column:

| Vertical Length | Unit | Relative Strength | Notes |
|---|---|---|---|
| 3 | Spearman | ~4x (comparable to lvl 3 shield) | Outreaches other melee units |
| 4 | Level 2 spearman | ~8x | |
| 5 | Archer | ~16x | Ranged attacker |
| 6 | Level 2 archer | ~32x | |
| 7 | Wizard | ~64x | Most powerful |
| 8 | Level 2 wizard | ~128x | |

- Spearmen outreach standard melee units in combat (they strike first)
- Archers can attack at range before melee engagement
- Wizards are the most powerful individual units (TBD: area damage, special abilities)

---

## 7. Board Locking

Locking is the primary way to pressure the enemy and progress toward a win.

### How Locking Works
- When an attack reaches the enemy board, it locks the gem it hits
- A locked gem cannot be part of a match and cannot be directly swapped by the player
- Locked gems are visually distinct (e.g., encased in crystal, darkened, chained)

### Unlocking
- A locked gem is unlocked when the player makes a match adjacent to it (horizontally or vertically)
- There is no time-based unlock — only adjacent matches free locked gems
- A single adjacent match unlocks the gem regardless of how it was locked

### Gravity & Locked Gems
- Locked gems obey gravity — if gems below them are cleared, locked gems fall
- The lock stays on the gem itself, not on the board position
- The previous position of the locked gem is no longer affected after it falls

### Pass-Through
- If an attack targets a gem that is already locked, it passes through that gem
- The attack continues upward to lock the next unlocked gem in the column
- This means sustained attacks on a single column will progressively lock it from bottom to top

### Units Locking the Board
- Units that reach the enemy board (after passing through a broken wall segment) can also lock squares
- TBD: exact mechanics of how units interact with the board (lock one square and disappear? lock and persist?)

---

## 8. Unit Combat

Units from both sides march toward each other through the battlefield. When opposing units meet:

### Combat Resolution
- Units engage in combat when they collide
- The stronger unit wins and continues marching, but with reduced strength proportional to the fight
- If units are evenly matched, both are destroyed
- Combat resolves based on relative strength values (see Sections 5 and 6)

### Unit vs Attack Interaction
- Enemy attacks (vertical match projectiles) can hit units as they travel through the battlefield
- An attack that hits a unit is stopped or partially diminished
- The unit absorbs damage proportional to the attack's power — a strong attack may destroy a weak unit and continue (at reduced power), while a weak attack may be fully absorbed by a strong unit

### Range Advantages
- Spearmen outreach basic melee and shield units — they deal damage before the melee unit can strike
- Archers can attack from a distance, potentially damaging or destroying units before melee contact
- Wizards have the greatest range and power (TBD: area effects)

### Movement
- Units move through the continuous battlefield at a constant speed
- TBD: exact movement speed (tuning parameter)
- Units stay in their column as they march (they do not change columns)

---

## 9. Win Condition

**A player wins by pushing an attack or unit completely past the enemy's board.**

To achieve this:
1. Destroy the wall segment in at least one column
2. Lock every gem in that column on the enemy's board (8 gems)
3. Send an attack or unit through that fully-locked column — with nothing left to stop it, it passes through the board entirely

This means the game has a clear strategic arc:
- **Early game:** Break through the wall, start locking enemy gems
- **Mid game:** Pressure specific columns while defending your own board from locks. Spawn units to control the battlefield
- **Late game:** Attempt to fully lock a column while the opponent tries to unlock their gems with adjacent matches

The opponent can defend by:
- Unlocking gems with adjacent matches (requires setting up matches next to locked gems)
- Spawning units to intercept incoming attacks
- Attacking the player's board to create pressure and force defensive play

---

## 10. AI Opponent

### Prototype
- The AI plays the exact same match-3 game as the player
- It evaluates available moves and makes swaps using the same rules
- No cheating — the AI sees only its own board and makes legitimate swaps
- AI decision-making: TBD (simple heuristic in prototype, potentially upgraded later)

### Future Considerations
- Difficulty levels: adjust AI reaction speed, strategic depth, or move evaluation quality
- Cheating modes for hard difficulty if needed (e.g., slightly better gem spawns)
- AI personality: aggressive (favors vertical attacks) vs defensive (favors horizontal unit spawns) vs balanced

---

## 11. Future Features (Deferred)

These are discussed but intentionally deferred from the initial prototype:

### Gem Color Differentiation
Each of the 6 gem colors will produce a distinct attack type and unit variant:
- **Red:** Fireball attacks, fire-themed units
- **Blue:** Ice attacks (potential slow effect), ice-themed units
- **Green, Yellow, Purple, White:** TBD
- Color-specific effects may include: AoE damage, slowing, piercing, splash, healing allies, etc.

### Square Matches
- Matching gems in a 2x2 or larger square pattern
- Deferred — mechanics TBD

### Mobile Port
- Phaser 3 supports touch input natively
- Use Capacitor or similar wrapper for app store deployment
- UI/UX adjustments for smaller screens and touch-only input
- The scrollbar/minimap will need touch-friendly interaction

### Multiplayer
- Real-time PvP over network
- Would require server authority for fair play
- Matchmaking, ranking systems

---

## 12. Tuning Parameters

These values will need playtesting and iteration:

| Parameter | Initial Value | Notes |
|---|---|---|
| Board dimensions | 8x8 | Fixed for now |
| Gem colors | 6 | May adjust |
| Battlefield height | 80 squares (10 board heights) | Adjustable |
| Wall segment HP | TBD | Should withstand ~3-5 basic attacks |
| Attack travel speed | ~1-2 sec across full field | Fast but not instant |
| Unit movement speed | TBD | Slower than attacks |
| Attack power scaling | 2x per additional gem | Core balance lever |
| Unit strength scaling | See Sections 5 & 6 | Core balance lever |
| Cascade delay | TBD | Time for gems to fall and settle |
| Lock visual | TBD | Must be clearly distinguishable |

---

## 13. Prototype Scope

The first playable build should include:

1. A single 8x8 match-3 board with swap, match detection, gravity, and cascades
2. All 6 gem colors (visually distinct, mechanically equivalent)
3. Vertical match → attack projectile that travels upward
4. Horizontal match → unit spawning with basic melee, shield tiers
5. L/T match detection → special unit spawning
6. Battlefield with units marching and attacks traveling
7. Wall with destructible segments
8. Board locking and unlocking mechanics
9. Basic unit combat (collision, strength comparison, winner continues)
10. Win condition detection (attack/unit passes through fully locked column)
11. AI opponent with basic move evaluation
12. Viewport with scrollbar/minimap
13. Placeholder art (colored shapes, simple sprites)
