# Fretboard Lab

An interactive web application for learning various guitar system with a modular, extensible architecture designed to support multiple guitar learning systems.

## Features

- **Visual fretboard** with color-coded chord shapes across a full 21-fret neck
- **Major and Minor Chord Support** - Full CAGED system implementation for both major and minor chord qualities
- **Chord Quality Toggle** - Seamlessly switch between major and minor chord patterns
- **Stack multiple patterns** - Select any combination of CAGED positions (or 3NPS modes, or triad inversions) to see how they link up, with overlapping notes split between their colors
- Walk the whole neck, including octave repeats of each shape
- **3NPS Scale System** - Three-notes-per-string major scale in all 12 keys, as two-string "dominoes" or full six-string positions, one color per mode
- **Triads** - Major, minor, diminished and augmented triads in every inversion on the four three-string sets, labelled by chord tone
- **Pentatonic Scale Overlay** - Toggle to show major/minor pentatonic scale notes over chord shapes for music theory context
- **Scale Overlay** - Overlay any of the supported scales and modes over the chord shapes
- **All Notes Display** - Toggle to show natural note names (E, F, G, A, B, C, D) on all fret positions for fretboard navigation
- **Rhythm Practice** - Interactive rhythm training with musical notation display, customizable BPM, and audio feedback
- **Dark/Light theme toggle** with system preference detection
- Authentic neck inlay dots for reference
- Clean, minimal design focused on learning

## Installation

