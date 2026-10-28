# Fretboard Lab

An interactive web application for learning various guitar system with a modular, extensible architecture designed to support multiple guitar learning systems.

## Features

- **Visual fretboard** with color-coded chord shapes across a full 21-fret neck
- **Major and Minor Chord Support** - Full CAGED system implementation for both major and minor chord qualities
- **Chord Quality Toggle** - Seamlessly switch between major and minor chord patterns
- **Stack multiple patterns** - Select any combination of CAGED positions (or 3NPS modes, or triad and seventh-chord inversions) to see how they link up, with overlapping notes split between their colors
- Walk the whole neck, including octave repeats of each shape
- **3NPS Scale System** - Three-notes-per-string major scale in all 12 keys, as two-string "dominoes" or full six-string positions, one color per mode
- **Triads** - Major, minor, diminished and augmented triads in every inversion on the four three-string sets, labelled by chord tone
- **7ths** - Major 7, dominant 7, minor 7, minor 7♭5 and diminished 7 chords in every inversion, as drop 2 and drop 3 voicings on three four-string sets, labelled by chord tone
- **Pentatonic Scale Overlay** - Toggle to show major/minor pentatonic scale notes over chord shapes for music theory context
- **Scale Overlay** - Overlay any of the supported scales and modes over the chord shapes
- **All Notes Display** - Toggle to show natural note names (E, F, G, A, B, C, D) on all fret positions for fretboard navigation
- **Rhythm Practice** - Interactive rhythm training with musical notation display, customizable BPM, and audio feedback
- **Shareable links** - Every page keeps its settings in the URL, so a teacher can send a link to an exact exercise
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

- **Select any of the 12 roots** and a **chord quality** (Major/Minor)
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

### 7ths

- Click "7ths" to explore four-note seventh chords, one note per string
- **Pick any of the 12 roots** and a quality: maj7, 7, m7, m7♭5 or °7
- Choose one or more string sets: E·DGB (drop 3, A string muted), ADGB and DGBE (drop 2); shift-click shows one alone
- Each chip is one inversion (root position, 1st, 2nd, 3rd), each with its own color; every dot shows its chord tone (R, 3, 5, 7, with ♭ as the quality needs)
- The root positions are the classic 6th-, 5th- and 4th-string-root shapes
- Use Previous/Next to walk the selected inversions up or down the neck
- Toggle "Whole Neck" to show every occurrence of the selected inversions

#### Keyboard Shortcuts

- **Arrow Keys (←/→)**: Walk the selection down/up the neck
- **Arrow Keys (↑/↓)**: Move the selected string sets toward the high/low strings
- **Numbers (1-4)**: Add or remove that inversion; **⇧1-4** shows it on its own
- **0**: Select every inversion, or collapse back to one
- **Space**: Toggle whole neck
- **N**: Toggle all notes display

### Rhythm Practice

- Click "Rhythm" to access the rhythm training system
- View 4 rhythm panels displaying different subdivision patterns with musical notation
- Click any panel to change its rhythm pattern from a library of common subdivisions
- Set your tempo with the BPM input (40-240 BPM)
- Click Start to begin cycling through the panels with audio beat clicks
- Enable "Play Notes" to hear the subdivision notes for each pattern
- Enable "Random Change" to have patterns randomly change after each cycle
- Use "Randomize" to shuffle all patterns at once

### Sharing a Setup

Every page has its own address (`/caged/`, `/3nps/`, `/triads/`, `/sevenths/`, `/rhythm/`), and the
address bar always holds the page's current settings. Set up an exercise, then press the share
button in the top bar: it opens the share sheet on phones and copies the link everywhere else.
Opening the link restores the same setup, and reloading the page keeps yours.

Settings left at their defaults are left out of the link. Links can also be written by hand:

| Page                | Params                                                                                                   | Example                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| All fretboard pages | `key` root note (`G`, `F#` or `Fs`, `Bb`)                                                                | `key=G`                                                      |
| CAGED               | `q` major/minor, `pos` positions (or `all`), `penta=1`, `notes=1`, `scale` overlay                       | `/caged/?key=G&q=minor&pos=0,2&scale=dorian`                 |
| 3NPS                | `modes` by name, `pair` low string (6-2), `strings=all`, `at` fret, `neck=1`, `notes=1`                  | `/3nps/?key=A&modes=ionian,lydian&pair=5`                    |
| Triads              | `q` quality, `inv` inversions (0-2), `sets` (EAD, ADG, DGB, GBE), `at`, `neck=1`, `notes=1`              | `/triads/?key=D&q=minor&inv=1,2&sets=DGB,GBE`                |
| 7ths                | `q` (maj7, dom7, min7, min7b5, dim7), `inv` (0-3), `sets` (e-dgb, adgb, dgbe), `at`, `neck=1`, `notes=1` | `/sevenths/?key=Bb&q=min7b5&sets=adgb`                       |
| Rhythm              | `bpm`, `panels` four pattern ids, `pool` pattern ids (or `none`), `random=1`, `audio=1`, `metronome=0`   | `/rhythm/?bpm=80&panels=quarter,two-eighths,triplet,quarter` |

