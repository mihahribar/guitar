# Task Breakdown: Rhythm Game

## Overview
Total Tasks: 28 tasks across 6 task groups
Assigned Implementers: api-engineer, ui-designer

## Dependencies Graph
```
Task Group 1 (Types & Constants)
      |
      v
Task Group 2 (Core Logic Hooks) ---> Task Group 3 (Notation SVG Components)
      |                                      |
      v                                      v
      +---------------+----------------------+
                      |
                      v
            Task Group 4 (UI Components)
                      |
                      v
            Task Group 5 (Page Integration)
                      |
                      v
            Task Group 6 (Manual Testing)
```

## Task List

### Foundation Layer

#### Task Group 1: Types and Constants
**Assigned implementer:** api-engineer
**Dependencies:** None

- [ ] 1.0 Complete types and constants foundation
  - [ ] 1.1 Create system directory structure
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/`
    - Create subdirectories: `components/`, `hooks/`, `constants/`, `types/`, `utils/`
  - [ ] 1.2 Define TypeScript types
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/types/index.ts`
    - Define `SubdivisionType`: 'quarter' | 'eighths' | 'sixteenths' | 'triplets'
    - Define `RhythmNote` interface: duration, isRest
    - Define `RhythmPattern` interface: id, name, notes, category
    - Define `PanelIndex` type: 0 | 1 | 2 | 3
    - Define `RhythmGameState` interface: panels, isPlaying, currentBeat, randomChangeMode, playAudio
    - Define `RhythmGameActions` interface: start, stop, togglePlay, setPattern, randomizeAll, setRandomChangeMode, setPlayAudio
    - Define `UseRhythmGameReturn` interface extending state and actions
    - Follow pattern from `src/systems/quiz/types/index.ts`
  - [ ] 1.3 Create rhythm pattern constants
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/constants/patterns.ts`
    - Define quarter note patterns (quarter note, quarter rest)
    - Define eighth note patterns (2 eighths, eighth+rest combos)
    - Define sixteenth note patterns (4 sixteenths, common combinations)
    - Define triplet patterns (3 triplets, triplet with rests)
    - Ensure all patterns have durations summing to 1.0
    - Include unique IDs for each pattern
  - [ ] 1.4 Create system constants
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/constants/index.ts`
    - Define `PANEL_COUNT = 4`
    - Define `BEATS_PER_MEASURE = 4`
    - Define default patterns for initial state
    - Export all pattern definitions
    - Define panel visual states constants (colors, transitions)
  - [ ] 1.5 Verify TypeScript compilation
    - Run `npm run build` to verify no type errors
    - Ensure all types are properly exported

**Acceptance Criteria:**
- All types compile without errors
- Pattern durations are mathematically valid (sum to 1.0)
- Constants follow existing project naming conventions
- Barrel exports work correctly

---

### Core Logic Layer

#### Task Group 2: Core Logic Hooks
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 1

