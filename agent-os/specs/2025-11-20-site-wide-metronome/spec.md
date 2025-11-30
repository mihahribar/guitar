# Specification: Site-Wide Metronome

## Goal

Add a simple, always-accessible metronome to the CAGED Visualizer application that provides precise timing for guitar practice across all learning systems with minimal UI footprint.

## User Stories

- As a guitar student, I want to practice chord changes with a metronome so that I can develop consistent timing
- As a user exploring different pages, I want the metronome to continue running when navigating between CAGED, Modes, and Quiz pages so that my practice flow is uninterrupted
- As a user, I want to quickly adjust the tempo with a numeric input so that I can match the metronome to my practice speed
- As a user, I want to start and stop the metronome with a single click so that I can control timing without distraction

## Core Requirements

### Functional Requirements

- Start/stop button to toggle metronome on/off
- Numeric BPM input field for tempo adjustment (range: 40-240 BPM)
- Default BPM of 120 when application loads
- Audio click sound generated via Web Audio API
- 4/4 time signature (fixed, with potential for future extension)
- Metronome state persists across page navigation within the same session
- Metronome stops when user closes/refreshes the browser

### Non-Functional Requirements

- Precise timing using Web Audio API for accuracy
- Minimal performance impact on the application
- Clean audio generation without clicks or pops
- Proper cleanup of AudioContext to prevent memory leaks
- BPM input validation to prevent invalid values
- Graceful handling of browser autoplay policies

## Visual Design

### UI Layout

- **Placement**: Inline in AppNavigation component, positioned after navigation buttons and before ThemeToggle
- **Components**:
  - Play/Pause button with icon (play ▶ / pause ⏸)
  - Numeric BPM input field with label
- **Styling**: Follows existing TailwindCSS patterns in AppNavigation
- **Spacing**: Consistent with existing navigation button spacing (space-x-3)
- **Dark Mode**: Full support using existing dark: prefixes

### Visual States

- **Play button**: Static icon (no beat animation or visual feedback)
- **Pause button**: Static icon when metronome is running
- **BPM input**: Standard input field with validation styling
- **No visual beat indicators**: Purely audio feedback

### Responsive Behavior

- Standard responsive behavior (no special mobile enhancements per requirements)
- Components stack naturally with existing navigation on smaller screens
- Input field maintains minimum usable width

## Reusable Components

### Existing Code to Leverage

- **AppNavigation.tsx**: Host component for metronome controls
  - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/components/AppNavigation.tsx`
  - Pattern: Horizontal flex layout with space-x-3 spacing
  - Buttons use consistent TailwindCSS styling with dark mode support
  - ARIA labels and semantic HTML for accessibility

- **ThemeToggle.tsx**: Reference pattern for toggle button component
  - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/components/ThemeToggle.tsx`
  - Pattern: Simple button with SVG icon, hover states, transitions
  - Uses `useTheme` hook pattern for state management

- **Input Validation Utilities**: Number validation patterns
  - File: `/Users/miha/Projects/me/caged-visualizer/src/utils/inputValidation.ts`
  - Functions: Similar validation patterns (integer, range checking)
  - Pattern: Create validator function following existing patterns

- **Constants Organization**: Magic numbers pattern
  - File: `/Users/miha/Projects/me/caged-visualizer/src/shared/constants/magicNumbers.ts`
  - Pattern: Centralized constants with TypeScript const assertions
  - Location for metronome-specific constants (BPM ranges, defaults)

### New Components Required

- **MetronomeControls.tsx**: Main metronome UI component
  - Why new: No existing metronome-specific component
  - Renders play/pause button and BPM input
  - Integrates into AppNavigation layout

- **useMetronome.ts**: Custom hook for metronome logic
  - Why new: Complex Web Audio API logic needs encapsulation
  - Manages AudioContext lifecycle
  - Handles beat scheduling and timing
  - Separates audio logic from UI rendering

## Technical Approach

### Component Structure

**File Organization:**

