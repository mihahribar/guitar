# Specification: Rhythm Game

## Goal

Create a rhythm practice tool that displays a 2x2 grid of rhythm panels, each showing standard music notation for one beat of a 4/4 measure. The game visually cycles through beats synchronized with the site-wide metronome, helping users practice reading and internalizing different rhythm patterns.

## User Stories

- As a guitar student, I want to see rhythm patterns in standard notation so that I can practice reading music
- As a musician, I want to set my practice tempo using the existing metronome so that I can practice at my preferred speed
- As a learner, I want to manually select patterns for each panel so that I can focus on specific rhythm combinations
- As a user, I want to randomize all patterns at once so that I can practice varied rhythm reading
- As a musician, I want a "random change" mode where one panel changes each cycle so that I can practice adapting to new patterns
- As a user, I want visual feedback showing which beat is active so that I can follow along with the rhythm
- As a learner, I want optional audio clicks for each note subdivision so that I can hear the rhythm while seeing it

## Core Requirements

### Functional Requirements

- Display a 2x2 grid of rhythm panels, each representing one beat of a 4/4 measure
- Show standard music notation symbols (quarter notes, eighth notes, sixteenth notes, triplets, rests) in each panel
- Allow manual pattern selection for each individual panel via dropdown or modal
- Provide a "Randomize All" button to randomly assign patterns to all four panels
- Implement "Random Change Mode" toggle that changes one random panel at the start of each new cycle
- Visual beat indicator: entire panel lights up/highlights when that beat is active
- Cycle continuously through panels 1-2-3-4 and repeat while playing
- Provide Start/Stop control for the cycling animation
- Optional "Play Audio" toggle that plays metronome clicks for each note subdivision (default: off)
- Integrate with existing site-wide metronome for BPM control (no separate BPM controls)

### Non-Functional Requirements

- Timing accuracy: Panel transitions must be precisely synchronized with metronome BPM
- Performance: Smooth visual transitions without frame drops at any supported BPM (40-240)
- Accessibility: Clear visual distinction between active and inactive panels
- Dark mode: Full support using existing theme system
- Responsive: Works on desktop and tablet screens (mobile optimization out of scope)

## Visual Design

### No mockups provided

Visual requirements derived from requirements:

### Layout Structure

- 2x2 grid centered on page
- Each panel displays music notation for one beat
- Controls positioned below or beside the grid
- Navigation button in main nav bar alongside "CAGED" and "Quiz"

### Panel Design

- Each panel sized consistently (suggested: 150-200px square)
- Music notation centered within panel
- Clear border/background to distinguish panels
- Active panel: highlighted background color (e.g., blue-500 or accent color)
- Inactive panel: neutral background (gray-100/gray-800 in dark mode)
- Smooth transition animation when switching active panel

### Controls Layout

- Pattern selector for each panel (dropdown showing notation preview)
- "Randomize All" button - prominent, easily accessible
- "Random Change Mode" toggle switch
- "Play Audio" toggle switch
- Start/Stop button - large, primary action

### Music Notation Display

- SVG-based rendering for scalability
- Standard notation symbols: filled/hollow note heads, stems, flags, beams, dots
- Rest symbols where applicable
- Clear spacing between subdivisions within a beat

## Reusable Components

### Existing Code to Leverage

**Hooks:**

- `src/shared/hooks/useMetronome.ts` - Web Audio API metronome implementation
  - Provides: `isPlaying`, `bpm`, `togglePlay`, `setBpm`, `isValid`
  - Already handles AudioContext lifecycle and click sound generation
  - Can extend for subdivision clicks

**Components:**

- `src/shared/components/MetronomeControls.tsx` - Reference for UI patterns (not directly used, as BPM controlled from nav)
- `src/shared/components/AppNavigation.tsx` - Add new navigation button here
- `src/shared/components/ThemeToggle.tsx` - Reference for toggle switch styling
- `src/shared/components/LoadingFallback.tsx` - For lazy loading fallback

**Constants:**

