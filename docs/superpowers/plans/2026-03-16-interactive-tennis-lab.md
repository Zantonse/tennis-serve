# Interactive Tennis Lab Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 25-page static tennis guide into an interactive PWA with match tracking, court-side tools, and science visualizations — 17 features across 5 phases.

**Architecture:** PWA-first static app. All state in IndexedDB (Dexie.js), offline via service worker, installable on phone. Next.js 16 static export preserved. Each tool is a `"use client"` page in the existing routing.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Dexie.js, Workbox, Three.js (spin visualizer only), custom SVG charts, Web Audio API, Vibration API.

**Spec:** `docs/superpowers/specs/2026-03-16-interactive-tennis-lab-design.md`

---

## File Structure

### New Files (by phase)

**Phase 0 — Foundation:**
```
lib/db.ts                           # Dexie database, schema, types
lib/tags.ts                         # Tag-to-content page mapping
lib/hooks/useDB.ts                  # React hooks for DB operations
components/tools/Timer.tsx           # Reusable countdown timer
components/tools/SliderInput.tsx     # Labeled range slider
components/tools/CourtDiagram.tsx    # SVG tennis court
components/tools/TagSelector.tsx     # Multi-select tag chips
components/tools/ToolPageShell.tsx   # Shared tool page layout
components/RegisterSW.tsx            # Service worker registration (client component)
app/(tools)/layout.tsx               # Tool pages layout
public/manifest.json                 # PWA manifest
public/sw.js                        # Service worker
public/icons/icon-192.png           # PWA icons
public/icons/icon-512.png
public/offline.html                 # Offline fallback
```

**Phase 1 — Match Intelligence:**
```
app/(tools)/match-log/page.tsx       # Post-match logger form
app/(tools)/dashboard/page.tsx       # Pattern dashboard
app/(tools)/trends/page.tsx          # Trend charts
app/(tools)/season/page.tsx          # Season overview
lib/match-analysis.ts                # Insight computation
components/tools/BarChart.tsx        # Custom SVG bar chart
components/tools/LineChart.tsx       # Custom SVG line chart
```

**Phase 2 — Court-Side Toolkit:**
```
app/(tools)/drill-timer/page.tsx     # Drill timer
app/(tools)/serve-random/page.tsx    # Serve target randomizer
app/(tools)/routine-timer/page.tsx   # Between-point routine timer
app/(tools)/warmup/page.tsx          # Warm-up flow
lib/drills.ts                        # Drill definitions
lib/audio.ts                         # Web Audio API helpers
lib/warmup-steps.ts                  # Warm-up step definitions
```

**Phase 3 — Interactive Science Lab:**
```
app/(tools)/spin-viz/page.tsx        # Spin visualizer (Three.js)
app/(tools)/serve-sim/page.tsx       # Serve placement simulator
app/(tools)/grip-explorer/page.tsx   # Grip explorer
app/(tools)/power-calc/page.tsx      # Power calculator
app/(tools)/chain-seq/page.tsx       # Kinetic chain sequencer
lib/physics.ts                       # Magnus effect, momentum, COR
lib/grips.ts                         # Grip data
lib/serve-data.ts                    # Serve placement data
components/tools/SpinScene.tsx       # Three.js scene (code-split)
components/tools/GripHandle.tsx      # SVG racket handle
components/tools/ChainTimeline.tsx   # Draggable timeline bars
```

**Phase 4 — Knowledge System:**
```
app/(tools)/flashcards/page.tsx      # Flashcard review
app/(tools)/quick-ref/page.tsx       # Quick reference sheets
content/flashcards.json              # Flashcard deck
content/quick-refs.json              # Quick reference entries
lib/sm2.ts                           # SM-2 spaced repetition algorithm
```

### Modified Files
```
lib/navigation.ts                    # New nav groups (per phase)
app/layout.tsx                       # PWA manifest link, meta tags
app/globals.css                      # Tool-specific styles
package.json                         # dexie, three, workbox-cli
```

---

