# Preflight — Project Documentation

**Last Updated:** March 25, 2026
**Version:** 0.1.0
**Status:** Production-ready — pre-launch

---

## Project Overview

Preflight is a local-first project operating system for vibe coders — builders who use AI coding assistants (Lovable, Bolt, Cursor, Claude Code, Replit, v0) to build apps. It eliminates chaotic, fragmented workflows by providing a structured, AI-ready build pipeline.

**What Preflight does:**
- Captures structured project briefs (problem, users, features, stack)
- Generates deep research prompts for Perplexity, Gemini, ChatGPT
- Creates design prompts for Stitch, v0, Figma AI
- Writes complete PRDs with TypeScript data models
- Generates system instructions and rules files (.cursorrules, CLAUDE.md)
- Produces sequential build prompts (Foundation → Database → Features → Audit → Deploy)
- Stores all artifacts in a project vault with context injection
- Supports BYOK (Bring Your Own Key) for Anthropic, OpenAI, Google, DeepSeek, Groq

**What Preflight is NOT:**
- Not a coding tool — it's the layer that precedes coding
- Not a project management tool — it doesn't track tasks or sprints
- Not a collaboration platform — it's local-first, single-user

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 6.2.2 |
| **Language** | TypeScript | 5.8.2 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **State** | Zustand | 5.0.6 |
| **Database** | Dexie.js (IndexedDB) | 4.0.11 |
| **Routing** | React Router | 6.30.1 |
| **AI SDKs** | OpenAI, Anthropic, Google | Latest |
| **Testing** | Vitest | 4.1.0 |

### Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.80.0",
  "@google/generative-ai": "^0.24.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "dexie": "^4.0.11",
  "dexie-react-hooks": "^1.1.7",
  "openai": "^6.32.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-dropzone": "^15.0.0",
  "react-hot-toast": "^2.6.0",
  "react-markdown": "^10.1.0",
  "react-router-dom": "^6.30.1",
  "remark-gfm": "^4.0.1",
  "tailwind-merge": "^2.6.0",
  "zustand": "^5.0.6"
}
```

### Dev Dependencies

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@types/node": "^22.13.10",
  "@types/react": "^18.3.20",
  "@types/react-dom": "^18.3.6",
  "@vitejs/plugin-react": "^4.3.4",
  "autoprefixer": "^10.4.21",
  "jsdom": "^29.0.1",
  "postcss": "^8.5.3",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.8.2",
  "vite": "^6.2.2",
  "vitest": "^4.1.0"
}
```

---

## Folder Structure