- `src/shared/constants/magicNumbers.ts` - METRONOME_CONSTANTS for BPM limits, click config

**Types:**

- `src/shared/types/metronome.ts` - MetronomeHookReturn interface
- `src/types/navigation.ts` - AppPage type (needs extension)

**Patterns from Quiz System:**

- `src/systems/quiz/` - Complete reference for system architecture
- Barrel exports pattern in `index.ts`
- Component/hook separation pattern
- Page component pattern (`QuizPage.tsx`)
- Type definitions pattern

### New Components Required

**Why new components are needed:**

- No existing music notation rendering capability
- No rhythm pattern data structures exist
- No beat cycling/timing synchronization exists
- Quiz system patterns don't apply to continuous cycling UI

**New components to create:**

1. `RhythmPanel` - Single panel showing music notation for one beat
2. `RhythmGrid` - 2x2 grid container managing panel layout
3. `RhythmControls` - Control panel with Start/Stop, toggles, Randomize button
4. `PatternSelector` - Dropdown/modal for selecting panel pattern
5. `RhythmPage` - Main page component (entry point)
6. `NotationDisplay` - SVG renderer for music notation symbols

## Technical Approach

### System Architecture

Create new system module: `src/systems/rhythm-game/`

```
src/systems/rhythm-game/
  components/
    RhythmPage.tsx           # Main page component (lazy loaded)
    RhythmGrid.tsx           # 2x2 grid container
    RhythmPanel.tsx          # Individual beat panel
    RhythmControls.tsx       # Start/Stop, toggles, randomize
    PatternSelector.tsx      # Pattern selection UI
    NotationDisplay.tsx      # SVG music notation renderer
  hooks/
    useRhythmGame.ts         # Main orchestration hook
    useRhythmCycler.ts       # Beat cycling logic with timing
    useSubdivisionAudio.ts   # Audio playback for subdivisions
  constants/
    index.ts                 # Rhythm patterns, notation data
    patterns.ts              # Pattern definitions
  types/
    index.ts                 # TypeScript definitions
  utils/
    rhythmUtils.ts           # Pattern validation, generation
  index.ts                   # Barrel exports
```

### State Management

**Local component state only (no localStorage, no context):**

```typescript
// Main game state in useRhythmGame hook
interface RhythmGameState {
  panels: RhythmPattern[]; // 4 patterns, one per panel
  isPlaying: boolean; // Whether cycling is active
  currentBeat: number; // 0-3, which panel is active
  randomChangeMode: boolean; // Auto-change one panel each cycle
  playAudio: boolean; // Whether to play subdivision clicks
}
```

**State resets on page reload (requirement)**

### Data Flow

1. `RhythmPage` renders `RhythmGrid` and `RhythmControls`
2. `useRhythmGame` hook manages all state and exposes actions
3. User interactions (pattern select, toggles) update state via hook actions
4. `useRhythmCycler` hook manages timing based on BPM from `useMetronome`
5. When playing, `useRhythmCycler` advances `currentBeat` at correct intervals
6. `RhythmPanel` receives `isActive` prop and highlights accordingly
7. If `playAudio` enabled, `useSubdivisionAudio` plays clicks per subdivision

### Timing Implementation

**Beat timing calculation:**

```typescript
// Interval between beats in ms
const beatInterval = (60 / bpm) * 1000;

// For subdivisions (e.g., sixteenth notes = 4 per beat)
const subdivisionInterval = beatInterval / subdivisionCount;
```

**Synchronization approach:**

- Use `setInterval` for beat advancement (like existing metronome)
- Start timing when user clicks Start
- Reset to beat 0 when stopping
- Random change triggers at beat 0 (start of new cycle)

### Audio Implementation

**Extend existing metronome audio pattern:**

- Reuse `AudioContext` initialization from `useMetronome`
- Create separate click scheduling for subdivisions
- Different frequency or volume for subdivisions vs main beat (optional distinction)
- Only play when `playAudio` toggle is enabled

### Navigation Integration

**Files to modify:**

