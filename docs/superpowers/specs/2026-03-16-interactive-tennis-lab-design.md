# Design: Interactive Tennis Lab — PWA with Match Intelligence, Court-Side Tools, and Science Visualizations

**Date:** 2026-03-16
**Status:** Approved
**Scope:** Transform the 25-page static tennis guide into an interactive, offline-capable PWA with match tracking, court-side tools, and science visualizations.

---

## Context

The site is a Next.js 16 static export (`output: "export"`) deployed on Vercel. It has 25 MDX content pages covering technique, strategy, conditioning, mental game, and recovery for 4.0→4.5 NTRP players. Current stack: React 19, Tailwind v4, next-mdx-remote, remark-gfm. No backend, no database, no auth.

The goal is to add 17 interactive features across three bundles while preserving the static export, zero-cost hosting, and adding offline capability via PWA.

---

## Architecture

### Approach: PWA-First Static App (Client-Only)

All state lives in the browser. No backend, no accounts, no database. IndexedDB for structured data, service worker for offline caching.

```
┌─────────────────────────────────────────────────────────┐
│                  VERCEL (Static Export)                   │
├──────────────┬──────────────┬───────────────────────────┤
│ 25 Content   │ Interactive  │ Match Intelligence        │
│ Pages (MDX)  │ Tools        │ Dashboard                 │
│              │              │                           │
│ Existing     │ Spin Viz     │ Match Logger              │
│ pages        │ Serve Sim    │ Pattern Dashboard         │
│ unchanged    │ Grip Explorer│ Trend Charts              │
│              │ Power Calc   │ Recommendations           │
│              │ Chain Seq    │ Season Overview            │
├──────────────┴──────────────┴───────────────────────────┤
│              Court-Side Toolkit (Phone UI)                │
│ Serve Randomizer · Drill Timer · Flashcards              │
│ Quick Ref · Routine Timer · Warm-Up Flow                 │
├──────────────────────────────────────────────────────────┤
│                  Shared Client Layer                      │
│ Dexie.js (IndexedDB) · React Components · Service Worker │
├──────────────────────────────────────────────────────────┤
│                    PWA Manifest                           │
│ Installable · Offline · Home Screen · Standalone Display  │
└──────────────────────────────────────────────────────────┘
```

### Key Decisions

1. **Static export preserved.** No server, zero cost, deploys in seconds. All interactivity is client-side.
2. **Dexie.js for storage.** Typed IndexedDB wrapper. Handles match logs, flashcard state, drill history. Survives browser updates, no practical size limits.
3. **PWA = phone app.** Add to home screen, full-screen mode, works offline at the court. Feels native.
4. **Tools as pages.** Each tool is a standard Next.js page with `"use client"` directive. Lives in the existing sidebar with 3 new nav groups.
5. **Three.js only for spin visualizer.** Code-split to that page only (~50KB). All other tools use SVG, Canvas, or pure React state.

### New Nav Groups

```
Interactive Tools — Spin Visualizer, Serve Simulator, Grip Explorer, Power Calculator, Chain Sequencer
Court-Side       — Drill Timer, Serve Randomizer, Flashcards, Quick Reference, Routine Timer, Warm-Up
My Tennis        — Match Log, Dashboard, Trends, Season Overview
```

---

## Data Layer

### IndexedDB Schema (Dexie.js)

