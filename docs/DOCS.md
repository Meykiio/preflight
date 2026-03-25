# Preflight - Project Documentation
**Last Updated:** 2026-03-23
**Version:** 0.1.0
**Stack:** React 18 + Vite + TypeScript + Tailwind + Dexie.js + Zustand

## Project Overview
Preflight is a local-first project operating system for vibe coders. It turns an idea into a build-ready delivery flow with structured briefs, research prompts, design prompts, PRDs, system instructions, rules files, staged build workflows, a reusable vault, and BYOK AI generation.

## Tech Stack
- `react` 18.3.1
- `react-dom` 18.3.1
- `react-router-dom` 6.30.1
- `zustand` 5.0.6
- `dexie` 4.0.11
- `dexie-react-hooks` 1.1.7
- `tailwindcss` 3.4.17
- `postcss` 8.5.3
- `autoprefixer` 10.4.21
- `typescript` 5.8.2
- `vite` 6.2.2
- `@vitejs/plugin-react` 4.3.4
- `cmdk` 1.1.1
- `react-hot-toast` 2.6.0
- `react-dropzone` 15.0.0
- `react-markdown` 10.1.0
- `remark-gfm` 4.0.1
- `openai` 6.32.0
- `@anthropic-ai/sdk` 0.80.0
- `@google/generative-ai` 0.24.1
- `vitest` 4.1.0
- `@testing-library/react` 16.3.2
- `@testing-library/jest-dom` 6.9.1
- `jsdom` 29.0.1

## Folder Structure
```text
src/
  components/
    hub/           # Project hub cards and modal flows
    layout/        # Sidebar, header, shell layout
    onboarding/    # First-run onboarding modal
    settings/      # Settings page cards and dialogs
    shared/        # Shared UI surfaces such as OutputPanel and CommandPalette
      command-palette/ # Command palette content, config, and action hooks
    splash/        # Launch splash screen
    workspace/     # Workspace-specific cards, selectors, and stage UI
      brief/       # Brief editor presentation components
      build/       # Build workflow shell sections
      design/      # Design module panels
      prd/         # PRD module panels
      research/    # Research module panels
      vault/       # Vault toolbar/sidebar/grid sections
  hooks/           # Reactive Dexie hooks and UI helpers
    useDialogAccessibility.ts # Focus trap + escape handling for modal surfaces
  lib/
    ai/            # Provider catalog
    appData.ts     # JSON export and usage log helpers
    db.ts          # Dexie schema and default seeds
    fileUpload.ts  # Upload validation and blob download helpers
    generationErrors.ts # UI-facing AI error mapping
    utils.ts       # Shared utility functions
  pages/
    hub/           # Hub route implementation
    settings/      # Settings route implementation
    workspace/     # Brief, Research, Design, PRD, Build, Vault pages
  services/
    ai/            # Provider adapters, errors, and generation factory
    generation/    # Artifact-specific generation builders
  stores/          # Zustand stores for UI and domain state
  test/            # Vitest setup
  types/           # Core domain types
```

## Type Definitions
- `ProjectStatus`: `ideation | researching | designing | building | shipped`
- `Platform`: supported target platforms for projects
- `AIProvider`: `anthropic | openai | google | deepseek | groq | custom`
- `AgentType`: research, design, PRD, system/rules, and build-stage agents
- `ArtifactType`: research, design, PRD, system, rules, and build prompt artifacts
- `VaultCategory`: `research | design | export | other`
- `BuildStageStatus`: `locked | not-started | in-progress | complete`
- `CoreFeature`: ordered feature item within a brief
- `Project`: root project metadata and lifecycle status
- `Brief`: structured problem, user, features, inspiration, and notes capture
- `GeneratedArtifact`: generated output plus metadata and context references
- `VaultFile`: stored binary context asset plus active-context flag
- `BuildStage`: sequential build step record with prompt content and status
- `AIProviderConfig`: persisted provider configuration and default model
- `AgentSystemPrompt`: editable system prompt per agent type
- `AppSettings`: theme, default provider, launcher toggles, streaming, name, onboarding state

## Database Schema
- `projects`: `id, status, updatedAt`
- `briefs`: `id, projectId`
- `artifacts`: `id, projectId, type, createdAt`
- `vaultFiles`: `id, projectId, category, isActiveContext`
- `buildStages`: `id, projectId, stageNumber`
- `aiProviders`: `id, provider, isDefault`
- `agentSystemPrompts`: `id, agentType, isDefault`
- `appSettings`: `id`

## Zustand Stores
- `projectStore`: selected project state plus project CRUD
- `uiStore`: sidebar state, active tab, command palette, onboarding flags, toasts
- `aiStore`: sanitized provider snapshots plus generation status flags
- `settingsStore`: persisted app settings and editable agent prompts