Requires **Node 22.22.1 or newer** (Vitest 5, jsdom 30 and lint-staged 17 each
set their own floor in that range; CI runs Node 24).

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`

## Usage

### CAGED Visualizer

- **Select a root chord** (C, A, G, E, or D) and **chord quality** (Major/Minor)
- Each chip in the selector is one playable position, labelled with its shape and base fret
- **Tap a chip to stack it** on the fretboard; tap again to remove it. Shift-click shows that position on its own
- Use Previous/Next to walk every selected position one step up or down the neck together
- Toggle "Show All Shapes" to light up the whole neck; switching it back off restores the selection you had
- Toggle "Pentatonic Scale" to overlay major/minor pentatonic scale notes in green
- Toggle "Scale" to overlay a chosen scale or mode, and pick the scale from the dropdown
- Toggle "All Notes" to display natural note names on fret positions for easy navigation

#### Keyboard Shortcuts

- **Arrow Keys (←/→)**: Walk every selected position down/up the neck
- **Numbers (1-9)**: Add or remove that position; **⇧1-9** shows it on its own
- **Space**: Select every position, or collapse back to your previous selection
- **S**: Toggle pentatonic scale overlay
- **M**: Toggle scale overlay
- **N**: Toggle all notes display

### 3NPS Scale System

- Click "3NPS" to explore the three-notes-per-string major scale
- **Pick any of the 12 roots**, then choose a string pair (6–5 through 2–1) or turn on "All Strings" for full six-string positions
- Each chip is one mode, from Ionian to Locrian, labelled with the note it starts on
- **Tap modes to stack them** and see how neighbouring dominoes connect; shift-click shows one alone
- Use Previous/Next to rotate the whole selection one step up or down the neck
- Toggle "Whole Neck" to show every occurrence of the selected modes instead of just the one nearest your position
- Toggle "All Notes" to display note names across the fretboard

#### Keyboard Shortcuts

- **Arrow Keys (←/→)**: Walk the selection down/up the neck
- **Arrow Keys (↑/↓)**: Move to the higher/lower string pair
- **Numbers (1-7)**: Add or remove that mode; **⇧1-7** shows it on its own
- **0**: Select every mode, or collapse back to one
- **Space**: Toggle whole neck
- **A**: Toggle all strings
- **N**: Toggle all notes display

### Triads

- Click "Triads" to explore close-voiced triads on three adjacent strings
- **Pick any of the 12 roots** and a quality: major, minor, diminished or augmented
- Choose one or more string sets (EAD, ADG, DGB, GBE); shift-click shows one alone
- Each chip is one inversion (root position, 1st, 2nd), each with its own color; every dot shows its chord tone (R, 3, 5, with ♭ or ♯ as the quality needs)
- Use Previous/Next to walk the selected inversions up or down the neck
- Toggle "Whole Neck" to show every occurrence of the selected inversions

#### Keyboard Shortcuts

- **Arrow Keys (←/→)**: Walk the selection down/up the neck
- **Arrow Keys (↑/↓)**: Move the selected string sets toward the high/low strings
- **Numbers (1-3)**: Add or remove that inversion; **⇧1-3** shows it on its own
- **0**: Select every inversion, or collapse back to one
- **Space**: Toggle whole neck
- **N**: Toggle all notes display

### Rhythm Practice

- Click "Rhythm" to access the rhythm training system
- View 4 rhythm panels displaying different subdivision patterns with musical notation
- Click any panel to change its rhythm pattern from a library of common subdivisions
- Set your tempo with the BPM input (30-300 BPM)
- Click Start to begin cycling through the panels with audio beat clicks
- Enable "Play Notes" to hear the subdivision notes for each pattern
- Enable "Random Change" to have patterns randomly change after each cycle
- Use "Randomize" to shuffle all patterns at once

## Building for Production

```bash
npm run build
```

## Project Architecture

This project features a **modular multi-system architecture** designed for scalability and maintainability:

### Directory Structure

```
src/
├── shared/                 # Reusable components, utilities, and types
│   ├── components/        # Shared UI components (FretboardDisplay, AppNavigation)
│   ├── constants/         # Shared constants and magic numbers
│   ├── types/            # Shared TypeScript type definitions
│   └── utils/            # Shared utilities (music theory, chord calculations)
├── systems/              # Modular learning systems
│   ├── caged/           # CAGED chord system module
│   │   ├── components/  # CAGED-specific components
│   │   ├── constants/   # CAGED system constants
│   │   ├── hooks/       # CAGED-specific React hooks
│   │   ├── types/       # CAGED system types
│   │   └── utils/       # CAGED-specific utilities
│   ├── three-nps/       # Three-notes-per-string scale system module
│   │   ├── components/  # 3NPS page, navigation, toggles
│   │   ├── constants/   # Scale steps, mode colours, string pairs
│   │   ├── hooks/       # 3NPS state, logic, keyboard
│   │   ├── types/       # 3NPS system types
│   │   └── utils/       # Pattern and sequence generation (+ tests)
│   ├── triads/          # Triads system module
│   │   ├── components/  # Triads page, navigation, toggles
│   │   ├── constants/   # Qualities, inversion colours, string sets
│   │   ├── hooks/       # Triads state, logic, keyboard
│   │   ├── types/       # Triads system types
│   │   └── utils/       # Triad and sequence generation (+ tests)
│   └── rhythm-game/     # Rhythm practice system module
│       ├── components/  # Rhythm UI (panels, controls, notation)
│       ├── constants/   # Rhythm patterns and defaults
│       ├── hooks/       # Beat cycling, audio, game state
│       ├── types/       # Rhythm system types
│       └── utils/       # Timing and pattern utilities
├── components/          # App infrastructure components
├── contexts/           # React contexts for global state
├── hooks/             # App-level React hooks
├── types/             # Infrastructure type definitions
└── utils/             # Infrastructure utilities
```

### Key Architecture Features

- **Modular Systems**: Each guitar learning system (CAGED, 3NPS, Triads, Rhythm) is completely isolated
- **Shared Resources**: Common components and utilities are centralized for reuse
- **TypeScript Path Aliases**: Clean imports using `@/shared` and `@/systems`
- **Barrel Exports**: Each module provides clean export interfaces
- **Code Splitting**: 3NPS, Triads and Rhythm systems are lazy-loaded for optimal performance
- **Tree Shaking**: Optimized bundle sizes through proper module structure

### Tech Stack

- **Framework**: React 19.3.0 + TypeScript 6.0.3
- **Build Tool**: Vite 8.3.0 with React plugin and path aliases
- **Styling**: TailwindCSS 4.3.3 with dark/light theme support
- **Code Quality**: ESLint 10.10.0 with typescript-eslint
- **Testing**: Vitest 5.0.1 with jsdom
- **Deployment**: GitHub Actions → GitHub Pages

### Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Production build with TypeScript checking
- `npm run lint` - Code quality and style checking
- `npm run preview` - Preview production build locally

### Bundle Optimization

The modular architecture enables excellent bundle optimization:

- **Main bundle**: ~250kB (77kB gzipped) - Core app + CAGED system
- **Shared chunk**: ~18kB (6.5kB gzipped) - Components shared across systems
- **Rhythm chunk**: ~28kB (7kB gzipped) - Lazy-loaded rhythm system
- **3NPS chunk**: ~18kB (6.5kB gzipped) - Lazy-loaded 3NPS system
- **Triads chunk**: ~18kB (6kB gzipped) - Lazy-loaded triads system
- **CSS bundle**: ~37kB (7.5kB gzipped) - Optimized styles
- **Total**: Fast loading with effective code splitting

## Contributing

The modular architecture makes it easy to add new guitar learning systems:

1. Create a new directory under `src/systems/[system-name]/`
2. Follow the established pattern: `components/`, `hooks/`, `types/`, `constants/`
3. Add system exports to a barrel export file
4. Import and integrate in the main app

This design supports future expansion to other guitar learning methods like scale patterns, chord progressions, or music theory exercises. The rhythm-game system demonstrates how audio-based features integrate within this architecture using Web Audio API.
