# Preflight - Project OS for Vibe Coders

Preflight is an open-source tool designed to structure the workflow of "vibe coding"—using AI coding assistants (like Lovable, Bolt, Cursor, Replit) to build applications. It guides users through a sequential process from raw idea to a production-ready build package by generating optimized prompts for research, design, PRDs, system instructions, and multi-stage builds.

## Technology Stack

- **Frontend:** React 18.3 + TypeScript
- **Build Tool:** Vite 6.2
- **Styling:** Tailwind CSS 3.4 (Dark-only theme)
- **State Management:** Zustand 5.0
- **Database:** Dexie.js (IndexedDB) for local-first storage
- **AI Integration:** Direct SDKs for Anthropic, OpenAI, and Google Generative AI
- **Testing:** Vitest

## Project Structure

- `src/components/`: Domain-specific UI components (Hub, Workspace, Onboarding, UI primitives).
- `src/pages/`: Main application routes (Project Hub, Workspace, Settings, Documentation).
- `src/stores/`: Zustand stores for AI configuration, project state, settings, and UI state.
- `src/services/`: Core business logic:
    - `ai/`: Provider abstractions, error handling, and retry logic.
    - `generation/`: specialized logic for generating Research, Design, PRD, and Build prompts.
- `src/lib/`: Database schema (Dexie), utility functions, and constants.
- `src/hooks/`: Custom React hooks for interacting with stores and the database.
- `docs/`: Extensive project documentation, including build prompt optimizations and design guides.

## Development Commands

- **Development Server:** `pnpm dev`
- **Build:** `pnpm build` (runs type checking and Vite build)
- **Test:** `pnpm test` (runs Vitest)
- **Type Check:** `pnpm typecheck`
- **Preview Build:** `pnpm preview`

## Core Modules

1. **Brief:** Capture project goals, users, and core features.
2. **Research:** Generate prompts for deep research (Perplexity, Gemini Deep Research).
3. **Design:** Generate prompts for UI/UX design (Stitch, v0, Figma AI).
4. **PRD:** Generate comprehensive Product Requirements Documents.
5. **System:** Generate system instructions (`.cursorrules`, `CLAUDE.md`).
6. **Build:** Generate a multi-stage sequential build workflow (Foundation -> Database -> Features -> Audit -> Deploy).
7. **Vault:** Local storage for research results and design assets to provide context for generations.

## Key Conventions

- **Local-First:** All project data and AI keys are stored locally in the browser's IndexedDB via Dexie.js.
- **Type Safety:** Strict TypeScript usage across the codebase.
- **Dark Mode:** The UI is optimized for long coding sessions with a dark-only theme.
- **BYOK:** Users bring their own AI provider keys, which are stored securely in the local database.