```
src/shared/
├── components/
│   ├── AppNavigation.tsx         # Modified: Add MetronomeControls
│   ├── MetronomeControls.tsx     # New: Metronome UI component
│   └── index.ts                  # Updated: Export MetronomeControls
├── hooks/
│   ├── useMetronome.ts           # New: Metronome logic hook
│   └── index.ts                  # Updated: Export useMetronome
├── constants/
│   └── magicNumbers.ts           # Modified: Add METRONOME_CONSTANTS
└── types/
    └── metronome.ts              # New: Metronome type definitions
```

### State Management

- **Local component state** (useState): BPM value, isPlaying boolean
- **Custom hook encapsulation** (useMetronome): Web Audio API logic
- **No global context needed**: State lives in AppNavigation component
- **No localStorage**: State resets on page reload per requirements

### Data Flow

1. User clicks play button → MetronomeControls updates isPlaying state
2. isPlaying change triggers useMetronome hook effect
3. useMetronome initializes AudioContext and starts scheduling beats
4. User changes BPM input → validates input → updates BPM state
5. BPM change triggers useMetronome recalculation
6. User navigates pages → metronome continues (no component unmount)
7. User clicks pause → stops scheduling, maintains AudioContext for cleanup

### Web Audio API Implementation

**Audio Architecture:**

- **AudioContext**: Single instance created on first play (respects autoplay policy)
- **OscillatorNode**: Short burst oscillator for click sound
- **GainNode**: Envelope for click to prevent audio pops
- **Timing**: Uses AudioContext.currentTime for precise scheduling

**Click Sound Generation:**

- Frequency: ~1000-1200Hz for clear, audible click
- Duration: 10-20ms for short, percussive sound
- Envelope: Exponential gain ramp-down to prevent clicks
- Volume: Fixed moderate level (no volume control per requirements)

**Beat Scheduling:**

- Calculate interval: 60 / BPM = seconds per beat
- Schedule beats slightly ahead using currentTime + interval
- No lookAhead scheduling (per requirements - simple timing)
- Clear scheduled beats when stopping

**Cleanup:**

- Stop all oscillators on pause/unmount
- Close AudioContext on component unmount
- Handle browser autoplay policy gracefully

### TypeScript Types

**Core Types:**

```typescript
interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
}

interface MetronomeHookReturn {
  isPlaying: boolean;
  bpm: number;
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  isValid: boolean;
}
```

### Constants

**Metronome Constants (in magicNumbers.ts):**

```typescript
METRONOME_CONSTANTS: {
  DEFAULT_BPM: 120,
  MIN_BPM: 40,
  MAX_BPM: 240,
  CLICK_FREQUENCY: 1000,  // Hz
  CLICK_DURATION: 0.01,   // seconds (10ms)
  TIME_SIGNATURE: 4       // 4/4 time (for future extension)
}
```

### BPM Input Validation

- Type: number (integer only)
- Range: 40-240 BPM (standard metronome range)
- Pattern: Follow existing validation utilities
- Error handling: Clamp to valid range, show visual feedback
- Input sanitization: parseInt to ensure integer values

## Integration Points

### AppNavigation.tsx Modification

- **Import**: Add MetronomeControls component
- **Layout**: Insert between navigation buttons and ThemeToggle
- **Markup**:
  ```tsx
  <div className="flex items-center space-x-3">
    {navItems.map(...)}  // Existing navigation
    <MetronomeControls />  // New metronome
    <ThemeToggle />       // Existing theme toggle
  </div>
  ```
- **No state changes**: AppNavigation remains stateless

### Shared Components Barrel Export

- Update `/Users/miha/Projects/me/caged-visualizer/src/shared/components/index.ts`
- Export MetronomeControls component

### Shared Hooks Barrel Export

- Update `/Users/miha/Projects/me/caged-visualizer/src/shared/hooks/index.ts`
- Export useMetronome hook

### Constants Update

- Add METRONOME_CONSTANTS to magicNumbers.ts
- Follow existing pattern with const assertion

## UI/UX Specifications

### Button Design

- **Size**: Consistent with navigation buttons (px-4 py-2)
- **Icon**: SVG play (▶) and pause (⏸) icons
- **States**:
  - Default: Gray background with hover effect
  - Playing: Blue accent to indicate active state
  - Focus: Ring outline for keyboard accessibility