## Custom Hooks
- `useProjects`: reactive project list and CRUD helpers
- `useProject`: reactive single-project lookup
- `useBrief`: reactive brief with lazy creation and upsert updates
- `useArtifacts`: reactive artifact list plus latest-by-type helpers
- `useVaultFiles`: reactive vault file list plus add/remove/context-toggle actions
- `useBuildStages`: reactive stage list with reset-and-create generation flow
- `useAIProviders`: sanitized provider summaries with save/delete/default helpers
- `useAgentPrompts`: prompt editing and reset helpers
- `useSettings`: app settings lookup and updates
- `useFirstLaunch`: onboarding completion detection
- `useCommandPalette`: global keyboard toggle handling for `⌘K` / `Ctrl+K`

## Features
- ✅ Project Hub with filters, sorting, list/grid views, JSON import, and create-project modal
- ✅ Workspace shell with sidebar, sticky header, stage chips, and context selector
- ✅ Brief module with autosave, feature capture, platform tags, and completion scoring
- ✅ Research module with context-node selection, AI generation, streaming output, and research vault uploads
- ✅ Design module with platform variants, AI generation, streaming output, and design history uploads
- ✅ PRD module with markdown rendering plus generated system instructions and rules files
- ✅ Sequential Build Engine with AI-generated stage prompts, status tracking, and export
- ✅ Vault module with dropzone uploads, search, category filters, context injection, and integrity metrics
- ✅ Settings module with BYOK providers, model routing, launcher toggles, theme selection, exports, and usage logs
- ✅ Splash screen and first-run onboarding with provider validation
- ✅ Global command palette with project search, navigation, quick actions, and platform links

## AI Integration
- The app uses a Dexie-backed BYOK model.
- Supported providers: Anthropic, OpenAI, Google Gemini, DeepSeek, Groq, and custom OpenAI-compatible endpoints.
- Provider adapters live in `src/services/ai/providers/`.
- `generateWithAgent()` loads the default provider and the matching agent system prompt from Dexie, then performs generation.
- Route-level generation surfaces support streaming UI updates.

## BYOK Security Model
- Provider keys are persisted only in Dexie.
- Sanitized provider summaries are exposed to React state and UI hooks.
- The AI service layer reads actual keys directly from Dexie on demand.
- Provider requests target official provider endpoints only.
- CSP rules in `index.html` restrict network access to the required font and AI origins.

## Design System Implementation
- Dark-first tonal surface system based on the custom Tailwind tokens in `tailwind.config.ts`
- `Space Grotesk` for headings, `Inter` for body copy, `JetBrains Mono` for prompts and HUD metadata
- Shared visual utilities: `glass-panel`, `gradient-cta`, `glow-primary`, `noise-texture`
- Shared output rendering through `OutputPanel`
- Animated splash progress, streaming cursors, hover transitions, and toast feedback
- Global focus-visible rings and reduced-motion fallbacks are defined in `src/index.css`
- Modal surfaces use dialog semantics plus focus trapping through `useDialogAccessibility`
- Upload-heavy modules share file validation and download helpers from `src/lib/fileUpload.ts`

## Splash & Onboarding
- App phases: `splash -> onboarding -> app`
- Splash runs on every launch and transitions after 2.8 seconds
- Onboarding is shown only when `AppSettings.isOnboardingComplete` is false
- Step 1 captures the user name
- Step 2 validates an AI provider key and stores the provider config
- Step 3 completes onboarding and opens the main app

## Command Palette
- Opens with `⌘K` or `Ctrl+K`
- Project search with status badges
- Navigation commands for Home, Settings, and project tabs
- Quick actions for New Project, Research generation, Design generation, Build export, and copying the latest artifact
- Platform launch shortcuts for Lovable, Bolt, Cursor, Perplexity, Gemini, ChatGPT, and v0

## Testing
- `corepack pnpm typecheck`
- `corepack pnpm build`
- `corepack pnpm test`
- Current automated coverage includes utility smoke tests and test-runner wiring

## Deployment
- `vercel.json` is configured for Vite output and SPA rewrites
- `netlify.toml` is configured for Vite output and SPA redirects
- `.env.example` documents optional environment variables
- `.github/workflows/ci.yml` runs install, typecheck, build, and test on pushes and PRs to `main`

## Configuration
- Default platform launchers are seeded in Dexie
- Default agent prompts are seeded in `src/lib/db.ts`
- AI routing uses the saved default provider model from Dexie
- Local JSON export includes projects, briefs, artifacts, build stages, vault file bytes, masked providers, prompts, and settings

## Architecture Decisions
- React + Vite for fast local iteration and easy code-splitting
- Dexie for local-first persistence without requiring a backend
- Zustand for light UI state and selection state
- BYOK instead of managed server-side proxying to keep the open-source build simple and private by default
- Dynamic provider imports to keep the initial bundle smaller and defer SDK loading until generation time

## Known Issues
- The custom provider path supports an optional `baseUrl` in the service layer, but the Settings UI does not yet expose a dedicated base URL field.
- The open-source build is local-first only; cloud sync and multi-user collaboration are intentionally out of scope for v0.1.0.
