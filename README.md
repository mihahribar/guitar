# CAGED Guitar System Visualizer

An interactive web application for learning the CAGED guitar system with a modular, extensible architecture designed to support multiple guitar learning systems.

## Features
- **Visual fretboard** with color-coded chord shapes
- **Major and Minor Chord Support** - Full CAGED system implementation for both major and minor chord qualities
- **Chord Quality Toggle** - Seamlessly switch between major and minor chord patterns
- Navigate through all 5 CAGED positions for any chord (C, A, G, E, D)
- Show individual shapes or all shapes at once with gradient blending
- **Pentatonic Scale Overlay** - Toggle to show major/minor pentatonic scale notes over chord shapes for music theory context
- **All Notes Display** - Toggle to show natural note names (E, F, G, A, B, C, D) on all fret positions for fretboard navigation
- **Rhythm Practice** - Interactive rhythm training with musical notation display, customizable BPM, and audio feedback
- **Quiz Mode** - Interactive chord identification quiz with scoring system
- **Dark/Light theme toggle** with system preference detection
- Authentic neck inlay dots for reference
- Clean, minimal design focused on learning

## Installation

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

### Visualizer Mode
- **Select a root chord** (C, A, G, E, or D) and **chord quality** (Major/Minor)
- Use Previous/Next buttons to cycle through the 5 shapes
- Toggle "Show All CAGED Shapes" to see the complete pattern with gradient overlays
- Toggle "Pentatonic Scale" to overlay major/minor pentatonic scale notes in green
- Toggle "All Notes" to display natural note names on fret positions for easy navigation
- Click on any colored circle in the progress indicator to jump to that shape

### Keyboard Shortcuts
- **Space**: Toggle between single shape and all shapes view
- **Arrow Keys (←/→)**: Navigate through shapes in single shape mode
- **Numbers (1-5)**: Jump directly to a specific shape position
- **S**: Toggle pentatonic scale overlay
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

### Quiz Mode
- Click "Quiz Mode" to start a chord identification quiz
- View a chord pattern on the fretboard and identify which root chord it represents
- Choose from all 5 possible chord options (C, A, G, E, D)
- Receive immediate feedback and track your score
- Review correct answers for missed questions at the end

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
│   ├── rhythm-game/     # Rhythm practice system module
│   │   ├── components/  # Rhythm UI (panels, controls, notation)
│   │   ├── constants/   # Rhythm patterns and defaults
│   │   ├── hooks/       # Beat cycling, audio, game state
│   │   ├── types/       # Rhythm system types
│   │   └── utils/       # Timing and pattern utilities
│   └── quiz/            # Quiz learning system module
│       ├── components/  # Quiz-specific components
│       ├── constants/   # Quiz system constants
│       ├── hooks/       # Quiz-specific React hooks
│       └── types/       # Quiz system types
├── components/          # App infrastructure components
├── contexts/           # React contexts for global state
├── hooks/             # App-level React hooks
├── types/             # Infrastructure type definitions
└── utils/             # Infrastructure utilities
```

### Key Architecture Features
- **Modular Systems**: Each guitar learning system (CAGED, Rhythm, Quiz) is completely isolated
- **Shared Resources**: Common components and utilities are centralized for reuse
- **TypeScript Path Aliases**: Clean imports using `@/shared` and `@/systems`
- **Barrel Exports**: Each module provides clean export interfaces
- **Code Splitting**: Quiz and Rhythm systems are lazy-loaded for optimal performance
- **Tree Shaking**: Optimized bundle sizes through proper module structure

### Tech Stack
- **Framework**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2 with React plugin and path aliases
- **Styling**: TailwindCSS 4.1.12 with dark/light theme support
- **Code Quality**: ESLint 9.33.0 with TypeScript ESLint
- **Deployment**: GitHub Actions → GitHub Pages

### Development Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Production build with TypeScript checking
- `npm run lint` - Code quality and style checking
- `npm run preview` - Preview production build locally

### Bundle Optimization
The modular architecture enables excellent bundle optimization:
- **Main bundle**: ~214kB (66kB gzipped) - Core app + CAGED system
- **Rhythm chunk**: ~21kB (5.8kB gzipped) - Lazy-loaded rhythm system
- **Quiz chunk**: ~18kB (5.5kB gzipped) - Lazy-loaded quiz system
- **CSS bundle**: ~38kB (7.3kB gzipped) - Optimized styles
- **Total**: Fast loading with effective code splitting

## Contributing

The modular architecture makes it easy to add new guitar learning systems:

1. Create a new directory under `src/systems/[system-name]/`
2. Follow the established pattern: `components/`, `hooks/`, `types/`, `constants/`
3. Add system exports to a barrel export file
4. Import and integrate in the main app

This design supports future expansion to other guitar learning methods like scale patterns, chord progressions, or music theory exercises. The rhythm-game system demonstrates how audio-based features integrate within this architecture using Web Audio API.