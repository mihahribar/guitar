# Tech Stack

## Framework & Runtime

- **Application Framework:** React 19.1.1 (single-page application)
- **Language/Runtime:** TypeScript 5.8.3 with strict mode enabled
- **Build Tool:** Vite 7.1.2 with React plugin and TypeScript path aliases
- **Package Manager:** npm (Node.js package manager)

## Frontend

### Core Framework & Libraries

- **JavaScript Framework:** React 19.1.1 with functional components and hooks
- **Type System:** TypeScript 5.8.3 with strict type checking
- **State Management:** React hooks (useState, useMemo, useCallback) with Context API for global state (theme, navigation)
- **Routing:** Single-page routing with lazy-loaded code splitting (quiz system loaded on demand)

### Styling & UI

- **CSS Framework:** TailwindCSS 4.1.12 (latest version with native CSS support via @tailwindcss/vite)
- **Styling Approach:** Utility-first with TailwindCSS classes, CSS custom properties for complex layouts
- **Theme System:** Custom dark/light mode implementation with system preference detection
- **Layout Techniques:** CSS Grid and Flexbox for responsive layouts, CSS Grid for fretboard display
- **Responsive Design:** Mobile-first approach with breakpoint-based responsive utilities
- **UI Components:** Custom-built components, no third-party UI library

### Architecture Patterns

- **Pattern:** Modular multi-system architecture with complete system isolation
- **Project Structure:**
  - `src/systems/[system]/` - Self-contained learning system modules (caged, quiz, modes)
  - `src/shared/` - Reusable components, utilities, types, and constants
  - `src/contexts/` - Global state management (ThemeContext, NavigationContext)
- **TypeScript Path Aliases:**
  - `@/shared` - Shared resources
  - `@/systems/caged` - CAGED system module
  - `@/systems/quiz` - Quiz system module
  - `@/systems/modes` - Modes system module
- **Component Patterns:** Functional components only, custom hooks for logic separation, props-based composition
- **Code Splitting:** Lazy-loaded quiz system (~18kB chunk) reduces initial bundle size
- **Barrel Exports:** Each module provides clean barrel exports for easy consumption

## Database & Storage

- **Local Storage:** Browser localStorage for theme preferences and future user progress tracking
- **State Persistence:** safeStorage utility wrapper for error-safe localStorage operations
- **No Backend:** Fully static site with no server-side database requirements

## Testing & Quality

### Code Quality

- **Linting:** ESLint 9.33.0 with TypeScript ESLint integration
- **ESLint Plugins:**
  - eslint-plugin-react-hooks (enforce React hooks rules)
  - eslint-plugin-react-refresh (React Fast Refresh compatibility)
  - @typescript-eslint (TypeScript-specific linting)
- **Formatting:** Consistent code style enforced through ESLint configuration
- **Type Checking:** TypeScript strict mode with comprehensive type coverage

### Testing Strategy

- **Current:** Manual testing across browsers and devices
- **Browser Testing:** Chrome, Firefox, Safari compatibility verification
- **Device Testing:** Desktop and mobile responsive layout testing
- **Music Accuracy:** Manual verification of chord patterns against actual guitar
- **Future Considerations:** Consider adding Jest + React Testing Library for automated tests

## Deployment & Infrastructure

### Hosting & CI/CD

- **Hosting:** GitHub Pages (static site hosting)
- **Domain:** Custom domain (caged.hribar.org) configured via CNAME
- **CI/CD:** GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Deployment Trigger:** Automatic deployment on push to main branch
- **Build Process:** `npm ci && npm run build` generates production-optimized bundle
- **Deploy Process:** GitHub Actions deploys `/dist` folder to GitHub Pages
- **CDN:** Global CDN distribution through GitHub Pages infrastructure

### Build & Bundling

- **Build Tool:** Vite 7.1.2 with optimized production builds
- **Bundle Optimization:**
  - Code splitting with lazy-loaded quiz system
  - Tree shaking for unused code elimination
  - Minification and compression
  - CSS extraction and optimization
- **Bundle Sizes:**
  - Main bundle: ~213kB
  - Quiz chunk: ~18kB (lazy-loaded)
  - CSS: ~33kB
- **Asset Optimization:** Vite automatic asset optimization and hashing

## Performance Optimization

### Frontend Performance