## Chunk 1: Phase 0 — Foundation

### Task 1: Install Dependencies

**Files:** Modify `package.json`

- [ ] Install dexie, dexie-react-hooks, and workbox-cli
- [ ] Run `npx next build` to verify no breakage
- [ ] Commit: `chore: add dexie and workbox-cli dependencies`

### Task 2: Create Dexie Database and Tag Mapping

**Files:** Create `lib/db.ts`, `lib/tags.ts`

- [ ] Create `lib/db.ts` with full Dexie schema (Match, Flashcard, DrillLog, Settings interfaces + TennisDB class + exported `db` singleton) — exact code from spec
- [ ] Create `lib/tags.ts` with `TAG_MAP` — 15 tags, each with label, contentPages array, drills array. Data from spec's tag table
- [ ] Run `npx tsc --noEmit` to verify types
- [ ] Commit: `feat: add Dexie IndexedDB schema and tag-to-content mapping`

### Task 3: Create React Hooks for DB Access

**Files:** Create `lib/hooks/useDB.ts`

- [ ] Create hooks: `useMatches()`, `useRecentMatches(count)`, `useAddMatch()`, `useDrillLogs()`, `useAddDrillLog()`, `useSetting(key)` using `useLiveQuery` from dexie-react-hooks
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat: add React hooks for IndexedDB access`

### Task 4: Create PWA Manifest and Icons

**Files:** Create `public/manifest.json`, `public/icons/icon-192.png`, `public/icons/icon-512.png`; Modify `app/layout.tsx`

- [ ] Create `public/manifest.json` (name: "Tennis Lab — 4.0 to 4.5", short_name: "Tennis Lab", display: standalone, theme_color: #dc2626)
- [ ] Generate red circle icons at 192x192 and 512x512 (canvas script or placeholder PNG)
- [ ] Add to `app/layout.tsx` `<head>`: manifest link, theme-color meta, apple-mobile-web-app-capable, apple-touch-icon
- [ ] Run `npx next build`
- [ ] Commit: `feat: add PWA manifest and app icons`

### Task 5: Create Service Worker and Registration

**Files:** Create `public/sw.js`, `public/offline.html`, `components/RegisterSW.tsx`; Modify `app/layout.tsx`

- [ ] Create `public/offline.html` — minimal standalone page: "You're offline. Previously visited pages are still available."
- [ ] Create `public/sw.js` — Workbox runtime caching: CacheFirst for same-origin pages and static assets, offline fallback to `/offline.html`, `skipWaiting()` + `clientsClaim()`
- [ ] Create `components/RegisterSW.tsx` — `"use client"` component that registers the service worker on mount via `navigator.serviceWorker.register('/sw.js')` inside a `useEffect`
- [ ] Add `<RegisterSW />` to `app/layout.tsx` body
- [ ] Run `npx next build`, verify `sw.js` and `offline.html` in output
- [ ] Commit: `feat: add service worker with offline caching`

### Task 6: Create Shared Tool Components

**Files:** Create `components/tools/Timer.tsx`, `SliderInput.tsx`, `CourtDiagram.tsx`, `TagSelector.tsx`, `ToolPageShell.tsx`

- [ ] **Timer.tsx** — `"use client"`. Props: `duration`, `onComplete`, `onTick?`, `autoStart?`, `label?`. Countdown with pause/resume/reset. Large mm:ss display.
- [ ] **SliderInput.tsx** — Props: `min, max, step, value, onChange, label, unit`. Labeled range input with value display.
- [ ] **CourtDiagram.tsx** — SVG court with service boxes, baselines, net, center mark. Props: `highlightZone?`, `children?` for overlays. Proportionally accurate.
- [ ] **TagSelector.tsx** — Props: `tags, selected, onChange, variant: 'strength'|'weakness'`. Flex-wrap chips, tap to toggle. Green/red variants. 48px+ tap targets.
- [ ] **ToolPageShell.tsx** — Props: `title, description?, children`. Header + back nav + padding wrapper.
- [ ] Run `npx next build`
- [ ] Commit: `feat: add shared tool components (Timer, Slider, Court, Tags, Shell)`

### Task 7: Create Tool Pages Layout and Nav Group

**Files:** Create `app/(tools)/layout.tsx`; Modify `lib/navigation.ts`

- [ ] Create `app/(tools)/layout.tsx` — same Sidebar + MobileNav + main structure as `app/(content)/layout.tsx`
- [ ] Add "My Tennis" nav group to `lib/navigation.ts` with: Match Log, Dashboard, Trends, Season Overview. Update `pageOrder`.
- [ ] Run `npx next build`
- [ ] Commit: `feat: add tools layout and My Tennis nav group`

### Task 8: Deploy and Tag Phase 0

- [ ] Run `npx next build` (full clean build)
- [ ] `vercel --prod --yes`
- [ ] Verify PWA: manifest loads, SW registers, "Add to Home Screen" available
- [ ] `git tag phase-0-foundation && git push --tags`

---

## Chunk 2: Phase 1 — Match Intelligence

### Task 9: Create Match Analysis Library

**Files:** Create `lib/match-analysis.ts`

- [ ] Pure functions (no React/DB): `getStats(matches)`, `getTagFrequency(matches, type)`, `getInsights(matches)`, `getRecommendations(matches, tagMap)`, `getStreaks(matches)`, `getSeasonStats(matches, period)` — exact logic from spec
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat: add match analysis computation library`