```
preflight/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/
│   │   └── ci.yml
│   ├── CODE_OF_CONDUCT.md
│   └── CONTRIBUTING.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CHANGELOG.md
│   ├── DOCS.md
│   ├── getting-started.md
│   └── PREFLIGHT_BUILD_PROMPTS.md
├── agent-prompts/         # Default agent prompt templates
├── src/
│   ├── components/
│   │   ├── hub/           # Project Hub components
│   │   ├── layout/        # Layout (Sidebar, Header, AppLayout)
│   │   ├── onboarding/    # First-run onboarding
│   │   ├── settings/      # Settings page components
│   │   ├── shared/        # Shared UI (CopyButton, ErrorBoundary, OutputPanel)
│   │   │   └── command-palette/
│   │   ├── splash/        # Launch splash screen
│   │   └── workspace/     # Workspace components
│   │       ├── brief/     # Brief editor
│   │       ├── build/     # Build workflow
│   │       ├── design/    # Design module
│   │       ├── prd/       # PRD module
│   │       ├── research/  # Research module
│   │       └── vault/     # Vault file UI
│   ├── hooks/             # Custom React hooks
│   │   ├── index.ts       # Barrel export
│   │   ├── useAIProviders.ts
│   │   ├── useAgentPrompts.ts
│   │   ├── useArtifacts.ts
│   │   ├── useBrief.ts
│   │   ├── useBuildStages.ts
│   │   ├── useCommandPalette.ts
│   │   ├── useDialogAccessibility.ts
│   │   ├── useFirstLaunch.ts
│   │   ├── useProject.ts
│   │   ├── useProjects.ts
│   │   ├── useSettings.ts
│   │   ├── useToast.ts
│   │   └── useVaultFiles.ts
│   ├── lib/
│   │   ├── ai/            # Provider catalog
│   │   ├── appData.ts     # Export/import helpers
│   │   ├── briefUtils.ts  # Brief utilities
│   │   ├── db-defaults.ts # Database default initialization
│   │   ├── db-schema.ts   # Dexie schema definition
│   │   ├── db-seeds.ts    # Default prompts and platforms
│   │   ├── db.ts          # Database entry point
│   │   ├── fileUpload.ts  # Upload validation
│   │   ├── generationErrors.ts # Error mapping
│   │   ├── readmeGenerator.ts
│   │   ├── utils.test.ts  # Unit tests
│   │   └── utils.ts       # Shared utilities
│   ├── pages/
│   │   ├── hub/
│   │   │   └── ProjectHub.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   ├── workspace/
│   │   │   ├── BriefPage.tsx
│   │   │   ├── BuildPage.tsx
│   │   │   ├── DesignPage.tsx
│   │   │   ├── PRDPage.tsx
│   │   │   ├── ProjectWorkspace.tsx
│   │   │   ├── ResearchPage.tsx
│   │   │   └── ShipPage.tsx
│   │   ├── ProjectHubPage.tsx    # Re-export
│   │   ├── ProjectWorkspacePage.tsx # Re-export
│   │   └── SettingsPage.tsx      # Re-export
│   ├── services/
│   │   ├── ai/
│   │   │   ├── providers/
│   │   │   │   ├── anthropicProvider.ts
│   │   │   │   ├── chunkText.ts
│   │   │   │   ├── customProvider.ts
│   │   │   │   ├── deepseekProvider.ts
│   │   │   │   ├── googleProvider.ts
│   │   │   │   ├── groqProvider.ts
│   │   │   │   ├── openaiProvider.ts
│   │   │   │   └── openAICompatibleProvider.ts
│   │   │   ├── errors.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── generation/
│   │       ├── buildGeneration.ts
│   │       ├── designGeneration.ts
│   │       ├── prdGeneration.ts
│   │       ├── readmeGeneration.ts
│   │       ├── researchGeneration.ts
│   │       ├── rulesFileGeneration.ts
│   │       └── systemInstructionsGeneration.ts
│   ├── stores/
│   │   ├── index.ts         # Barrel export
│   │   ├── aiStore.ts
│   │   ├── projectStore.ts
│   │   ├── settingsStore.ts
│   │   └── uiStore.ts
│   ├── test/
│   │   └── setupTests.ts
│   ├── types/
│   │   └── index.ts         # All TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── vercel.json
└── netlify.toml
```

---

## Architecture Overview

### Local-First Architecture

Preflight uses IndexedDB (via Dexie.js) as the primary data store. All data lives in the user's browser:
- Projects, briefs, artifacts, build stages, vault files
- AI provider configurations (keys stored encrypted by browser)
- App settings and agent prompts
- No server required for core functionality

### BYOK Security Model

**Bring Your Own Key** — users provide their own AI provider API keys:
1. Keys entered in Settings → AI Providers
2. Stored in IndexedDB (browser-encrypted at rest)
3. Read directly by service layer when generating
4. Never exposed to React state or logged
5. Masked in UI (showing only last 3-4 characters)

### Context Node System

Modules can inject context from other modules:
- Research prompt can include brief + tech stack
- Design prompt can include brief + research results
- PRD can include brief + research + design
- Build prompts can include all of the above + vault files

Users toggle "active context" on vault files to include/exclude from generations.

### Sequential Build Workflow