1. `src/types/navigation.ts` - Add `'rhythm'` to `AppPage` union type
2. `src/shared/components/AppNavigation.tsx` - Add nav item for rhythm game
3. `src/App.tsx` - Add lazy import and route for `RhythmPage`

## TypeScript Types

```typescript
// src/systems/rhythm-game/types/index.ts

/**
 * Subdivision types representing how a beat can be divided
 */
export type SubdivisionType =
  | 'quarter' // 1 note filling the beat
  | 'eighths' // 2 equal subdivisions
  | 'sixteenths' // 4 equal subdivisions
  | 'triplets'; // 3 equal subdivisions

/**
 * Individual note within a beat pattern
 */
export interface RhythmNote {
  /** Duration relative to beat (1 = whole beat, 0.5 = eighth, 0.25 = sixteenth) */
  duration: number;
  /** Whether this note is a rest (silence) */
  isRest: boolean;
}

/**
 * Complete rhythm pattern for one beat/panel
 */
export interface RhythmPattern {
  /** Unique identifier for the pattern */
  id: string;
  /** Human-readable name */
  name: string;
  /** Notes that make up this pattern (durations must sum to 1) */
  notes: RhythmNote[];
  /** Display category for grouping in selector */
  category: SubdivisionType;
}

/**
 * Panel index (0-3 for 2x2 grid)
 */
export type PanelIndex = 0 | 1 | 2 | 3;

/**
 * Main game state
 */
export interface RhythmGameState {
  /** Pattern assigned to each of the 4 panels */
  panels: [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];
  /** Whether the beat cycling is active */
  isPlaying: boolean;
  /** Current active beat (0-3) */
  currentBeat: PanelIndex;
  /** Whether random change mode is enabled */
  randomChangeMode: boolean;
  /** Whether audio playback is enabled */
  playAudio: boolean;
}

/**
 * Actions available from the game hook
 */
export interface RhythmGameActions {
  /** Start beat cycling */
  start: () => void;
  /** Stop beat cycling */
  stop: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Set pattern for a specific panel */
  setPattern: (panelIndex: PanelIndex, pattern: RhythmPattern) => void;
  /** Randomize all panel patterns */
  randomizeAll: () => void;
  /** Toggle random change mode */
  setRandomChangeMode: (enabled: boolean) => void;
  /** Toggle audio playback */
  setPlayAudio: (enabled: boolean) => void;
}

/**
 * Return type for useRhythmGame hook
 */
export interface UseRhythmGameReturn extends RhythmGameState, RhythmGameActions {
  /** Available patterns for selection */
  availablePatterns: RhythmPattern[];
  /** BPM from site metronome (read-only) */
  bpm: number;
}
```

## Integration Points

### Navigation System

**Modify `src/types/navigation.ts`:**

```typescript
export type AppPage = 'caged' | 'quiz' | 'rhythm';
```

**Modify `src/shared/components/AppNavigation.tsx`:**
Add to `navItems` array:

```typescript
{ page: 'rhythm', label: 'Rhythm', description: 'Practice rhythm patterns' }
```

**Modify `src/App.tsx`:**

```typescript
// Add lazy import
const RhythmPage = lazy(() => import("@/systems/rhythm-game/components/RhythmPage"));

// Add route in AppContent
{currentPage === 'rhythm' && (
  <Suspense fallback={<LoadingFallback message="Loading rhythm game..." size="large" />}>
    <RhythmPage />
  </Suspense>
)}
```

### Metronome Integration

The rhythm game reads BPM from the existing site metronome but does NOT control it:

```typescript
// In useRhythmCycler hook
import { useMetronome } from '@/shared/hooks';

export function useRhythmCycler() {
  const { bpm, isPlaying: metronomeIsPlaying } = useMetronome();

  // Use bpm for timing calculations
  // Note: Rhythm game has its own isPlaying state separate from metronome
}
```

**Important:** The rhythm game's Start/Stop controls its own cycling, independent of whether the metronome is playing clicks. Users control BPM via the nav bar metronome as usual.

## UI/UX Specifications

### Panel Visual States

