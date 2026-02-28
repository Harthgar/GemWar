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

### 4b. Asset Packs (Primary Strategy)

Asset packs are the sweet spot for GemWar: professional quality art at a fraction of commission cost, available immediately, and often from artists who specialize in game-ready sprites. The key challenge is finding packs that are internally consistent and cover enough of your needs.

**Where to shop:**

| Marketplace | Strengths | Price Range | License Notes |
|---|---|---|---|
| **itch.io** | Largest selection, many free packs, active community. Best for pixel art | Free - $30 per pack | Varies per pack — always check. Most paid packs allow commercial use |
| **Craftpix.net** | Curated, high quality. Good search/filtering. Many complete "sets" | Free - $30 per pack, bundles $15-50 | Commercial license included with paid packs |
| **GameDevMarket.net** | Curated marketplace, RPG-heavy catalog | $5-40 per pack | Commercial license included |
| **Kenney.nl** | Excellent quality, all CC0 (no attribution needed). More vector/modern style | Free | CC0 — use for anything, no restrictions |
| **OpenGameArt.org** | Large free library. Quality varies widely | Free | Mixed licenses — check each asset |

**What to search for (by GemWar category):**

**Gems / Match-3:**
- Search: "gems sprites", "jewels pixel art", "match 3 assets", "crystals game assets"
- What you need: 6+ distinct gem designs at 32-64px, ideally with animation frames
- Many match-3 asset packs exist because it's a popular genre — you may find complete kits with gems + board + FX

**Units (most important pack purchase):**
- Search: "pixel RPG characters", "fantasy warriors sprite sheet", "medieval unit sprites", "RTS pixel units"
- What you need: warrior, shield, spearman, archer, wizard archetypes — each with idle/walk/attack/death
- **Key tip:** Look for packs from a single artist that cover multiple unit types. A "medieval army pack" or "fantasy troops pack" is ideal. Avoid mixing unit packs from different artists
- Good sign: the pack page shows a sprite sheet with multiple character types in the same pixel scale and style

**FX / Projectiles:**
- Search: "pixel VFX", "pixel art effects", "magic spells pixel", "projectile sprites"
- These packs are often very comprehensive (50-100+ effects) and cheap ($5-15)
- Look for packs that include: projectiles, impacts, elemental effects (fire/ice/lightning), hit sparks

**UI:**
- Search: "pixel UI kit", "RPG interface", "game UI pixel art"
- Kenney's free UI packs are hard to beat, but they're not pixel-art style
- For pixel style: many $5-15 packs on itch.io include buttons, frames, health bars, panels

**Tilesets / Backgrounds:**
- You likely already have this covered with your Tiny Tales packs
- If not: search "pixel tileset fantasy", "battlefield background pixel"

**Buying strategy:**
1. **Prioritize single-artist coverage.** If one artist sells a unit pack, a gem pack, AND a UI pack, buy all three. Consistent style across categories is worth a small premium
2. **Check the artist's full catalog.** Many itch.io artists have a "fantasy" line with matching characters, tilesets, and UI. Buying within one line guarantees visual cohesion
3. **Buy the unit pack first.** Units are the hardest to find in the right style/coverage. Once you've committed to a unit pack's art style, match everything else to it
4. **Free packs for prototyping, paid packs for polish.** Don't buy until you know what style direction you want. Use free packs to test what "feels right" in-game first
5. **License audit.** Before committing, verify every pack allows commercial use. Most paid packs do, but free packs vary

**Artists/lines worth investigating on itch.io:**
_(These are starting points — browse their full catalogs to see if they cover multiple categories)_
- Search for artists who produce "medieval" or "fantasy" pixel art with multiple packs in the same style
- Look at the "Top Sellers" and "Most Popular" sections under Game Assets > Sprites on itch.io
- Many prolific pixel artists (like Szadi Art, Sanctum Pixel, Cainos, etc.) have extensive catalogs where units, tilesets, and UI all match

**The consistency problem:**
The biggest risk with asset packs is mixing styles. Mitigate this by:
- Buying from as few artists as possible (ideally 1-2)
- Ensuring pixel scale matches across packs (e.g., all 32x32 or all 48x48 characters)
- Using color grading / palette reduction in code to unify disparate packs (Phaser tint or a shader)
- Accepting that "close enough" is fine for a prototype — players are more forgiving than you think

### 4b-ii. Free Assets (supplementary)

Free assets are still valuable for filling gaps where you don't want to spend money:
- **Kenney.nl** — Best free game assets on the internet. CC0 license. Strong for UI, weaker for pixel RPG characters
- **OpenGameArt.org** — Hit or miss quality. Good for placeholder and SFX
- **Freesound.org** — Excellent for SFX (not visual art)

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