Build prompts are generated in order:
1. **Foundation** — Folder structure, config, types, schema, routing, layout shell
2. **Database** — Full schema implementation, RLS policies, service layer
3. **Features** — Individual features (one prompt per feature)
4. **Audit** — Code quality review and fixes
5. **Deployment** — Production build, config, CI/CD

Each stage assumes previous stages are complete.

---

## Type Definitions

All types are in `src/types/index.ts`:

| Type | Purpose | Key Fields |
|------|---------|------------|
| `ProjectStatus` | Project lifecycle stage | `ideation`, `researching`, `designing`, `building`, `shipped` |
| `Platform` | Target build platform | `lovable`, `bolt`, `cursor`, `claude-code`, `replit`, `v0`, `other` |
| `AIProvider` | AI provider type | `anthropic`, `openai`, `google`, `deepseek`, `groq`, `custom` |
| `AgentType` | Agent prompt category | `research`, `design`, `prd`, `system-instructions`, `rules-file`, `build-*` |
| `ArtifactType` | Generated artifact type | `research_prompt`, `design_prompt`, `prd`, `system_instructions`, `rules_file`, `build_prompt` |
| `VaultCategory` | Vault file category | `research`, `design`, `export`, `other` |
| `BuildStageStatus` | Build stage progress | `locked`, `not-started`, `in-progress`, `complete` |
| `Project` | Project metadata | `id`, `name`, `description`, `status`, `targetPlatforms`, `techStack`, `createdAt`, `updatedAt` |
| `Brief` | Project brief | `id`, `projectId`, `problem`, `targetUser`, `coreFeatures`, `inspirations`, `notes`, `updatedAt` |
| `GeneratedArtifact` | Generated content | `id`, `projectId`, `type`, `platform`, `content`, `contextNodes`, `version`, `createdAt` |
| `VaultFile` | Uploaded file | `id`, `projectId`, `name`, `size`, `mimeType`, `category`, `isActiveContext`, `data`, `uploadedAt` |
| `BuildStage` | Build workflow stage | `id`, `projectId`, `stageNumber`, `name`, `description`, `status`, `promptContent`, `platform`, `createdAt`, `updatedAt` |
| `AIProviderConfig` | Provider configuration | `id`, `provider`, `apiKey`, `model`, `baseUrl`, `isDefault`, `createdAt` |
| `AgentSystemPrompt` | Editable agent prompt | `id`, `agentType`, `label`, `content`, `isDefault`, `updatedAt` |
| `AppSettings` | App configuration | `id`, `theme`, `defaultProvider`, `enabledPlatformLaunchers`, `streamingEnabled`, `userName`, `isOnboardingComplete`, `updatedAt` |

---

## Database Schema

Dexie.js database: `preflight`

| Table | Indexes | Description |
|-------|---------|-------------|
| `projects` | `id`, `status`, `updatedAt` | Project metadata |
| `briefs` | `id`, `projectId` | Project briefs (one per project) |
| `artifacts` | `id`, `projectId`, `type`, `createdAt` | Generated prompts/content |
| `vaultFiles` | `id`, `projectId`, `category`, `isActiveContext` | Uploaded files |
| `buildStages` | `id`, `projectId`, `stageNumber` | Build workflow stages |
| `aiProviders` | `id`, `provider`, `isDefault` | AI provider configs |
| `agentSystemPrompts` | `id`, `agentType`, `isDefault` | Editable agent prompts |
| `appSettings` | `id` | App-wide settings (single record) |
| `projectVersions` | `id`, `projectId`, `createdAt` | Exported project versions |
| `credentials` | `id`, `projectId`, `category` | Project credentials |

---

## Zustand Stores