```typescript
// lib/db.ts
import Dexie, { type Table } from 'dexie';

interface Match {
  id?: number;
  date: Date;
  opponent?: string;
  format: 'best-of-3' | '8-game-pro' | 'tiebreak-set';
  score: string;
  won: boolean;
  surface: 'hard' | 'clay' | 'indoor';
  composure: number; // 1-10
  firstServe?: number; // percentage estimate
  doubleFaults?: number;
  strengths: string[]; // tags
  weaknesses: string[]; // tags
  notes?: string;
}

interface Flashcard {
  id: string; // sourcePage + section slug
  front: string;
  back: string;
  sourcePage: string;
  ease: number; // SM-2 default 2.5
  interval: number; // days
  nextReview: Date;
  repetitions: number;
}

interface DrillLog {
  id?: number;
  date: Date;
  drill: string;
  sourcePage: string;
  duration: number; // seconds
  notes?: string;
}

interface Settings {
  key: string;
  value: string | number | boolean;
}

class TennisDB extends Dexie {
  matches!: Table<Match>;
  flashcards!: Table<Flashcard>;
  drillLogs!: Table<DrillLog>;
  settings!: Table<Settings>;

  constructor() {
    super('tennis-lab');
    this.version(1).stores({
      matches: '++id, date, won, surface',
      flashcards: 'id, sourcePage, nextReview',
      drillLogs: '++id, date, drill',
      settings: 'key',
    });
  }
}

export const db = new TennisDB();
```

### Tag System

15 predefined tags for match logging, each mapping to 1-2 content pages and specific drills:

| Tag | Content Pages | Drill Links |
|---|---|---|
| Forehand | Groundstrokes | Cross-Court 20, Speed Ladder Rally |
| Backhand | Groundstrokes | Backhand cross-court game, Figure-8 |
| First Serve | Technique, Serve Types | Target practice (Training) |
| Second Serve | Serve Types (kick section) | Pressure serve drill (Training) |
| Return | Return of Serve | Serve Return Reaction (Footwork Drills) |
| Net Game | Upper Body (volley section) | Approach-Split-Volley (Footwork Drills) |
| Footwork | Footwork | X-Drill, Fan Drill (Footwork Drills) |
| Composure | Mental Game | Between-point routine, pressure games |
| Shot Selection | Strategy & Tactics | 3-shot pattern drill (Groundstrokes) |
| Consistency | Groundstrokes | Deep Zone Rally, Cross-Court 20 |
| Tiebreaks | Mental Game (tiebreak section) | First-to-7 tiebreak practice |
| Big Points | Mental Game (pressure section) | Must-win games, consequence games |
| Depth | Groundstrokes, Momentum & Force | Deep Zone Rally (Groundstrokes) |
| Aggression | Advanced Strategy | First-Strike Drill (Groundstrokes) |
| Patience | Strategy & Tactics | Rally construction (Groundstrokes) |

---

## Feature Specifications

### Bundle A: Match Intelligence Engine

#### Post-Match Logger
- Mobile-first form, completable in under 2 minutes
- Fields: date (auto), score (set inputs), result (won/lost toggle), composure (1-10 tap scale), first serve % (text input), double faults (number), strength tags (multi-select from predefined list), weakness tags (multi-select), free-text notes
- Saves to IndexedDB `matches` table
- Confirmation screen with quick stats after save

#### Pattern Dashboard
- Requires 5+ logged matches before showing insights
- Stat cards: total matches, win rate, average composure, average first serve %
- Pattern insights: auto-generated from tag frequency analysis
  - "Second Serve tagged as weakness in X of Y matches (Z%)" with link to relevant content
  - "Composure drops in deciding sets" (compare composure in 3rd sets vs 1st sets)
  - "Tiebreak record: X-Y" with link to Mental Game tiebreak section
- Weakness-to-content linker: each weakness tag surfaces direct links to relevant pages and drills
- Practice recommender: rule-based, reads last 5 matches, suggests 3 focus areas with specific drill links

#### Trend Charts
- Win rate over time (bar chart, green/red)
- Composure trend (line chart)
- First serve % trend (line chart)
- Built with custom SVG charts (avoid Recharts dependency — chart types are simple enough: bar, line). If chart complexity grows beyond 3 types, reconsider Recharts.
- Time range selector: last 10, last 20, all matches

#### Season Overview
- Monthly/quarterly rollups
- Total matches, W/L record, improvement areas
- Streaks (win/loss), personal bests
- Requires 10+ matches for quarterly view

### Bundle B: Court-Side Toolkit

