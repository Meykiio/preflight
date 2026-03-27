# Changelog

## [0.1.0] - 2026-03-27

### Added

- **Build Page Enhancements**
  - Smooth color-transitioning progress bar (red → orange → green) for workflow generation
  - Progress percentage display during generation (35% → 75% → 100%)
  - Animated loading spinner with `animate-spin`
  - Stage card overflow fixes with proper width constraints
  - Text wrapping for long stage titles and descriptions

- **Navigation Improvements**
  - Scroll-to-top on route changes with proper timing
  - 350ms fade-in page transitions for smooth navigation
  - Removed redundant top header in workspace routes
  - Enhanced breadcrumb panel styling as main header

- **Performance Optimizations**
  - Added `React.memo` to all page components (BuildPage, PRDPage, BriefPage, ResearchPage, DesignPage, VaultPage, ShipPage, SettingsPage, ProjectHub, ProjectWorkspace)
  - Memoized derived state with `useMemo` to prevent unnecessary recalculations
  - Wrapped event handlers in `useCallback` to prevent child re-renders
  - Optimized re-render performance across all workspace pages

- **Error Handling**
  - Added user-facing toast notifications to `useVaultFiles` hook
  - Added user-facing toast notifications to `useBuildStages` hook
  - Improved error messages for failed operations

- **Code Quality**
  - Fixed `.gitignore` to allow `src/**/build/` folders while ignoring root `/build/`
  - Removed duplicate `GenerationProgress` component
  - Centralized `GenerationProgress` in shared components
  - Fixed import paths for shared components

### Changed

- **GenerationProgress Component**
  - Extended to support progress bar mode with color transitions
  - Added dynamic color calculation based on progress percentage
  - Maintained backward compatibility with token count mode

- **Settings Page**
  - Fixed async/await in `handleClearAllData` callback

### Fixed

- Build stage cards no longer overflow horizontally
- Copy and Mark Complete buttons now visible and clickable
- Loading spinner animates smoothly during generation
- Top header removed in workspace routes (breadcrumb panel is now main header)
- Page navigation always starts at top of page
- Import path for `GenerationProgress` component

### Technical

- All page components now use `React.memo` for performance
- Derived state memoized with `useMemo` in 10+ page components
- Event handlers wrapped in `useCallback` throughout codebase
- Error toast notifications added to critical hooks

---

## [0.1.0] - 2026-03-23

### Added

- Local-first project hub and workspace shell
- Brief, Research, Design, PRD, Build, Vault, and Settings modules
- BYOK AI provider integration for Anthropic, OpenAI, Google, DeepSeek, Groq, and custom OpenAI-compatible endpoints
- Splash screen, onboarding flow, and global command palette
- JSON export, usage log modal, platform launcher controls, and vault context injection
- Vitest configuration and initial utility coverage
- GitHub issue templates, CI workflow, and deployment config for Vercel and Netlify
