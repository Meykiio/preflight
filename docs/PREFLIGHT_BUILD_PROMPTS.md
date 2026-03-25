# PREFLIGHT — SEQUENTIAL BUILD PROMPTS
# Version: 1.0 | Stack: React + Vite + TypeScript + Tailwind + shadcn/ui + Dexie.js + Zustand
# Instructions: Copy and paste each stage prompt ONE AT A TIME into your AI coding tool.
# Wait for the agent to complete, verify, then move to the next stage.
# Never skip stages. Never paste two stages at once.

---

## HOW TO USE THESE PROMPTS

1. Copy the full prompt block for the current stage
2. Paste into your AI coding tool (Lovable, Cursor, Claude Code, Bolt, etc.)
3. Wait for completion
4. Run `npm run build` — must pass with zero errors before proceeding
5. Verify the summary matches what was requested
6. Move to the next stage

**If something breaks:** Do not proceed. Fix the issue in the same stage before moving forward.

---

---

# STAGE 01 — FOUNDATION
**Goal:** Project structure, Tailwind config, TypeScript setup, core type definitions, Dexie schema skeleton, layout shell, DOCS.md

---

```
BEHAVIOR: Before writing any code, check if DOCS.md exists at the project root and read it. If it does not exist, you will create it as part of this stage. After completing all tasks, update DOCS.md with everything you built.

TASK: Initialize the complete foundation for Preflight — an open-source Project OS for vibe coders. This is Stage 01 of 20. Do not build any features yet. Only establish the foundation.

STACK:
- React 18 + Vite + TypeScript (strict mode)
- Tailwind CSS with custom design tokens
- shadcn/ui (initialize with dark theme)
- Dexie.js for IndexedDB
- Zustand for state management
- JetBrains Mono, Space Grotesk, Inter (via Google Fonts)
- Material Symbols Outlined (via Google Fonts)

PLAN BEFORE CODING: List the exact files you will create and their purposes before writing any code.

STEP 1 — Configure Tailwind (tailwind.config.ts):
Add the following custom color tokens to the theme.extend.colors object:
{
  "primary": "#c5c0ff",
  "primary-container": "#8b80ff",
  "on-primary": "#2600a1",
  "on-primary-fixed": "#150067",
  "secondary": "#6edab4",
  "secondary-container": "#2fa280",
  "tertiary": "#ffb95d",
  "surface": "#131318",
  "surface-dim": "#131318",
  "surface-bright": "#39383e",
  "surface-container-lowest": "#0e0e13",
  "surface-container-low": "#1b1b20",
  "surface-container": "#1f1f25",
  "surface-container-high": "#2a292f",
  "surface-container-highest": "#35343a",
  "surface-variant": "#35343a",
  "on-surface": "#e4e1e9",
  "on-surface-variant": "#c8c4d7",
  "outline": "#928fa0",
  "outline-variant": "#474554",
  "on-primary-container": "#21008e",
  "inverse-primary": "#5647d5",
  "background": "#131318"
}
Add custom fontFamily: { "headline": ["Space Grotesk", "sans-serif"], "body": ["Inter", "sans-serif"], "label": ["Inter", "sans-serif"], "mono": ["JetBrains Mono", "monospace"] }
Add custom borderRadius: { "DEFAULT": "0.125rem", "sm": "0.25rem", "md": "0.375rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem" }
Enable darkMode: "class"

STEP 2 — Global CSS (src/index.css):
- Import Google Fonts: Space Grotesk (500,700), Inter (400,500,600), JetBrains Mono (400,500), Material Symbols Outlined
- Set :root with `color-scheme: dark`
- Set body background to surface (#131318), color to on-surface (#e4e1e9), font-family to Inter
- Add a .noise-texture class with the SVG fractal noise filter at 3% opacity
- Add a .glass-panel class: background rgba(19,19,24,0.6), backdrop-filter blur(12px)
- Add a .gradient-cta class: background linear-gradient(135deg, #c5c0ff, #8b80ff)
- Add a .glow-primary class: box-shadow 0 0 20px rgba(197,192,255,0.2)
- Add scrollbar styles: thin, using surface-container-high color

STEP 3 — TypeScript types (src/types/index.ts):
Create the following TypeScript interfaces with strict types (no `any`):

```typescript
export type ProjectStatus = 'ideation' | 'researching' | 'designing' | 'building' | 'shipped';
export type Platform = 'lovable' | 'bolt' | 'cursor' | 'claude-code' | 'replit' | 'v0' | 'other';
export type AIProvider = 'anthropic' | 'openai' | 'google' | 'deepseek' | 'groq' | 'custom';
export type AgentType = 'research' | 'design' | 'prd' | 'system-instructions' | 'rules-file' | 'build-foundation' | 'build-database' | 'build-feature' | 'build-audit' | 'build-deployment';
export type ArtifactType = 'research_prompt' | 'design_prompt' | 'prd' | 'system_instructions' | 'rules_file' | 'build_prompt';
export type VaultCategory = 'research' | 'design' | 'export' | 'other';
export type BuildStageStatus = 'locked' | 'not-started' | 'in-progress' | 'complete';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  targetPlatforms: Platform[];
  techStack: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Brief {
  id: string;
  projectId: string;
  problem: string;
  targetUser: string;
  coreFeatures: { id: string; text: string; order: number }[];
  inspirations: string[];
  notes: string;
  updatedAt: number;
}

export interface GeneratedArtifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  platform: string;
  content: string;
  contextNodes: string[];
  agentSystemPromptId: string;
  version: number;
  charCount: number;
  tokenEstimate: number;
  createdAt: number;
}

export interface VaultFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mimeType: string;
  category: VaultCategory;
  isActiveContext: boolean;
  data: ArrayBuffer;
  uploadedAt: number;
}