#### Drill Timer
- Select a drill from a predefined list (sourced from content pages)
- Configurable sets, reps, work time, rest time
- Visual countdown with current instruction and next-up preview
- Audio beeps at transitions (Web Audio API)
- Works with screen off (audio continues)
- Logs completed drills to IndexedDB `drillLogs` table

#### Serve Target Randomizer
- Interactive court diagram (SVG)
- Tap button generates random target: T/body/wide × deuce/ad × flat/slice/kick
- Visual highlight on court diagram
- Streak counter (consecutive serves to target — self-reported tap)
- Session stats: total serves, % to target
- Large tap targets for one-handed phone use

#### Technique Flashcards
- Cards auto-generated from key cues across all 25 content pages
- Initial deck: ~100-150 cards, hand-authored as a static JSON file (`content/flashcards.json`). Each card references its source page. Cards are bundled at build time, not dynamically extracted from MDX.
- SM-2 spaced repetition algorithm:
  - After reveal, rate: Again (ease×0.8, interval=1) / Hard (interval×1.2) / Good (interval×ease) / Easy (interval×ease×1.3)
  - Ease minimum 1.3, default 2.5
- Daily session: configurable 10-20 cards (from settings)
- Progress stored in IndexedDB `flashcards` table
- Source page attribution on each card

#### Quick Reference Sheets
- One-screen summary per content page
- Key cues, checklists, and critical numbers hand-authored as a static JSON file (`content/quick-refs.json`), one entry per content page. Same authoring approach as flashcards.
- Swipeable between pages
- Designed for glancing at during changeovers (large text, high contrast)

#### Between-Point Routine Timer
- 20-second countdown divided into 4 phases (from Mental Game page):
  - Phase 1: Positive Physical Response (0-5s)
  - Phase 2: Relaxation Response (5-10s)
  - Phase 3: Preparation (10-16s)
  - Phase 4: Ritual (16-20s)
- Visual phase progression bar
- Breathing guide in Phase 2 (inhale 4, exhale 6)
- Haptic feedback at phase transitions (Vibration API)
- Tap to start, auto-resets for next point

#### Warm-Up Flow
- Guided 10-15 minute pre-match warm-up from Conditioning page
- Step-by-step checklist with timer per exercise
- Audio cue at each step transition
- Skip/extend controls per step

### Bundle C: Interactive Science Lab

#### Spin Visualizer
- Three.js WebGL scene: 3D tennis ball, court surface, net, trajectory arc
- Controls: spin type (topspin/slice/flat/kick), spin rate (500-5000 RPM slider), ball speed (60-200 km/h slider), net clearance
- Real-time trajectory update using Magnus effect physics from Momentum & Force page
- Computed outputs: bounce height, landing depth, curve amount, vertical margin
- Rotatable/zoomable camera
- Code-split: Three.js bundle loads only on this page (~50KB)

#### Serve Placement Simulator
- Interactive SVG court diagram
- Controls: court side (deuce/ad), serve type (flat/slice/kick)
- Heat-mapped target zones with ATP win percentages (from Strategy page data)
- Serve+1 pattern arrows showing optimal follow-up
- Info panel with strategy explanation and links to relevant content pages
- No external dependencies (pure SVG + React state)

#### Grip Explorer
- SVG racket handle cross-section (8-bevel octagon)
- Tap a bevel → highlight, show grip name, recommended shots, racket face angle preview
- Rotatable 360 degrees
- Shot recommendation panel links to Groundstrokes and Serve Types pages
- No external dependencies

#### Power Calculator
- Reactive input form: racket speed, racket mass, string tension, spin rate
- Physics formulas from Momentum & Force page:
  - Ball speed = f(racket speed, mass, COR)
  - Contact force = impulse / contact time (4.5ms)
  - Energy efficiency = KE_ball / KE_racket
- Side-by-side comparison mode (two configurations)
- No external dependencies (pure math)