| Store | File | State | Actions |
|-------|------|-------|---------|
| `useProjectStore` | `projectStore.ts` | `projects[]`, `selectedProjectId` | `loadProjects`, `selectProject`, `createProject`, `updateProject`, `deleteProject` |
| `useSettingsStore` | `settingsStore.ts` | `settings`, `agentPrompts[]` | `loadSettings`, `updateSettings`, `loadAgentPrompts`, `updateAgentPrompt`, `resetAgentPrompt` |
| `useUIStore` | `uiStore.ts` | `sidebarCollapsed`, `activeTab`, `commandPaletteOpen` | `toggleSidebar`, `setActiveTab`, `toggleCommandPalette` |
| `useAIStore` | `aiStore.ts` | Provider generation state | Generation status flags |

---

## Custom Hooks

| Hook | Parameters | Returns | When to Use |
|------|-----------|---------|-------------|
| `useProjects` | none | `{ projects, isLoading, createProject, updateProject, deleteProject }` | Project list CRUD |
| `useProject` | `projectId` | `{ project, isLoading }` | Single project reactive lookup |
| `useBrief` | `projectId` | `{ brief, isLoading, updateBrief, initializeBrief }` | Brief editor with autosave |
| `useArtifacts` | `projectId` | `{ artifacts, isLoading, createArtifact, deleteArtifact, getLatestByType }` | Generated artifact list |
| `useVaultFiles` | `projectId` | `{ files, isLoading, addFile, removeFile, toggleContext }` | Vault file management |
| `useBuildStages` | `projectId` | `{ stages, isLoading, createStages, updateStage }` | Build workflow management |
| `useAIProviders` | none | `{ providers, defaultProvider, isLoading, saveProvider, deleteProvider, setDefault }` | AI provider settings |
| `useAgentPrompts` | none | `{ prompts, isLoading, updatePrompt, resetToDefault }` | Agent prompt customization |
| `useSettings` | none | `{ settings, updateSettings }` | App settings |
| `useCommandPalette` | none | `{ isOpen, toggle, open, close }` | Global ⌘K palette |
| `useFirstLaunch` | none | `{ isFirstLaunch, completeOnboarding, isLoading }` | Onboarding detection |
| `useDialogAccessibility` | none | Focus trap + escape handling | Modal surfaces |

---

## Features

| Module | Feature | Status |
|--------|---------|--------|
| **Project Hub** | Grid/list view with filters | ✅ Complete |
| **Project Hub** | JSON import/export | ✅ Complete |
| **Project Hub** | Batch selection/delete | ✅ Complete |
| **Project Hub** | Status tracking | ✅ Complete |
| **Brief** | Structured capture (problem, users, features) | ✅ Complete |
| **Brief** | Autosave with debounce (800ms) | ✅ Complete |
| **Brief** | Completion scoring | ✅ Complete |
| **Research** | Context node selector | ✅ Complete |
| **Research** | AI generation with streaming | ✅ Complete |
| **Research** | Platform launchers (Perplexity, Gemini, ChatGPT) | ✅ Complete |
| **Research** | File upload to vault | ✅ Complete |
| **Design** | Platform variants (Stitch, v0, Figma AI, Universal) | ✅ Complete |
| **Design** | AI generation with streaming | ✅ Complete |
| **Design** | Design history tracking | ✅ Complete |
| **PRD** | Markdown generation | ✅ Complete |
| **PRD** | System instructions generation | ✅ Complete |
| **PRD** | Rules file generation (.cursorrules, CLAUDE.md) | ✅ Complete |
| **Build** | Sequential stage workflow | ✅ Complete |
| **Build** | AI generation per stage | ✅ Complete |
| **Build** | Status tracking per stage | ✅ Complete |
| **Build** | Export all prompts | ✅ Complete |
| **Vault** | File upload (PDF, MD, PNG, JSON, ZIP) | ✅ Complete |
| **Vault** | Category filters | ✅ Complete |
| **Vault** | Context injection toggle | ✅ Complete |
| **Vault** | Integrity metrics | ✅ Complete |
| **Settings** | BYOK provider management | ✅ Complete |
| **Settings** | Agent prompt customization | ✅ Complete |
| **Settings** | Platform launcher toggles | ✅ Complete |
| **Settings** | Usage logs | ✅ Complete |
| **Settings** | JSON export all data | ✅ Complete |
| **UI** | Splash screen | ✅ Complete |
| **UI** | Onboarding flow | ✅ Complete |
| **UI** | Command palette (⌘K) | ✅ Complete |
| **UI** | Dark theme only | ✅ Complete |
| **UI** | Error boundary | ✅ Complete |
| **UI** | Toast notifications | ✅ Complete |