export interface BuildStage {
  id: string;
  projectId: string;
  stageNumber: number;
  name: string;
  description: string;
  status: BuildStageStatus;
  promptContent: string;
  platform: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIProviderConfig {
  id: string;
  provider: AIProvider;
  apiKey: string;
  model: string;
  isDefault: boolean;
  createdAt: number;
}

export interface AgentSystemPrompt {
  id: string;
  agentType: AgentType;
  label: string;
  content: string;
  isDefault: boolean;
  updatedAt: number;
}

export interface AppSettings {
  id: string;
  theme: 'dark' | 'light' | 'system';
  defaultProvider: AIProvider | null;
  enabledPlatformLaunchers: string[];
  streamingEnabled: boolean;
  updatedAt: number;
}
```

STEP 4 — Dexie.js database (src/lib/db.ts):
Create a single Dexie database instance called `db`. Schema version 1. Tables with indexes:
- projects: "id, status, updatedAt"
- briefs: "id, projectId"
- artifacts: "id, projectId, type, createdAt"
- vaultFiles: "id, projectId, category, isActiveContext"
- buildStages: "id, projectId, stageNumber"
- aiProviders: "id, provider, isDefault"
- agentSystemPrompts: "id, agentType, isDefault"
- appSettings: "id"
Export the db instance as default. Add a `initializeDefaults` async function that seeds the appSettings table with default values if empty, and seeds the agentSystemPrompts table with placeholder entries for each AgentType if empty.

STEP 5 — Zustand stores (src/stores/):
Create four store files:

src/stores/projectStore.ts — manages: projects array, selectedProjectId, loadProjects(), selectProject(), createProject(), updateProject(), deleteProject(). All actions read/write from Dexie db.

src/stores/uiStore.ts — manages: sidebarCollapsed (bool), activeTab (string), isCommandPaletteOpen (bool), isOnboardingComplete (bool), toasts array. Pure UI state, no DB calls.

src/stores/aiStore.ts — manages: providers array, defaultProvider, isGenerating (bool), generationError (string | null), loadProviders(), saveProvider(), deleteProvider(). Reads/writes AIProviderConfig from Dexie.

src/stores/settingsStore.ts — manages: settings object (AppSettings), agentPrompts array, loadSettings(), updateSettings(), loadAgentPrompts(), updateAgentPrompt(), resetAgentPrompt(). Reads/writes from Dexie.

STEP 6 — Layout components (src/components/layout/):
Create three placeholder layout components:

AppLayout.tsx — full-screen flex layout. Left sidebar (240px fixed, collapsible to 64px). Right main content area (flex-1). No logic yet. Just the structural shell. Background: surface-container-lowest.

Sidebar.tsx — placeholder sidebar with the Preflight logo at top, empty nav list in middle, settings/support links at bottom. Use surface-container-lowest as background. No borders — use surface color for visual separation.

Header.tsx — top bar with search input (placeholder) on left and notification + settings + avatar icons on right. Background surface/60 with backdrop-blur-xl.

STEP 7 — Router setup (src/main.tsx and src/App.tsx):
Set up React Router v6. Routes:
- "/" → ProjectHub (placeholder component that renders "Project Hub" text)
- "/project/:projectId" → ProjectWorkspace (placeholder)
- "/settings" → Settings (placeholder)
All routes wrapped in AppLayout. Add the dark class to the html element on mount.

STEP 8 — Google Fonts + Material Symbols (index.html):
Add preconnect links and import links for Space Grotesk, Inter, JetBrains Mono, and Material Symbols Outlined in the <head>.

STEP 9 — Initialize shadcn/ui:
Run `npx shadcn-ui@latest init` with dark theme, slate base color, src/components/ui as the component directory. Install: Button, Input, Badge, Dialog, Tabs, Popover, ScrollArea, Separator, Tooltip, DropdownMenu, Toast.

STEP 10 — DOCS.md (project root):
Create DOCS.md with this structure:
# Preflight — Project Documentation
**Last Updated:** [today's date]
**Version:** 0.1.0-alpha
**Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Dexie.js + Zustand

## Project Overview
[Brief description of what Preflight is]

## Tech Stack
[List all dependencies with versions]

## Folder Structure
[Exact folder tree showing every directory and its purpose]

## Type Definitions
[List all interfaces defined in src/types/index.ts]

## Database Schema
[List all Dexie tables and their indexes]

## Zustand Stores
[List each store and what state it manages]

## Features
[Empty section — will be filled as features are built]

## Known Issues
[Empty section]

VALIDATION: Run `npm run build`. Zero TypeScript errors required. Zero ESLint warnings from type issues. The app must render the AppLayout with sidebar and header visible at localhost:5173.

SUMMARY: After completing all steps, list exactly which files were created, what each one does, and confirm the build passes.
```

---

---

# STAGE 02 — ZUSTAND + DEXIE INTEGRATION
**Goal:** Wire all Zustand stores to Dexie, reactive hooks, data initialization

---

```
BEHAVIOR: Read DOCS.md before starting. Do not modify the type definitions from Stage 01. Do not modify the Tailwind config. Do not add any new npm packages without listing them first and getting confirmation in your plan.

TASK: Wire all Zustand stores to Dexie.js and create the custom hooks layer. This is Stage 02 of 20.

PLAN BEFORE CODING: State exactly what files you will create or modify.

STEP 1 — Custom hooks (src/hooks/):
Create the following hooks. Each hook reads reactively from Dexie using `useLiveQuery` from dexie-react-hooks:

useProjects.ts — returns: { projects, isLoading, createProject, updateProject, deleteProject }
useProject.ts (single project by ID) — returns: { project, isLoading }
useBrief.ts — returns: { brief, isLoading, updateBrief }
useArtifacts.ts — returns: { artifacts, isLoading, createArtifact, deleteArtifact, getLatestByType }
useVaultFiles.ts — returns: { files, isLoading, addFile, removeFile, toggleContext }
useBuildStages.ts — returns: { stages, isLoading, createStages, updateStageStatus, updateStagePrompt }
useAIProviders.ts — returns: { providers, defaultProvider, isLoading, saveProvider, deleteProvider, setDefault }
useAgentPrompts.ts — returns: { prompts, isLoading, updatePrompt, resetToDefault }
useSettings.ts — returns: { settings, isLoading, updateSettings }

Rules for all hooks:
- Use useLiveQuery for all read operations (reactive — auto-updates UI when DB changes)
- Use async functions for all write operations with try/catch
- Return isLoading: true while useLiveQuery returns undefined
- Generate UUIDs using crypto.randomUUID()
- Set createdAt/updatedAt to Date.now()

STEP 2 — Database initialization (src/lib/db.ts update):
Update the initializeDefaults function to seed AgentSystemPrompts with these placeholder contents (full content will be set in Stage 12):
- research: "You are a research prompt architect. Generate deep research prompts."
- design: "You are a UI design prompt engineer. Generate UI design prompts."
- prd: "You are a senior product manager. Generate complete PRDs."
- system-instructions: "You are a coding agent configuration specialist."
- rules-file: "You are a coding agent rules architect."
- build-foundation: "You are a senior full-stack engineer. Generate foundation prompts."
- build-database: "You are a database architect. Generate DB setup prompts."
- build-feature: "You are a feature engineer. Generate feature build prompts."
- build-audit: "You are a code auditor. Generate audit prompts."
- build-deployment: "You are a deployment engineer. Generate deployment prompts."

STEP 3 — App initialization (src/App.tsx update):
On app mount (useEffect with empty deps), call db.initializeDefaults(). Handle errors gracefully — log to console, never crash the app.

STEP 4 — Utils (src/lib/utils.ts):
Add these utility functions:
- generateId(): string — returns crypto.randomUUID()
- formatDate(timestamp: number): string — returns human-readable date (e.g., "2 hours ago", "Jan 5")
- formatFileSize(bytes: number): string — returns "1.2 MB", "340 KB", etc.
- estimateTokens(text: string): number — rough estimate: Math.ceil(text.length / 4)
- truncate(text: string, maxLength: number): string
- copyToClipboard(text: string): Promise<boolean> — uses navigator.clipboard.writeText, returns true on success

STEP 5 — AI Provider abstraction (src/services/ai/):
Create the provider interface and base structure. Do NOT implement actual API calls yet (that is Stage 13).

src/services/ai/types.ts:
```typescript
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AICompleteParams {
  model: string;
  system: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  complete(params: AICompleteParams): Promise<string>;
  streamComplete(params: AICompleteParams, onChunk: (chunk: string) => void): Promise<void>;
  validateKey(apiKey: string): Promise<boolean>;
}

export interface AIProviderAdapter {
  provider: import('../../types').AIProvider;
  create(apiKey: string, model: string): AIProvider;
}
```

src/services/ai/index.ts:
Export a `getProvider` function that takes an AIProviderConfig and returns a stub AIProvider that throws NotImplementedError. This will be replaced in Stage 13.

STEP 6 — Error boundary (src/components/shared/ErrorBoundary.tsx):
Create a React error boundary component. On error, render a dark-themed fallback UI with the error message and a "Reload" button. Style using surface-container-high background with primary-colored error text.

VALIDATION: Run `npm run build`. Zero TypeScript errors. Run `npm run dev` — app loads, no console errors. Verify useLiveQuery is installed: run `npm list dexie-react-hooks`.

UPDATE DOCS.md: Add a "Custom Hooks" section listing each hook and what it returns. Add "AI Services" section noting the abstraction layer is in place.

SUMMARY: List all files created or modified and confirm build passes.
```

---

---

# STAGE 03 — CORE LAYOUT & NAVIGATION
**Goal:** Full sidebar, header, routing, command palette shell, toast system

---

```
BEHAVIOR: Read DOCS.md first. Do NOT break any existing types, DB schema, or store logic from Stages 01-02. Only modify layout components and add navigation logic.

TASK: Build the complete navigation system, sidebar, header, and shell layout. No feature content yet — only the chrome that surrounds all pages.

PLAN BEFORE CODING: List every file you will create or modify.

STEP 1 — Sidebar (src/components/layout/Sidebar.tsx — full implementation):
Replace the placeholder with the full sidebar:

Structure:
- Top section (px-4 pt-6 pb-4): Logo mark + "Preflight" wordmark in Space Grotesk bold. Below the logo: if a project is selected, show project name + status badge. If no project selected, show nothing.
- Middle section (flex-1, overflow-y-auto): Navigation links. When no project is selected, show only "Projects" link. When a project is selected, show: Brief, Research, Design, PRD, Build, Vault — each with a Material Symbols icon and label.
- Bottom section (border-top using surface-container): "New Generation" gradient button (gradient-cta class). Below: Settings link and Support link.
- Collapsed state (64px wide): Show only icons, hide labels. Show a toggle arrow button to expand.

Active state styling: active link has bg-primary/10 text-primary with a 2px right border in primary color. Hover: bg-surface-container text-on-surface. Transition: 0.2s cubic-bezier(0.4,0,0.2,1).

Use uiStore for: sidebarCollapsed state, activeTab. Use projectStore for: selectedProjectId.
Navigation: clicking Brief/Research/etc. sets activeTab in uiStore and navigates to /project/:id.

STEP 2 — Header (src/components/layout/Header.tsx — full implementation):
Left side: 
- If on a project page: show breadcrumb "Preflight / [Project Name]" with a back arrow
- If on hub: show "Preflight" wordmark only
Center (hidden on mobile): Search input with placeholder "Search projects... ⌘K" — clicking it or pressing ⌘K opens command palette (sets uiStore.isCommandPaletteOpen = true)
Right side: Notification bell icon (no functionality yet), gear icon (navigates to /settings), user avatar circle (initials "U" for now)

Styling: bg-surface/60 backdrop-blur-xl, sticky top-0 z-40, height 56px.

STEP 3 — AppLayout (src/components/layout/AppLayout.tsx — full implementation):
Full-screen flex layout. Left: Sidebar (fixed, full height). Right: flex-col — Header (sticky top) + main content (flex-1, overflow-y-auto, relative).
Add a subtle radial glow in the background: absolute positioned div with bg-primary/5 blur-[120px] rounded-full at top-right, and bg-secondary/5 blur-[100px] at bottom-left. Noise texture overlay (noise-texture class, absolute, pointer-events-none).

STEP 4 — Command Palette shell (src/components/shared/CommandPalette.tsx):
Create the command palette using cmdk library (`npm install cmdk`).
Structure: Dialog overlay (fixed inset-0, bg-surface-dim/80, backdrop-blur-sm, z-50). Inner panel: centered, max-w-lg, bg-surface-container glass-panel, rounded-xl, border border-outline-variant/15.
Content: Search input (cmdk Command.Input) with search icon. Results list (cmdk Command.List). Groups: "Projects" (lists all projects from useProjects), "Navigate" (Home, Settings), "Actions" (New Project).
Keyboard: ⌘K to open, Escape to close. Listen on document keydown in useEffect.
Show/hide based on uiStore.isCommandPaletteOpen. Each result item: icon + label + shortcut hint.
No actual navigation functionality yet — just the visual shell and open/close toggle.

STEP 5 — Toast system (src/components/shared/Toast.tsx):
Install and configure react-hot-toast: `npm install react-hot-toast`.
Create a ToastProvider component that wraps the app. Configure toast options: position bottom-right, dark theme, duration 3000ms.
Create a useToast hook in src/hooks/useToast.ts that wraps react-hot-toast methods: success(message), error(message), info(message), warning(message).

STEP 6 — Copy button component (src/components/shared/CopyButton.tsx):
A reusable button component. Props: text (string to copy), size ('sm' | 'md' | 'lg'), label (optional string, defaults to "Copy").
Behavior: clicking calls copyToClipboard util. On success: icon changes to checkmark, label changes to "Copied!" for 2 seconds, then resets. On error: shows toast error.
Sizes: sm = 28px height text-xs, md = 36px text-sm, lg = 44px text-base.
Style: bg-surface-container-high, hover:bg-surface-bright, border border-outline-variant/20, rounded-lg, flex items-center gap-2, transition 0.2s.

STEP 7 — Platform launcher buttons (src/components/shared/PlatformLaunchers.tsx):
A row of small icon+label buttons. Props: platforms (array of platform names to show).
Platform config (hardcoded): Lovable (heart icon, opens lovable.dev), Bolt (bolt icon, opens bolt.new), Cursor (arrow icon, opens cursor.sh), Claude Code (opens claude.ai), Perplexity (opens perplexity.ai), Gemini (opens gemini.google.com), ChatGPT (opens chat.openai.com), v0 (opens v0.dev), Replit (opens replit.com).
Each button: 32px height, bg-surface-container-high, rounded-md, text-xs, flex gap-1.5, hover:bg-surface-bright. Opens URL in new tab on click.

VALIDATION: Run `npm run build`. Zero TypeScript errors. Open app — sidebar shows, header shows, command palette opens with ⌘K, closes with Escape. Navigate between routes — active state updates correctly.

UPDATE DOCS.md: Add "Navigation & Layout" section. Document command palette keyboard shortcut, sidebar collapse behavior, platform launcher URLs.

SUMMARY: List all files created/modified and confirm all navigation works.
```

---

---

# STAGE 04 — PROJECT HUB
**Goal:** Full home screen with project cards grid, create project modal, empty state, filter/sort

---

```
BEHAVIOR: Read DOCS.md first. Do not modify layout components, stores, or types from previous stages. Only create new page and modal components.

TASK: Build the Project Hub — the main home screen that shows all projects as cards. This is Stage 04 of 20.

PLAN BEFORE CODING: List every file you will create or modify.

STEP 1 — Project Hub page (src/pages/hub/ProjectHub.tsx):
Layout: full content area with max-w-7xl mx-auto px-8 py-10.

Hero section:
- Large greeting: "Welcome back." in Space Grotesk 48px bold tracking-tighter. (Static for now — personalization in Stage 12)
- Subtitle line: "[N] projects in orbit · Last active [X] ago" — pull from useProjects hook. Use formatDate util.
- Right side: "New Project" gradient-cta button + "Import" ghost button.

Filter bar:
- Status filter pills: All, Ideation, Researching, Designing, Building, Shipped. Active pill: bg-primary/15 text-primary border border-primary/30. Inactive: bg-surface-container text-on-surface-variant.
- Right side: Sort dropdown (Last modified, Created, Name) + Grid/List view toggle icons.

Project cards grid:
- 3-column responsive grid (xl:grid-cols-3 lg:grid-cols-2 grid-cols-1), gap-6.
- Map over filtered+sorted projects from useProjects hook.
- Each card: ProjectCard component (see Step 2).
- Loading state: 3 skeleton cards (animated bg-surface-container-high pulse).

Empty state (when no projects):
- Centered, py-24.
- Large icon (rocket_launch, 64px, text-primary/40).
- Heading: "No projects yet." Space Grotesk 28px.
- Subtext: "Start with an idea. Preflight handles the rest." text-outline.
- "Create your first project" gradient-cta button.
- Below: 3 feature hint cards ("Guided Setup", "Templates", "Vault Training") — visual only, no functionality.

STEP 2 — ProjectCard component (src/components/hub/ProjectCard.tsx):
Props: project (Project type).

Card structure (bg-surface-container, rounded-xl, border border-outline-variant/10, p-5, relative, noise-texture):
- Top row: StatusBadge component (left) + options menu button (right, ⋮ icon, no functionality yet).
- App icon area: 40px square, rounded-lg, bg-surface-container-high, centered icon (default: deployed_code Material Symbol).
- Project name: Space Grotesk 18px font-semibold mt-3.
- Description: text-outline text-sm line-clamp-2.
- Progress section:
  - Label "Progress" + percentage (count completed stages / total stages * 100, or 0 if no stages).
  - Thin progress bar (h-[3px], bg-surface-variant, inner div bg-gradient-to-r from-primary to-secondary).
  - Pipeline stage icons row: 5 small icons (Brief, Research, Design, PRD, Build) — filled primary if that module has at least one artifact, outline text-outline if empty.
- Bottom row: Last modified timestamp (text-outline text-xs) + Platform badge chips (platform names as small pills).

Hover state: card lifts with transition-all, border-color shifts to border-primary/20, shadow-[0_0_20px_rgba(197,192,255,0.05)].
Click: navigate to /project/:id and set selectedProjectId in projectStore.

STEP 3 — StatusBadge component (src/components/shared/StatusBadge.tsx):
Props: status (ProjectStatus).
Renders a pill with a colored dot and label.
Status colors: ideation=outline, researching=tertiary, designing=primary, building=secondary (with pulse animation on dot), shipped=secondary.
Style: inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider.
Background: bg-[status-color]/10, text: text-[status-color], dot: w-1.5 h-1.5 rounded-full bg-[status-color].

STEP 4 — New Project Modal (src/components/hub/NewProjectModal.tsx):
Triggered by "New Project" button. Uses Dialog from shadcn/ui.

Form fields:
- Project name (Input, required, autofocus, placeholder "What are you building?")
- One-line description (Input, optional, placeholder "What does this app do in one sentence?")
- Target platform chips (multi-select): Lovable, Bolt, Cursor, Claude Code, Replit, v0, Other — click to toggle selected state (bg-primary/15 border-primary/40 when selected)
- Tech stack tags (tag input): type to add, click to remove. Show pill for each tag.

Footer: "Create Project" gradient-cta button (full width) + cancel text link.

On submit: call createProject from useProjects hook with form data. On success: close modal, navigate to /project/:newId, show success toast.
Validation: name is required (show inline error if empty on submit attempt).

STEP 5 — Wire up import/export (src/pages/hub/ProjectHub.tsx):
Import button: show a file input dialog that accepts .json files. Parse the JSON, validate it has the expected shape, import all projects via createProject. Show success/error toast.

VALIDATION: Run `npm run build`. Open the app. Verify:
- Empty state renders correctly.
- Create a project via the modal — it appears as a card.
- Click the card — navigate to /project/:id (workspace placeholder for now).
- Filter pills filter the grid.
- Status badge renders correctly for each status.

UPDATE DOCS.md: Add "Project Hub" to Features section. Document project card structure and status colors.

SUMMARY: List files created/modified and confirm all interactions work.
```

---

---

# STAGE 05 — PROJECT WORKSPACE SHELL
**Goal:** Workspace layout, tabbed navigation, pipeline progress bar, context node selector

---

```
BEHAVIOR: Read DOCS.md first. Do not break Project Hub or layout components. Only add workspace-specific components.

TASK: Build the Project Workspace shell — the container that hosts all project tabs (Brief, Research, Design, PRD, Build, Vault). No tab content yet — only the shell and navigation.

PLAN BEFORE CODING: List every file you will create or modify.

STEP 1 — ProjectWorkspace page (src/pages/workspace/ProjectWorkspace.tsx):
Use useParams() to get projectId. Use useProject(projectId) hook. If project not found, show a "Project not found" state with a back button.

Layout: full content area, no extra padding. Two sections:
1. Workspace header (sticky, bg-surface/80 backdrop-blur-md, border-b border-outline-variant/10, z-30, px-8 py-4):
   - Breadcrumb: "Projects" (clickable, navigates to "/") / "[Project Name]" (current, not clickable).
   - Pipeline progress bar: horizontal row of stage pills. Stages: Brief → Research → Design → PRD → Build → Ship. Each pill: rounded-full px-3 py-1 text-xs. Completed stages: bg-secondary/20 text-secondary. Current stage: bg-primary/20 text-primary with animated pulse. Future stages: bg-surface-container text-outline.
   - Right side: "Context Nodes" button (opens ContextNodeSelector panel).

2. Tab content area (flex-1, overflow-y-auto):
   - Read activeTab from uiStore.
   - Render the correct tab component based on activeTab. For now, render placeholder components for all tabs.
   - Placeholders: each renders a centered div with the tab name and "Coming in Stage [N]".

STEP 2 — Workspace sidebar updates (src/components/layout/Sidebar.tsx update):
When selectedProjectId is set, update the nav to show workspace tabs.
Each tab link: Brief, Research, Design, PRD, Build, Vault.
Icons: description, analytics, architecture, article, terminal, inventory_2.
Clicking sets activeTab in uiStore.
Add a "PRD" tab between Design and Build (with storage icon).

STEP 3 — Context Node Selector (src/components/workspace/ContextNodeSelector.tsx):
A slide-in panel (right side, absolute, bg-surface-container glass-panel, border-l border-outline-variant/15, w-72, h-full, z-20, transition slide from right).
Props: projectId (string), selectedNodes (string[]), onChangeNodes (callback).

Node types to show:
- Brief (always available if brief has content)
- Research results (available if vault has files in 'research' category)
- Design files (available if vault has files in 'design' category)
- PRD (available if artifact of type 'prd' exists)
- System Instructions (available if artifact of type 'system_instructions' exists)
- Vault files (multi-select list of vault files with isActiveContext = true)

Each node: checkbox + icon + label + status chip ("Available" / "Missing data" greyed out).
Bottom: "[N] nodes selected" count + "Done" close button.

Open/close: triggered by the "Context Nodes" button in workspace header. Use local useState for open state.

STEP 4 — Output Panel component (src/components/shared/OutputPanel.tsx):
A reusable panel for displaying generated AI content.
Props: content (string), type (ArtifactType), platform (string), isLoading (boolean), onRegenerate (() => void), platformLaunchers (string[]).

Structure:
- Header toolbar: filename chip (e.g., "PROMPT_V1.2.TXT") + Copy button (large) + Regenerate button + Download dropdown.
- Content area: dark bg-surface-container-lowest, rounded-lg, p-4, font-mono text-sm, overflow-auto, max-h-[500px].
  - Loading state: animated skeleton lines (3 lines, varying widths, bg-surface-container-high pulse).
  - Syntax highlighting: apply color classes to lines starting with specific keywords (SYSTEM:, CONTEXT:, OBJECTIVE: in secondary color; comments in outline; keywords like INPUT_NODES: in primary color). This is simple regex-based coloring, not a full syntax highlighter.
- Footer: chars count + token estimate (use estimateTokens util) + platform launcher buttons row.

Download dropdown options (based on type): "Download .md", "Download .txt", "Download .cursorrules" (for rules-file type), "Download CLAUDE.md" (for rules-file type).

VALIDATION: Run `npm run build`. Open a project — workspace renders with pipeline bar and tab navigation. Context Node Selector opens/closes. Switching tabs in sidebar updates the content area.

UPDATE DOCS.md: Add "Project Workspace" to Features section. Document tab names and context node types.

SUMMARY: List files created/modified and confirm workspace shell works correctly.
```

---

---

# STAGE 06 — BRIEF MODULE
**Goal:** Fully functional Brief tab with autosave, structured form, completion gate

---

```
BEHAVIOR: Read DOCS.md first. Do not break workspace shell or any previous components. The Brief module must autosave to Dexie.js on every meaningful change — no save button.

TASK: Build the complete Brief module — the structured project idea capture form.

PLAN BEFORE CODING: List every file you will create.

STEP 1 — Brief page (src/pages/workspace/BriefPage.tsx):
Replace the placeholder with the full Brief form.

Layout: max-w-3xl mx-auto py-8 px-6. Autosave to Dexie via useBrief hook on every field change (debounced 800ms).

Header section:
- Large editable project name input (not a regular Input — style it as an h1, 40px Space Grotesk bold, contentEditable or large styled input, no border, transparent bg, placeholder "Untitled project"). Saves to project.name on blur.
- Below: "PROJECT IDENTITY" label in mono uppercase text-outline text-xs tracking-widest.

Form sections (2-column grid on desktop, 1-column on mobile):

Left column:
- "The Problem" card (bg-surface-container, rounded-xl, p-5, noise-texture):
  - Warning icon (warning, text-tertiary) + "The Problem" heading.
  - Textarea: 4 rows, bg-surface-container-lowest, no border, font-body text-sm, placeholder "What problem does this solve? Be specific.". Autosaves to brief.problem.
  
- "Core Features" card:
  - Sparkle icon (auto_awesome, text-primary) + "Core Features" heading + "Add Requirement" small button (right-aligned).
  - List of feature input rows: numbered badge (01, 02...) + text input + drag handle + delete button.
  - "Add Feature" button adds a new empty row.
  - Features reorderable (drag-and-drop is optional — just add/remove for now).
  - Saves to brief.coreFeatures array.

Right column:
- "Target User" card:
  - Users icon + "Target User" heading.
  - List of user type chips (add/remove). Each chip: input + add button. Display as pills once added. Saves to brief.targetUser as comma-joined string.

- "Tech Stack Hint" card:
  - Stack icon + "Tech Stack Hint" heading.
  - Tag input: type a tech name + Enter to add, click chip to remove. Saves to project.techStack.

- "Target Platforms" card:
  - Monitor icon + "Target Platforms" heading.
  - Grid of platform buttons (same as New Project modal). Multi-select. Saves to project.targetPlatforms.

Notes section (full width):
- Collapsible "Notes" section. Simple textarea. Saves to brief.notes.

Completion CTA (bottom, full width, sticky bottom-0 bg-surface/80 backdrop-blur-md py-4):
- Show only when name + problem + at least 1 feature are filled.
- Large gradient-cta button: "Brief looks complete → Generate Research Prompt" with arrow icon.
- Clicking: navigates to Research tab (sets activeTab = 'research' in uiStore).
- Below button: small text "This will initialize the Analysis Engine to find market gaps and technical feasibility for [Project Name]."

STEP 2 — useBrief hook update (src/hooks/useBrief.ts):
Ensure the hook initializes an empty Brief in Dexie if one doesn't exist for this projectId. The Brief must be created lazily on first access.

STEP 3 — Brief completion check utility (src/lib/briefUtils.ts):
Export a `getBriefCompletionScore(brief: Brief): number` function that returns 0-100 based on:
- name filled: 20 points
- problem filled: 25 points
- targetUser filled: 15 points
- coreFeatures >= 1: 25 points
- techStack filled: 10 points
- targetPlatforms >= 1: 5 points

Export `isBriefComplete(brief: Brief): boolean` — returns true if score >= 70.

VALIDATION: Run `npm run build`. Open a project → Brief tab. Type in the problem textarea — verify it autosaves (check Dexie DevTools if available or add a "Saved" indicator). Add a feature — it appears in the list. Fill all required fields — the CTA button appears. Click it — navigates to Research tab.

UPDATE DOCS.md: Add "Brief Module" to Features section. Document autosave behavior and completion gates.

SUMMARY: List files created/modified and confirm autosave and completion gate work.
```

---

---

# STAGE 07 — RESEARCH MODULE
**Goal:** Research tab with context nodes, AI prompt generation, platform launchers, file upload

---

```
BEHAVIOR: Read DOCS.md first. Do not modify Brief module, types, or DB schema. The AI generation call will use a stub that returns a placeholder — real AI integration is Stage 13. Focus on UI and file upload logic.

TASK: Build the complete Research module.

PLAN BEFORE CODING: List every file you will create.

STEP 1 — Research page (src/pages/workspace/ResearchPage.tsx):

Top section — "Deep Research Prompt":
Header: "Research Intelligence" heading (Space Grotesk 28px) + "SYSTEM READY" green status badge (right-aligned, bg-secondary/10 text-secondary, rounded, text-xs mono uppercase).
Subheading: "Synthesize project context into high-fidelity research prompts for LLM analysis."

Context Nodes panel (left column, ~380px wide):
- "CONTEXT NODES" label (mono uppercase text-outline text-xs).
- List of context node cards. Each card: icon + label + description + checkbox/toggle + status chip.
  - "Project Brief" node — always available if brief has content. Shows "v1.2 Updated 2h ago" style metadata.
  - "Tech Stack" node — available if project.techStack has items.
  - "User Personas" node — disabled/locked if targetUser is empty. Shows lock icon + "Missing Data" label.
- "Generate Research Prompt" button (gradient-cta, full width). Loading state: spinner + "Generating...".

Right column (flex-1):
- OutputPanel component instance. If no artifact yet: show placeholder state with dashed border and "Generate your first research prompt" text.
- When generated: show full output in OutputPanel with platform launchers: Perplexity, Gemini, ChatGPT.

Bottom section — "Research Results":
- "Research Results" heading + "DRAG & DROP READY" badge.
- File drop zone: accept PDF, MD, TXT. On drop: call addFile from useVaultFiles hook with category='research'.
- Uploaded files grid: file cards showing name, size, status. Each card: download icon + delete icon.
- Each file card has an "Inject Context" toggle — calls toggleContext from useVaultFiles.

STEP 2 — Generation logic (src/services/generation/researchGeneration.ts):
Create a `generateResearchPrompt(params: { project: Project, brief: Brief, activeNodes: string[] }): Promise<string>` function.
For now: build a structured prompt string by combining the context nodes (project name, problem, features, tech stack) into the deep research prompt format from Stage 3 PRD. Return this string as the "generated" content. The actual AI call will be wired in Stage 13.

STEP 3 — Artifact save/load:
When generation succeeds: save a new GeneratedArtifact to Dexie via createArtifact from useArtifacts hook.
On page load: use getLatestByType('research_prompt') to check if a prompt already exists and pre-populate the OutputPanel.

VALIDATION: Run `npm run build`. Open Research tab. Select context nodes. Click generate — OutputPanel shows content. Upload a file — it appears in the results section. Toggle context — state updates.

UPDATE DOCS.md: Add "Research Module" to Features. Document context node types and generation flow.

SUMMARY: List all files and confirm generation and file upload work.
```

---

---

# STAGE 08 — DESIGN MODULE
**Goal:** Design tab with platform selector, context nodes, prompt generation, output history

---

```
BEHAVIOR: Read DOCS.md first. Same pattern as Stage 07 — stub generation, real AI in Stage 13. Do not modify Research module.

TASK: Build the complete Design module.

PLAN BEFORE CODING: List every file you will create.

STEP 1 — Design page (src/pages/workspace/DesignPage.tsx):

Top section:
Header: "Design Prompt" heading + "Target Platform" selector.
Platform selector: horizontal tab row with platform names: Stitch, v0, Figma AI, Locofy, Universal. Active tab: bg-surface-container-high border-b-2 border-primary text-primary. Inactive: text-outline.

Context Nodes panel (same layout as Research):
- Brief node + Research results node (locked if no research files in vault).
- "+ Add context" button that opens the full ContextNodeSelector panel.
- "Generate Design Prompt" button (gradient-cta).

Action Center panel (right, accent card bg-primary/10 border border-primary/20 rounded-xl):
- "ACTION CENTER" label.
- "Generate Design Prompt" large action button with bolt icon.
- Shows selected platform name.

Output area:
- Generated prompt in a monospace terminal-style block (bg-surface-container-lowest, rounded-lg).
- Toolbar: file label chip + "Open [Platform]" button + "Open v0" button (based on selected platform).
- If Stitch selected: show "OPEN STITCH ↗" button. If v0: "OPEN V0 ↗". Always show both as options.

Bottom section — "Output History":
- "Manage and view previously generated dashboard wireframes"
- If design files uploaded to vault: show thumbnail grid. Each card: thumbnail preview (just a placeholder image or file icon) + platform label chip ("STITCH V4", "V0 RENDER") + file name.
- "+ Add Concept" button (calls vault file picker for image/PDF uploads with category='design').
- "Upload Design Output" button.

STEP 2 — Generation logic (src/services/generation/designGeneration.ts):
Same pattern as research — build the design prompt string from context, return it as the generated content.

STEP 3 — Platform-specific prompt variants:
The design prompt content should be slightly different per platform. Create a `getDesignPromptForPlatform(platform: string, context: object): string` function that adjusts the prompt's constraint section based on the selected platform.

VALIDATION: Run `npm run build`. Switch between platform tabs — active tab updates. Generate prompt — OutputPanel shows content. Upload a design file — it appears in Output History.

UPDATE DOCS.md: Add "Design Module" to Features. Document platform variants.

SUMMARY: List all files and confirm all interactions work.
```

---

---

# STAGE 09 — PRD & SYSTEM MODULE
**Goal:** PRD tab with three-panel layout, PRD generation, System Instructions, Rules File

---

```
BEHAVIOR: Read DOCS.md first. This is the most complex tab — three generation panels on one screen. Do not break any previous modules.

TASK: Build the complete PRD & System module with all three sub-sections.

PLAN BEFORE CODING: List every file you will create. Plan the layout carefully — left panel (PRD) takes ~55% width, right panel (System Instructions + Rules File) takes ~45%.

STEP 1 — PRD page (src/pages/workspace/PRDPage.tsx):

Page layout: two-column flex on desktop. Left: PRD panel. Right: System Instructions + Rules File stacked vertically.

LEFT PANEL — PRD:
Header row: "PRD" large heading (Space Grotesk) + version chip (v0.4.2-alpha style) + "Copy as Markdown" button + "Regenerate" button.
Context nodes: Brief + Research + Design (show which are available/selected).
If no PRD generated: empty state with "Generate PRD" button.
If PRD generated: render the content using react-markdown with remark-gfm plugin. Style markdown: h2 in primary color, h3 in secondary, code blocks in surface-container-lowest, links in primary.
Generation: `generatePRD(params)` stub function in src/services/generation/prdGeneration.ts.
Save as artifact type 'prd'.

RIGHT PANEL TOP — System Instructions:
"System Instructions" heading (18px Space Grotesk) + "Paste this as the system prompt for your AI coding tool." subtitle.
Platform mode selector: Universal | Lovable | Cursor | Claude Code | Bolt (small horizontal tabs).
"SYSTEM_PROMPT.TXT" file chip + Copy button.
Content: monospace code block (bg-surface-container-lowest rounded-lg p-4 text-sm overflow-auto max-h-[280px]).
Green-highlighted keywords (CONTEXT:, OBJECTIVE:, SYSTEM:, CONSTRAINTS:) using inline spans.
Generate button. Save as artifact type 'system_instructions'.
Below content: "LIVE CONTEXT" badge (bg-secondary/10 text-secondary, animated dot).

RIGHT PANEL BOTTOM — Rules File:
"Rules File" heading + "Platform-specific agent constraints." subtitle.
Platform selector tabs: Universal | Cursor | Claude (horizontal pills).
File chip shows ".CURSORRULES" or "CLAUDE.MD" based on selection.
Content: same monospace block with green-highlighted section headers (# Technical Constraints, # UI Integrity Rules, etc. in secondary color).
Generate button. Save as artifact type 'rules_file'.
Footer: "SYSTEM HEALTH" label + "NEURAL_SYNC_OPTIMIZED" green status chip.

STEP 2 — Generation stubs:
src/services/generation/prdGeneration.ts — builds PRD markdown from context
src/services/generation/systemInstructionsGeneration.ts — builds system instructions text for selected platform
src/services/generation/rulesFileGeneration.ts — builds .cursorrules or CLAUDE.md content for selected platform

All return strings. AI calls wired in Stage 13.

STEP 3 — Platform-specific rules templates:
For each platform (Universal, Lovable, Cursor, Claude Code, Bolt), define a template object with the key sections of the rules file pre-filled. The generation function merges this template with the project-specific context.

VALIDATION: Run `npm run build`. Open PRD tab. Generate PRD — markdown renders correctly. Generate System Instructions — content shows with syntax highlighting. Switch between Cursor/Claude Code tabs in Rules File — the file chip label updates.

UPDATE DOCS.md: Add "PRD & System Module" to Features. Document the three sub-sections.

SUMMARY: List all files and confirm all three panels work correctly.
```

---

---

# STAGE 10 — BUILD MODULE (SEQUENTIAL BUILD ENGINE)
**Goal:** Full sequential build engine with stage cards, progress tracker, export all

---

```
BEHAVIOR: Read DOCS.md first. This is the most important module — the core product value. Do not break PRD or System module.

TASK: Build the complete Sequential Build Engine — the module that generates and manages all build prompts.

PLAN BEFORE CODING: List every file you will create.

STEP 1 — Build page (src/pages/workspace/BuildPage.tsx):

Page header:
"Sequential Build Engine" heading (Space Grotesk 32px) + "ACTIVE WORKSPACE" badge + version chip "V1.0.42-STABLE".
Platform mode selector: Universal | Lovable | Cursor (horizontal tab buttons, styled with border, active has bg-surface-container-high).

Global generate button (full-width card, bg-primary/10 border border-primary/20 rounded-xl, p-5):
- Sparkle icon + "Generate Full Build Workflow" large text + "Orchestrate the entire workspace architecture in sequential prompts" subtitle.
- Arrow icon on right.
- Clicking triggers generateFullWorkflow() function — creates all build stages in Dexie based on the PRD's core features.
- Loading state: animated progress showing "Analyzing PRD... Generating stages... Complete."

Build stages list (mt-6, flex flex-col gap-4):
Map over buildStages from useBuildStages hook.
Each stage: BuildStageCard component (see Step 2).
Empty state: "Generate your first build workflow above" with a locked icon.

Bottom sticky bar:
"GLOBAL COMPLETION" label + "Progress: X of Y stages completed" text.
Stage dots row: horizontal row of small circles, filled=complete, outlined=pending, current=pulsing.
"TARGET PLATFORM" label + platform name chip.
"EXPORT ALL" button (downloads all stage prompts as single .md file).

STEP 2 — BuildStageCard component (src/components/workspace/BuildStageCard.tsx):
Props: stage (BuildStage), onStatusChange, onRegenerate.

Card structure (bg-surface-container rounded-xl border border-outline-variant/10, p-5, relative):
- Stage number badge: large colored square (40px) with stage number. Colors: 01-02 = primary, 03-04 = secondary, 05+ = outline-variant. Font-mono bold.
- Header row: stage name (Space Grotesk 18px semibold) + status chip (right).
  - Status chips: "LOCKED" (bg-outline/10 text-outline), "NOT STARTED" (bg-surface-container-high text-on-surface-variant), "IN PROGRESS" (bg-secondary/10 text-secondary with pulsing dot), "COMPLETE" (bg-secondary/20 text-secondary with checkmark).
- Stage description: text-outline text-sm mt-1.
- Step progress row: small colored circles showing sub-step count + "X STEPS COMPLETE" or "X STEPS QUEUED".
- Prompt block (collapsible, default expanded for IN PROGRESS stages, collapsed for others):
  - File label chip (e.g., "FOUNDATION-CONFIG.SH" or "AUTH-SCHEMA.MAIN.SQL").
  - Copy button (top-right of block).
  - Code block: bg-surface-container-lowest rounded-lg p-4 font-mono text-sm text-secondary (prompt content in green syntax style).
- Footer row: "DISMISS STAGE" ghost button + "COPY PROMPT" gradient-cta button (if not complete) OR "TOGGLE STATUS" button (if prompt was already copied).

States:
- Locked (stages after the current active one): reduced opacity 0.4, no copy button.
- Active: full opacity, highlighted left border (3px solid primary).
- Complete: checkmark icon, reduced opacity 0.7, collapsed by default.

STEP 3 — Build workflow generation (src/services/generation/buildGeneration.ts):
`generateFullWorkflow(params: { project, brief, prd, platform })`:
1. Always generate these fixed stages: Foundation, Database & Auth, Core Architecture.
2. Parse brief.coreFeatures — generate one Feature Block stage per feature.
3. Always append: Integration Layer, Audit & Refactor, Bug Fix Cycle, Polish, Final Audit, Deployment Prep.
4. For each stage, generate the prompt content using the stage-specific templates from Stage 3 PRD.
5. Save all stages to Dexie via createStages from useBuildStages hook.
6. Return the array of created stages.

STEP 4 — Export all functionality:
`exportAllPrompts(stages: BuildStage[]): void` — builds a single markdown string with all stages separated by "---", prompts as code blocks, and stage names as headings. Uses FileSaver.js to download as "preflight-build-workflow.md".

STEP 5 — Stage status management:
When user clicks "TOGGLE STATUS": cycle through not-started → in-progress → complete → not-started.
When a stage is marked complete: automatically unlock the next stage (set its status from 'locked' to 'not-started').
First stage (Foundation) always starts as 'not-started' (never locked).

VALIDATION: Run `npm run build`. Generate full workflow — stages appear. Each stage has a copy button. Toggling status cycles through states. Next stage unlocks when previous is complete. Export All downloads a file.

UPDATE DOCS.md: Add "Build Module" to Features. Document stage types, status states, and export format.

SUMMARY: List all files and confirm the sequential logic works correctly.
```

---

---

# STAGE 11 — VAULT MODULE
**Goal:** Vault file storage, categories, inject context toggles, vault integrity

---

```
BEHAVIOR: Read DOCS.md first. Vault is used by other modules (Research and Design already upload to it). This stage builds the dedicated Vault view.

TASK: Build the complete Vault module tab view.

STEP 1 — Vault page (src/pages/workspace/VaultPage.tsx):
Header: "Project Vault" (Space Grotesk 28px) + "Deep-storage for all technical assets, context injections, and architectural blueprints for [Project Name]." subtitle.
Right side: filter pills (All, Research, Designs, Exports) + search input.

Main layout: 2-column. Left (380px): upload zone + vault integrity card. Right: file grid.

Left — Upload zone (bg-surface-container dashed border rounded-xl p-8 text-center):
- Upload icon (cloud_upload, 40px, text-outline).
- "Drop your project brain here" heading.
- "Accepting PDF, MD, PNG, and JSON context files" subtitle.
- "SELECT ASSETS" button.

Left — Vault Integrity card (mt-4, bg-surface-container rounded-xl p-5):
- "VAULT INTEGRITY" label + percentage + "Ready" green badge.
- Progress bar (bg-secondary gradient).
- "Total Context Weight" row with file size total.
- "Active Context Tokens" row with token estimate of all active context files combined.

Right — Files grid (grid grid-cols-2 gap-4):
Map over vault files filtered by selected category.
Each file card (bg-surface-container rounded-xl p-4 border border-outline-variant/10):
- File type icon (picture_as_pdf for PDF, article for MD, data_object for JSON, image for PNG) in colored badge.
- File name (truncated, font-mono text-sm).
- File size + "UPDATED X AGO" metadata.
- "INJECT CONTEXT" toggle (shadcn Switch component). When on: bg-secondary. Calls toggleContext from useVaultFiles.
- Download icon + Delete icon (top-right, show on hover).

Bottom of right column: "+ LINK CLOUD DRIVE" placeholder button (not functional — future feature).

STEP 2 — File upload handling:
Drag-and-drop: use react-dropzone. Accept: .pdf, .md, .txt, .png, .jpg, .json, .zip.
On drop: read file as ArrayBuffer, call addFile with the file data.
Show upload progress (simple indeterminate loading state per file card while uploading to IndexedDB).

VALIDATION: Run `npm run build`. Navigate to Vault tab. Upload a file via drag-and-drop — it appears in the grid. Toggle context — state updates. Filter by category — correct files shown. Vault integrity score updates.

UPDATE DOCS.md: Add "Vault Module" to Features. Document supported file types and context injection behavior.

SUMMARY: List all files and confirm upload, toggle, and filter work.
```

---

---

# STAGE 12 — SETTINGS MODULE
**Goal:** Full Settings page with AI providers, agent prompts editor, platform launchers, appearance

---

```
BEHAVIOR: Read DOCS.md first. Settings connects to aiStore and settingsStore from Stage 02. Do not modify any feature modules.

TASK: Build the complete Settings page.

STEP 1 — Settings page (src/pages/settings/SettingsPage.tsx):
Header: "Workspace Settings" (Space Grotesk 32px) + "ENGINE CONFIGURATION & AUTHENTICATION" subtitle in mono uppercase.

Two-column layout: main content (left, ~65%) + sidebar panels (right, ~35%).

MAIN LEFT — AI Providers section:
"AI Providers" heading with key icon + "X CORE LINKS ACTIVE" badge (counts connected providers).
Provider cards grid (3 columns):
For each provider (Anthropic, OpenAI, Google Gemini, DeepSeek, Groq, Custom):
- Card: bg-surface-container-low rounded-xl p-5 border border-outline-variant/10.
- Top: provider logo/icon + status chip ("CONNECTED" with green dot / "DISCONNECTED" with red dot).
- Provider name (Space Grotesk semibold).
- API key: masked input (show first 7 chars + dots + last 3 chars). Edit pencil icon on right.
- Clicking edit: inline input field appears for updating the key. Save/cancel buttons.
On save: call saveProvider from useAIProviders hook.

Intelligence Routing card:
"Intelligence Routing" heading with brain icon.
"DEFAULT WORKSPACE MODEL" label + model selector dropdown (shadcn Select). Shows available models for the connected default provider.
"STREAMING RESPONSE" label + toggle switch + "Visualize the model thinking in real-time." description.

Platform Launchers card:
"Platform Launchers" heading with rocket icon.
Grid of platform toggles (2 columns): Lovable, Cursor, VS Code, Warp, Bolt, Replit, Perplexity, Gemini, ChatGPT, v0.
Each row: platform icon + name + shadcn Switch toggle. Calls updateSettings from useSettings.

Agent Prompts section:
"Agent Prompts" heading.
List of agent prompt cards — one per AgentType.
Each card: agent name + "Edit" button. On click: opens an inline textarea with the current system prompt content. "Save" and "Reset to Default" buttons.
Use useAgentPrompts hook for all operations.

MAIN RIGHT — Appearance card:
Theme selector: three preview thumbnails (Dark, Light, System). Active has primary border.

Storage card:
"EXPORT JSON" action row → downloads all project data as JSON.
"USAGE LOGS" action row → shows a simple modal with a list of generation events (timestamps + artifact types created).
"CLEAR ALL DATA" danger button → shows confirmation dialog before calling db.delete() and reloading.

HUD stats (bottom of right panel):
Latency and Memory mini progress bars (static values for now — real metrics in future).
System version chip.

STEP 2 — Personalized greeting:
Now that Settings has a name field, add an "Your name" input to the settings page (stored in AppSettings.userName). Use this value in the Project Hub greeting: "Welcome back, [Name]." If empty, show "Welcome back."

VALIDATION: Run `npm run build`. Open Settings. Add an Anthropic API key — provider shows as CONNECTED. Toggle a platform launcher — save persists on page refresh. Edit an agent prompt — changes save and persist.

UPDATE DOCS.md: Add "Settings Module" to Features. Document where settings are persisted and the agent prompts system.

SUMMARY: List all files and confirm all settings persist correctly.
```

---

---

# STAGE 13 — AI PROVIDER INTEGRATION (BYOK)
**Goal:** Real AI calls, all providers wired, generation functions produce real output

---

```
BEHAVIOR: Read DOCS.md first. This stage wires real AI API calls to the generation stubs created in Stages 07-10. API keys are already stored in Dexie from Stage 12. Do not add any new UI components — only implement the service layer.

SECURITY RULES (NON-NEGOTIABLE):
- API keys must ONLY be read from Dexie.js
- Never log API keys, never include them in error messages
- Never send API keys to any server other than the official provider endpoint
- Never store API keys in localStorage, sessionStorage, or any React state
- All API calls must be wrapped in try/catch with user-friendly error handling

TASK: Implement the full BYOK AI integration layer.

PLAN BEFORE CODING: List every file you will create or modify.

STEP 1 — Provider adapters (src/services/ai/providers/):
Create one file per provider:

anthropicProvider.ts:
- Import @anthropic-ai/sdk (install if not present: `npm install @anthropic-ai/sdk`)
- Implement AIProvider interface
- complete(): call anthropic.messages.create() with the model, system prompt, and messages
- streamComplete(): call anthropic.messages.stream() and call onChunk for each delta text
- validateKey(): make a minimal API call, return true if 200 response

openaiProvider.ts:
- Import openai (install if not present: `npm install openai`)
- Implement AIProvider interface
- Map message roles correctly
- complete(): call openai.chat.completions.create()
- streamComplete(): use stream: true, iterate over chunks

googleProvider.ts:
- Import @google/generative-ai (install if not present: `npm install @google/generative-ai`)
- Implement AIProvider interface
- Note: Google uses a different message format (parts array) — handle the mapping

deepseekProvider.ts and groqProvider.ts:
- Both are OpenAI-compatible APIs
- Reuse openaiProvider logic with different baseURL
- DeepSeek: https://api.deepseek.com/v1
- Groq: https://api.groq.com/openai/v1

customProvider.ts:
- Props: apiKey, model, baseURL
- Implement as OpenAI-compatible adapter with the custom baseURL

STEP 2 — Provider factory (src/services/ai/index.ts — full implementation):
Replace the stub with a real getProvider function:
1. Read the default AIProviderConfig from Dexie (call db.aiProviders.where('isDefault').equals(1).first())
2. Based on provider type, instantiate the correct adapter with the API key
3. Return the AIProvider instance
4. If no provider configured: throw a descriptive error "No AI provider configured. Please add an API key in Settings."

Also export: `generateWithAgent(agentType: AgentType, userContent: string, onChunk?: (chunk: string) => void): Promise<string>`
This function:
1. Gets the agent's system prompt from Dexie (db.agentSystemPrompts.where('agentType').equals(agentType).first())
2. Gets the AI provider via getProvider()
3. Calls complete() or streamComplete() based on whether onChunk is provided
4. Returns the generated text

STEP 3 — Wire generation functions to real AI:
Update each generation service to call generateWithAgent instead of returning stub strings:

researchGeneration.ts: Build the user content from context (project name, brief, tech stack), call generateWithAgent('research', content). Return the result.

designGeneration.ts: Same pattern for design prompt generation.

prdGeneration.ts: Build user content from brief + research artifacts, call generateWithAgent('prd', content).

systemInstructionsGeneration.ts: Include PRD + platform in user content, call generateWithAgent('system-instructions', content).

rulesFileGeneration.ts: Include PRD + platform in user content, call generateWithAgent('rules-file', content).

buildGeneration.ts: For each stage, call generateWithAgent with the appropriate agent type.

STEP 4 — Streaming UI updates:
In OutputPanel, update to handle streaming:
- Props: add isStreaming (boolean) and onStreamChunk ((chunk: string) => void).
- During streaming: show content character by character as chunks arrive (append to state string).
- Show a blinking cursor at the end of streaming content.
- When streaming ends: show the full content and the toolbar.

Update each generation call site to pass an onChunk callback that updates a local state string, and passes it to OutputPanel.

STEP 5 — Error handling:
Wrap all AI calls in the UI with error handling:
- "No API key configured" → redirect to Settings with a toast message
- "Invalid API key" → show inline error with a link to Settings
- "Rate limit exceeded" → show toast with retry suggestion
- "Network error" → show toast with retry button
- Never crash the page — always catch and display the error gracefully

VALIDATION: Add a real Anthropic (or OpenAI) API key in Settings. Generate a research prompt — real output streams in. Generate a PRD — full markdown document appears. Verify API key is never visible in network requests (key should be in request headers only, not in the URL or request body).

UPDATE DOCS.md: Add "AI Integration" section. Document the provider abstraction pattern and BYOK security model. List all supported providers and their model options.

SUMMARY: List all files modified and confirm real AI generation works end-to-end.
```

---

---

# STAGE 14 — SPLASH SCREEN & ONBOARDING
**Goal:** Splash screen animation, 3-step onboarding flow, first launch detection

---

```
BEHAVIOR: Read DOCS.md first. This stage adds the app entry experience. Do not break any existing functionality.

TASK: Build the splash screen and 3-step onboarding flow.

STEP 1 — First launch detection (src/hooks/useFirstLaunch.ts):
Check AppSettings.isOnboardingComplete from Dexie on app load. Return { isFirstLaunch, completeOnboarding } where isFirstLaunch = !settings.isOnboardingComplete.

STEP 2 — Splash screen (src/components/splash/SplashScreen.tsx):
Shown for 2.5 seconds on every app load (not just first launch).
Design matches the splash HTML from the design files:
- Full screen, bg-surface-container-lowest, flex-col items-center justify-center.
- Radial glow: absolute, bg-primary/8, blur-3xl, behind the logo.
- Noise overlay (3% opacity).
- Logo icon: 80px square, bg-surface-container-highest rounded-xl, Material Symbol pentagon (filled, primary color) with rocket_launch overlay icon.
- "Preflight" wordmark (Space Grotesk 32px bold tracking-tighter).
- Tagline: "YOUR LAUNCHPAD. EVERY BUILD." (mono, uppercase, letter-spacing, text-outline).
- Progress bar: 3px height, bg-surface-variant, inner fill with gradient from-primary to-secondary, animated from 0% to 100% over 2 seconds.
- Status chips: "● SYSTEMS NOMINAL" (secondary) and "● SYNCING VAULT" (primary/40).
- HUD bottom-right: BUILD HASH chip, ENVIRONMENT chip, version text.
- HUD bottom-left: "READY FOR IGNITION" mono text.

Animation sequence:
- 0ms: logo and wordmark fade in (opacity 0 → 1, 400ms ease)
- 300ms: tagline fades in
- 500ms: progress bar starts filling
- 2400ms: progress bar completes
- 2500ms: entire screen fades out (opacity 1 → 0, 300ms), then calls onComplete()

STEP 3 — Onboarding flow (src/components/onboarding/OnboardingFlow.tsx):
Shown after splash screen only on first launch.
Modal overlay (fixed inset-0, bg-surface-dim/80, backdrop-blur-sm, z-100).
Modal panel: centered, max-w-2xl, bg-surface-container glass-panel, rounded-xl, border border-outline-variant/15.
Noise texture on modal.

Step 1 — Welcome:
- Top progress bar: 3 segments (first empty, second filled primary, third empty).
- "Welcome to Preflight" heading + "Let's set up your workspace in 2 minutes." subtitle.
- "What should we call you?" label + name Input (autofocus). Saves to AppSettings.userName.
- "Continue →" gradient-cta button.

Step 2 — Connect your AI (matches the design from the uploaded screens):
- Progress bar: second segment filled.
- "Connect your AI" heading + "Bring your own key — free forever." subtitle.
- "SELECT PROVIDER" label.
- Provider grid (2 rows of 3): Anthropic, OpenAI, Gemini, DeepSeek, Groq, Custom. Same styling as the uploaded design (square cards, grayscale until selected, border-2 border-primary when selected).
- "CLAUDE API KEY" label (updates based on selected provider) + "How to get your API key ↗" link.
- Password input for API key (show/hide toggle).
- "Verify & Continue →" button with loading state.
- On verify: call provider.validateKey(). If valid: save to Dexie, proceed to Step 3. If invalid: show error inline.
- Footer: "Encrypted on-device" badge + Privacy / Terms links.
- HUD decorations: LATENCY / REGION / UPTIME in bottom-left, version in top-right (mono, primary/40 color).

Step 3 — Ready:
- Progress bar: all segments filled.
- Animated checkmark (stroke draw animation, 600ms).
- "You're all set." heading.
- "Create your first project, or explore the interface." subtitle.
- "Open Preflight →" gradient-cta button.
- On click: set isOnboardingComplete = true in AppSettings, close modal.

STEP 4 — App entry flow (src/App.tsx update):
1. On mount: show SplashScreen.
2. On splash complete: if isFirstLaunch, show OnboardingFlow. Else, show main app.
3. On onboarding complete: show main app.
Use local state to manage which "phase" is showing: 'splash' | 'onboarding' | 'app'.

VALIDATION: Run `npm run build`. Clear app data (or use incognito mode). Splash screen plays. Onboarding appears. Complete all 3 steps. Main app loads. On second visit: only splash plays (no onboarding). Verify name appears in Project Hub greeting.

UPDATE DOCS.md: Add "Splash & Onboarding" section. Document the entry flow phases and first launch detection.

SUMMARY: List all files and confirm the full entry flow works.
```

---

---

# STAGE 15 — COMMAND PALETTE (FULL IMPLEMENTATION)
**Goal:** Fully functional ⌘K command palette with fuzzy search, project navigation, quick actions

---

```
BEHAVIOR: Read DOCS.md first. The command palette shell exists from Stage 03. This stage fills it with real functionality. Do not break any other modules.

TASK: Complete the command palette with real search and actions.

STEP 1 — Full CommandPalette (src/components/shared/CommandPalette.tsx — update):
Using cmdk library. Full content groups:

Group 1 — Projects:
List all projects from useProjects hook. Each item: project icon + name + status badge.
On select: navigate to /project/:id, close palette.
Filter: cmdk handles fuzzy search automatically.

Group 2 — Navigate:
- "Home / Projects" → navigate to "/"
- "Settings" → navigate to "/settings"
- If in a project: all tabs (Brief, Research, Design, PRD, Build, Vault) → setActiveTab and navigate

Group 3 — Quick Actions:
- "New Project" → open NewProjectModal
- "Generate Research Prompt" (if in project with brief complete) → trigger Research generation
- "Generate Design Prompt" (if research done) → navigate to Design tab + trigger
- "Export Build Prompts" (if build stages exist) → trigger exportAllPrompts
- "Copy Last Artifact" → copy the most recently generated artifact to clipboard

Group 4 — Open Platform:
- Links to open Lovable, Bolt, Cursor, Perplexity, Gemini, ChatGPT, v0 in new tabs

Keyboard shortcuts: ↑/↓ to navigate, Enter to select, Escape to close. These are handled by cmdk automatically.

Empty state: "No results for '[query]'" with a subtle illustration.

Loading state (when projects are loading): animated skeleton items.

STEP 2 — Global keyboard listener (src/hooks/useCommandPalette.ts):
Hook that sets up and tears down the global keydown listener for ⌘K (Mac) and Ctrl+K (Windows/Linux). Toggles uiStore.isCommandPaletteOpen.

STEP 3 — Keyboard shortcuts display:
In the palette, next to each action item, show the keyboard shortcut hint on the right side in a mono pill. Format: "⌘K", "⌘1", etc.

VALIDATION: Run `npm run build`. Press ⌘K — palette opens. Type "proj" — shows matching projects. Click a project — navigates correctly. Press Escape — closes. Press ⌘K again while palette is open — closes. Navigate with arrow keys.

UPDATE DOCS.md: Add "Command Palette" section. Document all available commands and keyboard shortcuts.

SUMMARY: List all files and confirm all command groups work.
```

---

---

# STAGE 16 — AUDIT & REFACTOR
**Goal:** Code quality audit, file size check, dead code removal, type safety, documentation sync

---

```
BEHAVIOR: Read DOCS.md completely before starting. This stage makes ZERO new features. Only improve quality.

TASK: Audit the entire codebase and refactor for quality, scalability, and maintainability.

DO NOT add any new features or UI changes.
DO NOT change any user-visible behavior.
DO NOT break any existing functionality.
Only improve code quality.

STEP 1 — File size audit:
Scan every file in src/. List all files over 200 lines. For each oversized file:
- Identify logical sub-components or utilities that can be extracted
- Extract into separate files
- Update all imports

Report: "Found X files over 200 lines. Split Y files."

STEP 2 — TypeScript audit:
Search the entire codebase for:
- Any `any` type → replace with proper type
- Non-null assertions (!) where the value could genuinely be null → add proper null checks
- Implicit `any` from untyped parameters → add explicit types
- Missing return types on exported functions → add explicit return types

Report: "Fixed X TypeScript issues."

STEP 3 — Dead code removal:
- Remove unused imports (use eslint --fix or manually scan)
- Remove empty components or placeholder files that have been replaced
- Remove any commented-out code blocks
- Remove unused utility functions in src/lib/

STEP 4 — Component deduplication:
Identify any UI patterns that appear in more than 2 places without a shared component:
- Extract into shared components in src/components/shared/
- Update all usages

STEP 5 — Error handling audit:
Check every async function (especially Dexie calls and AI service calls) has a try/catch.
Check every AI generation call shows a user-visible error state when it fails.
Check every file upload handles the error case.

STEP 6 — DOCS.md sync:
Read the current DOCS.md. Compare it against the actual codebase. Update every section that is stale:
- Folder structure (add any new files/folders created since Stage 01)
- Features list (mark all implemented features as ✅)
- Type definitions (update if any were added)
- Known issues (add any TODOs or known bugs found during this audit)
- Update "Last Updated" date

STEP 7 — Performance check:
- Ensure useLiveQuery calls are scoped (not querying the entire DB on every keystroke)
- Ensure debouncing is applied to all autosave inputs
- Ensure heavy components (OutputPanel, BuildStageCard) use React.memo where appropriate

VALIDATION: Run `npm run build`. Run `npm run test` (even if no tests exist yet — at least confirm the test runner works). Zero TypeScript errors. App runs with no console errors or warnings.

DOCS UPDATE: Update DOCS.md comprehensively after this stage. This is the most important documentation update.

SUMMARY: Report how many files were modified, what was split, what types were fixed, and confirm the build passes cleanly.
```

---

---

# STAGE 17 — BUG FIX CYCLE
**Goal:** Systematic identification and resolution of all known issues

---

```
BEHAVIOR: Read DOCS.md first. Read the "Known Issues" section specifically. This stage fixes bugs — it does not add features.

TASK: Run a systematic bug fix pass across the entire application.

STEP 1 — Navigation bugs:
Test every navigation path:
- Hub → Project → all tabs → back to hub
- Hub → Settings → back to hub
- Command palette navigation to each route
- Browser back button behavior

Fix any route that doesn't work correctly or shows a blank screen.

STEP 2 — Data persistence bugs:
Test these scenarios and fix any failures:
- Create a project, refresh the page — project still exists
- Edit a brief, refresh — changes preserved
- Upload a vault file, refresh — file still in vault
- Set an AI provider key, refresh — key still present (masked)
- Toggle platform launcher, refresh — toggle state preserved
- Generate an artifact, refresh — artifact still visible

STEP 3 — Generation error states:
Test with an invalid API key — appropriate error message shown.
Test with no API key at all — redirect to settings or inline error.
Test with network disconnected (or simulated) — error handled gracefully.

STEP 4 — Copy button verification:
Test the CopyButton component on every OutputPanel:
- Click copy → content is in clipboard
- "Copied!" state shows for 2 seconds
- State resets correctly

STEP 5 — File upload edge cases:
Test uploading: empty file, very large file (>10MB), unsupported file type, duplicate file name.
All should be handled gracefully with appropriate error messages.

STEP 6 — Mobile layout pass:
Open the app at 768px width.
Fix any overflow, cropped content, or broken layouts.
The app should be usable (not perfect, but functional) at tablet width.

STEP 7 — Onboarding edge cases:
- What happens if user closes browser mid-onboarding?
- What if API key validation fails 3 times?
- What if user skips the name field?
All should be handled gracefully.

VALIDATION: Run `npm run build`. Manually test every scenario in the steps above. Document what was fixed in DOCS.md Known Issues section.

UPDATE DOCS.md: Mark all fixed issues as resolved. Add any new discovered issues.

SUMMARY: Report a list of every bug found and fixed in this stage.
```

---

---

# STAGE 18 — POLISH
**Goal:** Animations, loading states, empty states, micro-interactions, visual consistency

---

```
BEHAVIOR: Read DOCS.md first. Polish only — no new features, no bug fixes (those are done). Focus entirely on the user experience quality.

TASK: Polish the entire app to production quality.

STEP 1 — Page transitions:
Add fade-in transitions to page content using CSS transitions (not Framer Motion — keep it simple):
- All page content areas: opacity 0 → 1, 200ms ease, on route change
- Tab switches in workspace: fade between active tab content
- Modal open/close: scale(0.95)+opacity(0) → scale(1)+opacity(1), 200ms

Add transition only to content, not to the layout chrome (sidebar/header stay static).

STEP 2 — Loading states:
Audit every data fetch and add appropriate loading UI:
- Project cards: skeleton loading cards while useProjects is loading
- OutputPanel: skeleton lines while isLoading prop is true
- Build stages: skeleton cards while useBuildStages is loading
- Settings: skeleton rows while providers are loading
Skeleton style: bg-surface-container-high animate-pulse rounded.

STEP 3 — Empty states polish:
Audit every list/grid that can be empty. Each must have:
- A relevant icon (Material Symbol, 48px, text-outline/40)
- A helpful heading (what's missing)
- A helpful subtext (what to do)
- An action button where appropriate

Empty states needed: Project Hub, Vault, Build stages, Research results, Design output history, Artifact history.

STEP 4 — Hover states audit:
Every interactive element must have a visible hover state:
- Buttons: brightness increase or shadow change
- Cards: border color shift + subtle lift
- Nav items: background color change
- Icons: color change

Every hover must use `transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]`.

STEP 5 — Copy button consistency:
Audit every place where generated content is shown. Every OutputPanel must have:
- A copy button that is always visible (not hover-only)
- Proper "Copied!" feedback
- The correct content being copied (not a partial)

STEP 6 — Toast notifications audit:
Add success toasts for these actions:
- Project created
- Artifact generated
- File uploaded
- File deleted
- Settings saved
- API key connected
- Build workflow exported
- Stage marked complete

STEP 7 — Typography consistency:
Audit every heading, body text, and label:
- All page headings: Space Grotesk bold tracking-tighter
- All body text: Inter 400
- All mono content (prompts, keys, metadata): JetBrains Mono
- All "HUD" labels: font-mono uppercase tracking-widest text-outline text-[10px]
- Consistent type scale: display=48px, h1=32px, h2=24px, h3=18px, body=14px, small=12px

STEP 8 — Color consistency:
Replace any hardcoded hex values with Tailwind token classes.
Ensure every surface uses the correct token:
- Page backgrounds: bg-surface
- Cards: bg-surface-container
- Inputs: bg-surface-container-lowest
- Floating elements (modals, palette): glass-panel class
- Never use pure black or white

VALIDATION: Run `npm run build`. Walk through the entire app. Every screen should feel premium, consistent, and responsive. No janky interactions, no missing loading states, no empty screens without guidance.

UPDATE DOCS.md: Add a "Design System Implementation" section noting all the design tokens and animation patterns in use.

SUMMARY: List every change made in this polish pass.
```

