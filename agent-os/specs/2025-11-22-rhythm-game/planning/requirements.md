# Spec Requirements: Rhythm Game

## Initial Description

Create a Rhythm Game that has a simple 2x2 grid, each panel is a 1/4 of a 4/4 rhythm. Each panel has combinations of notes (1 quarter, 2 eighths, 4 sixteenths, 3 triplets, and any combinations of all those that make sense). Before the game starts the user can select a BPM tempo using the built-in metronome feature. User can either pick combination for each panel, randomize it, and even a mode where on each cycle one panel randomly changes. There is no need to record the user, but there should be an option to "play" the tempo (but the default is to just cycle through panels). Based on the metronome speed, the panels should light up so the user knows which notes are supposed to be played.

**Context:**
This is for the CAGED Visualizer project - a React + TypeScript guitar learning application. The rhythm game will help users practice reading and internalizing different rhythm patterns.

## Requirements Discussion

### First Round Questions

**Q1: How should the notes be visually displayed in each panel? Standard music notation symbols, or a simplified visual representation (like colored blocks/bars)?**
**Answer:** Music notation (standard quarter/eighth/sixteenth note symbols)

**Q2: How should the 'lighting up' work within each panel when the beat is active?**
**Answer:** Whole panel (entire panel lights up for its beat duration)

**Q3: For the 'play' audio mode, what sound should play for the notes?**
**Answer:** Metronome click (use the existing metronome click sound for each note)

**Q4: Should rests (silence) be included as valid note options in panels?**
**Answer:** Yes, include rests (allow panels to have rest patterns)

**Q5: Should the rhythm game use the existing site-wide metronome controls, or have its own dedicated BPM controls on the page?**
**Answer:** Use site metronome (integrate with existing nav bar metronome for BPM)

**Q6: In the 'random change' mode, should the randomly changing panel be a different panel each cycle, or always change the same position?**
**Answer:** Random position (a random panel changes each cycle, could be any of the 4)

**Q7: What valid note combinations should be available per panel? (These all equal one beat in 4/4)**
**Answer:** Full flexibility (any mathematically valid combination including rests)

**Q8: How should navigation to the Rhythm Game page work?**
**Answer:** Main nav button (add button to main navigation bar alongside Quiz)

### Existing Code to Reference

- **Metronome feature**: `src/shared/hooks/useMetronome.ts` - Web Audio API implementation for timing and click sounds
- **MetronomeControls**: `src/shared/components/MetronomeControls.tsx` - UI controls for metronome
- **AppNavigation**: `src/shared/components/AppNavigation.tsx` - Navigation bar where new button will be added
- **Quiz system**: `src/systems/quiz/` - Reference for separate page/system architecture
- **Navigation context**: `src/contexts/NavigationContext.tsx` - For adding new page route

### Follow-up Questions

None required.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

No visual assets to analyze.

## Requirements Summary

### Functional Requirements

- **2x2 Grid Layout**: Four panels arranged in a grid, each representing one beat of a 4/4 measure
- **Note Pattern Display**: Standard music notation symbols for rhythm patterns
- **Pattern Selection**: User can manually select pattern for each panel
- **Randomize All**: Button to randomize all four panels at once
- **Random Change Mode**: Mode where one random panel changes pattern each cycle
- **Visual Beat Indicator**: Whole panel lights up when that beat is active
- **Play Mode**: Optional audio mode that plays metronome clicks for each note subdivision
- **BPM Integration**: Uses existing site-wide metronome for tempo control
- **Cycle Looping**: Continuously cycles through panels 1-2-3-4 and repeats

### Note Pattern Options

All mathematically valid combinations that equal one beat, including:

- **Quarter note**: 1 note filling the beat
- **Eighth notes**: 2 equal subdivisions
- **Sixteenth notes**: 4 equal subdivisions
- **Triplets**: 3 equal subdivisions
- **Mixed patterns**: Eighth + 2 sixteenths, dotted eighth + sixteenth, etc.
- **Rests**: Any pattern can include rest values (e.g., eighth + eighth-rest)

### Non-Functional Requirements

- **Performance**: Smooth visual transitions synced to BPM
- **Timing Accuracy**: Panel changes precisely aligned with metronome timing
- **Simplicity**: Clean, focused UI without unnecessary complexity
- **Accessibility**: Clear visual feedback for current beat

### UI/UX Requirements

- **Placement**: Separate page accessible from main navigation
- **Navigation**: New button in nav bar alongside Quiz button
- **Layout**: 2x2 grid centered on page with controls below/beside
- **Controls**:
  - Pattern selector for each panel (dropdown or modal)
  - "Randomize All" button
  - "Random Change Mode" toggle
  - "Play Audio" toggle (default: off)
  - Start/Stop button for cycling
- **Visual Feedback**:
  - Active panel highlighted/lit up
  - Clear distinction between active and inactive panels
- **Responsive Design**: Works on desktop and tablet screens
- **Dark Mode**: Full dark mode support using existing theme system

### State Management

- **No Persistence**: State resets on page reload
- **No localStorage**: All state in memory only
- **Component State**: Local state for panel patterns, play state, mode toggles
- **Metronome Integration**: Read BPM from existing metronome, use its audio engine

### Interaction Requirements

- **No User Recording**: Does not listen to or record user input
- **No Scoring**: Not evaluating user performance
- **Visual Only by Default**: Default mode just shows visual cycling
- **Optional Audio**: User can enable click sounds for subdivisions

### Scope Boundaries

**In Scope:**

- 2x2 grid with 4 rhythm panels
- Standard music notation display
- Manual pattern selection per panel
- Randomize all patterns button
- Random change mode (one panel changes each cycle)
- Visual beat indicator (whole panel lights up)
- Optional play mode with metronome clicks
- Integration with existing site-wide metronome for BPM
- New navigation button in main nav bar
- Start/Stop cycling control
- Rest patterns included as options

**Out of Scope:**

- User input recording or detection
- Scoring or performance evaluation
- localStorage persistence
- Custom sound options (uses metronome click only)
- Time signatures other than 4/4
- More than 4 panels
- Per-subdivision lighting (whole panel only)
- Keyboard shortcuts
- Tutorial or onboarding
- Mobile-specific optimizations

### Technical Considerations

- **System Architecture**: Create new `src/systems/rhythm-game/` module following existing patterns
- **Metronome Hook**: Leverage existing `useMetronome` hook for timing and audio
- **Music Theory**: Need rhythm calculation utilities for valid pattern combinations
- **SVG/Canvas**: Music notation rendering (consider SVG for scalability)
- **Animation**: CSS transitions or requestAnimationFrame for smooth panel lighting
- **TypeScript**: Strict typing for rhythm patterns and state
- **Navigation**: Add route and nav button following Quiz pattern

### Implementation Notes

- Pattern combinations must mathematically equal exactly one beat
- Triplets divide the beat into 3 equal parts (not compatible with binary subdivisions in same panel)
- Consider using a music notation library or custom SVG components
- Panel lighting should be synchronized with audio when play mode is enabled
- Random change should happen at the start of each new cycle (after panel 4)
- Metronome must be running for cycling to work (or auto-start when user starts game)

### Future Enhancement Potential

- Different time signatures (3/4, 6/8)
- More panels (3x3 grid for longer patterns)
- Tap-along mode with accuracy feedback
- Custom click sounds
- Pattern presets/favorites
- Difficulty levels (limit available patterns)
