# AGENTS.md — Preflight

## Commands

```
pnpm dev          # Start Vite dev server
pnpm typecheck    # tsc -b (project references)
pnpm build        # typecheck + vite build
pnpm test         # vitest run
pnpm lint         # eslint src --ext .ts,.tsx
pnpm lint:fix     # eslint --fix
pnpm format       # prettier --write
pnpm format:check # prettier --check
```

CI order: `typecheck -> build -> test`. Run in this order before committing.

## Stack

- React 18 + TypeScript (strict) + Vite 6, ESM (`"type": "module"`)
- Tailwind CSS 3.4, **dark-only** theme — no light mode
- Zustand 5 for state (`src/stores/`: aiStore, projectStore, settingsStore, uiStore)
- Dexie.js (IndexedDB) for local-first persistence — no backend
- Path alias: `@/*` → `./src/*`

## Architecture

- **Entry**: `src/main.tsx` → `src/App.tsx` (BrowserRouter, lazy-loaded routes)
- **Routes**: `/` (ProjectHub), `/project/:projectId` (Workspace), `/settings`, `/docs`
- **Workspace modules** (sequential flow): Brief → Research → Design → PRD → System → Build → Ship → Vault
- **AI providers** (`src/services/ai/providers/`): Anthropic, OpenAI, Google, DeepSeek, Groq, OpenRouter, Ollama, LM Studio, Qwen, custom OpenAI-compatible
- **Generation services** (`src/services/generation/`): prompt generation for each workspace stage
- **Validation services** (`src/services/validation/`): packageValidator, consistencyChecker, configValidator, libraryValidator
- **DB** (`src/lib/db.ts`): Dexie schema + defaults + seeds, initialized on app start via `db.initializeDefaults()`

## Key Conventions

- **Local-first**: All data and API keys stored in browser IndexedDB. Keys are encrypted with Web Crypto API.
- **No env vars required**: App works without `.env` in local mode. `VITE_SUPABASE_*` only for optional cloud mode.
- **ESLint**: `no-console` = error, `@typescript-eslint/no-explicit-any` = error, unused vars prefixed with `_` allowed.
- **Prettier**: double quotes, semicolons, `trailingComma: "none"`, `printWidth: 100`, LF line endings.
- **ESM only**: Use `import`/`export`, not `require()`.

## Testing

- Vitest with jsdom environment
- Setup: `src/test/setupTests.ts` — mocks `fake-indexeddb`, Web Crypto API, and localStorage
- Run single test: `pnpm test -- -t "test name"` or `pnpm test -- src/path/to/file.test.ts`

## Deployment

- **Vercel**: `vercel.json` — SPA rewrites, security headers, `pnpm install --frozen-lockfile`
- **Netlify**: `netlify.toml` — same SPA redirect pattern
- Build output: `dist/`