Anything the app doesn't recognise falls back to its default, and `at` (the fret the selection
sits near) snaps to the nearest real position.

## Building for Production

```bash
npm run build
```

GitHub Pages has no fallback for single-page apps, so the build also writes a copy of
`index.html` for every page (`dist/triads/index.html` and so on). The list of pages is
`APP_PAGES` in `src/app/navigation/pages.ts`.

## Project Architecture

This project features a **modular multi-system architecture** designed for scalability and maintainability:

### Directory Structure

```
src/
├── app/                    # App shell: error boundary, theme, page navigation
│   ├── theme/             # Theme context, provider and toggle
│   └── navigation/        # Page list and paths, navigation context, top bar
├── shared/                 # Reusable components, utilities, and types
│   ├── components/        # Shared UI components (FretboardDisplay, voicing page, modal)
│   ├── constants/         # Fretboard and music theory constants
│   ├── hooks/             # Shared React hooks (URL settings sync)
│   ├── types/            # Shared TypeScript type definitions
│   └── utils/            # Shared utilities (music theory, chord voicings, selection reducer, URL params)
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
│   │   ├── components/  # Triads page (renders the shared VoicingPage)
│   │   ├── constants/   # Qualities, inversion colours, string sets
│   │   ├── types/       # Triads system types
│   │   ├── utils/       # Triad and sequence generation (+ tests)
│   │   └── system.ts    # VoicingSystem definition: labels, string set chips, link names
│   ├── sevenths/        # Seventh chords (7ths) system module
│   │   ├── components/  # 7ths page (renders the shared VoicingPage)
│   │   ├── constants/   # Qualities, inversion colours, string sets
│   │   ├── types/       # 7ths system types
│   │   ├── utils/       # Seventh chord sequences (+ tests)
│   │   └── system.ts    # VoicingSystem definition: labels, string set chips, link names
│   └── rhythm-game/     # Rhythm practice system module
│       ├── components/  # Rhythm UI (panels, controls, notation)
│       ├── constants/   # Rhythm patterns, defaults and metronome settings
│       ├── hooks/       # Beat cycling, audio, game state
│       ├── types/       # Rhythm system types
│       └── utils/       # Timing and pattern utilities
├── App.tsx              # Providers and the page switch
└── main.tsx             # Entry point
```

### Key Architecture Features

- **Modular Systems**: Each guitar learning system (CAGED, 3NPS, Triads, 7ths, Rhythm) is completely isolated
- **Settings in the URL**: each system's state hook reads its settings from the query string on load and writes changes back with `replaceState`
- **Shared Resources**: Common components and utilities are centralized for reuse
- **TypeScript Path Aliases**: Clean imports using `@/shared` and `@/systems`
- **Barrel Exports**: Each module provides clean export interfaces
- **Code Splitting**: 3NPS, Triads, 7ths and Rhythm systems are lazy-loaded for optimal performance
- **Tree Shaking**: Optimized bundle sizes through proper module structure

### Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite with React plugin and path aliases
- **Styling**: TailwindCSS 4 with dark/light theme support
- **Code Quality**: ESLint with typescript-eslint
- **Testing**: Vitest with jsdom
- **Deployment**: GitHub Actions → GitHub Pages

### Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Production build with TypeScript checking
- `npm run lint` - Code quality and style checking
- `npm run format:check` - Check formatting with Prettier (`npm run format` fixes it)
- `npm run knip` - Find unused files, exports and dependencies
- `npm run test:run` - Run the tests once
- `npm run preview` - Preview production build locally

CI runs lint, the formatting check, knip, the tests and the build on every push to `main`, and
only deploys when all of them pass.

### Bundle Optimization

The modular architecture enables excellent bundle optimization:

- **Main bundle**: ~250kB (77kB gzipped) - Core app + CAGED system
- **Shared chunk**: ~24kB (8kB gzipped) - Components and voicing logic shared across systems
- **Rhythm chunk**: ~28kB (7kB gzipped) - Lazy-loaded rhythm system
- **3NPS chunk**: ~18kB (6kB gzipped) - Lazy-loaded 3NPS system
- **Triads chunk**: ~15kB (5kB gzipped) - Lazy-loaded triads system
- **7ths chunk**: ~16kB (5.5kB gzipped) - Lazy-loaded seventh chords system
- **CSS bundle**: ~36kB (7.5kB gzipped) - Optimized styles
- **Total**: Fast loading with effective code splitting

## Contributing

The modular architecture makes it easy to add new guitar learning systems:

1. Create a new directory under `src/systems/[system-name]/`
2. Follow the established pattern: `components/`, `hooks/`, `types/`, `constants/`
3. Add system exports to a barrel export file
4. Import and integrate in the main app
5. Add the page to `APP_PAGES` in `src/app/navigation/pages.ts` so it gets its own path, and give its state hook an encode/decode pair so its settings can be shared (see `src/shared/utils/urlParams.ts`)

This design supports future expansion to other guitar learning methods like scale patterns, chord progressions, or music theory exercises. The rhythm-game system demonstrates how audio-based features integrate within this architecture using Web Audio API.