---

---

# STAGE 19 — FINAL AUDIT
**Goal:** Security review, accessibility, performance, pre-launch checklist

---

```
BEHAVIOR: Read DOCS.md completely. This is the final quality gate before deployment prep. Be thorough.

TASK: Complete a final pre-launch audit across security, accessibility, and performance.

STEP 1 — Security audit:
- Confirm no API keys are in any React state, console.log, or network request URLs
- Confirm all Dexie reads of API keys are only in the AI service layer
- Confirm .env is in .gitignore
- Confirm no secrets in any config files
- Confirm the CSP (Content Security Policy) in index.html only allows necessary external origins (Google Fonts, trusted CDNs)
- Check that any user-provided content (project names, brief text) is not rendered as HTML (XSS prevention)

Report: "Security audit complete. X issues found and resolved."

STEP 2 — Accessibility audit:
- All interactive elements have accessible labels (aria-label or visible text)
- All images have alt text
- Focus indicators are visible on all interactive elements (add focus:ring-2 focus:ring-primary to any missing)
- Color contrast: all text must meet WCAG AA (4.5:1 ratio for normal text)
- Keyboard navigation: tab through the entire app — every interactive element must be reachable and operable
- Screen reader: all form inputs have associated labels
- Dialog components have aria-modal and focus trap

STEP 3 — Performance audit:
- Open DevTools → Performance. Profile the Project Hub with 10 projects.
- Check that re-renders are not excessive (no component rendering 50+ times per second)
- Check that useLiveQuery subscriptions are properly cleaned up on unmount
- Bundle size check: `npm run build` — report the main bundle size. If over 1MB (before gzip), identify the largest dependencies and see if any can be lazy-loaded.
- Add React.lazy() + Suspense for all page-level components (hub, workspace, settings)

STEP 4 — Cross-browser check:
Verify the app works in: Chrome (primary), Firefox, Safari (if on Mac).
Fix any webkit-specific CSS issues (particularly backdrop-filter support).
Add fallback for browsers without backdrop-filter: solid background instead.

STEP 5 — README.md (project root — create or update):
Write a production-quality README.md:
- Project banner (text-based if no image)
- What Preflight is (2-paragraph description)
- Features list (all 8 modules)
- Tech stack badges
- Quick start: `git clone → npm install → npm run dev`
- Environment variables: list all env vars with descriptions (none required for local mode)
- Customization: how to self-host with Supabase
- Contributing guide (short)
- License: MIT

STEP 6 — CHANGELOG.md (project root):
Create CHANGELOG.md with:
## [0.1.0] - [today's date]
### Added
- List all features built across all stages

VALIDATION: Run `npm run build`. Zero warnings. Zero errors. Bundle analyzer (if available). Test in Chrome and Firefox. Tab through the entire app with keyboard only.

UPDATE DOCS.md: Final comprehensive update. All sections current. No stale information.

SUMMARY: Full audit report — security issues found/fixed, accessibility improvements, performance findings, browser compatibility notes.
```