- **React Optimization:** useMemo for expensive calculations (CAGED shape calculations, chord transpositions)
- **Rendering Optimization:** useCallback to prevent unnecessary re-renders
- **Minimal Re-renders:** Targeted state updates within system boundaries
- **Code Splitting:** Lazy-loaded quiz system reduces initial bundle size
- **Tree Shaking:** Modular architecture enables excellent tree shaking

### Loading Performance

- **Bundle Size:** Optimized bundles load in under 3 seconds on typical connections
- **Lazy Loading:** Quiz system loaded on demand (~18kB additional)
- **Asset Caching:** Vite content hashing enables long-term browser caching
- **Fast Refresh:** Vite HMR provides instant development feedback

### Runtime Performance

- **60fps Target:** Smooth animations and interactions
- **Gradient Generation:** Efficient dynamic CSS generation for shape overlays
- **State Management:** Context-minimal approach reduces unnecessary provider re-renders
- **System Isolation:** Prevents cross-system performance impacts

## Error Handling & Monitoring

### Error Management

- **Error Boundaries:** React ErrorBoundary components catch rendering errors
- **Safe Component Wrapper:** SafeComponent wrapper for critical components
- **Error Logging:** errorLogger utility for consistent error handling
- **Input Validation:** inputValidation utility for user input safety
- **Storage Safety:** safeStorage wrapper prevents localStorage errors

### Monitoring

- **Performance Monitor:** Custom performanceMonitor utility for tracking metrics
- **Current Monitoring:** Client-side error logging only
- **Future Considerations:** Consider adding Sentry or similar for production error tracking

## Security Considerations

- **Static Site:** No server-side attack vectors
- **No User Data:** No data collection or storage of personal information
- **XSS Prevention:** React's built-in JSX escaping protects against XSS
- **Dependency Security:** Regular npm audit for known vulnerabilities
- **HTTPS:** Enforced HTTPS through GitHub Pages
- **No API Keys:** No secrets or API keys in codebase

## Browser Compatibility

- **Target Browsers:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **JavaScript Features:** ES6+ features (arrow functions, destructuring, async/await)
- **CSS Requirements:** CSS Grid support required for fretboard layout
- **CSS Custom Properties:** Used for theming and complex layouts
- **Dark Mode:** CSS prefers-color-scheme media query support

## Development Environment

### Development Tools

- **Dev Server:** Vite dev server with Hot Module Replacement (HMR)
- **TypeScript Checking:** Continuous type checking during development
- **Fast Refresh:** React Fast Refresh for instant component updates
- **Source Maps:** Full source map support for debugging

### Development Workflow

- **Local Development:** `npm run dev` starts dev server on http://localhost:5173
- **Type Checking:** `tsc -b` validates TypeScript before builds
- **Linting:** `npm run lint` runs ESLint checks
- **Production Preview:** `npm run preview` tests production build locally
- **Build:** `npm run build` creates optimized production bundle

## Third-Party Services

- **Authentication:** None (no user accounts)
- **Email:** None (no email functionality)
- **Monitoring:** None currently (manual monitoring)
- **Analytics:** None currently (future consideration)
- **CDN:** GitHub Pages CDN (built-in with hosting)

## Future Technical Considerations

### Potential Additions

- **Audio Library:** Tone.js or Web Audio API for chord sound playback
- **Testing Framework:** Jest + React Testing Library for automated testing
- **E2E Testing:** Playwright or Cypress for end-to-end testing
- **Analytics:** Plausible or privacy-focused analytics for usage insights
- **Error Tracking:** Sentry for production error monitoring
- **Backend API:** Optional Node.js/Express backend for user progress sync (future)
- **Database:** Optional PostgreSQL for multi-device progress sync (future)
- **Mobile Framework:** React Native or Capacitor for native mobile apps (future)

### Scalability Considerations

- **Current:** Static site scales infinitely via GitHub Pages CDN
- **Module Addition:** Architecture supports adding new learning systems without refactoring
- **Performance:** Current bundle sizes remain optimal with modular code splitting
- **Future Backend:** May need backend for user accounts, progress sync across devices
- **Mobile Native:** Would require separate mobile app development pipeline

### Technical Debt & Improvements

- **Automated Testing:** Add unit and integration tests for core music theory calculations
- **Performance Monitoring:** Implement real-time performance tracking in production
- **Accessibility Audit:** Comprehensive accessibility testing with screen readers
- **Bundle Analysis:** Regular bundle size audits to prevent bloat
- **Dependency Updates:** Keep dependencies current with automated update checks
- **TypeScript Coverage:** Maintain 100% TypeScript coverage as codebase grows
