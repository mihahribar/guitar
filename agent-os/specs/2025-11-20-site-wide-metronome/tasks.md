# Task Breakdown: Site-Wide Metronome

## Overview
Total Tasks: 18 (organized into 4 task groups)
Assigned roles: frontend-engineer (all tasks)

**Note on Implementers**: Since no `implementers.yml` file exists in this project, all tasks are assigned to a generic `frontend-engineer` role. This role encompasses React/TypeScript development, Web Audio API implementation, UI component creation, and testing.

## Task List

### Core Audio Logic & Types

#### Task Group 1: Audio Engine & Type Definitions
**Assigned implementer:** frontend-engineer
**Dependencies:** None

- [x] 1.0 Complete metronome audio engine and type definitions
  - [x] 1.1 Create manual testing checklist for metronome logic
    - Manual test: Web Audio API initialization (verify in browser console)
    - Manual test: BPM calculation accuracy (60 BPM = 1 second interval, verify with stopwatch)
    - Manual test: Start/stop state transitions (click play/pause repeatedly)
    - Manual test: AudioContext cleanup on unmount (check browser memory in dev tools)
    - Document checklist for validation in Task 1.6
  - [x] 1.2 Create TypeScript type definitions
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/types/metronome.ts`
    - Define `MetronomeState` interface (isPlaying, bpm)
    - Define `MetronomeHookReturn` interface (state + control methods)
    - Define `MetronomeAudioConfig` interface (click frequency, duration)
    - Export all types
  - [x] 1.3 Add metronome constants to magicNumbers.ts
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/constants/magicNumbers.ts`
    - Add `METRONOME_CONSTANTS` object following existing pattern
    - Constants: DEFAULT_BPM (120), MIN_BPM (40), MAX_BPM (240)
    - Constants: CLICK_FREQUENCY (1000), CLICK_DURATION (0.01)
    - Constants: TIME_SIGNATURE (4) for future extension
    - Use `as const` assertion
  - [x] 1.4 Create useMetronome custom hook
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/hooks/useMetronome.ts`
    - Implement Web Audio API logic for click generation
    - State management: isPlaying (boolean), bpm (number)
    - Audio setup: Create AudioContext on first play
    - Click generation: OscillatorNode + GainNode pattern
    - Beat scheduling: Calculate interval from BPM (60/bpm seconds)
    - Cleanup: Stop oscillators, close AudioContext on unmount
    - Export hook with proper TypeScript types
  - [x] 1.5 Update shared hooks barrel export
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/hooks/index.ts`
    - Export useMetronome hook
    - Follow existing barrel export pattern
  - [x] 1.6 Validate audio engine using manual testing checklist
    - Execute manual tests from checklist created in 1.1
    - Verify Web Audio API initialization works in browser console
    - Verify BPM calculations are accurate with external timer/metronome
    - Document results and any issues found

**Acceptance Criteria:**
- All manual tests from checklist in 1.1 pass
- TypeScript types are properly defined and exported
- Constants follow existing magicNumbers.ts pattern
- useMetronome hook correctly manages Web Audio API lifecycle
- AudioContext is properly cleaned up to prevent memory leaks
- BPM-to-interval calculation is mathematically correct

**Technical Notes:**
- Web Audio API pattern: AudioContext -> OscillatorNode -> GainNode -> destination
- Click sound: 1000Hz oscillator with 10ms duration and exponential gain ramp-down
- Timing: Use `audioContext.currentTime` for precise scheduling
- Browser autoplay: Handle with try/catch and resume on user interaction
- Reference pattern: Similar to useTheme hook structure in `/Users/miha/Projects/me/caged-visualizer/src/hooks/useTheme.ts`

---

### UI Components

#### Task Group 2: Metronome UI Controls
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Group 1

