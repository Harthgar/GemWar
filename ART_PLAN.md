# GemWar — Art Plan

## 1. Asset Inventory

Everything the game needs, organized by category. Counts are approximate — prototype can start with fewer variants and expand.

### 1.1 Gems (highest priority — on-screen constantly)
| Asset | Count | Notes |
|---|---|---|
| Gem sprites (6 colors) | 6 | Need to be instantly distinguishable at small size (~48-64px). Shape + color coding recommended for accessibility |
| Gem idle animation | 6 | Subtle shimmer/pulse. Can be a simple 2-4 frame loop or shader effect |
| Gem match/destroy FX | 6 | Burst/shatter per color |
| Gem locked state | 1-6 | Overlay or variant (chains, crystal encasement, darkened). Could be 1 generic overlay or 6 color-coded |
| Gem swap animation | — | Handled by code (tween), no extra art needed |

### 1.2 Board & Background
| Asset | Count | Notes |
|---|---|---|
| Board background/frame | 1 | 8x8 grid area, subtle grid lines or tile pattern |
| Board cell highlight | 2-3 | Selected gem, valid swap target, hover state |
| Battlefield background | 1 | Tall, tileable vertically. Should feel like a warzone/field between two fortresses |
| Viewport minimap frame | 1 | UI element for the sidebar scrollbar/minimap |

### 1.3 Wall
| Asset | Count | Notes |
|---|---|---|
| Wall segment (healthy) | 1 | Repeatable for 8 columns |
| Wall segment (damaged) | 2-3 | Progressive damage states |
| Wall segment (destroyed) | 1 | Rubble/gap |
| Wall destruction FX | 1 | Crumbling animation |

### 1.4 Attack Projectiles
| Asset | Count | Notes |
|---|---|---|
| Generic projectile (prototype) | 1 | Glowing bolt or energy ball |
| Color-themed projectiles (future) | 6 | Fireball, ice shard, lightning bolt, etc. |
| Projectile travel FX | 1-6 | Trail/glow behind projectile |
| Projectile impact FX | 1-6 | Hit effect on wall, unit, or board |

### 1.5 Units (most complex category)
| Unit Type | Variants | Sprites Needed | Notes |
|---|---|---|---|
| Basic melee | 1 | idle, walk, attack, death | Simple soldier/warrior |
| Shield unit Lv2 | 1 | idle, walk, attack, death | Soldier with shield |
| Shield unit Lv3 | 1 | idle, walk, attack, death | Heavier armor + shield |
| Spearman Lv1 | 1 | idle, walk, attack, death | Long weapon, extended reach |
| Spearman Lv2 | 1 | idle, walk, attack, death | Upgraded spearman |
| Archer Lv1 | 1 | idle, walk, attack, death | Ranged, bow/crossbow |
| Archer Lv2 | 1 | idle, walk, attack, death | Upgraded archer |
| Wizard Lv1 | 1 | idle, walk, attack, death | Staff/magic |
| Wizard Lv2 | 1 | idle, walk, attack, death | More powerful wizard |

That's **9 unit types**, each needing ~4 animation states = **36 animation sets** minimum.

**Mirroring:** Enemy units can be palette-swapped or tinted versions of player units (red vs blue team coloring). This halves the unique unit art.

### 1.5b Elemental / Color Variants (Future)

When gem colors gain identity, each unit type could have a color-specific version (fire archer, ice archer, etc.). Eventually, entirely different factions with unique unit sets could exist. The full scope:

| Tier | What It Means | Art Volume |
|---|---|---|
| **Now:** 1 faction, no color | 9 base unit types | 9 units x 4 anims = 36 sheets |
| **Near future:** 1 faction, 6 colors | Same 9 units with elemental decoration | 9 base + overlay system |
| **Later:** Multiple factions x 6 colors | Entirely different unit designs per faction | 9+ units per faction |

**Elemental decoration without full redraws — recommended approach:**
Rather than creating 54 unique unit sprites (9 types x 6 colors), use a layered system:
- **Base sprite:** The unit itself (archer, wizard, etc.) stays the same across all colors
- **Weapon tip / aura overlay:** A small elemental effect composited on top — fire glow on the arrowhead, ice crystals on the spear tip, lightning crackle around the staff
- **Tint or particle trail:** Subtle color tint on the unit or a trailing particle effect in the gem color
- **Projectile swap:** Ranged units fire color-specific projectiles (this is already needed for attacks)

This means adding 6 colors costs ~6 small overlay sprites per unit type (or a single particle system per color), not 6 full redraws. The base unit art stays reusable.

**Faction expansion (long-term):**
A second faction would be a full new set of 9 unit types with different silhouettes and animations (e.g., undead, elves, mechanical). This is a major art investment and should only happen if the game warrants it. Asset packs can help here — buying a second pack in a different theme gives you a second faction cheaply.

### 1.6 Combat FX
| Asset | Count | Notes |
|---|---|---|
| Melee clash | 1 | Sword/shield spark |
| Ranged hit (arrow) | 1 | Arrow impact |
| Magic hit | 1-2 | Spell impact |
| Unit death | 1-2 | Poof/collapse, can be generic |
| Health bar (units) | 1 | Simple bar, code-driven |

### 1.7 UI
| Asset | Count | Notes |
|---|---|---|
| Main menu background | 1 | Title screen |
| Game logo/title | 1 | "GemWar" treatment |
| Button sprites | 3-5 | Play, settings, etc. |
| Font | 1-2 | Display + body (can use free fonts) |
| Minimap indicator | 2-3 | Player position, unit dots, attack dots |
| Win/lose screen | 2 | Victory and defeat overlays |
| Health bar (wall segments) | 1 | Thin bar per column |