---

---

# STAGE 20 — DEPLOYMENT PREP
**Goal:** Production build, GitHub repo setup, deployment configuration, open-source launch prep

---

```
BEHAVIOR: Read DOCS.md completely. This is the final stage. The app will be deployed after this.

TASK: Prepare Preflight for production deployment and open-source launch.

STEP 1 — Environment configuration:
Create .env.example at project root with comments:
```
# Preflight — Environment Variables
# Copy this file to .env and fill in values (optional — Preflight works without any env vars in local mode)

# For self-hosted cloud mode with Supabase (optional):
# VITE_SUPABASE_URL=your-supabase-project-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App configuration
VITE_APP_VERSION=0.1.0
VITE_APP_NAME=Preflight
```
Confirm .env is in .gitignore. Confirm no VITE_ env vars contain secrets that would be exposed in the bundle.

STEP 2 — Production build verification:
Run `npm run build` — must complete with zero errors and zero warnings.
Check the dist/ folder — confirm index.html, main JS bundle, and assets are present.
Run `npm run preview` — app must load in production mode at localhost:4173.
Test all major user flows in production mode:
- Create a project
- Fill a brief
- Generate a research prompt (with a real API key)
- Navigate between all tabs
- Open command palette

STEP 3 — GitHub configuration:
Create .github/ISSUE_TEMPLATE/ with two templates:
- bug_report.md: Bug title, description, steps to reproduce, expected vs actual behavior, environment info
- feature_request.md: Feature title, problem it solves, proposed solution, alternatives considered

Create .github/CONTRIBUTING.md:
- How to set up the dev environment
- Coding conventions (reference .cursorrules)
- How to run tests
- PR submission guidelines

Create .github/workflows/ci.yml:
A GitHub Actions workflow that runs on every push and PR to main:
- Install dependencies (npm ci)
- Type check (npm run typecheck or tsc --noEmit)
- Build (npm run build)
- (Tests if any exist)

STEP 4 — Vercel/Netlify deployment config:
Create vercel.json:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Create netlify.toml:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

STEP 5 — Package.json final review:
Verify:
- name: "preflight" or "preflight-os"
- version: "0.1.0"
- description: "Open-source project OS for vibe coders"
- license: "MIT"
- repository: { url: your GitHub URL }
- keywords: ["vibe-coding", "ai", "project-management", "open-source", "developer-tools"]
- scripts include: dev, build, preview, typecheck

STEP 6 — MIT License file:
Create LICENSE at project root with MIT license text, year, and your name.

STEP 7 — Final DOCS.md update:
This is the definitive final update:
- Verify every feature is documented
- Add "Deployment" section: Vercel, Netlify, self-hosted instructions
- Add "Configuration" section: all Dexie tables, AI providers supported
- Add "Architecture Decisions" section: why React+Vite, why Dexie, why BYOK
- Update "Last Updated" to today

VALIDATION:
1. Run `npm run build` — passes.
2. Run `npm run preview` — app loads and all features work.
3. Verify .env is in .gitignore.
4. Verify README.md exists with full content.
5. Verify LICENSE exists.
6. Verify CHANGELOG.md exists.
7. Verify .github/ folder has CI workflow and issue templates.
8. Open the app in production preview — complete a full user flow: create project → fill brief → generate research prompt → generate design prompt → generate PRD → generate build workflow → export all prompts.

FINAL SUMMARY:
Generate a complete deployment checklist — a table with every item marked ✅ or ❌.
Report the total number of stages completed, files created, and features shipped.
Confirm Preflight is ready for open-source launch.
```

---

---

# END OF BUILD PROMPTS

## LAUNCH CHECKLIST (Run after Stage 20)

- [ ] All 20 stages complete
- [ ] `npm run build` passes with zero errors
- [ ] `npm run preview` works in production mode
- [ ] All 8 modules functional (Brief, Research, Design, PRD, Build, Vault, Settings, Onboarding)
- [ ] Real AI generation working with at least one provider
- [ ] .env in .gitignore
- [ ] README.md complete
- [ ] LICENSE file present (MIT)
- [ ] CHANGELOG.md created
- [ ] DOCS.md fully updated
- [ ] GitHub Actions CI workflow in place
- [ ] Vercel/Netlify deployment config files present
- [ ] App deployed to staging URL for testing
- [ ] Demo video recorded
- [ ] Product Hunt draft created
- [ ] Hacker News Show HN post drafted
- [ ] Posted in r/cursor, r/vibecoding, r/SaaS

## TOTAL BUILD STATS
- Stages: 20
- Estimated build time: 8-14 hours across platforms
- Primary modules: 8
- AI agents configured: 10
- Supported coding platforms: 9

---

*Generated by Preflight — Your launchpad. Every build.*