- [ ] 2.0 Complete core logic hooks
  - [ ] 2.1 Create rhythm utility functions
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/utils/rhythmUtils.ts`
    - Implement `validatePattern(pattern)`: verify durations sum to 1.0
    - Implement `getRandomPattern(category?)`: return random pattern, optionally from category
    - Implement `getRandomPanelIndex()`: return random 0-3
    - Implement `getSubdivisionCount(pattern)`: count notes for audio playback
  - [ ] 2.2 Create useRhythmCycler hook
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/hooks/useRhythmCycler.ts`
    - Accept `bpm` parameter from metronome
    - Manage `currentBeat` state (0-3)
    - Calculate beat interval: `(60 / bpm) * 1000`
    - Use `setInterval` for beat advancement
    - Expose `start()`, `stop()`, `reset()` functions
    - Handle cycle completion callback for random change mode
    - Clean up interval on unmount
  - [ ] 2.3 Create useSubdivisionAudio hook
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/hooks/useSubdivisionAudio.ts`
    - Initialize AudioContext (reuse pattern from `useMetronome.ts`)
    - Accept `pattern` and `bpm` to calculate subdivision timing
    - Implement `playSubdivisions(pattern)`: schedule clicks for each note
    - Calculate subdivision interval: `beatInterval / subdivisionCount`
    - Handle `playAudio` toggle state
    - Clean up AudioContext on unmount
  - [ ] 2.4 Create useRhythmGame orchestration hook
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/hooks/useRhythmGame.ts`
    - Import and use `useMetronome` for BPM
    - Import and use `useRhythmCycler` for beat cycling
    - Import and use `useSubdivisionAudio` for audio playback
    - Manage panel patterns state (4 patterns tuple)
    - Implement all actions from `RhythmGameActions` interface
    - Implement random change logic on cycle completion
    - Use `useMemo` for derived state calculations
    - Return `UseRhythmGameReturn` interface
  - [ ] 2.5 Create hooks barrel export
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/hooks/index.ts`
    - Export all hooks
  - [ ] 2.6 Verify hook compilation and basic logic
    - Run `npm run build` to verify no errors
    - Verify timing calculations are correct

**Acceptance Criteria:**
- Hooks compile without TypeScript errors
- Beat cycling logic advances 0-1-2-3-0 correctly
- Timing calculations match BPM (60/bpm * 1000 for beat interval)
- Random change triggers at cycle start (beat 0)
- Audio hooks handle AudioContext lifecycle properly

---

### Notation Layer

#### Task Group 3: Music Notation SVG Components
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1

- [ ] 3.0 Complete music notation SVG rendering
  - [ ] 3.1 Create SVG note symbol components
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/NotationSymbols.tsx`
    - Implement `NoteHead` component (filled/hollow oval)
    - Implement `NoteStem` component (vertical line)
    - Implement `NoteFlag` component (single flag for eighth, double for sixteenth)
    - Implement `NoteBeam` component (horizontal beam for grouped notes)
    - Implement `TripletBracket` component (bracket with "3")
    - Use consistent viewBox sizing for scalability
  - [ ] 3.2 Create SVG rest symbol components
    - Add to NotationSymbols.tsx or create separate file
    - Implement `QuarterRest` component (standard symbol)
    - Implement `EighthRest` component (standard symbol)
    - Implement `SixteenthRest` component (standard symbol)
    - Ensure visual consistency with note symbols
  - [ ] 3.3 Create NotationDisplay component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/NotationDisplay.tsx`
    - Accept `pattern: RhythmPattern` prop
    - Render appropriate symbols based on pattern notes
    - Handle beaming for grouped eighth/sixteenth notes
    - Space notes evenly within the beat
    - Support dark mode colors (use currentColor or CSS variables)
    - Size: fit within panel (approximately 150-200px)
  - [ ] 3.4 Verify notation rendering
    - Test quarter note display
    - Test eighth notes with beam
    - Test sixteenth notes with double beam
    - Test triplet with bracket and "3"
    - Test rest symbols
    - Verify dark mode appearance

**Acceptance Criteria:**
- SVG symbols render at correct proportions
- Beamed notes display with proper beam connections
- Triplet bracket with "3" marking displays correctly
- Rest symbols are recognizable
- Notation scales properly within different panel sizes
- Dark mode displays with appropriate contrast

---

### UI Components Layer

#### Task Group 4: UI Components
**Assigned implementer:** ui-designer
**Dependencies:** Task Groups 2, 3

- [ ] 4.0 Complete UI components
  - [ ] 4.1 Create RhythmPanel component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/RhythmPanel.tsx`
    - Accept props: `pattern`, `isActive`, `panelIndex`, `onSelectPattern`
    - Render `NotationDisplay` with pattern
    - Apply active/inactive visual states:
      - Inactive: `bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600`
      - Active: `bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500`
    - Add CSS transition: `transition-colors duration-150`
    - Size: approximately 150-200px square
    - Add click handler for pattern selection
    - Display panel number (1-4) in corner
  - [ ] 4.2 Create PatternSelector component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/PatternSelector.tsx`
    - Accept props: `isOpen`, `onClose`, `onSelect`, `availablePatterns`
    - Display as dropdown or modal overlay
    - Group patterns by category (quarters, eighths, sixteenths, triplets)
    - Show pattern name and small notation preview
    - Close on selection or click outside
    - Style following existing dropdown patterns
    - Support keyboard navigation (Escape to close)
  - [ ] 4.3 Create RhythmGrid component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/RhythmGrid.tsx`
    - Accept props: `panels`, `currentBeat`, `onSelectPattern`
    - Render 2x2 grid using CSS Grid: `grid-cols-2 gap-4`
    - Map panels to RhythmPanel components
    - Pass `isActive={index === currentBeat}` to each panel
    - Center grid on page
    - Add beat number labels (1, 2, 3, 4)
  - [ ] 4.4 Create RhythmControls component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/RhythmControls.tsx`
    - Accept props from `UseRhythmGameReturn` (or subset)
    - Implement Start/Stop button (primary style):
      - `bg-blue-600 hover:bg-blue-700 text-white`
      - Change label based on `isPlaying` state
    - Implement "Randomize All" button (secondary style):
      - `bg-gray-100 dark:bg-gray-800 hover:bg-gray-200`
    - Implement "Random Change Mode" toggle switch
      - Follow `ThemeToggle.tsx` styling pattern
    - Implement "Play Audio" toggle switch
    - Display current BPM (read-only, from metronome)
    - Layout: horizontal on desktop, stack on tablet
  - [ ] 4.5 Create components barrel export
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/index.ts`
    - Export all components
  - [ ] 4.6 Verify component rendering and interactions
    - Test panel active/inactive states
    - Test pattern selector opens and closes
    - Test controls toggle states
    - Verify responsive behavior on tablet width

