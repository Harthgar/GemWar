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
| **Combat FX** | EVFX packs (owned) + FX asset pack | Your EVFX Slash and Sanctuary packs + supplement with a dedicated pixel FX pack | $0-15 |
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
| **VisuStella Rocks, Ores, Minerals** *(owned)* | Humble Bundle | 1.9 GB — likely contains many mineral/gem sprites at RPGMaker icon size | Check license | MEDIUM-HIGH — inspect these first, may already solve the problem |
| **VisuStella Jewelry Vol.01** *(owned)* | Humble Bundle | 381 MB of jewelry sprites | Check license | MEDIUM-HIGH — same as above |

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

#### Option 1: Maximize Owned Assets ($0-$5)
| Category | Pack | Cost |
|---|---|---|
| Gems | VisuStella Rocks/Minerals or Jewelry *(owned)* — check first. Fallback: Rotating Gems (OpenGameArt, CC0) | $0 |
| Units | Tiny Tales Mega Sprite Pack + Knights + Character Generator *(owned)* | $0 |
| VFX | EVFX Slash + Sanctuary *(owned)* + Pimen free packs (supplement) | $0 |
| UI | CraftPix Free Basic Pixel Art UI for RPG | $0 |
| Gems fallback | Magic Gems (Coloritmic) if VisuStella doesn't work at match-3 scale | $5 |
| **Total** | | **$0-5** |

**Pros:** Zero/near-zero cost. Your Humble Bundle packs are from the RPGMaker ecosystem so they're unlikely to be recognized in a browser game. Good enough for prototype and possibly beyond.
**Cons:** RPGMaker-style sprites may feel dated or have a specific "look." VisuStella gems may not work at small board scale. Need to audit all packs first.

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

#### Option 4: Free Prototype, Then Upgrade ($0 now, $25-38 later)
| Phase | What | Cost |
|---|---|---|
| **Now** | Tiny Tales units *(owned)* + Rotating Gems (CC0) + Pimen free VFX + CraftPix free UI | $0 |
| **Later** | Pixel Heroes Animated + Magic Gems (replace prototype art) | $25 |
| **Optional** | Pimen Mega Pack VFX | $13 |
| **Total** | | **$0 → $25-38** |

**Pros:** No money spent until the game is playable and you know what you actually need. Owned Tiny Tales assets are low-recognition in browser games. Upgrade path is clear.
**Cons:** Two art swaps (prototype → final) means integration work twice.

**Overall recommendation: Option 4.** Start with your owned assets (zero cost, low recognition risk), get the game playable, then upgrade to Pixel Heroes + Magic Gems once you've confirmed the game is worth investing in.

### 4c. Your Humble Bundle Assets

**Most useful for GemWar:**

| Pack | Use Case | Fit |
|---|---|---|
| **Tiny Tales: Mega Sprite Pack** | Unit sprites (walk cycles, varied characters) | HIGH — great for prototype units |
| **Tiny Tales: Human NPC Knights Sprite Pack** | Shield units, melee units | HIGH |
| **Tiny Tales: Human NPC Advanced Sprite Pack** | More unit variety | HIGH |
| **Tiny Tales Overworld Tileset Pack** | Battlefield background | MEDIUM |
| **Tiny Tales Dungeon Tileset Pack** | Board frame / background | MEDIUM |
| **Tiny Tales: 2D Character Generator** | Generate custom unit sprites | HIGH — could create all unit types |
| **Tiny Tales 2D Battler Packs (Vol 1-5)** | Battle portraits, enemy art | LOW (battler-style, not overworld) |
| **EVFX Slash** | Melee combat effects | MEDIUM — check if scale works |
| **EVFX Sanctuary** | Magic/healing effects | MEDIUM |
| **EasySTAR Animations - Astrology** | Magic attack FX? | LOW — probably too specific |
| **VisuStella Atelier: Rocks, Ores, and Minerals** | Gem sprites! | MEDIUM-HIGH — check if style/size works for match-3 gems |
| **VisuStella Armory: Jewelry Vol.01** | Alternative gem sprites | MEDIUM-HIGH |
| **Tyler Warren RPG Battlers Pixel Style** | Unit sprites (battler format) | LOW — battler style, not overworld |
| **Cursed Kingdoms / Valor and Villainy Music** | Background music | HIGH |
| **Cute Game Sounds / Beast Sounds** | SFX | MEDIUM |

**Top recommendation:** Download and inspect the **Tiny Tales: 2D Character Generator** first. If it lets you create custom sprite sheets for different unit types (melee, archer, mage, spear), it could single-handedly solve your unit art problem for the prototype. Also check the **VisuStella Rocks/Ores/Minerals** and **Jewelry** packs for gem sprites.

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

### Right Now (Week 1-2): Zero-Cost Prototype Art
1. **Gems:** Colored geometric shapes (code-drawn circles/diamonds with distinct silhouettes)
2. **Units:** Pull from Tiny Tales Mega Sprite Pack + Knights pack. Map unit types to existing characters
3. **Battlefield:** Tiny Tales Overworld tileset, tiled vertically
4. **Wall:** Simple stone block sprite from Tiny Tales Dungeon tileset
5. **FX:** Phaser particle emitters (code-only, no sprites needed)
6. **UI:** Minimal — text + colored rectangles
7. **Elemental colors:** Not yet — all units are generic. Plan the overlay/tint system in code so it's ready when art arrives

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