### Task 10: Create Custom SVG Charts

**Files:** Create `lib/charts.ts`, `components/tools/BarChart.tsx`, `components/tools/LineChart.tsx`

- [ ] `lib/charts.ts` — `scaleLinear(domain, range)`, `computeTicks(min, max, count)`
- [ ] `BarChart.tsx` — SVG bars with labels/values. Props: `data: {label, value, color}[], height?, width?`
- [ ] `LineChart.tsx` — SVG path with optional dots. Props: `data: {label, value}[], color?, showDots?`
- [ ] Run `npx next build`
- [ ] Commit: `feat: add custom SVG bar and line chart components`

### Task 11: Build Post-Match Logger

**Files:** Create `app/(tools)/match-log/page.tsx`

- [ ] Mobile-first form: date (auto-today), score inputs (3 sets), won/lost toggle, format selector, surface selector, composure 1-10 tap scale, first serve %, double faults, strength TagSelector, weakness TagSelector, notes textarea
- [ ] Save via `useAddMatch()`, show confirmation with stats, link to dashboard
- [ ] All inputs 48px+ tap targets
- [ ] Run `npx next build`
- [ ] Commit: `feat: add post-match logger page`

### Task 12: Build Pattern Dashboard

**Files:** Create `app/(tools)/dashboard/page.tsx`

- [ ] Reads matches via `useMatches()`. If fewer than 5: onboarding prompt with link to `/match-log`
- [ ] 5+ matches: stat cards (total, win rate, avg composure, avg first serve %), insights from `getInsights()`, recommendations from `getRecommendations()`, recent 5 matches list
- [ ] Weakness tags link to content pages via `TAG_MAP`
- [ ] Commit: `feat: add pattern dashboard page`

### Task 13: Build Trends and Season Overview

**Files:** Create `app/(tools)/trends/page.tsx`, `app/(tools)/season/page.tsx`

- [ ] Trends: time range selector, win rate BarChart, composure LineChart, first serve % LineChart, weakness frequency table
- [ ] Season: monthly summary cards, streaks, year-to-date, improvement areas (compare first/second half)
- [ ] Run `npx next build`
- [ ] Commit: `feat: add trends and season overview pages`
- [ ] Deploy: `vercel --prod --yes`
- [ ] Tag: `git tag phase-1-match-intelligence && git push --tags`

---

## Chunk 3: Phase 2 — Court-Side Toolkit

### Task 14: Create Audio, Drill, and Warm-Up Data