**Acceptance Criteria:**
- Panels display correct active/inactive visual states
- Grid renders as 2x2 with proper spacing
- Pattern selector shows all patterns grouped by category
- Controls are accessible and follow existing UI patterns
- Toggle switches work correctly
- Responsive layout works on tablet screens

---

### Integration Layer

#### Task Group 5: Page Integration and Navigation
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 4

- [ ] 5.0 Complete page integration
  - [ ] 5.1 Create RhythmPage component
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/components/RhythmPage.tsx`
    - Import and use `useRhythmGame` hook
    - Render `RhythmGrid` with game state
    - Render `RhythmControls` with actions
    - Manage PatternSelector visibility state
    - Handle pattern selection flow
    - Layout: centered content with appropriate padding
    - Add page title/header: "Rhythm Practice"
    - Export as default for lazy loading
  - [ ] 5.2 Create system barrel exports
    - Create `/Users/miha/Projects/me/caged-visualizer/src/systems/rhythm-game/index.ts`
    - Export `RhythmPage` as default
    - Export all components
    - Export all hooks
    - Export types (type-only exports)
    - Export constants
    - Follow pattern from `src/systems/quiz/index.ts`
  - [ ] 5.3 Update navigation types
    - Modify `/Users/miha/Projects/me/caged-visualizer/src/types/navigation.ts`
    - Add `'rhythm'` to `AppPage` union type: `'caged' | 'quiz' | 'rhythm'`
  - [ ] 5.4 Update AppNavigation component
    - Modify `/Users/miha/Projects/me/caged-visualizer/src/shared/components/AppNavigation.tsx`
    - Add nav item for rhythm game
    - Label: "Rhythm"
    - Position: after Quiz button
    - Follow existing nav item styling
  - [ ] 5.5 Update App.tsx with lazy loading
    - Modify `/Users/miha/Projects/me/caged-visualizer/src/App.tsx`
    - Add lazy import: `const RhythmPage = lazy(() => import("@/systems/rhythm-game/components/RhythmPage"))`
    - Add route condition in AppContent:
      ```tsx
      {currentPage === 'rhythm' && (
        <Suspense fallback={<LoadingFallback message="Loading rhythm game..." size="large" />}>
          <RhythmPage />
        </Suspense>
      )}
      ```
  - [ ] 5.6 Verify navigation and page loading
    - Run `npm run dev`
    - Verify nav button appears
    - Verify clicking nav button loads rhythm page
    - Verify lazy loading works (loading fallback shows briefly)

**Acceptance Criteria:**
- Navigation button appears in nav bar alongside CAGED and Quiz
- Clicking "Rhythm" navigates to rhythm game page
- Page lazy loads correctly with loading fallback
- All components render on the page
- Build completes without errors (`npm run build`)
- ESLint passes (`npm run lint`)

---

### Verification Layer

#### Task Group 6: Manual Testing and Verification
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 5

- [ ] 6.0 Complete manual testing checklist
  - [ ] 6.1 Visual verification - Light mode
    - [ ] Grid displays as 2x2 with proper spacing
    - [ ] All 4 panels show music notation clearly
    - [ ] Active panel has blue highlight
    - [ ] Inactive panels have gray background
    - [ ] Controls are properly styled
    - [ ] Pattern selector dropdown is readable
  - [ ] 6.2 Visual verification - Dark mode
    - [ ] Toggle dark mode via theme button
    - [ ] All panels have appropriate dark backgrounds
    - [ ] Active panel highlight visible in dark mode
    - [ ] Notation symbols have sufficient contrast
    - [ ] Controls adapt to dark theme
    - [ ] Pattern selector works in dark mode
  - [ ] 6.3 Functional testing - Beat cycling
    - [ ] Click Start button - cycling begins
    - [ ] Panels light up in sequence 1-2-3-4
    - [ ] Change BPM in nav metronome - cycling speed updates
    - [ ] Test at slow BPM (60) - timing is correct
    - [ ] Test at fast BPM (180) - timing is correct
    - [ ] Click Stop button - cycling stops
    - [ ] Cycling resets to beat 1 when stopped
  - [ ] 6.4 Functional testing - Pattern selection
    - [ ] Click on a panel - pattern selector opens
    - [ ] Pattern categories are properly grouped
    - [ ] Select a pattern - panel updates with new notation
    - [ ] Click outside selector - it closes
    - [ ] Press Escape - selector closes
    - [ ] All pattern types render correctly
  - [ ] 6.5 Functional testing - Randomize and modes
    - [ ] Click "Randomize All" - all 4 panels change
    - [ ] Randomize produces valid patterns
    - [ ] Enable "Random Change Mode" toggle
    - [ ] Start cycling - one panel changes each cycle
    - [ ] Random changes happen at beat 1 (cycle start)
    - [ ] Disable random change - no more auto-changes
  - [ ] 6.6 Functional testing - Audio playback
    - [ ] Enable "Play Audio" toggle
    - [ ] Start cycling - hear clicks for subdivisions
    - [ ] Quarter note panel - 1 click per beat
    - [ ] Eighth notes - 2 clicks per beat
    - [ ] Sixteenth notes - 4 clicks per beat
    - [ ] Triplets - 3 clicks per beat
    - [ ] Audio syncs with visual highlighting
    - [ ] Disable audio - clicks stop
  - [ ] 6.7 Cross-browser testing
    - [ ] Test in Chrome - all features work
    - [ ] Test in Firefox - all features work
    - [ ] Test in Safari - all features work (especially Web Audio)
    - [ ] Audio context initializes properly in each browser
  - [ ] 6.8 Responsive testing
    - [ ] Test at desktop width (1024px+) - full layout
    - [ ] Test at tablet width (768px) - controls may stack
    - [ ] Grid remains usable at tablet size
    - [ ] Notation remains readable at smaller sizes

**Acceptance Criteria:**
- All visual states render correctly in both themes
- Beat cycling is precisely synchronized with BPM
- Pattern selection works for all panels
- Randomize and random change mode work correctly
- Audio playback produces correct number of clicks per pattern
- No console errors during normal operation
- Works in Chrome, Firefox, and Safari

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Types and Constants** (api-engineer)
   - Foundation for all other work
   - No dependencies
   - Estimated effort: 2-3 hours

2. **Task Group 2: Core Logic Hooks** (api-engineer)
   - Core timing and state management
   - Depends on Task Group 1
   - Estimated effort: 4-5 hours

3. **Task Group 3: Music Notation SVG Components** (ui-designer)
   - Can run in parallel with Task Group 2 after Task Group 1
   - Depends on Task Group 1 for types
   - Estimated effort: 3-4 hours

4. **Task Group 4: UI Components** (ui-designer)
   - Main visual components
   - Depends on Task Groups 2 and 3
   - Estimated effort: 4-5 hours

5. **Task Group 5: Page Integration and Navigation** (ui-designer)
   - Wire everything together
   - Depends on Task Group 4
   - Estimated effort: 2-3 hours

6. **Task Group 6: Manual Testing** (ui-designer)
   - Comprehensive verification
   - Depends on Task Group 5
   - Estimated effort: 2-3 hours

**Total Estimated Effort:** 17-23 hours

---

## File Inventory

### New Files to Create
```
src/systems/rhythm-game/
  index.ts                           # System barrel exports
  types/
    index.ts                         # TypeScript type definitions
  constants/
    index.ts                         # System constants
    patterns.ts                      # Rhythm pattern definitions
  utils/
    rhythmUtils.ts                   # Rhythm utility functions
  hooks/
    index.ts                         # Hooks barrel export
    useRhythmGame.ts                 # Main orchestration hook
    useRhythmCycler.ts               # Beat cycling logic
    useSubdivisionAudio.ts           # Audio playback for subdivisions
  components/
    index.ts                         # Components barrel export
    RhythmPage.tsx                   # Main page component
    RhythmGrid.tsx                   # 2x2 grid container
    RhythmPanel.tsx                  # Individual beat panel
    RhythmControls.tsx               # Control buttons and toggles
    PatternSelector.tsx              # Pattern selection dropdown
    NotationDisplay.tsx              # SVG notation renderer
    NotationSymbols.tsx              # SVG symbol components
```

### Existing Files to Modify
```
src/types/navigation.ts              # Add 'rhythm' to AppPage type
src/shared/components/AppNavigation.tsx  # Add rhythm nav button
src/App.tsx                          # Add lazy import and route
```

---

## Notes

- **No automated tests**: This project uses manual testing only. Task Group 6 provides comprehensive manual testing checklist.
- **Metronome integration**: The rhythm game reads BPM from `useMetronome` but has its own independent play/pause state for cycling.
- **Pattern validation**: All patterns must have note durations summing to exactly 1.0 (one beat).
- **Triplet rule**: Triplet patterns should not be mixed with binary subdivisions within the same beat (musically invalid).
- **Audio context**: Browser autoplay policies require user interaction before audio. The existing `useMetronome` pattern handles this.
- **Performance**: Use `useMemo` for expensive calculations and ensure smooth transitions at all BPM values (40-240).
