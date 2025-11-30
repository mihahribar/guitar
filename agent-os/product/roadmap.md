# Product Roadmap

## Current State (Completed)

The CAGED Visualizer has successfully launched with a solid foundation covering core interactive visualization and learning features:

- Interactive CAGED chord visualizer with all 5 shapes (C, A, G, E, D)
- Major and minor chord quality support with seamless toggling
- Pentatonic scale overlays (major and minor patterns)
- Multi-shape display mode with gradient blending
- Quiz system for chord recognition practice
- Guitar modes visualizer covering all 7 traditional modes
- Dark/light theme support with automatic detection
- Keyboard navigation for hands-free exploration
- Mobile-responsive design
- GitHub Pages deployment with custom domain
- Modular multi-system architecture with excellent code organization

Make all the buttons more vibrant, maybe use some gradients and hover effects to improve user engagement.

## Development Roadmap

0. [ ] Add a site wide metronome feature that can be toggled on/off, with adjustable BPM settings. Add it to the top row next to quiz button. `S`

1. [ ] Create a rhythm & picking game, where users can practice strumming patterns and picking techniques in time with a metronome. Use the fretboard to display tabulature/notes. Focus only on one string. Randomly cycle between quarter, eight, tripple notes and use a randomize function to combine various combinations. `M`

2. [ ] Create a circle of fifths visualizer that integrates with the CAGED system, allowing users to see relationships between keys and how chord shapes shift when changing keys. Include interactive features to highlight relative minors and common chord progressions. `M`

3. [ ] Create scale chord visualisation system, where the learner can select a major/minor scale in a specific key, and then cycle through all the chords in that scale up an down the fretboard. Visualize how chords are built (1st, 3rd, 5th notes of the scale etc).

4. [ ] Audio Integration System — Add playback functionality that plays actual chord sounds when users click on chord positions, with support for different voicings and the ability to hear the difference between major/minor qualities. Include arpeggio playback mode and adjustable tempo controls. `L`

5. [ ] User Progress Tracking — Implement local storage-based system to track which CAGED shapes users have explored, quiz performance history over time, and personal best scores. Display progress visualizations and achievement milestones to motivate continued learning. `M`

6. [ ] Enhanced Quiz Modes — Expand quiz system with multiple difficulty levels (beginner: root notes only, intermediate: full chord shapes, advanced: chord extensions), timed challenges with countdown modes, and mistake review mode that focuses on previously incorrect answers. `M`

7. [ ] Chord Extensions Module — Create new learning system for 7th, 9th, 11th, and 13th chords, showing how these extensions layer onto the basic CAGED shapes. Include jazz voicing patterns and common chord substitution visualizations. `XL`

8. [ ] Scale System Visualizer — Build comprehensive scale exploration module covering three-note-per-string patterns, five CAGED-based scale positions, exotic scales (harmonic minor, melodic minor, diminished, whole tone), and scale-to-chord relationship views. `XL`

9. [ ] Chord Progression Builder — Interactive tool for building and visualizing common chord progressions (I-IV-V, ii-V-I, etc.), showing how to voice progressions using CAGED shapes with smooth voice leading, and suggesting optimal fingerings for transitions. `L`

10. [ ] Fretboard Note Training — Dedicated learning mode focused on memorizing individual note positions across the entire fretboard, with quiz modes for finding specific notes, identifying note patterns, and speed drills with timed challenges. `M`

11. [ ] Custom Tuning Support — Extend the visualizer to support alternative tunings (Drop D, DADGAD, Open G, Open D, etc.), recalculating all chord shapes and scale patterns dynamically based on selected tuning. `L`

12. [ ] Practice Session Manager — Create structured practice workflows with customizable session templates, warm-up routines combining multiple learning systems, practice timers with intervals, and session history tracking to monitor daily practice habits. `M`

13. [ ] Social Sharing Features — Enable users to share specific chord positions or quiz scores via generated shareable URLs, create embeddable widgets for blog posts and forums, and add screenshot generation for social media sharing. `S`

14. [ ] Arpeggio Pattern System — New learning module visualizing arpeggio patterns across CAGED positions for triads, 7th chord arpeggios, and extended arpeggios, with sweep picking and alternate picking pattern suggestions. `L`

15. [ ] Mobile App Development — Build native iOS and Android applications with offline mode support, haptic feedback for interactions, device-optimized touch gestures, and potential AR features for overlaying patterns on real guitars. `XL`

> Notes
>
> - Roadmap prioritizes features that directly support the mission of making guitar theory visual and accessible
> - Ordering balances quick wins (audio integration, progress tracking) with foundational systems (chord extensions, scales) that enable future features
> - Each feature is designed as an end-to-end implementation including both UI and underlying music theory calculations
> - Mobile app is positioned late to ensure web platform is feature-complete first
> - Architecture supports parallel development of multiple learning system modules