- **Transitions**: 200ms duration for state changes
- **ARIA**: `aria-label="Start metronome"` / `"Stop metronome"`

### BPM Input Design

- **Type**: `<input type="number">`
- **Size**: Compact width (w-20 or similar)
- **Label**: "BPM" text label or placeholder
- **Styling**: Border, padding consistent with app design
- **Dark mode**: Border and text color adapt to theme
- **Validation feedback**: Red border on invalid input
- **ARIA**: `aria-label="Metronome tempo in beats per minute"`

### Accessibility

- **Keyboard**: Tab navigation between play button and BPM input
- **Screen readers**: Clear ARIA labels on all controls
- **Focus indicators**: Visible focus ring on interactive elements
- **Semantic HTML**: Proper button and input elements

## Audio Implementation Details

### Web Audio API Setup

```typescript
// Initialization
const audioContext = new AudioContext();

// Click generation
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// Configure
oscillator.frequency.value = 1000; // Hz
gainNode.gain.value = 0.3; // Moderate volume
oscillator.start(time);
oscillator.stop(time + 0.01); // 10ms duration
```

### Timing Calculation

```typescript
// Interval calculation
const intervalInSeconds = 60 / bpm;

// Next beat scheduling
const nextBeatTime = audioContext.currentTime + intervalInSeconds;
```

### Browser Compatibility

- **Web Audio API**: Supported in all modern browsers
- **Autoplay Policy**: Handle AudioContext resume() requirement
- **Fallback**: User must interact (click play) to start - acceptable per modern browser standards

### Error Handling

- AudioContext creation failure: Log error, disable metronome
- Invalid BPM input: Clamp to valid range, don't crash
- Browser autoplay block: Resume AudioContext on user interaction

## Out of Scope

The following features are explicitly excluded from this implementation:

- **Visual beat indicators**: No flashing or pulsing animations
- **BPM increment/decrement buttons**: No +/- buttons for BPM adjustment
- **BPM slider control**: Only numeric input field
- **Subdivision patterns**: No eighth notes, triplets, or other divisions
- **Volume control**: Fixed volume level
- **Sound customization**: No different click sounds or samples
- **Tap tempo**: No BPM detection from user tapping
- **Accent patterns**: No emphasis on beat 1 or other accents (uniform beats only)
- **Alternative time signatures**: Only 4/4 time (though structured for future extension)
- **Keyboard shortcuts**: No spacebar or arrow key controls
- **localStorage persistence**: State resets on reload
- **Advanced scheduling**: No lookAhead scheduling optimization
- **Special mobile enhancements**: Standard responsive behavior only

## Future Extensibility Considerations

While not in scope for this implementation, the architecture supports:

- **Time signature variations**: Constants include TIME_SIGNATURE value
- **Accent patterns**: Beat number tracking could be added to scheduling
- **Volume control**: GainNode value could be made configurable
- **Subdivision patterns**: Scheduling logic could handle multiple beats per measure
- **Visual feedback**: Component structure allows adding visual indicators later
- **Keyboard shortcuts**: useEffect listeners could be added to useMetronome hook
- **Persistence**: localStorage integration straightforward to add

**Design Decisions to Support Extension:**

- Separate constants for time signature (currently fixed at 4)
- Clean separation of audio logic in custom hook
- Modular component structure allows adding features without refactoring

## Success Criteria

### Functional Success

- Metronome starts/stops reliably on button click
- BPM adjustments take effect immediately
- Audio clicks are audible and consistent
- Metronome continues running during page navigation
- Invalid BPM inputs are handled gracefully

### Technical Success

- No memory leaks from AudioContext
- No performance degradation when metronome is running
- TypeScript strict mode compliance with no type errors
- Clean integration with existing navigation component
- Code follows established project patterns and conventions

### User Experience Success

- Controls are intuitive and require no explanation
- Click sound is clear and unobtrusive
- Dark mode styling is consistent with app theme
- Responsive layout works on desktop and mobile screens
- Accessibility standards met (ARIA labels, keyboard navigation)

### Code Quality Success

- ESLint passes with no warnings
- Component follows single responsibility principle
- Custom hook encapsulates complex logic cleanly
- Constants are centralized and well-documented
- No code duplication with existing patterns