### 1.8 Audio (not visual art, but noting for completeness)
| Asset | Notes |
|---|---|
| Music — gameplay | You have Cursed Kingdoms, Valor and Villainy, and other music packs from your Humble Bundle |
| SFX — gem swap, match, cascade | Short, satisfying sounds |
| SFX — attack launch, impact | Whoosh, explosion |
| SFX — unit march, combat, death | Marching, clash, cry |
| SFX — wall hit, wall break | Crack, crumble |

---

## 2. Art Style Recommendation

### Target Style: **Crisp Pixel Art (32-64px base)**
**Why this fits GemWar:**
- Match-3 games need gems to read clearly at small sizes — pixel art excels here
- Units on the battlefield will be small; pixel art stays readable at tiny scales
- Huge ecosystem of free and affordable pixel art assets
- AI image generators struggle with pixel art consistency, but work fine for concept art
- Your Humble Bundle assets (Tiny Tales series, Tyler Warren, SeraphCircle) are all pixel-art style
- Pixel art is forgiving for a small team — a single artist can produce a lot

**Alternative: Clean Vector / Flat Style**
- Think Clash Royale or mobile puzzle games
- Scales to any resolution, good for future mobile port
- Harder to find free assets in a consistent style
- AI generation is more viable here (Midjourney/DALL-E can produce consistent flat icons)

**Recommendation:** Start pixel art. Your existing assets lean that way, and it's the most practical path for prototyping.

---

## 3. Sourcing Strategy — Phased Approach

### Phase A: Prototype (Now)
**Goal:** Get something playable and visually comprehensible. Speed over polish.

| Category | Source | Approach |
|---|---|---|
| **Gems** | AI-generated or hand-drawn | Generate 6 distinct gem icons with Midjourney/DALL-E, clean up in Aseprite/Photoshop. Or use free gem sprites from itch.io |
| **Board** | Code + minimal art | Colored rectangles with subtle grid. Can enhance later |
| **Battlefield BG** | Tileable texture | Use a simple grass/stone tile from Tiny Tales Overworld Tileset Pack (you own this) |
| **Wall** | Simple sprite | 1 stone block sprite, tint for damage states |
| **Projectiles** | Code-driven | Colored circles/shapes with particle trails (Phaser particles). No art needed |
| **Units** | Tiny Tales sprite packs | You own Tiny Tales Mega Sprite Pack + multiple NPC packs (Knights, Human Advanced, Beastmen, etc.). These have walk cycles and varied character types. Can map unit tiers to different characters |
| **UI** | Minimal/code | HTML-style buttons, basic overlays |

**Cost: $0** — leverages owned assets + code-drawn primitives

### Phase B: Polished Prototype / Demo
**Goal:** Cohesive visual identity. Good enough to show people and get feedback.

| Category | Source | Approach | Est. Cost |
|---|---|---|---|
| **Gems** | Asset pack or AI-refined | Buy a high-quality gem/jewel sprite pack from itch.io or craftpix. Alternatively, AI-generate + manual cleanup | $0-20 |
| **Units (9 types)** | Asset pack (primary strategy) | Buy 1-2 comprehensive pixel RPG unit packs that cover warrior/archer/mage archetypes with animations (see Section 4b) | $10-50 |
| **Battlefield BG** | Tiny Tales tilesets (owned) or asset pack | Layer Overworld + Dungeon tilesets you own for a war-torn field | $0-15 |
| **Wall** | Part of tileset/environment pack | Often included in dungeon or castle tileset packs | $0 |
| **Projectiles** | FX asset pack or code-driven | Pixel FX packs on itch.io often include projectiles, explosions, magic bolts | $0-15 |
| **Combat FX** | Pimen free packs + FX asset pack | EVFX packs are Effekseer format (not Phaser-compatible). Pimen free packs cover slashes, elemental spells, hit sparks. Supplement with paid Pimen Mega Pack if needed | $0-15 |
| **UI** | Free UI pack | Kenney's UI packs (free, CC0) or paid pixel UI packs on itch.io | $0-15 |

**Estimated total: $10-130**

### Phase C: Release Quality
**Goal:** Professional, cohesive art throughout. Everything feels intentional.

| Category | Source | Est. Cost | Notes |
|---|---|---|---|
| **Premium asset packs** | itch.io / craftpix / gamedevmarket | $50-200 | Upgrade to higher-quality packs if Phase B packs aren't polished enough. Buy from fewer artists for consistency |
| **Custom commission (targeted)** | Contract pixel artist | $200-1,000 | Only for gaps that asset packs can't fill — e.g., custom gem designs, unique hero units, or elemental overlays. Not a full-game commission |
| **Elemental overlays** | Commission or AI + cleanup | $50-200 | Small weapon-tip effects and aura sprites for the 6 colors. Good candidate for a small focused commission |
| **Portraits/splash** | AI-generated | $0 | Character portraits for menus, victory screens. AI excels at non-pixel painterly art |
| **Music** | Owned packs | $0 | Your Humble Bundle music packs cover this well |
| **SFX** | Free packs + owned | $0-15 | Freesound.org, your Cute Game Sounds / Beast Sounds packs |

**Estimated total: $50-400** (asset-pack-heavy approach)
**Alternative: $1,000-3,000** (full custom commission — only if game proves out and you want a unique visual identity)

---

## 4. Sourcing Options — Deep Dive

### 4a. AI-Generated Art

**Best for:**
- Concept art and mood boards (fast iteration on visual direction)
- Gem/icon sprites (simple, symmetric objects)
- Backgrounds and textures (tileable patterns)
- Character portraits and splash art (non-pixel, painterly style)
- Rapid prototyping of any visual element