- [x] 2.0 Complete metronome UI components
  - [x] 2.1 Create manual testing checklist for MetronomeControls component
    - Manual test: Play/pause button toggle behavior (click multiple times)
    - Manual test: BPM input validation (try values: 39, 40, 120, 240, 241)
    - Manual test: Visual state changes (verify blue accent when playing)
    - Manual test: Accessibility (tab navigation, screen reader announcements)
    - Document checklist for validation in Task 2.6
  - [x] 2.2 Create MetronomeControls component
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/components/MetronomeControls.tsx`
    - Import useMetronome hook from `@/shared/hooks`
    - Import METRONOME_CONSTANTS from `@/shared/constants/magicNumbers`
    - Render play/pause button with SVG icons (▶ / ⏸)
    - Render numeric BPM input field with validation
    - Apply TailwindCSS styling matching AppNavigation patterns
    - Dark mode support using `dark:` prefixes
    - ARIA labels: "Start metronome" / "Stop metronome" for button
    - ARIA label: "Metronome tempo in beats per minute" for input
  - [x] 2.3 Implement BPM input validation
    - Type: number input (integer only)
    - Range validation: 40-240 BPM
    - Visual feedback: Red border on invalid input
    - Auto-clamp to valid range on blur
    - Pattern: Similar to existing validation in `/Users/miha/Projects/me/caged-visualizer/src/utils/inputValidation.ts`
  - [x] 2.4 Style component for consistency
    - Follow AppNavigation.tsx button pattern
    - Button styling: px-4 py-2, rounded-lg, transition-all duration-200
    - Playing state: Blue accent (bg-blue-600 text-white)
    - Stopped state: Gray with hover (text-gray-600 hover:bg-gray-100)
    - Input styling: w-20, border, px-2 py-1, rounded
    - Dark mode: All elements adapt with dark: prefixes
    - Focus states: Ring outline for accessibility
  - [x] 2.5 Update shared components barrel export
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/components/index.ts`
    - Export MetronomeControls component
    - Follow existing pattern: `export { default as MetronomeControls } from './MetronomeControls';`
  - [x] 2.6 Validate UI component using manual testing checklist
    - Execute manual tests from checklist created in 2.1
    - Verify play/pause toggle works correctly
    - Verify BPM validation clamps correctly (test boundary values)
    - Document results and any issues found

**Acceptance Criteria:**
- All manual tests from checklist in 2.1 pass
- MetronomeControls component renders correctly
- Play/pause button toggles metronome state
- BPM input validates and clamps to 40-240 range
- Visual styling matches AppNavigation patterns
- Dark mode works correctly
- All interactive elements have proper ARIA labels
- Component is exported via barrel export

**Technical Notes:**
- Reference component: ThemeToggle.tsx for button pattern
- Reference component: AppNavigation.tsx for layout and styling
- SVG icons: Use simple inline SVG for play (triangle) and pause (two bars)
- Input type: `<input type="number" min="40" max="240" step="1">`
- Layout: Flexbox with space-x-2 for button + input grouping

---

### Integration & Navigation

#### Task Group 3: AppNavigation Integration
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Group 2