**Files:** Create `lib/audio.ts`, `lib/drills.ts`, `lib/warmup-steps.ts`

- [ ] `audio.ts` — Web Audio API: `playBeep(freq?, duration?)`, `playCountdown()`, `vibrate(pattern?)`
- [ ] `drills.ts` — `DRILLS` array: 15-20 drills with id, name, sourcePage, sourceHref, sets, reps, workSeconds, restSeconds, instructions
- [ ] `warmup-steps.ts` — `WARMUP_STEPS` array: 10-12 steps with id, name, duration, instruction
- [ ] Commit: `feat: add audio helpers, drill definitions, and warm-up steps`

### Task 15: Build Drill Timer and Serve Randomizer

**Files:** Create `app/(tools)/drill-timer/page.tsx`, `app/(tools)/serve-random/page.tsx`; Modify `lib/navigation.ts`

- [ ] Add "Court-Side" nav group to navigation.ts: Drill Timer, Serve Randomizer, Routine Timer, Warm-Up
- [ ] Drill Timer: drill selection grid → active countdown with sets/reps, audio beeps at transitions, logs to IndexedDB on completion
- [ ] Serve Randomizer: CourtDiagram with highlight, random target generation (3 targets x 2 sides x 3 types), big tap button, streak counter, session stats
- [ ] Run `npx next build`
- [ ] Commit: `feat: add drill timer and serve target randomizer`

### Task 16: Build Routine Timer and Warm-Up Flow

**Files:** Create `app/(tools)/routine-timer/page.tsx`, `app/(tools)/warmup/page.tsx`

- [ ] Routine Timer: 20s countdown, 4 phases with instructions, phase progress bar, breathing guide in Phase 2, haptic vibration at transitions, auto-reset
- [ ] Warm-Up: step-by-step checklist from WARMUP_STEPS, timer per step, audio cues, skip/extend controls, completion screen
- [ ] Run `npx next build`
- [ ] Commit: `feat: add routine timer and warm-up flow`
- [ ] Deploy: `vercel --prod --yes`
- [ ] Tag: `git tag phase-2-court-side && git push --tags`

---

## Chunk 4: Phase 3 — Interactive Science Lab

### Task 17: Create Physics and Data Libraries

**Files:** Create `lib/physics.ts`, `lib/grips.ts`, `lib/serve-data.ts`

- [ ] `physics.ts` — Pure functions: `magnusTrajectory()`, `ballSpeed()`, `contactForce()`, `energyEfficiency()`, `bounceHeight()`, `verticalMargin()`. Constants: ball mass 57g, contact time 4.5ms, net height 0.914m
- [ ] `grips.ts` — `GRIPS` array: 6 grips with bevel, name, bestFor, faceAngle, description, relatedPages
- [ ] `serve-data.ts` — `SERVE_DATA`: per side, per target, per type: winPercentage, description, servePlusOne, strategyLink
- [ ] Commit: `feat: add physics formulas, grip data, and serve placement data`

### Task 18: Build Serve Simulator and Grip Explorer

**Files:** Create `app/(tools)/serve-sim/page.tsx`, `components/tools/GripHandle.tsx`, `app/(tools)/grip-explorer/page.tsx`; Modify `lib/navigation.ts`

- [ ] Add "Interactive Tools" nav group: Spin Visualizer, Serve Simulator, Grip Explorer, Power Calculator, Chain Sequencer
- [ ] Serve Simulator: CourtDiagram with heat-mapped target zones (colored SVG overlays), court side and serve type toggles, info panel with win %, serve+1 pattern, strategy links
- [ ] GripHandle.tsx: SVG octagonal handle, 8 clickable bevels, red highlight on selection
- [ ] Grip Explorer: GripHandle + info panel (grip name, description, shots, face angle, content links)
- [ ] Commit: `feat: add serve simulator and grip explorer`

### Task 19: Build Power Calculator and Chain Sequencer

**Files:** Create `app/(tools)/power-calc/page.tsx`, `components/tools/ChainTimeline.tsx`, `app/(tools)/chain-seq/page.tsx`

