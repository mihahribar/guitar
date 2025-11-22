# CAGED Visualizer Project - Claude Development Guide

## Project Overview
Interactive React web application for learning the CAGED guitar system - a guitar learning method that teaches 5 chord shapes that can be moved up and down the neck. The app includes an interactive visualizer, quiz mode for chord identification practice and rhythm practice with audio feedback. **Now supports both major and minor chord qualities** with complete CAGED implementation for all chord types.

**Live Site**: [caged.hribar.org](https://caged.hribar.org)

## Architecture Summary
- **Pattern**: Modern React SPA with **modular multi-system architecture**
- **State Management**: React hooks with context for theme/navigation, local state for component logic
- **UI Approach**: Component composition with separation of concerns and system isolation
- **Data Flow**: Props down, callbacks up pattern with custom hooks encapsulating complex logic
- **Modularity**: Complete separation of guitar learning systems with shared utilities
- **Scalability**: Designed to support multiple guitar learning systems beyond CAGED

## Tech Stack
- **Framework**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2 with React plugin and TypeScript path aliases
- **Styling**: TailwindCSS 4.1.12 (latest version with native CSS support)
- **Development**: ESLint 9.33.0 with TypeScript ESLint
- **Deployment**: GitHub Actions → GitHub Pages

## Project Structure (Modular Multi-System Architecture)
```
src/
├── App.tsx                     # Root app with navigation logic
├── main.tsx                    # React entry point
├── index.css                   # Global styles + TailwindCSS
├── shared/                     # Reusable across all learning systems
│   ├── components/            # Shared UI components
│   │   ├── FretboardDisplay.tsx   # Guitar fretboard renderer
│   │   ├── AppNavigation.tsx      # Top navigation bar
│   │   ├── ThemeToggle.tsx        # Theme switcher
│   │   └── LoadingFallback.tsx    # Loading states
│   ├── constants/             # Shared constants and magic numbers
│   │   └── magicNumbers.ts    # Fretboard, UI, validation constants
│   ├── types/                 # Shared TypeScript definitions
│   │   ├── core.ts            # Core types (ChordType, ChordQuality)
│   │   └── fretboard.ts       # Fretboard-related types
│   ├── utils/                 # Shared utilities
│   │   ├── musicTheory.ts     # Music theory calculations
│   │   └── chordUtils.ts      # Chord calculation utilities
│   └── hooks/                 # Shared hooks (currently none)
├── systems/                   # Modular learning systems
│   ├── caged/                 # CAGED chord system module
│   │   ├── components/        # CAGED-specific components
│   │   │   ├── CAGEDVisualizer.tsx    # Main visualizer
│   │   │   ├── CAGEDNavigation.tsx    # Shape navigation
│   │   │   ├── ViewModeToggles.tsx    # Toggle controls
│   │   │   ├── ChordQualityToggle.tsx # Major/minor toggle
│   │   │   ├── ShowAllToggle.tsx      # Show all shapes
│   │   │   ├── PentatonicToggle.tsx   # Pentatonic overlay
│   │   │   └── AllNotesToggle.tsx     # All notes display
│   │   ├── hooks/             # CAGED-specific hooks
│   │   │   ├── useCAGEDLogic.ts       # Core calculations
│   │   │   ├── useCAGEDState.ts       # State management
│   │   │   ├── useCAGEDSequence.ts    # Shape sequencing
│   │   │   └── useKeyboardNavigation.ts # Keyboard shortcuts
│   │   ├── constants/         # CAGED system data/patterns
│   │   │   └── index.ts       # Shape definitions and constants
│   │   ├── types/             # CAGED-specific types
│   │   │   └── index.ts       # CAGED interfaces and types
│   │   └── utils/             # CAGED-specific utilities
│   ├── rhythm-game/           # Rhythm practice system module
│   │   ├── components/        # Rhythm UI components
│   │   │   ├── RhythmPage.tsx        # Main rhythm page
│   │   │   ├── RhythmGrid.tsx        # 4-panel grid layout
│   │   │   ├── RhythmPanel.tsx       # Individual rhythm panel
│   │   │   ├── RhythmControls.tsx    # BPM, play, toggles
│   │   │   ├── PatternSelector.tsx   # Pattern selection modal
│   │   │   ├── NotationDisplay.tsx   # Musical notation renderer
│   │   │   └── NotationSymbols.tsx   # SVG notation components
│   │   ├── hooks/             # Rhythm-specific hooks
│   │   │   ├── useRhythmGame.ts      # Main game orchestration
│   │   │   ├── useRhythmCycler.ts    # Beat cycling logic
│   │   │   └── useSubdivisionAudio.ts # Web Audio API playback
│   │   ├── constants/         # Rhythm patterns and defaults
│   │   │   ├── index.ts       # Default panels and config
│   │   │   └── patterns.ts    # All rhythm pattern definitions
│   │   ├── types/             # Rhythm system types
│   │   │   └── index.ts       # RhythmPattern, Note, etc.
│   │   └── utils/             # Rhythm utilities
│   │       └── rhythmUtils.ts # Timing calculations
│   └── quiz/                  # Quiz learning system module
│       ├── components/        # Quiz-specific components
│       │   ├── QuizPage.tsx           # Quiz mode entry point
│       │   ├── QuizQuestion.tsx       # Individual questions
│       │   ├── QuizResults.tsx        # Quiz completion screen
│       │   ├── QuizProgress.tsx       # Progress indicator
│       │   └── QuizModeToggle.tsx     # Quiz mode navigation
│       ├── hooks/             # Quiz-specific hooks
│       │   ├── useQuiz.ts             # Quiz state management
│       │   ├── useQuizLogic.ts        # Question generation
│       │   ├── useQuizState.ts        # Quiz state handling
│       │   └── useQuizPreferences.ts  # Quiz preferences
│       ├── constants/         # Quiz configuration
│       │   ├── index.ts       # Quiz constants
│       │   └── quizConfig.ts  # Default quiz settings
│       └── types/             # Quiz-specific types
│           └── index.ts       # Quiz interfaces and types
├── components/                # App infrastructure components
│   ├── ErrorBoundary.tsx     # Error handling
│   └── SafeComponent.tsx     # Safe component wrapper
├── contexts/                  # React contexts for global state
│   ├── ThemeContext.tsx      # Dark/light theme management
│   ├── theme.ts              # Theme type definitions
│   ├── NavigationContext.tsx # App navigation state
│   └── NavigationContextCore.ts # Navigation core logic
├── hooks/                     # App-level React hooks
│   ├── useTheme.ts           # Theme management
│   └── useNavigation.ts      # App navigation
├── types/                     # Infrastructure type definitions
│   ├── navigation.ts         # Navigation types
│   └── errors.ts             # Error handling types
├── utils/                     # Infrastructure utilities
│   ├── errorLogger.ts        # Error logging
│   ├── inputValidation.ts    # Input validation
│   ├── performanceMonitor.ts # Performance monitoring
│   └── safeStorage.ts        # Safe localStorage operations
└── assets/                    # Static assets
```

## Modular Architecture Features

### TypeScript Path Aliases
The project uses TypeScript path aliases for clean, predictable imports:
- `@/shared` - Access to shared utilities, components, and types
- `@/systems/caged` - CAGED system module imports
- `@/systems/rhythm-game` - Rhythm practice system imports
- `@/systems/quiz` - Quiz system module imports

Example imports:
```typescript
// Shared utilities
import { FretboardDisplay } from '@/shared/components';
import { FRETBOARD_CONSTANTS } from '@/shared/constants';

// System-specific imports
import { CAGEDVisualizer } from '@/systems/caged/components';
import { useQuiz } from '@/systems/quiz/hooks';
```

### Barrel Exports
Each module provides clean barrel exports for easy consumption:
- `src/shared/index.ts` - All shared resources
- `src/systems/caged/index.ts` - Complete CAGED system
- `src/systems/rhythm-game/index.ts` - Complete rhythm system
- `src/systems/quiz/index.ts` - Complete quiz system

### System Isolation
- Each learning system is completely self-contained
- Systems can access shared utilities but not each other directly
- Cross-system dependencies must go through shared utilities
- Each system maintains its own types, constants, and business logic

### Code Splitting & Performance
- Quiz and Rhythm systems are lazy-loaded for optimal initial bundle size
- Modular structure enables excellent tree shaking
- Bundle sizes: Main (~214kB), Rhythm chunk (~21kB), Quiz chunk (~18kB), CSS (~38kB)

## Code Conventions & Patterns

### Naming Conventions
- **Components**: PascalCase (`CAGEDVisualizer.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCAGEDLogic.ts`)
- **Types**: PascalCase interfaces (`ChordType`, `QuizSession`)
- **Constants**: SCREAMING_SNAKE_CASE (`CAGED_SHAPE_DATA`)
- **Files**: PascalCase for components, camelCase for utilities

### Component Patterns
- **Functional components only** - no class components
- **Custom hooks for logic** - components focus on rendering
- **Props interface definitions** - always typed
- **Conditional rendering** - using `&&` and ternary operators
- **Event handlers** - named with `handle` or `on` prefix

### State Management Patterns
- **Local state**: `useState` for simple component state
- **Complex logic**: Custom hooks with `useMemo` for expensive calculations
- **Global state**: React Context (Theme, Navigation)
- **State updates**: Immutable patterns with proper dependencies

### TypeScript Usage
- **Strict mode enabled** - full type checking
- **Interface over type** - for object shapes
- **Union types** - for limited options (`ChordType = 'C' | 'A' | 'G' | 'E' | 'D'`)
- **Type exports** - explicit type-only imports/exports
- **Generic types** - used sparingly, mainly in hooks

### Styling Approach
- **TailwindCSS utility classes** - primary styling method
- **CSS custom properties** - for complex fretboard layout
- **Dark mode support** - using Tailwind's dark: prefix
- **Responsive design** - mobile-first approach
- **CSS Grid/Flexbox** - for complex layouts

## Key Dependencies & Their Purpose
- **@tailwindcss/vite**: TailwindCSS 4.x integration with Vite
- **react**: Core React library (latest v19)
- **typescript**: Full TypeScript support
- **@vitejs/plugin-react**: Vite React support with Fast Refresh
- **eslint**: Code quality with React hooks rules

## Development Workflow

### Available Scripts
```bash
npm run dev      # Development server (http://localhost:5173)
npm run build    # Production build (runs TypeScript check first)
npm run lint     # ESLint code quality check  
npm run preview  # Preview production build locally
```

### Development Process
1. **Start dev server**: `npm run dev`
2. **Code changes**: Auto-reload via Vite HMR
3. **Type checking**: Continuous via TypeScript
4. **Code quality**: Run `npm run lint` before commits
5. **Build testing**: `npm run build` before deployment

### Deployment Process
- **Trigger**: Push to `main` branch
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Build**: `npm ci && npm run build`
- **Deploy**: GitHub Pages from `/dist` folder
- **Domain**: Custom domain configured via CNAME

## Music Theory Context (CAGED System)
The app implements the CAGED guitar system with full major and minor chord support:

### Chord Shapes and Qualities
- **5 chord shapes**: C, A, G, E, D - moveable patterns for both major and minor
- **Major chord patterns**: Original CAGED system implementation
- **Minor chord patterns**: Parallel implementation with flattened thirds
- **Chord quality toggle**: Seamless switching between major/minor via `ChordQuality` type

### Music Theory Implementation
- **Chromatic intervals**: Mathematical chord transposition for all qualities
- **Major chord intervals**: Root (0), Major Third (4), Perfect Fifth (7)
- **Minor chord intervals**: Root (0), Minor Third (3), Perfect Fifth (7)
- **Pentatonic scales**: Major (0,2,4,7,9) and Minor (0,3,5,7,10) pentatonic intervals
- **Fretboard logic**: 15 frets, standard tuning (E-A-D-G-B-E)
- **Pattern calculation**: Shape + quality + position = chord voicing
- **Visual overlays**: Color-coded shapes with gradient blending for overlapping patterns

### Data Structure Organization
- **`CAGED_SHAPES_BY_QUALITY`**: Combined data structure organizing major/minor patterns
- **Dynamic shape selection**: Runtime selection based on `chordQuality` state
- **Consistent color coding**: Same colors for major/minor versions of each shape
- **Root note preservation**: Same root note positions for major/minor variants

## Claude-Specific Guidance

### Context Guidelines
When asking Claude for help with this project:
1. **Specify component location** - include file paths
2. **Mention feature area** - visualizer vs quiz vs theme/navigation
3. **Include TypeScript context** - types are crucial for accuracy
4. **Reference existing patterns** - point to similar code when requesting changes

### Effective Prompts
```
"Add a new feature to the visualizer component that [description]. Follow the existing pattern in CAGEDVisualizer.tsx and use the custom hooks pattern."

"Fix a bug in the quiz system where [issue]. The quiz logic is in src/hooks/useQuiz.ts and the UI is in src/components/QuizQuestion.tsx."

"Update the theme system to support [new feature]. The theme context is in src/contexts/ThemeContext.tsx."
```

### Code Generation Guidelines
- **Follow existing patterns** - check neighboring components first
- **Use TypeScript interfaces** - define types before implementation  
- **Leverage custom hooks** - extract complex logic from components
- **Maintain accessibility** - include ARIA labels and semantic HTML
- **Follow TailwindCSS patterns** - use utility classes, avoid custom CSS
- **Test responsive behavior** - consider mobile/desktop layouts

### Important Constraints
- **Music theory accuracy** - CAGED calculations must be mathematically correct
- **Performance** - use `useMemo` for expensive calculations
- **Accessibility** - keyboard navigation, screen reader support
- **Mobile support** - responsive design is crucial
- **TypeScript strict mode** - all code must pass type checking

### File Organization Rules
- **System Modules**: Complete isolation of learning systems in `src/systems/[system]/`
- **Shared Resources**: Reusable components, utilities, types in `src/shared/`
- **Infrastructure**: App-level components, contexts, utils in root directories
- **Components**: UI rendering only, delegate logic to hooks
- **Hooks**: Encapsulate state and complex calculations within system boundaries
- **Constants**: Static data, no logic - organized by system
- **Types**: TypeScript definitions - shared types in `src/shared/types/`, system-specific in system modules
- **Contexts**: Global app state management (theme, navigation) only

### Common Task Templates

#### Adding New Quiz Features
1. Update types in `src/systems/quiz/types/index.ts`
2. Modify quiz logic in `src/systems/quiz/hooks/` (useQuiz.ts or related hooks)
3. Update UI components in `src/systems/quiz/components/Quiz*.tsx`
4. Add/update constants in `src/systems/quiz/constants/`
5. Test with different chord combinations

#### Modifying CAGED Logic
1. Review music theory in `src/systems/caged/constants/index.ts`
2. Update calculation logic in `src/systems/caged/hooks/useCAGEDLogic.ts`
3. Test with all chord shapes and positions
4. Verify visual accuracy on fretboard

#### Adding Rhythm Features
1. Update types in `src/systems/rhythm-game/types/index.ts`
2. Add patterns in `src/systems/rhythm-game/constants/patterns.ts`
3. Modify game logic in `src/systems/rhythm-game/hooks/useRhythmGame.ts`
4. Update audio in `src/systems/rhythm-game/hooks/useSubdivisionAudio.ts`
5. Test with different BPM values and pattern combinations

#### Adding New Learning System
1. Create new directory `src/systems/[system-name]/`
2. Set up standard structure: `components/`, `hooks/`, `types/`, `constants/`
3. Create barrel export `src/systems/[system-name]/index.ts`
4. Add navigation integration in `src/types/navigation.ts`
5. Import and integrate in App.tsx

#### Adding Shared Components
1. Create component file in `src/shared/components/`
2. Define props interface with TypeScript
3. Use existing TailwindCSS patterns
4. Add to barrel export in `src/shared/components/index.ts`
5. Test dark/light theme compatibility

#### Adding System-Specific Components
1. Create component file in `src/systems/[system]/components/`
2. Use system-specific types from `../types`
3. Import shared utilities from `@/shared`
4. Add to system barrel export
5. Test within system context

#### Theme/Styling Changes
1. Check existing TailwindCSS usage patterns
2. Update classes in component files
3. Test dark mode compatibility
4. Verify responsive behavior

### Common Gotchas
- **CAGED calculations**: Off-by-one errors in fret calculations
- **React 19 patterns**: Use latest React patterns, not legacy approaches
- **TailwindCSS 4.x**: Uses different syntax than v3.x
- **TypeScript strict**: All props and state must be properly typed
- **Mobile layout**: Fretboard display needs special mobile considerations
- **Web Audio autoplay**: AudioContext must be resumed after user interaction (browser policy)

### Testing Approach
- **Manual testing**: No automated test suite currently
- **Cross-browser**: Test in Chrome, Firefox, Safari
- **Device testing**: Desktop and mobile layouts
- **Music accuracy**: Verify chord patterns with actual guitar
- **Performance**: Check for smooth animations and interactions

### Integration Points
- **GitHub Pages**: Static site deployment
- **GitHub Actions**: CI/CD pipeline
- **TailwindCSS**: Styling system integration
- **TypeScript**: Type checking integration
- **ESLint**: Code quality integration

## Project-Specific Notes

### Unique Architectural Decisions
- **Modular multi-system architecture**: Complete isolation of learning systems
- **TypeScript path aliases**: Clean imports with `@/shared` and `@/systems`
- **System isolation with shared utilities**: No direct cross-system dependencies
- **Custom hooks pattern**: Logic separated from UI completely within systems
- **Mathematical chord calculation**: Real music theory implementation
- **Gradient overlay system**: Complex visual blending for overlapping patterns
- **Context-minimal approach**: Only theme and navigation in context
- **Code splitting by system**: Quiz and Rhythm systems lazy-loaded for performance
- **Web Audio API integration**: Rhythm system uses Web Audio for precise timing and audio playback

### Performance Considerations
- **Modular tree shaking**: Excellent bundle optimization through system isolation
- **Code splitting**: Quiz (~18kB) and Rhythm (~21kB) systems lazy-loaded, reducing initial bundle
- **useMemo for calculations**: CAGED logic is memoized within systems
- **Minimal re-renders**: State changes are targeted and system-contained
- **Efficient gradient generation**: Dynamic CSS generation
- **Vite build optimization**: Enhanced tree shaking and bundling with path aliases
- **System isolation**: Prevents unnecessary cross-system re-renders
- **Web Audio scheduling**: Rhythm audio uses precise AudioContext timing

### Security Considerations
- **Static site**: No server-side vulnerabilities
- **No user data**: No storage or data collection
- **XSS prevention**: React's built-in protections
- **Dependency security**: Regular npm audit

### Browser Compatibility
- **Modern browsers only**: Uses latest React and TailwindCSS features
- **ES6+ features**: Arrow functions, destructuring, etc.
- **CSS Grid support**: Required for fretboard layout
- **Dark mode support**: CSS custom properties

### Environment Configuration
- **Development**: Vite dev server with HMR
- **Production**: Static build optimized for GitHub Pages
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React + TypeScript

This guide provides the essential context for effective Claude collaboration on the CAGED Visualizer project. The combination of music theory accuracy, modern React patterns, and clean architecture makes this a unique learning application that requires both technical and domain expertise.