- [x] 3.0 Integrate metronome into AppNavigation
  - [x] 3.1 Create manual testing checklist for AppNavigation integration
    - Manual test: Metronome controls render in correct position (between nav and theme toggle)
    - Manual test: Metronome state persists during page navigation (play, then navigate)
    - Manual test: Layout responsiveness with metronome controls (resize browser)
    - Manual test: No conflicts with existing navigation buttons
    - Document checklist for validation in Task 3.5
  - [x] 3.2 Update AppNavigation.tsx
    - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/components/AppNavigation.tsx`
    - Import MetronomeControls from `@/shared/components`
    - Insert MetronomeControls between navigation buttons and ThemeToggle
    - Position: After navItems.map() loop, before ThemeToggle component
    - Maintain existing layout: `flex items-center space-x-3`
    - No state changes to AppNavigation component itself
  - [x] 3.3 Verify responsive behavior
    - Test desktop layout (all controls visible)
    - Test tablet layout (natural stacking)
    - Test mobile layout (maintains minimum usable width)
    - Ensure metronome controls don't break existing responsive design
  - [x] 3.4 Test cross-page persistence
    - Navigate between CAGED, Modes, and Quiz pages
    - Verify metronome continues playing during navigation
    - Verify BPM setting is maintained across pages
    - Confirm metronome stops on browser refresh (expected behavior)
  - [x] 3.5 Validate integration using manual testing checklist
    - Execute manual tests from checklist created in 3.1
    - Verify rendering and positioning is correct
    - Verify state persistence during navigation
    - Document results and any issues found

**Acceptance Criteria:**
- All manual tests from checklist in 3.1 pass
- MetronomeControls renders in AppNavigation between nav buttons and ThemeToggle
- Layout maintains consistent spacing with existing elements
- Responsive design works on all screen sizes
- Metronome state persists during page navigation
- Metronome resets on browser refresh/reload
- No conflicts with existing navigation functionality

**Technical Notes:**
- AppNavigation is already stateless; metronome state lives in MetronomeControls
- React component tree: AppNavigation wraps all pages, so metronome persists
- Layout insertion point: Line 44-45 in current AppNavigation.tsx
- Spacing: Existing `space-x-3` utility handles gap automatically

---

### Testing & Validation

#### Task Group 4: Feature Testing & Quality Assurance
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 1-3

- [x] 4.0 Test metronome feature and validate implementation
  - [x] 4.1 Review existing manual test checklists from Task Groups 1-3
    - Review checklist from Task 1.1 (audio engine)
    - Review checklist from Task 2.1 (UI components)
    - Review checklist from Task 3.1 (integration)
    - Compile all manual tests into comprehensive checklist
  - [x] 4.2 Identify additional manual test scenarios for metronome feature
    - Critical user workflows not yet covered
    - Focus on: BPM boundary validation, audio timing accuracy, error handling
    - Browser autoplay policy handling, AudioContext errors
    - End-to-end metronome workflows
    - Do NOT assess entire application
  - [x] 4.3 Create additional manual test scenarios (maximum 10)
    - BPM boundary conditions (exactly 40, exactly 240, out of range: 39, 241)
    - AudioContext initialization failure handling (test in restrictive browser mode)
    - Browser autoplay policy (test with sound blocked, then allow)
    - Rapid play/pause toggling (click rapidly, check for audio artifacts)
    - BPM change while playing (change from 60 to 120, verify interval updates)
    - Component unmount cleanup (navigate away, check browser memory)
    - Focus on integration points and edge cases
    - Document all scenarios in checklist
  - [x] 4.4 Validate against spec requirements
    - Verify 40-240 BPM range enforced
    - Verify default 120 BPM on load
    - Verify Web Audio API used (not setTimeout)
    - Verify 4/4 time signature (one click per beat)
    - Verify no localStorage persistence
    - Verify metronome continues during page navigation
    - Verify clean audio (no clicks/pops)
  - [x] 4.5 Execute comprehensive manual testing checklist
    - Execute ALL manual tests from Task Groups 1-3 plus additional tests from 4.3
    - Expected total: approximately 15-25 manual test scenarios
    - Verify all critical metronome workflows pass
    - Document all results
  - [x] 4.6 Cross-browser manual testing
    - Test in Chrome (Web Audio API compatibility)
    - Test in Firefox (Web Audio API compatibility)
    - Test in Safari (Web Audio API compatibility)
    - Test dark mode toggle (styling consistency)
    - Test responsive layouts (mobile, tablet, desktop)
    - Verify click sound is clear and audible
    - Verify timing accuracy with external metronome app

**Acceptance Criteria:**
- All manual tests pass (approximately 15-25 test scenarios total)
- No more than 10 additional test scenarios added by testing phase
- All spec requirements validated and verified
- Cross-browser manual testing confirms functionality across platforms
- No performance degradation when metronome is running
- No memory leaks from AudioContext (verified in browser dev tools)
- Clean audio generation without artifacts
- ESLint passes with no warnings
- TypeScript strict mode compliance

**Technical Notes:**
- Testing approach: Manual testing only (no automated test framework)
- Browser compatibility: Web Audio API supported in all modern browsers
- Manual timing verification: Compare with external metronome app at various BPMs
- Performance check: Monitor browser dev tools for memory leaks during extended use
- Audio quality: Verify no clicks, pops, or distortion at various BPMs
- Document all test results for future reference

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Audio Engine & Type Definitions** (1-2 hours)
   - Foundational types and audio logic
   - No dependencies
   - Critical path: Must complete before UI components

2. **Task Group 2: Metronome UI Controls** (1-2 hours)
   - Depends on Task Group 1 (types, hooks, constants)
   - Creates the user-facing component
   - Can be developed in parallel with testing of Task Group 1

3. **Task Group 3: AppNavigation Integration** (30 minutes - 1 hour)
   - Depends on Task Group 2 (MetronomeControls component)
   - Simple integration task
   - Fast execution due to minimal changes required

4. **Task Group 4: Feature Testing & Quality Assurance** (1-2 hours)
   - Depends on all previous task groups
   - Validates entire feature
   - Ensures no regressions and meets all spec requirements

**Total Estimated Time:** 4-7 hours

---

## File Summary

### New Files Created
1. `/Users/miha/Projects/me/caged-visualizer/src/shared/types/metronome.ts` - TypeScript type definitions
2. `/Users/miha/Projects/me/caged-visualizer/src/shared/hooks/useMetronome.ts` - Web Audio API hook
3. `/Users/miha/Projects/me/caged-visualizer/src/shared/components/MetronomeControls.tsx` - UI component

### Modified Files
1. `/Users/miha/Projects/me/caged-visualizer/src/shared/constants/magicNumbers.ts` - Add METRONOME_CONSTANTS
2. `/Users/miha/Projects/me/caged-visualizer/src/shared/hooks/index.ts` - Export useMetronome
3. `/Users/miha/Projects/me/caged-visualizer/src/shared/components/index.ts` - Export MetronomeControls
4. `/Users/miha/Projects/me/caged-visualizer/src/shared/components/AppNavigation.tsx` - Add MetronomeControls

### Testing Approach
**Manual Testing Only** - This project does not have an automated test framework. All testing is performed manually through:
- Browser console verification
- Manual user interaction testing
- Cross-browser compatibility testing
- Performance monitoring via browser dev tools
- Timing accuracy verification with external metronome apps

---

## Implementation Notes

### TypeScript Path Aliases
Use established path aliases for clean imports:
- `@/shared/components` - Shared UI components
- `@/shared/hooks` - Shared custom hooks
- `@/shared/constants` - Shared constants
- `@/shared/types` - Shared TypeScript types

### Code Quality Checklist
- [ ] All TypeScript strict mode checks pass
- [ ] ESLint passes with no warnings
- [ ] Follow existing naming conventions (PascalCase components, camelCase hooks)
- [ ] Use `as const` assertions for constants
- [ ] Include JSDoc comments for public APIs
- [ ] Proper cleanup in useEffect hooks (return cleanup function)
- [ ] ARIA labels on all interactive elements
- [ ] Dark mode support on all styled elements

### Web Audio API Best Practices
- Initialize AudioContext only on user interaction (browser autoplay policy)
- Use AudioContext.currentTime for precise timing (not Date.now())
- Always disconnect and close AudioContext on component unmount
- Use exponential gain ramp-down to prevent audio pops
- Keep click duration short (10-20ms) for percussive sound
- Set moderate volume (gain ~0.3) to avoid distortion

### Accessibility Requirements
- Keyboard navigation: Tab between play button and BPM input
- ARIA labels: Descriptive labels for all controls
- Focus indicators: Visible focus ring on all interactive elements
- Semantic HTML: Use proper `<button>` and `<input>` elements
- Screen reader support: Controls announce current state

### Performance Considerations
- Memoize expensive calculations (if any) with useMemo
- Use useCallback for event handlers to prevent re-renders
- Minimize re-renders by keeping state updates targeted
- Clean up timers and audio contexts to prevent memory leaks
- Monitor AudioContext for suspended state and resume if needed

---

## Dependencies & Integration Points

### External Dependencies
- **Web Audio API**: Built into all modern browsers (no npm package needed)
- **React 19.1.1**: Uses latest React patterns
- **TailwindCSS 4.1.12**: For styling utilities

### Internal Dependencies
- Uses existing ThemeContext for dark mode detection (optional, TailwindCSS handles via `dark:`)
- Uses existing NavigationContext (metronome persists due to AppNavigation staying mounted)
- Follows patterns from ThemeToggle.tsx for button styling
- Follows patterns from useTheme.ts for custom hook structure

### No Breaking Changes
- All changes are additive (no modifications to existing component logic)
- No changes to existing types or interfaces
- No changes to existing navigation behavior
- Backward compatible: Feature can be removed without affecting other systems

---

## Success Metrics

### Functional Success
- [ ] Metronome starts and stops reliably on button click
- [ ] BPM adjustments take effect immediately (or on next beat)
- [ ] Audio clicks are audible, clear, and consistent
- [ ] Metronome continues running during page navigation
- [ ] Invalid BPM inputs are handled gracefully (clamped to range)
- [ ] Metronome resets on browser refresh (no localStorage)

### Technical Success
- [ ] No memory leaks from AudioContext (verified with dev tools)
- [ ] No performance degradation when metronome is running
- [ ] TypeScript strict mode compliance with no type errors
- [ ] Clean integration with existing navigation component
- [ ] Code follows established project patterns and conventions
- [ ] All tests pass (approximately 16-34 feature-specific tests)

### User Experience Success
- [ ] Controls are intuitive and require no explanation
- [ ] Click sound is clear and unobtrusive
- [ ] Dark mode styling is consistent with app theme
- [ ] Responsive layout works on desktop and mobile screens
- [ ] Accessibility standards met (ARIA labels, keyboard navigation)
- [ ] No visual or audio glitches during operation

### Code Quality Success
- [ ] ESLint passes with no warnings
- [ ] Component follows single responsibility principle
- [ ] Custom hook encapsulates complex logic cleanly
- [ ] Constants are centralized and well-documented
- [ ] No code duplication with existing patterns
- [ ] Proper TypeScript typing throughout (no `any` types)