- [ ] Power Calculator: SliderInput for racket speed, mass, tension, spin rate. Computed outputs via physics.ts functions. Optional comparison mode.
- [ ] ChainTimeline.tsx: 5 draggable horizontal bars (hips, trunk, upper arm, forearm, racket). Color-coded. Computed racket speed based on sequence pattern.
- [ ] Chain Sequencer page: ChainTimeline + output panel + preset buttons (Optimal / All At Once) + link to Full-Body Integration
- [ ] Commit: `feat: add power calculator and kinetic chain sequencer`

### Task 20: Build Spin Visualizer (Three.js)

**Files:** Create `components/tools/SpinScene.tsx`, `app/(tools)/spin-viz/page.tsx`; Modify `package.json`

- [ ] `npm install three @types/three`
- [ ] SpinScene.tsx: `"use client"`, dynamically imported. Three.js scene: green court, net, yellow ball, trajectory arc from `magnusTrajectory()`, OrbitControls. Props: spinType, spinRate, ballSpeed, netClearance.
- [ ] Spin Viz page: `dynamic(() => import(...), { ssr: false })` to lazy-load. Spin type toggle, spin rate slider, ball speed slider. Computed results panel.
- [ ] Verify Three.js is code-split (check build output)
- [ ] Commit: `feat: add 3D spin visualizer with Three.js (code-split)`
- [ ] Deploy: `vercel --prod --yes`
- [ ] Tag: `git tag phase-3-interactive-lab && git push --tags`

---

## Chunk 5: Phase 4 — Knowledge System

### Task 21: Create SM-2 Algorithm and Flashcard Data

**Files:** Create `lib/sm2.ts`, `content/flashcards.json`

- [ ] `sm2.ts` — `calculateNextReview(quality: 0|1|2|3, card)` returning updated ease, interval, repetitions, nextReview. Logic from spec.
- [ ] `content/flashcards.json` — 50 cards (id, front, back, sourcePage, sourceHref). Cover: Grips (6), Groundstrokes (8), Biomechanics (5), Technique (5), Serve Types (5), Footwork (5), Mental Game (6), Strategy (5), Lower Body (5).
- [ ] Commit: `feat: add SM-2 algorithm and initial flashcard deck`

### Task 22: Build Flashcards Page

**Files:** Create `app/(tools)/flashcards/page.tsx`; Modify `lib/navigation.ts`

- [ ] Add Flashcards and Quick Reference to Court-Side nav group in navigation.ts
- [ ] Flashcards page: seed IndexedDB from flashcards.json on first load. Query due cards (nextReview <= today). Show front → "Tap to Reveal" → back with source link → quality buttons (Again/Hard/Good/Easy). Update via SM-2. Progress bar. Completion screen.
- [ ] Commit: `feat: add spaced repetition flashcards`

### Task 23: Build Quick Reference Sheets and Season Overview

**Files:** Create `content/quick-refs.json`, `app/(tools)/quick-ref/page.tsx`

- [ ] `content/quick-refs.json` — one entry per page: pageTitle, pageHref, cues (5-8 strings). Start with 10 most important pages.
- [ ] Quick Ref page: page selector (dropdown/tabs), large-text cue list, high contrast, link to full page
- [ ] Commit: `feat: add quick reference sheets`
- [ ] Deploy: `vercel --prod --yes`
- [ ] Tag: `git tag phase-4-knowledge-system && git push --tags`

---

## Final Verification

- [ ] All 25 content pages still render (no regression)
- [ ] All 17 tool pages build and render
- [ ] PWA installs on iOS and Android
- [ ] Offline mode works (cached pages accessible without network)
- [ ] IndexedDB persists (log match, close browser, reopen, data retained)
- [ ] Three.js code-split (only loads on /spin-viz)
- [ ] Court-side tools usable one-handed on phone (48px+ tap targets)
- [ ] Total added bundle under 40KB (excluding code-split Three.js)