#### Kinetic Chain Sequencer
- Visual timeline with draggable bars for: hips, trunk, upper arm, forearm, racket
- Drag to adjust segment timing
- Correct sequential timing: green indicators, high computed racket speed
- Simultaneous firing: red indicators, lower speed with explanation
- Reset to optimal / reset to simultaneous presets
- Based on timing diagrams from Full-Body Integration page
- HTML Canvas or pure CSS + pointer events

---

## PWA Configuration

### Manifest
```json
{
  "name": "Tennis Lab — 4.0 to 4.5",
  "short_name": "Tennis Lab",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1c1917",
  "theme_color": "#dc2626",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Strategy
- **Cache-first** for static content pages (MDX-rendered HTML)
- **Cache-first** for tool pages, JS bundles, CSS, fonts, images
- **Network-first** for nothing (fully static site)
- **Offline fallback** page if uncached route requested offline
- Precache all 25 content pages + all tool pages on first visit
- **Cache invalidation:** Use Workbox with revision hashes generated at build time. On each deploy, the service worker compares manifest hashes and updates only changed assets. Users see updates on next visit after the SW activates.

### Dependencies Added

| Package | Purpose | Size Impact |
|---|---|---|
| dexie | IndexedDB wrapper | ~15KB gzipped |
| three | 3D rendering (spin visualizer only) | ~50KB gzipped, code-split |
| (no chart library) | Custom SVG charts — simple bar/line types only | 0KB |
| workbox (or custom SW) | Service worker utilities | Build-time only |

Total added client bundle (excluding code-split Three.js): ~40KB gzipped.

---

## Build Phases

### Phase 0: Foundation
- PWA manifest + service worker
- Dexie.js data layer (schema, hooks, typed access)
- Shared component library (Timer, SliderInput, CourtDiagram, TagSelector)
- New nav groups in sidebar
- `"use client"` page wrapper pattern for interactive pages
- PWA icon generation

### Phase 1: Match Intelligence
- Post-Match Logger
- Pattern Dashboard
- Trend Charts
- Weakness-to-Content Linker
- Practice Recommender

### Phase 2: Court-Side Toolkit
- Drill Timer (with Web Audio API cues)
- Serve Target Randomizer (with streak tracking)
- Between-Point Routine Timer (4-phase, haptic)
- Warm-Up Flow (checklist + timer)

### Phase 3: Interactive Science Lab
- Spin Visualizer (Three.js)
- Serve Placement Simulator (SVG)
- Grip Explorer (SVG)
- Power Calculator (pure math)
- Kinetic Chain Sequencer (Canvas/CSS)

### Phase 4: Knowledge System
- Technique Flashcards (SM-2 spaced repetition)
- Quick Reference Sheets (per-page summaries)
- Season Overview (monthly/quarterly rollups)

Each phase ships independently and delivers usable value before the next begins.

**Nav group phasing:** Nav entries are added only when their features ship. Phase 0 adds the "My Tennis" group (empty until Phase 1 populates it). "Court-Side" nav group appears with Phase 2. "Interactive Tools" appears with Phase 3. Flashcards and Quick Reference are added to "Court-Side" in Phase 4. No stub/empty pages.

---

## Design Principles

1. **Phone-first for court tools.** Minimum 48px tap targets, high contrast, one-handed usability, audio/haptic cues.
2. **Offline-first.** Every feature works without network. Service worker caches all pages and assets.
3. **Content-connected.** Every tool links back to the relevant content page. Weakness tags map to specific pages and drills. The content is the knowledge base; the tools make it actionable.
4. **Progressive enhancement.** The 25 content pages work exactly as before. Interactive features are additive — if JS fails or IndexedDB is unavailable, the guide still functions.
5. **Minimal dependencies.** Three.js is the only heavy dep, code-split to one page. Everything else is SVG, Canvas, or pure React.

---

## Out of Scope

- Backend / API routes
- User authentication / accounts
- Cloud sync / cross-device data
- Social features / leaderboards
- AI-powered coaching (Claude API integration)
- Video upload / analysis

These can be added later as a backend layer without rebuilding the client architecture.