| State      | Background                 | Border                     | Opacity |
| ---------- | -------------------------- | -------------------------- | ------- |
| Inactive   | gray-100 / gray-800 (dark) | gray-300 / gray-600 (dark) | 100%    |
| Active     | blue-500 / blue-600 (dark) | blue-600 / blue-500 (dark) | 100%    |
| Transition | CSS transition 100-150ms   | -                          | -       |

### Control Button Styles

Follow existing button patterns from `AppNavigation.tsx` and `MetronomeControls.tsx`:

- Primary action (Start/Stop): `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary actions (Randomize): `bg-gray-100 dark:bg-gray-800 hover:bg-gray-200`
- Toggles: Similar to ThemeToggle switch style

### Music Notation Requirements

**Note symbols to implement:**

- Quarter note: filled oval head with stem
- Eighth notes: paired with beam, or single with flag
- Sixteenth notes: paired with double beam, or single with double flag
- Triplet: three notes with bracket and "3" marking
- Quarter rest: standard rest symbol
- Eighth rest: standard rest symbol
- Sixteenth rest: standard rest symbol

**Sizing:**

- Notes should be clearly visible at panel size
- Consistent sizing across all pattern types
- SVG viewBox allows scaling without quality loss

### Pattern Selector UX

**Dropdown approach (recommended):**

- Click panel to open pattern selector
- Show pattern name + small notation preview
- Group by category (quarters, eighths, sixteenths, triplets, mixed)
- Close on selection or click outside

### Responsive Behavior

**Desktop (default):**

- 2x2 grid with generous spacing
- Controls beside or below grid
- Full-size notation display

**Tablet (min-width: 768px):**

- Grid may stack or reduce spacing
- Controls stack vertically below grid
- Slightly smaller notation

**Mobile (out of scope):**

- Basic functionality should work but not optimized
- Panels may be too small for comfortable use

## Rhythm Pattern Data

### Predefined Patterns

Patterns should be defined in `src/systems/rhythm-game/constants/patterns.ts`:

**Quarter patterns:**

- Quarter note (1 note)
- Quarter rest (silence)

**Eighth patterns:**

- Two eighth notes
- Eighth + eighth rest
- Eighth rest + eighth
- Two eighth rests

**Sixteenth patterns:**

- Four sixteenth notes
- Sixteenth-sixteenth-eighth (common pattern)
- Eighth-sixteenth-sixteenth (common pattern)
- Dotted eighth + sixteenth
- Various rest combinations

**Triplet patterns:**

- Three triplet notes
- Triplet with rest variations

**Mixed patterns (advanced):**

- Combinations that add up to one beat
- Must be mathematically valid (durations sum to 1.0)

### Pattern Validation

All patterns must:

1. Have note durations that sum to exactly 1.0 (one beat)
2. Not mix triplet subdivisions with binary subdivisions (musically invalid)
3. Have unique IDs for selection tracking

## Out of Scope

- User input recording or tap detection
- Scoring or performance evaluation
- localStorage persistence (state resets on reload)
- Custom sound options (uses metronome click only)
- Time signatures other than 4/4
- More than 4 panels
- Per-subdivision lighting within panels (whole panel lights only)
- Keyboard shortcuts
- Tutorial or onboarding flow
- Mobile-specific optimizations
- Pattern editing/custom patterns
- Saving favorite patterns
- Per-beat audio accent (all clicks same volume)
- MIDI input/output
- Audio waveform visualization

## Success Criteria

- All 4 panels display clear, readable music notation
- Beat cycling is precisely synchronized with BPM (no drift over time)
- Visual transitions are smooth at all supported BPM values (40-240)
- Pattern selection works correctly for all panels
- "Randomize All" generates valid patterns for all 4 panels
- "Random Change Mode" changes exactly one random panel per cycle
- "Play Audio" plays correct number of clicks per beat subdivision
- Navigation button appears alongside existing nav items
- Dark mode displays correctly with appropriate contrast
- New system follows existing modular architecture patterns
- TypeScript compiles with no errors
- Code passes ESLint checks
