# Spec Requirements: Site-Wide Metronome

## Initial Description
Add a site-wide metronome feature that can be toggled on/off, with adjustable BPM settings. Add it to the top row next to quiz button.

**Context:**
This is for the CAGED Visualizer project - a React + TypeScript guitar learning application. The metronome should be accessible from all pages and integrate into the existing navigation bar alongside the quiz button.

## Requirements Discussion

### First Round Questions

**Q1: Audio Implementation - I assume we should use the Web Audio API for precise timing, as it's built into browsers and provides accurate scheduling. Is that correct, or would you prefer a simpler setTimeout approach?**
**Answer:** Web Audio API

**Q2: BPM Controls - I'm thinking we should include both a numeric input and a slider for BPM adjustment (common range 40-240 BPM). Should we include both input methods, or just one?**
**Answer:** Numeric input only (no slider)

**Q3: Visual Feedback - Should the metronome button show a visual pulse/beat indicator when active (flashing or color change on each beat), or just remain static with an on/off state?**
**Answer:** No indicator

**Q4: Time Signature - I assume we're starting with 4/4 time signature only. Should we include time signature controls (3/4, 6/8, etc.) in the initial implementation, or save that for future enhancement?**
**Answer:** 4/4 for now with potential extension later

**Q5: UI Design - For placement "next to quiz button" in the nav bar, should this be: (a) A button that opens a small dropdown/popover with BPM input, or (b) An inline control group showing play/pause button + BPM input always visible?**
**Answer:** Inline control group in the nav bar

**Q6: State Persistence - Should the metronome BPM setting persist across page reloads using localStorage, or reset to default each time?**
**Answer:** No localStorage storage

**Q7: Keyboard Shortcuts - Should we include keyboard shortcuts (e.g., spacebar to start/stop, arrow keys for BPM adjustment) for power users?**
**Answer:** No keyboard shortcuts

**Q8: Mobile Experience - On mobile screens where the nav bar is limited, should the metronome controls collapse into a menu, or should they remain visible with adjusted sizing?**
**Answer:** No special mobile enhancements

**Q9: Timing Accuracy - Should we implement a "lookAhead" scheduling approach (scheduling beats slightly ahead of time) for maximum timing accuracy, or is basic Web Audio API timing sufficient?**
**Answer:** No lookAhead scheduling needed for now

**Q10: What should we explicitly NOT include in this feature? (e.g., subdivision patterns, volume control, different sound options, tap tempo, accent patterns)**
**Answer:** Focus on simplicity - just the beat, nothing else

### Existing Code to Reference
No similar existing features identified for reference.

### Follow-up Questions
None required.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements
- **Metronome Toggle**: Start/stop button to activate metronome
- **BPM Control**: Numeric input field for tempo adjustment
- **Audio Output**: Metronome click sound generated via Web Audio API
- **Time Signature**: 4/4 time signature (fixed for initial implementation)
- **Site-Wide Access**: Available on all pages through navigation bar
- **Default BPM**: Should have a sensible default BPM value (typically 120 BPM)

### Non-Functional Requirements
- **Audio Accuracy**: Web Audio API for precise timing
- **Performance**: Must not impact page performance when running
- **Simplicity**: Minimal feature set - focus on core beat functionality only
- **Integration**: Seamless integration into existing AppNavigation component

### UI/UX Requirements
- **Placement**: Inline control group in navigation bar next to quiz button
- **Layout**: Always-visible controls (not hidden in dropdown/popover)
- **Components**:
  - Play/pause button (toggle state)
  - Numeric BPM input field
- **Visual Feedback**: Static button states (no beat indicators or animations)
- **Responsive Design**: Standard responsive behavior (no special mobile enhancements)
- **Styling**: Follow existing TailwindCSS patterns in AppNavigation

### State Management
- **No Persistence**: BPM resets to default on page reload
- **No localStorage**: State maintained in memory only during session
- **Component State**: Local state management (likely React hooks)

### Interaction Requirements
- **No Keyboard Shortcuts**: Mouse/touch interaction only
- **Simple Controls**: Click to start/stop, type to change BPM
- **BPM Range**: Typical metronome range (suggest 40-240 BPM with validation)

### Scope Boundaries

**In Scope:**
- Basic metronome with start/stop functionality
- BPM adjustment via numeric input
- Web Audio API implementation for click sound
- 4/4 time signature
- Integration into AppNavigation component
- Basic input validation for BPM range

**Out of Scope:**
- Visual beat indicators or animations
- BPM slider control
- Subdivision patterns (eighth notes, triplets, etc.)
- Volume control
- Different sound options or customization
- Tap tempo functionality
- Accent patterns or emphasis on beat 1
- Alternative time signatures (3/4, 6/8, etc.) - potential future enhancement
- Keyboard shortcuts
- Special mobile enhancements or layouts
- localStorage persistence
- LookAhead scheduling optimization

### Technical Considerations
- **Audio Implementation**: Web Audio API (OscillatorNode or AudioBufferSource for click sound)
- **React Integration**: Will integrate into existing AppNavigation.tsx component
- **TypeScript**: Must follow strict typing patterns used throughout project
- **Styling**: TailwindCSS 4.1.12 utility classes
- **State Pattern**: Follow existing React hooks pattern (useState for metronome state)
- **Navigation Context**: Consider if metronome state should be accessible globally or remain local to AppNavigation
- **Audio Context**: Proper cleanup and context management to avoid memory leaks
- **Browser Compatibility**: Web Audio API is well-supported in modern browsers (aligns with project's modern browser requirement)

### Implementation Notes
- Default BPM should be set to a commonly used tempo (recommend 120 BPM)
- BPM input should validate against reasonable range (40-240 BPM typical)
- Audio context should handle browser autoplay policies (may require user interaction to start)
- Component should be self-contained with minimal impact on existing navigation logic
- Click sound should be simple and unobtrusive (short, clean tone)
- Metronome should continue running when navigating between pages (site-wide functionality)

### Future Enhancement Potential
- Time signature variations (mentioned as potential extension)
- Volume control
- Visual feedback options
- Keyboard shortcuts
- Subdivision patterns
- Advanced timing optimizations (lookAhead scheduling)