---

## AI Integration

### Supported Providers

| Provider | Models | Streaming |
|----------|--------|-----------|
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | ✅ |
| OpenAI | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo | ✅ |
| Google | Gemini 1.5 Pro, Gemini 1.5 Flash | ✅ |
| DeepSeek | DeepSeek Chat, DeepSeek Coder | ✅ |
| Groq | Llama 3, Mixtral | ✅ |
| Custom | Any OpenAI-compatible endpoint | ✅ |

### Generation Flow

```
User clicks "Generate" in module
  ↓
Module calls generateWithAgent(agentType, userContent, onChunk)
  ↓
Service loads default provider from Dexie
  ↓
Service loads agent system prompt from Dexie
  ↓
Service creates provider with API key from Dexie
  ↓
Provider calls official API (Authorization: Bearer <key>)
  ↓
Response streamed back to UI via onChunk callback
  ↓
Artifact saved to Dexie
```

### Key Security Properties

- Keys never leave the device except to official provider endpoints
- Keys not stored in React state or Zustand
- Keys masked in UI (showing `sk-...abc123`)
- CSP restricts connect-src to provider domains only

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_APP_NAME` | No | `Preflight` | App display name |
| `VITE_APP_VERSION` | No | `0.1.0` | App version |
| `VITE_SUPABASE_URL` | No | — | Supabase project URL (cloud sync, optional) |
| `VITE_SUPABASE_ANON_KEY` | No | — | Supabase anon key (cloud sync, optional) |

**Note:** Preflight works fully offline without any environment variables. AI provider keys are added in-app.

---

## Build Commands

```bash
npm run dev       # Development server (localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build (localhost:4173)
npm run test      # Run test suite with Vitest
npm run typecheck # TypeScript check (no emit)
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Build settings auto-detected (Vite)
4. Deploy

Configuration in `vercel.json`:
- SPA rewrites to index.html
- Security headers (X-Frame-Options, CSP, etc.)

### Netlify

1. Push code to GitHub
2. Connect repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

Configuration in `netlify.toml`:
- SPA redirects
- Security headers

### Self-Hosted

```bash
npm run build
# Copy dist/ to any static file server
# Serve with SPA fallback (all routes → index.html)
```

---

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full workflow.

Quick start:
```bash
git clone https://github.com/preflight/preflight.git
cd preflight
pnpm install
cp .env.example .env
pnpm dev
```

Before submitting a PR:
```bash
pnpm typecheck   # Zero TypeScript errors
pnpm test        # All tests pass
pnpm build       # Clean production build
```

---

## Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| Custom provider baseUrl not exposed in Settings UI | Low | Edit directly in IndexedDB | Planned |
| Cloud sync requires manual Supabase setup | Medium | Use local-only mode | By design |
| Light theme removed | Low | Dark theme only | By design |

---

## Changelog

See [CHANGELOG.md](docs/CHANGELOG.md) for version history.

**v0.1.0** — Initial release
- Local-first project hub and workspace
- Brief, Research, Design, PRD, Build, Vault, Settings modules
- BYOK AI provider integration
- Splash screen and onboarding
- Command palette
- JSON export/import

---

**Last audit:** March 25, 2026
**Build status:** ✅ Passing
**Test status:** ✅ Passing (3 tests)
**TypeScript:** ✅ Zero errors