**Limitations:**
- Inconsistent style across multiple generations (units won't look like they belong together)
- Poor at pixel art at specific resolutions (can't reliably produce 32x32 sprites)
- Can't generate sprite sheets with animation frames
- Legal gray area for commercial use — varies by tool and jurisdiction
- Results need manual cleanup/editing almost always

**Recommended tools:**
- **Midjourney** — Best quality for game art concepts. ~$10/month
- **DALL-E 3 (via ChatGPT)** — Good for icons and simple objects. Included with ChatGPT Plus
- **Stable Diffusion (local)** — Free, most control, pixel art LoRA models exist but require setup
- **Aseprite** — For cleaning up AI output into proper sprite sheets ($20, one-time)

**Verdict:** Use AI for concepting and for assets where consistency across a set doesn't matter (backgrounds, gem icons, portraits). Don't rely on it for unit sprites that need to feel cohesive.

### 4b. Asset Packs — Specific Recommendations

Asset packs are the primary strategy for GemWar art. Below are concrete packs found through research, organized by category. Remember: you already own Tiny Tales, VisuStella, EVFX, and Tyler Warren packs from Humble Bundle — those are noted where relevant.

#### Recognizability Risk

A valid concern with popular asset packs: will players recognize them from other games?

- **High-recognition packs:** Kenney assets, Tiny Swords (Pixel Frog), and LuizMelo character packs are *extremely* widely used. Indie devs who frequent itch.io or game jams will likely recognize them. General players probably won't
- **Medium-recognition:** Pimen VFX, CraftPix freebies — common in indie games but less instantly identifiable since VFX and UI are less distinctive than character art
- **Low-recognition:** Paid niche packs ($5-20 range with fewer downloads), your Humble Bundle RPGMaker packs (designed for a different engine ecosystem, rarely seen in browser/Phaser games), and less popular itch.io creators
- **Mitigation:** Palette swaps, tinting, combining elements from multiple packs, and adding custom overlays (like elemental effects) all make stock assets feel more "yours." The more you layer and modify, the less recognizable the base assets become
- **Bottom line:** For a prototype/early release, recognizability is not a real problem. For a polished commercial release, the units and gems matter most — those are what players associate with your game's identity. VFX, UI, and tilesets are rarely recognized

#### Gems / Match-3 Sprites

**FREE:**

| Pack | Source | Details | License | GemWar Fit |
|---|---|---|---|---|
| **Rotating Gems for Match3** | [OpenGameArt](https://opengameart.org/content/rotating-gems-for-match3) | 7 colors, 40-frame rotation animation, 52x52px. Includes heart bomb + rainbow bomb variants | CC0 | EXCELLENT — animated, right size, more than 6 colors |
| **Gem Match 3 Set** | [OpenGameArt](https://opengameart.org/content/gem-match-3-set) | 4 gem shapes x 6 colors (24 sprites). Vector + PNG | CC0 | GOOD — exactly 6 colors, but static (no animation) |
| **Kenney Puzzle Pack 2** | [kenney.nl](https://www.kenney.nl/assets/puzzle-pack-2) | 795 assets: gems in 8 colors, diamonds, blocks, back tiles. Vector/flat style | CC0 | GOOD if going non-pixel — clean look but won't match pixel units |
| **VisuStella Rocks, Ores, Minerals** *(owned)* | Humble Bundle | **INSPECTED:** 6,516 PNGs, 4 crystal shapes, 11 colors, 256px painted style. Built-in elemental overlays (fire/ice/plasma/etc). Scales down beautifully | Check license | **CONFIRMED EXCELLENT** — use this. See Section 4c for full details |
| **VisuStella Jewelry Vol.01** *(owned)* | Humble Bundle | 381 MB of jewelry sprites. Not yet inspected — Minerals pack already covers gems well | Check license | LOW priority — Minerals pack is sufficient |

**PAID:**

| Pack | Source | Price | Details | GemWar Fit |
|---|---|---|---|---|
| **Magic Gems Pixel Art Asset** (Coloritmic) | [itch.io](https://coloritmic.itch.io/magic-gems-asset) / [GameDevMarket](https://www.gamedevmarket.net/asset/magic-gems-pixel-art-asset) | ~$5 | 17 gem types x 3 forms (sphere, square, brilliant). Animated. Aseprite source files included. ~32px pixel art | EXCELLENT — massive variety, animated, source files for customization. Low recognition risk (niche creator) |
| **Shiny Gems Pack** (Frakassets) | [itch.io](https://frakassets.itch.io/shiny-gems-pack-1) | ~$3 | 9 animated gems with shimmer/sparkle | GOOD — affordable supplement |
| **Match 3 Game Gems** | [GameDevMarket](https://www.gamedevmarket.net/asset/match-3-game-gems) | ~$5-10 | 78 gem types at 64x64px. 2D art (not pixel) | GOOD for variety — pick best 6 from 78 options |

**Recommendation:** Check your VisuStella packs first (free to you). If they don't work at match-3 scale, the **Rotating Gems** (free, CC0, animated) are the best free option. **Magic Gems** ($5) is the best paid option — low recognition risk, Aseprite sources let you customize.

#### Unit Sprites (Most Important Category)

**FREE:**

| Pack | Source | Details | License | GemWar Fit |
|---|---|---|---|---|
| **Tiny Swords** (Pixel Frog) | [itch.io](https://pixelfrog-assets.itch.io/tiny-swords) | Warrior, Lancer, Archer, Monk. **5 faction colors** (blue/red/purple/yellow/black). Includes terrain, buildings, UI, particle FX. 64x64 grid. Idle/Run/Attack anims | Free commercial use | EXCELLENT roster match but **very widely recognized** in indie games. Top-down perspective (not side-view). Enemy Pack ($15) adds 16 more unit types |
| **CraftPix Tiny Hero Series** | [craftpix.net](https://craftpix.net/freebies/free-tiny-pixel-hero-sprites-with-melee-attacks/) | Multiple free packs: Melee Heroes, Bow Heroes, Assassin/Mage/Viking. 32px, walk/run/attack/die anims | Royalty-free commercial | GOOD — 32px is a nice small scale. Consistent across the series. Less recognized than Tiny Swords |
| **CraftPix Knight Sprites** | [craftpix.net](https://craftpix.net/freebies/free-knight-character-sprites-pixel-art/) | 3 knight color variants, 12 sprite sheets with Defend/Protect/Attack/Death | Royalty-free commercial | MODERATE — good for shield units specifically |
| **LuizMelo Character Packs** | [itch.io](https://luizmelo.itch.io/) | Multiple CC0 packs: Medieval Warrior, Wizard, Evil Wizard, Martial Hero, etc. High-quality pixel art, 13 anim states. ~231x190px (large) | CC0 | GOOD quality but very large sprites need heavy downscaling. One character per pack. **Widely used** in platformers |
| **Tiny Tales packs** *(owned)* | Humble Bundle | Mega Sprite Pack, Human NPC Knights, Human NPC Advanced, 2D Character Generator, Beastmen, Orcs, Dark Elves, etc. | Check license | HIGH for prototype — these are RPGMaker-style top-down sprites. The 2D Character Generator could create custom unit combinations. **Low recognition in browser games** (RPGMaker ecosystem, not typically seen in Phaser/HTML5 games) |

**PAID:**

| Pack | Source | Price | Details | GemWar Fit |
|---|---|---|---|---|
| **Pixel Heroes Animated** | [GameDevMarket](https://www.gamedevmarket.net/asset/pixel-heroes-animated) | $20 | **10 characters:** Archer, Dark Wizard, Fire Wizard, White Wizard, Knight, Spearman, Viking, Thief, Pirate, Naked. **Plus 8 monsters.** 40x32px side-view. **11 anim states** (idle, walk, run, attack x2, block, death, etc.) | EXCELLENT — best roster match for GemWar. Knight=warrior, Viking=shield, Spearman, Archer, 3 Wizard variants. Moderate recognition |
| **RPG Heroes & Enemies** (Overboy) | [itch.io](https://overboy.itch.io/character-pack-02) | ~$14 | 15 characters: 5 archers, 5 heavy warriors, 5 light fighters across Human/Orc/Troll/Demon factions. Idle/Move/Attack/Hit/Dead | GOOD — faction variety is interesting. Missing wizard + spearman. **Same artist as OVERBURN FX** = style consistency |
| **Overboy CHARACTER MEGAPACK** | [itch.io](https://overboy.itch.io/character-megapack) | ~$35 | 50+ animated characters | GOOD if budget stretches — widest variety from one consistent artist |

**Recommendation for units:** Your **Tiny Tales packs** (already owned) are the best starting point for prototype — they're from the RPGMaker ecosystem so very few Phaser/browser games use them, meaning low recognition. For polished art, **Pixel Heroes Animated** ($20) has the best direct roster match to GemWar's unit types. If you want same-artist VFX, the **Overboy** ecosystem (characters + OVERBURN FX) is worth considering despite the gaps.

#### VFX / Projectiles / Spell Effects

**FREE:**

| Pack | Source | Details | License | GemWar Fit |
|---|---|---|---|---|
| **Pimen VFX Collection** (15+ free packs) | [itch.io](https://pimen.itch.io/) | Slashes & Thrusts (20 slashes + 5 thrusts, 48x48), Hit Sparks, Ice/Fire/Thunder/Water/Earth/Wind/Dark/Holy spell effects, Smoke & Dust, Cutting & Healing. All consistent pixel art style | Commercial use allowed | EXCELLENT — this one creator's free packs alone cover nearly every VFX GemWar needs. Elemental types map to gem colors. Moderately recognized but VFX are rarely a recognition issue |
| **Pixel Art Spells — Dungeon Delve** | [OpenGameArt](https://opengameart.org/content/pixel-art-spells) | 16x16 animated projectiles: fireball, ice bolt, arcane ray, lightning, shadow, etc. **Black-and-white base designed to be tinted in-engine** | CC0 | EXCELLENT for projectiles — the tint-in-engine approach is perfect for GemWar's 6 gem colors from one set of sprites |
| **CodeManu Free VFX Packs** | [itch.io](https://codemanu.itch.io/pixelart-effect-pack) + [VFX pack](https://codemanu.itch.io/vfx-free-pack) | 42 total effects across 2 packs: explosions, fireballs, energy bursts. 100x100px | CC-BY 4.0 | GOOD — larger scale, good for explosions and impacts |
| **EVFX Slash + EVFX Sanctuary** *(owned)* | Humble Bundle | Slash effects and magic/sanctuary effects. RPGMaker format sprite sheets | Check license | MEDIUM — check if the scale and format work for Phaser. May need sprite sheet splitting |

**PAID:**

| Pack | Source | Price | Details | GemWar Fit |
|---|---|---|---|---|
| **Pimen Mega Pack Elemental Spell Effects 01** | [itch.io](https://pimen.itch.io/mega-pack-elemental-spell-effects) | ~$13 | 50+ spell animations: Thunder, Fire, Water, Earth, Wind | EXCELLENT — same style as free Pimen packs but much more content. Covers 5 elements |
| **Pimen Mega Pack Spell Effects 02** | [itch.io](https://pimen.itch.io/mega-pack-elemental-spell-effects-02) | ~$21 | 50 more: Ice, Holy, Dark, Acid, Wood | EXCELLENT complement to Pack 01 |
| **OVERBURN FX** (Overboy) | [itch.io](https://overboy.itch.io/overburn-pixel-art-fire-fx-effects) | ~$16 | 120 fire effects, 3000+ frames, **4 color variants** (orange, blue, green, purple). PSD source. 2 bonus characters | STRONG for fire specifically. 4 colors map to gem types. **Same artist as Overboy character packs** |
| **Super Pixel Fantasy FX** (unTied Games) | [itch.io](https://untiedgames.itch.io/) | $5-7 each | Modular: Fantasy FX, Projectiles, Impacts, Explosions as separate packs. Multiple color themes per pack | GOOD — buy exactly what you need. Consistent across the series |

**Recommendation for VFX:** **Pimen's free packs** are the clear winner — they cover almost every element and are consistently styled. Supplement with the Dungeon Delve projectiles (free, tintable). If you want more volume, the **Pimen Mega Pack** ($13) is the best single purchase. Check your **EVFX packs** first since you own them.

#### UI Kits

**FREE:**

| Pack | Source | Details | License | GemWar Fit |
|---|---|---|---|---|
| **CraftPix Basic Pixel Art UI for RPG** | [craftpix.net](https://craftpix.net/freebies/free-basic-pixel-art-ui-for-rpg/) | Windows (settings, shop, victory/defeat), buttons, **health/mana/XP bars**, quick slot bar, icons. PSD + PNG | Royalty-free commercial | EXCELLENT — the health bars and HUD elements are directly useful. PSD files are editable |
| **Kenney UI Pack + RPG Expansion** | [kenney.nl](https://kenney.nl/assets/ui-pack) | 430+ buttons/panels/sliders + 85 RPG elements + 130 adventure elements. Vector/flat style | CC0 | EXCELLENT quality but non-pixel style. Could work as a deliberate "clean UI" design choice alongside pixel game art |
| **Tiny Swords UI** (if using Tiny Swords) | Included in [Tiny Swords](https://pixelfrog-assets.itch.io/tiny-swords) | Banners, ribbons, buttons, health bars, icons | Free commercial | EXCELLENT if you commit to the Tiny Swords aesthetic |

**PAID:**

| Pack | Source | Price | Details | GemWar Fit |
|---|---|---|---|---|
| **CraftPix Game UI Pixel Art** | [craftpix.net](https://craftpix.net/product/game-ui-pixel-art/) | ~$6 | 10 window types, 64 icons (24x24), buttons, loading screen. PSD + PNG | GOOD — more menu-focused than HUD. Complements the free CraftPix RPG UI |

**Recommendation:** The **CraftPix free RPG UI** is the best starting point — it has health bars, which is what you need most. Supplement with Kenney if you want more polished buttons/panels.

#### Recognizability Summary by Pack

| Pack | Recognition Risk | Why |
|---|---|---|
| Tiny Swords (Pixel Frog) | **HIGH** | One of the most popular free game asset packs. Used in countless jam games and tutorials |
| LuizMelo packs | **HIGH** | Extremely popular CC0 packs, seen in many platformers |
| Kenney assets | **HIGH** | The most-used free game assets on the internet |
| Pimen VFX | **MEDIUM** | Popular but VFX is less identifiable than characters |
| CraftPix freebies | **MEDIUM** | Common in indie games |
| Pixel Heroes Animated | **LOW-MEDIUM** | Paid pack, fewer users |
| Magic Gems (Coloritmic) | **LOW** | Niche paid pack |
| Overboy packs | **LOW-MEDIUM** | Paid, smaller audience |
| Your Tiny Tales / VisuStella *(owned)* | **LOW in browser games** | RPGMaker ecosystem — almost never seen in Phaser/HTML5 games. Very common in RPGMaker games specifically |

### 4b-ii. Recommended Combinations

These are complete "shopping lists" that balance coverage, cost, consistency, and your owned assets.

#### Option 1: Maximize Owned Assets ($0) — CONFIRMED VIABLE
| Category | Pack | Cost |
|---|---|---|
| Gems | **VisuStella Minerals** *(owned)* — CONFIRMED excellent. 11 colors, 4 shapes, built-in elemental overlays. 256px scales down perfectly | $0 |
| Units | **Tiny Tales Mega Sprite Pack** *(owned)* — 9 races, 48px. Walk-only but VFX-sell combat works | $0 |
| Elemental units | **Tiny Tales Elementals** *(owned)* — 18 creatures mapping to gem colors. Use for special/powerful units | $0 |
| VFX | **Pimen free packs** (slashes, elemental spells, hit sparks) — EVFX Slash is NOT usable (Effekseer format) | $0 |
| Tilesets | **Tiny Tales Overworld + Dungeon** *(owned)* — battlefield BG + wall segments | $0 |
| UI | CraftPix Free Basic Pixel Art UI for RPG | $0 |
| **Total** | | **$0** |

**Pros:** Completely free. VisuStella gems are genuinely high quality (painted crystals with glow). Elementals give us future color variants for free. Low recognition risk in browser games. Gems have built-in elemental overlays — fire/ice/etc versions already exist.
**Cons:** Style mismatch between painted VisuStella gems and pixel Tiny Tales units — could work if "gems are magical/special" is the visual logic. Walk-cycle-only units need VFX to sell combat. Character Generator (Windows-only) untested.

#### Option 2: Best Unit Roster Match ($25-$38)
| Category | Pack | Cost |
|---|---|---|
| Gems | Magic Gems Pixel Art (Coloritmic) | $5 |
| Units | Pixel Heroes Animated (GameDevMarket) — Knight, Viking, Spearman, Archer, 3 Wizards, 8 monsters | $20 |
| VFX | Pimen free packs (slashes, elemental spells, hit sparks) | $0 |
| VFX upgrade | Pimen Mega Pack Elemental Spell Effects 01 (optional) | $13 |
| UI | CraftPix Free Basic Pixel Art UI for RPG | $0 |
| Tilesets | Tiny Tales Overworld + Dungeon *(owned)* | $0 |
| **Total** | | **$25-38** |

**Pros:** Pixel Heroes has the closest match to GemWar's 9 unit types (warrior, shield, spear, archer, 3 wizard tiers). 11 animation states per character is generous. Side-view perspective. Low recognition risk. Pimen VFX is well-proven.
**Cons:** Units and gems are from different artists (may need color grading to unify). 40x32px units are small.

#### Option 3: Same-Artist Characters + VFX ($24-$35)
| Category | Pack | Cost |
|---|---|---|
| Gems | Magic Gems Pixel Art (Coloritmic) | $5 |
| Units | RPG Heroes & Enemies (Overboy) — 15 characters across factions | $14 |
| VFX | OVERBURN FX (Overboy) — 120 fire effects, 4 colors — **same artist as units** | $16 |
| VFX supplement | Pimen free packs (for non-fire elements: ice, thunder, water) | $0 |
| UI | CraftPix Free Basic Pixel Art UI for RPG | $0 |
| **Total** | | **$35** |

**Pros:** Characters and fire VFX are guaranteed style-consistent (same artist). 4 OVERBURN color variants (orange, blue, green, purple) map to gem colors. Overboy has expansion packs (Megapack, Orcs) if you want more later.
**Cons:** Missing wizard + spearman unit types. Fire-only from Overboy, need Pimen for other elements.

#### Option 4: Free Prototype, Then Upgrade ($0 now, $25-38 later) — SELECTED

**This is the chosen approach.**

| Phase | What | Cost |
|---|---|---|
| **Now** | **VisuStella Minerals** for gems (confirmed excellent) + **Tiny Tales Mega Sprite Pack** for units + **Tiny Tales Elementals** for special/elemental units + **Tiny Tales tilesets** for battlefield/walls + **Pimen free VFX** + CraftPix free UI | $0 |
| **Later** | Pixel Heroes Animated (if walk-only units aren't enough) + Magic Gems (if pixel-style gems preferred over VisuStella painted style) | $25 |
| **Optional** | Pimen Mega Pack VFX | $13 |
| **Total** | | **$0 → $25-38** |

**Pros:** No money spent until the game is playable. Owned assets are stronger than expected — VisuStella gems are high quality with built-in elemental variants, and Elementals give us color-coded units for free. Low recognition risk. May not even need the "Later" purchases if the owned assets look good in-game.
**Cons:** Painted gems vs pixel units style gap (likely fine). Walk-only units need VFX for combat. Two art swaps if we do upgrade later.

**Overall recommendation: Option 4 confirmed.** The asset inspection validated that owned packs are even better than initially expected. The VisuStella minerals with built-in elemental overlays and the Tiny Tales Elementals mapping to gem colors are both wins we didn't anticipate.

### 4c. Your Humble Bundle Assets — Inspection Results

We've downloaded and inspected the most promising packs. Here's what we found:

#### VisuStella Rocks, Ores, and Minerals — EXCELLENT for Gems

**Verdict: Best gem art option. Already owned. Use this.**

- **6,516 PNGs** across 4 mineral shapes (Mineral01_01 through Mineral01_04)
- **11 colors:** Red, Blue, Green, Gold, Violet, Orange, Pink, Black, White, Silver, Brown (we need 6, so we pick the best)
- **Multiple base variants per color:** Base, Sparkling, Cracked, Dirt, Light, Stonebits (~15 combos)
- **Built-in elemental overlays:** fire, ice, plasma, earth, light, dark, water, wind — applied ON the crystals. This is exactly what we planned for future elemental gem variants, and it's already done
- **Individual sprites:** 256x256px painted/illustrated style (not pixel art). Scales down well to 48-64px board size
- **Small atlas:** 288x352px. **Large atlas:** 2304x2816px
- **Style:** High-quality painted crystals with glow effects. Not pixel art, but could work alongside pixel units if we lean into "gems are special/magical" as a visual distinction

**Gem color mapping (recommended):**
| Gem Color | VisuStella Color | Mineral Shape | Notes |
|---|---|---|---|
| Red | Red | Mineral01_01 | Fiery crystal cluster |
| Blue | Blue | Mineral01_03 | Tall angular crystals |
| Green | Green | Mineral01_02 | Pick best shape |
| Yellow | Gold | Mineral01_04 | Upright cluster |
| Purple | Violet | Mineral01_04 | Sparkling variant |
| White | White or Silver | Mineral01_01 | Light base variant |

**Elemental variants (future):** Already built into the pack — each color has fire, ice, plasma, earth, light, dark, water, wind overlays. When we add gem-color-specific attacks, we can swap to the elemental overlay versions with zero additional art cost.

#### EVFX Slash — NOT Directly Usable

**Verdict: Skip for now. Use Pimen free packs instead.**

- VFX stored in `.efkefc` format (Effekseer particle engine for RPGMaker MZ)
- **Not a standard sprite sheet** — requires either the Effekseer runtime or conversion to extract usable frames
- The PNG files included are mostly RPGMaker demo project assets, not the actual slash effects
- 71 OGG sound files are potentially useful as combat SFX, though
- Would require significant conversion work to use in Phaser. Pimen's free VFX packs are a much easier path

#### Tiny Tales 2D Character Generator — Requires Windows

**Verdict: Park this. Try later if you have access to a Windows machine or VM.**

- Windows-only Unity .exe application
- Exports custom sprite sheets to an "Exported" folder
- Could potentially create custom unit combinations (armor, weapons, colors)
- License allows free and commercial use, modification, but no redistribution of the tool itself
- **Not usable on Mac without a VM**

#### Tiny Tales Mega Sprite Pack — Good Prototype Units (Walk Only)

**Verdict: Solid for prototype. Walk-cycle-only limitation manageable with VFX overlays.**

- **3,300 PNGs** across 9 character races: Cat, DarkElf, Fennec, Horned, Human, Mouse, Orc, Squirrel, Vampire
- **48x80px** sprite sheets — RPGMaker-style walk cycles (4 directions x 3 frames = 12 frames per sheet)
- Original folder has individual sprites; RPG Maker folder has 32px and 48px formatted versions
- **Walk cycles only — no attack or death animations.** This is the key limitation
- Clean, consistent pixel art style across all races

**Prototype unit mapping:**
| GemWar Unit | Mega Sprite Character | Notes |
|---|---|---|
| Basic melee | Human warrior variants | Sword-carrying characters |
| Shield Lv2/Lv3 | Orc or Horned variants | Bulkier characters suggest defense |
| Spearman Lv1/Lv2 | DarkElf variants | Taller, leaner look |
| Archer Lv1/Lv2 | Fennec or Cat variants | Smaller, agile look |
| Wizard Lv1/Lv2 | Vampire or robed Human | Magic-user aesthetic |

#### Tiny Tales Elemental NPC — Standout for Elemental Units

**Verdict: Excellent find. These map directly to gem color elements.**

- **18 elemental creatures** — 9 elements with base + Prime (upgraded) variant each
- **Elements:** Fire, Ice, Storm, Water, Wind, Earth, Dark, Light, Nature
- **96x160px** sprite sheets (larger than humanoid sprites — 2x scale, good for "special" units)
- Same walk cycle format (4 directions x 3 frames), no attack anims

**Gem color → Elemental mapping:**
| Gem Color | Elemental | Prime Variant Use |
|---|---|---|
| Red | Fire | Fire Prime = upgraded red units |
| Blue | Ice | Ice Prime = upgraded blue units |
| Green | Nature | Nature Prime = upgraded green units |
| Yellow | Storm | Storm Prime = upgraded yellow units |
| Purple | Dark | Dark Prime = upgraded purple units |
| White | Light | Light Prime = upgraded white units |

**Use case options:**
1. **Elemental unit variants** — When gem colors gain identity, swap humanoid units for elementals of that color
2. **Special units from L/T matches** — Elementals could represent the more powerful spearman/archer/wizard spawns (their larger sprite size reinforces their power)
3. **"Summoned creature" overlay** — Elementals march alongside humanoid units as magical companions

#### Tiny Tales Magitek Dynasty NPC — Supplemental

**Verdict: Nice to have. Good for faction variety later.**

- 19 human characters across Dynasty, Empire, Noble faction variants
- Same 48x80px walk cycle format
- Could serve as a second faction set if we want human vs human visual distinction
- Less immediately useful than Mega Sprite Pack or Elementals

#### Tiny Tales Tilesets (Overworld + Dungeon)

**Verdict: Useful for battlefield and board backgrounds.**

- **Overworld (149 PNGs):** Hills, Desert, Snow, Towns, Villages, Exteriors, Interiors
- **Dungeon (176 PNGs):** Fortress, CityWalls, Mines, TechFortress
- Tiled-compatible format with sample .tmx maps
- 256x256px tileset images

**GemWar uses:**
| Tileset | Use | Notes |
|---|---|---|
| Overworld Hills | Battlefield background | Green grass/hills tiling vertically. Natural "warzone" feel |
| Dungeon Fortress | Wall segments, board frame | Stone walls and fortification tiles. Could build wall segments from these |
| Dungeon CityWalls | Alternative wall art | Defensive wall assets |
| Overworld Snow/Desert | Future battlefield themes | Alternate visual themes if we add maps |

#### Tyrian Remastered Graphics — Not Useful
- 47 sci-fi ship sprite sheets. Wrong genre entirely. Skip.

#### The Walk-Cycle-Only Problem & Solutions

The biggest limitation across all Tiny Tales packs is **walk cycles only — no attack or death animations**. For GemWar's combat units, here are the options ranked by effort:

1. **VFX-sell combat (recommended for prototype):** Units walk, and when they fight, overlay slash/hit/explosion VFX from Pimen packs + screen flash + damage numbers. Many successful games do this. The "combat" is sold by the effects, not unit animation
2. **Use Elementals for combat units:** A fire elemental "attacking" reads fine with just a particle burst — no swing animation needed. Reserve humanoids for marching, elementals for fighting
3. **Frame-hack attacks:** Take the side-facing walk frame and overlay weapon-swing VFX. Cheap but can look okay
4. **Character Generator (Windows):** If it supports attack frames, this solves everything. Need Windows to test
5. **Commission attack frames later:** Match the Tiny Tales style. 9 units x 1 attack anim each = small focused commission

#### Other Owned Packs (Not Yet Inspected)

| Pack | Expected Use | Priority to Inspect |
|---|---|---|
| **VisuStella Armory: Jewelry Vol.01** | Alternative gem sprites (jewelry style) | LOW — Minerals pack already covers gems well |
| **EVFX Sanctuary** | Magic/healing VFX | LOW — same Effekseer format issue as EVFX Slash |
| **Tiny Tales: Human NPC Knights** | More knight/warrior unit sprites | MEDIUM — could add shield/melee variety |
| **Tiny Tales: Human NPC Advanced** | More unit variety | MEDIUM |
| **Tiny Tales: Beastmen, Orcs, Dark Elves** | Additional race variants | LOW — Mega Sprite Pack already has 9 races |
| **Tyler Warren RPG Battlers Pixel Style** | Battler-format sprites | LOW — wrong perspective for overworld units |
| **Cursed Kingdoms / Valor and Villainy Music** | Background music | HIGH — inspect when ready for audio |
| **Cute Game Sounds / Beast Sounds** | SFX | MEDIUM |

### 4d. Contract Artist (Targeted Gap-Filling)

Commissioning custom art makes the most sense for specific gaps that asset packs can't fill — not as a wholesale approach at a low budget. Cheap commissions ($50-200) are hit-or-miss, and you often get what you pay for. Save commissions for when you know exactly what you need and can't find it pre-made.

**Best use cases for commissions in GemWar:**
- **Elemental weapon overlays** — 6 small effects (fire tip, ice tip, etc.) that layer on top of asset-pack units. Very small scope, easy to spec
- **Custom gem designs** — If you want gems that are uniquely "GemWar" and can't find a pack you love. 6 sprites is a manageable commission
- **A specific unit that doesn't exist** — If your unit pack covers 7 of 9 types but is missing "spearman," commission just that gap in the same style
- **Logo and title treatment** — Hard to find pre-made, quick commission

**Where to find artists (when the time comes):**
- **itch.io asset creators** — Many take commissions and already understand game art constraints. Best bet: find an artist whose existing packs you like, and commission matching pieces
- **r/gameDevClassifieds** — Reddit board for game dev hiring
- **Twitter/X #pixelart** — Large community, many artists open for commissions
- **Fiverr** — Convenient but quality is unpredictable. Look for artists with game art in their portfolio

**Tips:**
- Provide reference art (screenshots from your game with the asset-pack art in place) so they can match the existing style
- Ask for source files (Aseprite .ase) so you can make tweaks or recolor yourself
- Commission from the same artist who made your asset pack if possible — guaranteed style match
- Keep commissions focused and small-scope until you find an artist you trust

---

## 5. Recommended Approach

### Right Now (Week 1-2): Zero-Cost Prototype Art (Concrete Plan)
1. **Gems:** VisuStella Minerals — pick 6 colors (Red, Blue, Green, Gold, Violet, White), use Base_Sparkling variants, downscale from 256px to ~48-64px. Use individual PNGs not atlases
2. **Units:** Tiny Tales Mega Sprite Pack — Human warriors for melee, Orcs for shields, DarkElf for spearmen, Fennec for archers, Vampire for wizards. 48px sprites, walk cycle only
3. **Special units (L/T matches):** Tiny Tales Elementals — Fire=red, Ice=blue, Nature=green, Storm=yellow, Dark=purple, Light=white. Their larger size (96px) naturally communicates "more powerful"
4. **Battlefield:** Tiny Tales Overworld Hills tileset, tiled vertically
5. **Wall:** Tiny Tales Dungeon Fortress tileset — stone wall segments
6. **FX:** Pimen free packs (slashes, hit sparks, elemental spells) + Phaser particle emitters
7. **Projectiles:** Code-driven colored shapes with particle trails for now. Pimen elemental spells can upgrade this later
8. **UI:** Minimal — CraftPix free RPG UI for health bars, code-drawn for the rest
9. **Elemental gem variants:** Already available in VisuStella (fire/ice/plasma overlays on crystals). Not needed yet but zero-cost when ready
10. **Combat selling:** Walk → stop → overlay Pimen slash/hit VFX → damage numbers → unit disappears. No attack animation needed

### Month 1-2: Audit Owned Assets + Browse Packs
1. Download and audit your Humble Bundle packs — especially Tiny Tales Character Generator, VisuStella Rocks/Minerals, VisuStella Jewelry
2. Browse itch.io, craftpix, and gamedevmarket for unit packs and gem packs. Bookmark candidates, don't buy yet
3. Generate AI concept art for the overall visual direction (mood boards) — use this to guide pack selection
4. Test 1-2 free packs in-game to get a feel for what pixel scale and style works at your board/battlefield size
5. **Important decision:** Confirm the target pixel scale (16px, 32px, 48px per unit). This constrains all future purchases

### Month 2-3: Buy Packs + Fill Gaps
1. **Buy the unit pack first** — this is the style anchor. Everything else should match it
2. Buy a gem pack (or use VisuStella minerals if they work)
3. Buy an FX pack if EVFX packs don't fit the scale
4. Use free Kenney UI pack or buy a matching pixel UI pack
5. Implement the elemental tint/overlay system in code — even with placeholder colored circles on weapon tips, this validates the approach
6. Identify specific gaps that packs didn't cover

### Month 3+: Targeted Polish
1. Commission small, focused pieces for gaps: elemental overlays, missing unit types, custom gem design if desired
2. AI-generate splash art / portraits for menus and victory screens
3. Polish UI, add screen transitions, refine particle FX

### If the Game Proves Out: Full Investment
1. Commission a full art pass from one artist ($1-3k) for a unique visual identity — or stick with polished asset-pack art if it looks good
2. Commission a second faction's unit set for variety
3. Expand elemental overlays into fully distinct color variants if the game warrants it

---

## 6. Priority Order for Art Investment

If you're spending money, spend it in this order (most visible/impactful first):

1. **Gems** — The player stares at these the entire game. They must look great and be instantly readable
2. **Units** — The battlefield is the "cool" part of the game. Distinct, readable unit sprites sell the fantasy
3. **Combat/Match FX** — Juice makes the game feel good. Particle effects + screen shake go a long way with minimal art
4. **UI** — Clean UI signals quality. A good font + simple frames go far
5. **Battlefield background** — Important but a single good tileable texture handles this
6. **Wall** — Functional, doesn't need to be fancy
7. **Portraits/splash** — Nice to have, not critical for gameplay