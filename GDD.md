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

A vertical match (3+ gems in the same column) fires an attack upward from that column toward the enemy. The attack type depends on the gem color. Match length determines attack level (1-6).

### Attack Power Scaling
| Match Length | Level | Base Power | Notes |
|---|---|---|---|
| 3 | 1 | 1x | Basic attack |
| 4 | 2 | 2x | |
| 5 | 3 | 4x | |
| 6 | 4 | 8x | |
| 7 | 5 | 16x | |
| 8 | 6 | 32x | Full-column match |

Each additional gem roughly doubles the attack power. All attack types follow this base damage curve.

### General Attack Behavior
- **Column-locked:** All attacks travel in the column where the match occurred (secondary effects like splash or chains may reach other columns)
- **Wall interaction:** Attacks hit wall segments and deal damage proportional to their power
- **Board interaction:** If an attack reaches the enemy board, it locks one gem at the point of impact (the front-most unlocked gem in that column). Attacks are primarily anti-unit and anti-wall weapons; units are the primary gem-locking threat
- **Locked gem pass-through:** If the target gem is already locked, the attack passes through and locks the next unlocked gem

### Attack Types by Color

#### Red — Fireball
- **Visual:** Large glowing orb trailing flames
- **Speed:** Medium
- **Mechanic:** Travels in column, explodes on impact with AoE splash. Splash damages all units within a distance-based radius (circular, not column-bounded). Best at clearing clusters of units
- **Level scaling:** Splash radius grows with level (e.g. 0.5 → 1 → 1.5 → 2 → 2.5 → 3 cells)

#### Blue — Frost Bolt
- **Visual:** Sharp icicle projectile
- **Speed:** Medium-fast
- **Mechanic:** Pierces through enemies in its column, freezing/slowing each one hit. Stops on the last unit it can't pierce past. Frozen units have reduced movement speed
- **Level scaling:** Pierce count: 0, 1, 2, 3, 4, 5 (starts at 0, +1 per level). Freeze duration increases with level

#### Green — Poison Shot
- **Visual:** Bubbling dark-green projectile
- **Speed:** Medium
- **Mechanic:** Hits the first unit in its path. If the hit damage is enough to kill that unit, the attack passes through (subtracting HP dealt from remaining power) and continues to the next target. Applies heavy poison DoT to the unit it finally stops on. Most of the damage comes from the DoT. Best single-target killer — the answer to large, powerful enemy units
- **Level scaling:** Pass-through count: 0, 1, 2, 3, 4, 5 (+1 per level). DoT total damage doubles per level

#### Yellow — Lightning
- **Visual:** Bright crackling arc
- **Speed:** Very fast
- **Mechanic:** Hits the first enemy in its column, then chains to the nearest enemy within range. Chains can jump to units in adjacent columns. Good against spread-out formations
- **Level scaling:** Chain count: 1, 2, 3, 4, 5, 6 (starts at 1, +1 per level). Chain range grows with level. Each chain deals full damage

#### Purple — Void Pulse
- **Visual:** Dark expanding shockwave
- **Speed:** Medium-slow
- **Mechanic:** Passes through enemies in its column, pushing each one 1 column sideways. Disrupts enemy formations by displacing units out of their intended column — can strand melee units in columns where the wall is still intact. Lower base damage than other attacks (utility-focused)
- **Level scaling:** Pierce count: 1, 3, 5, 7, 9, 11 (starts at 1, +2 per level)

#### White — Holy Beam
- **Visual:** Bright concentrated beam, full column flash
- **Speed:** Instant (no travel time)
- **Mechanic:** Instantly damages all units in its column path. Cannot be dodged or intercepted by timing. No secondary effects — pure concentrated damage. Steepest damage scaling of all colors. Best wall breaker
- **Level scaling:** Pure damage increase (steepest base curve, no additional mechanics)

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

## 6b. Square Matches — Wall Repair

A 2x2 block of same-colored gems (a "square match") heals the player's own wall.

### Mechanics
- A pure square match (not connected to any horizontal or vertical 3+ run) heals the player's wall segment in each column covered by the square
- Each column heals **10 HP** per square match
- Wall HP is capped at the initial maximum (100 HP per segment)

### Composite Matches
- If a 2x2 block connects with a horizontal or vertical run (forming an L/T shape), the group is classified as that shape instead — no healing occurs, and the normal attack/unit spawning rules apply
- Only pure, isolated square matches trigger the wall heal effect

### Strategic Role
- Square matches provide the only way to repair wall damage
- This gives players a defensive option: set up 2x2 blocks to heal walls under pressure
- Balances the offensive focus of vertical (attacks) and horizontal (units) matches

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
- Wizards have the greatest range and power; AoE splash damages enemies in adjacent columns

### Cross-Column Targeting
- Spearmen can target enemies up to 1 column away
- Archers can target enemies up to 2 columns away
- Wizards can target enemies up to 3 columns away
- Melee and shield units only fight in their own column
- Ranged units prefer same-column targets; cross-column targeting uses the same engagement range (circular)

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

### Gem Color Unit Differentiation
- Attack types are fully specified in Section 4
- Unit color differentiation is TBD — currently all colors produce the same unit types
- Future: each color could produce units with distinct abilities (fire units deal AoE, ice units slow, etc.)

### Mobile Port
- Basic mobile support implemented: tall 9:16 resolution (700x1136), touch-action CSS, swipe input for gem swapping
- Future: Use Capacitor or similar wrapper for app store deployment
- Further UX polish for touch-only input (larger tap targets, haptic feedback, etc.)

### Free Unit Movement
- Currently units are column-locked and only move vertically
- Future: units could move freely in 2D across the battlefield
- Collision/bumping could push units sideways out of their starting column
- Ranged units would have true circular engagement ranges
- Melee units passing close enough would stop and fight regardless of column
- This would require reworking movement, combat, wall/board interaction, and spawning
- Recommended incremental approach: start with lateral nudging on collision + circular range for ranged units

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
