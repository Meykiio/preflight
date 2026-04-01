# Preflight Platform — Improvement Notes

**Context**: These notes are collected from a real end-to-end test of the Preflight platform.
The project used as the test case was **PRINTADIX** — an invite-only internal ad creation platform
built with React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase v2, TanStack Query v5, and Zustand v4.

Every issue listed below is something Preflight's output got wrong, and had to be manually corrected
before the build prompts could be handed to a coding agent. The goal of these notes is to help you
fix Preflight so future projects don't have the same problems.

**Status Tracking**: Each issue has a status: ⚪ Not Started | 🟡 In Progress | ✅ Complete

---

## SECTION 1 — Research Prompt Problems

### 1.1 — Research prompt doesn't distinguish between internal tools and public products
**Status**: ⚪ Not Started

**What happened**: The generated research prompt included sections on market sizing (TAM/SAM/SOM),
virality and acquisition strategies, competitor landscape, and community research (Reddit/Discord).
None of these are relevant for an internal-only, invite-based tool. They took up roughly 40% of the
prompt, displacing the technical questions that were actually needed.

**What Preflight should do**:
- Detect when the product is described as "internal tool", "invite-only", "staff-only", or
  "not for external users" and automatically suppress market sizing, virality, and acquisition sections.
- Replace them with questions relevant to internal tools: team workflow patterns, role-based access
  design, internal adoption friction, and data ownership.

**Implementation**: Update `src/services/generation/researchGeneration.ts` with product type detection.

---

### 1.2 — Research prompt doesn't ask the right technical questions for the stated stack
**Status**: ⚪ Not Started

**What happened**: When the user specifies a tech stack (Supabase, React, TanStack Query), the research
prompt should ask targeted questions about that stack. Instead it asked generic questions that returned
generic answers. Key technical areas that were completely missing:

- Supabase RLS patterns for multi-tenant workspace isolation
- BYOK (Bring Your Own Key) API key storage patterns — encrypted server-side vs client-side
- Supabase Edge Function architecture for long-form AI generation
- File upload patterns using Supabase Storage with signed URLs
- How to structure agent instruction files (CLAUDE.md / .qwenrules) for full-stack Supabase projects
- Draft state persistence strategies (Supabase vs IndexedDB)
- Coding agent (Qwen Code / Cursor) specific workflow constraints and known failure modes

**What Preflight should do**:
- When the user specifies "Supabase" in the stack, automatically include a research section on
  Supabase-specific patterns (RLS, Edge Functions, Storage, Auth).
- When the user specifies a BYOK AI requirement, automatically include a security research section
  on server-side key storage.
- When the user selects a terminal coding agent (Qwen Code, Claude Code), ask about agent-specific
  workflow patterns.

**Implementation**: Update `src/services/generation/researchGeneration.ts` with stack-aware prompts.

---

## SECTION 2 — Design Prompt Problems

### 2.1 — Color system was internally contradictory
**Status**: ⚪ Not Started

**What happened**: The generated design prompt defined dark background colors (#1E1E2F) alongside
light surface colors (#F8F9FA, #FFFFFF) and light-mode text colors (#212529). These directly contradict
each other. The design tool (Stitch) resolved the conflict by going fully light-mode, ignoring the
dark tokens entirely.

**What Preflight should do**:
- Before outputting the design prompt, validate that all color tokens are internally consistent.
  If `background` is dark, then `surface`, `text`, and `border` colors must also be dark-mode values.
  If any group contradicts the others, flag it or auto-correct it.
- Prompt the user to explicitly choose a theme direction ("Light theme or dark theme?") before
  generating the design prompt.

**Implementation**: Add color validation to `src/services/generation/designGeneration.ts`.

---

### 2.2 — Page descriptions had no component-level specificity
**Status**: ⚪ Not Started

**What happened**: Every page was described as "Single column layout" with 3 bullet points.
This gives the design tool nothing to work with. For example, the Ideas Bank page was described as
"Filterable list of ideas" — which is meaningless. The design tool generated a generic list view
with no filter pills, no status pills, no bulk action bar, and no overflow menus.

**What Preflight should do**:
- Design prompt output must describe each page at the component anatomy level, not the page concept level.
- For each page, the prompt must specify:
  - The exact filters present (e.g., "filter pills: All / Draft / Pending / Approved / Changes Requested / Rejected")
  - The exact card anatomy (e.g., "idea card: status pill top-left, angle color tag, title, excerpt 3 lines, member ID bottom-left, date, 3-dot overflow menu bottom-right")
  - State variations: empty state, loading state, error state
  - Admin vs. member view differences per component

**Implementation**: Update design prompt template in `src/services/generation/designGeneration.ts`.

---

### 2.3 — Font choices triggered generic output
**Status**: ⚪ Not Started

**What happened**: The design prompt specified Roboto + Open Sans. These are the most common SaaS
font pairing and caused the design tool to output a generic HR portal aesthetic. The user had to
manually override to Plus Jakarta Sans + JetBrains Mono to get quality output.

**What Preflight should do**:
- Default font recommendations should favor distinctive modern pairings over commodity combinations.
  Avoid Roboto/Open Sans as defaults entirely.
- Recommended defaults: Inter + JetBrains Mono (technical), Plus Jakarta Sans + JetBrains Mono
  (modern/rounded), Geist + JetBrains Mono (minimal).

**Implementation**: Update font defaults in design generation service.

---

### 2.4 — Navigation was specified but tabs were never named
**Status**: ⚪ Not Started

**What happened**: The design prompt said "Bottom Tab Bar with 5 tabs" but never defined the tab
labels, icons, or order. The design tool invented its own tabs and got them wrong.

**What Preflight should do**:
- Navigation must always be fully specified: every tab/link must have a label, an icon name, and
  its order position. If the user hasn't specified these, ask them before generating the prompt.

**Implementation**: Add navigation spec requirement to design prompt template.

---

### 2.5 — Shared component library was never defined
**Status**: ⚪ Not Started

**What happened**: The design prompt defined 2 components. The actual app needed at minimum:
Status pill, Idea card, Note card, Prompt card, Ad card, Score panel, Filter bar, Role badge,
Empty state, FAB button. Without these definitions, the design tool invented its own component shapes.

**What Preflight should do**:
- For every feature listed in the Brief, automatically infer the components needed and include them
  in the design prompt's component library section.
- Components must include: anatomy (fields inside), sizing, spacing, and state variants.

**Implementation**: Add component inference logic to design generation.

---

### 2.6 — Role-based UI differences were never specified
**Status**: ⚪ Not Started

**What happened**: Admin and member see different things on almost every screen, but the design prompt
made no mention of this. The design tool produced one version of each screen with no awareness of
role-based UI deltas.

**What Preflight should do**:
- For every feature where the Brief specifies role differences (admin vs. member), the design prompt
  must include an explicit "Admin view vs. Member view" delta section per screen.
- Examples: admin sees approve/reject buttons and bulk delete; member does not. Score panel is
  admin-only on Production Board.

**Implementation**: Add role-based UI section to design prompt template.

---

## SECTION 3 — PRD Problems

### 3.1 — "Local-first" framing used for a cloud Supabase project
**Status**: ⚪ Not Started

**What happened**: The PRD used "local-first" framing throughout — describing the app as having
local data storage, local-first sync, and offline capability. The project is Supabase-backed,
which is the opposite of local-first. This framing would cause any coding agent to make wrong
decisions on every auth and storage call.

**What Preflight should do**:
- If "Supabase" is in the tech stack, never use "local-first" framing anywhere in the PRD.
  Supabase is cloud-native. Use "cloud-backed", "server-side", or "Supabase-managed" instead.
- If the user has explicitly requested local-first features, surface this as a conflict with
  the chosen stack and ask for clarification.

**Implementation**: Add stack-aware framing to `src/services/generation/prdGeneration.ts`.

---

### 3.2 — Data model was incomplete
**Status**: ⚪ Not Started

**What happened**: The PRD data model was missing entire tables: `brainstorm_notes`, `workspaces`,
`invites`. It was also missing critical columns: `angle` field on ideas, `score` on ad_cards,
`changes_requested` as a status value, `char_count_warning` on prompts.

**What Preflight should do**:
- The PRD data model must include 100% of the tables implied by the features in the Brief.
  Every feature that stores data needs a table. Preflight should derive tables automatically from
  the feature list.
- For each table, include ALL columns: primary key, foreign keys, every field mentioned in the
  feature descriptions, status enums with ALL valid values, and timestamp columns.

**Implementation**: Add auto-derivation logic from Brief features to data model.

---

### 3.3 — Wrong library version cited
**Status**: ⚪ Not Started

**What happened**: The PRD cited `supabase-js` version `1.35.0`. This is the old v1 API.
The v1 and v2 APIs are completely different (e.g., `signIn()` vs `signInWithPassword()`).
Any coding agent following the PRD would install the wrong version and generate broken auth code.

**What Preflight should do**:
- Always use the current major version of specified libraries.
- Never hardcode specific patch versions in the PRD — use `^2.x` style semver ranges.
- If a library has a known major breaking version (like supabase-js v1 → v2, TanStack Query v4 → v5),
  Preflight should know which major version is current and use it.

**Implementation**: Add library version registry to PRD generation.

---

### 3.4 — Libraries from the Brief were absent from the PRD tech stack table
**Status**: ⚪ Not Started

**What happened**: TanStack Query v5, React Router v6, and shadcn/ui were specified in the Brief
but did not appear in the PRD's tech stack section. A coding agent reading only the PRD would not
know to install or use them.

**What Preflight should do**:
- Every library named in the Brief must appear in the PRD tech stack table.
- There must be zero drift between Brief and PRD on this.

**Implementation**: Add Brief library extraction to PRD tech stack section.

---

## SECTION 4 — RULES.md Problems

### 4.1 — Dexie.js referenced throughout, which is completely wrong for this stack
**Status**: ⚪ Not Started

**What happened**: RULES.md was full of Dexie.js references: `useLiveQuery`, "persist to Dexie on
every write", `db.workspaces.get()`, etc. Dexie is a browser IndexedDB wrapper — it has no
relationship to Supabase and no place in this project. Any coding agent following these rules would
install and use the wrong database library for all persistence operations.

**What Preflight should do**:
- When Supabase is selected as the backend, RULES.md must never mention Dexie, IndexedDB,
  localStorage, or any other local persistence library as the data layer.
- RULES.md must explicitly prohibit these: "❌ Never use Dexie, IndexedDB, or localStorage for
  data persistence. All reads and writes go through `src/services/` → Supabase."

**Implementation**: Add stack-matched rules to `src/services/generation/rulesFileGeneration.ts`.

---

### 4.2 — No mention of the critical business constraint (character count)
**Status**: ⚪ Not Started

**What happened**: The most unusual and critical technical requirement of the project — that AI-generated
prompts must be between 13,000 and 14,900 characters — was not mentioned anywhere in RULES.md.
This constraint affects the Edge Function architecture, the database schema, and the UI.

**What Preflight should do**:
- Any constraint flagged in the Brief as critical (character limits, rate limits, size constraints,
  timing constraints) must be explicitly documented in RULES.md in the AI Integration section,
  including the enforcement mechanism (retry logic, error handling, warning flags).

**Implementation**: Extract critical constraints from Brief to RULES.md.

---

### 4.3 — shadcn/ui and TanStack Query missing from style and state rules
**Status**: ⚪ Not Started

**What happened**: RULES.md defined styling rules without mentioning shadcn/ui, and state management
rules without mentioning TanStack Query — both of which are core to the stack.

**What Preflight should do**:
- Every library in the tech stack must appear in the relevant RULES.md section:
  - shadcn/ui → Styling rules section
  - TanStack Query → State management section
  - React Router → Routing rules section
- There must be zero drift between stack definition and rules.

**Implementation**: Add library-to-section mapping in rules generation.

---

## SECTION 5 — Build Prompts Problems (most critical section)

These are the bugs found in the generated Build Prompts. They are the most damaging because they
go directly to the coding agent. Any of these would cause the agent to write incorrect, non-working,
or insecure code.

### 5.1 — Dexie.js re-appeared in Build Prompts after being removed from RULES.md
**Status**: ⚪ Not Started

**What happened**: Even after Dexie.js was removed from RULES.md, it re-appeared in Stages 01 and 02
of the Build Prompts. Stage 01 included a `src/lib/schema.ts` file using `import { Dexie } from 'dexie'`.
Stage 02 included a full `PrintadixDB` class with `db.version(1).stores(...)` and service functions
calling `db.workspaces.get(id)`.

This is the single most dangerous error in the entire output. An agent following Stage 02 would
install Dexie, write all data to IndexedDB, and produce a completely broken app that ignores Supabase.

**What Preflight should do**:
- Build Prompts must be validated against RULES.md before output. If RULES.md prohibits a library,
  that library must not appear anywhere in any Build Prompt stage.
- Preflight needs a consistency check: scan every Build Prompt stage for library names that appear
  in the "Prohibited" section of RULES.md. If found, flag and remove before outputting.

**Implementation**: Add `src/services/validation/consistencyChecker.ts`.

---

### 5.2 — Wrong npm package names in package.json
**Status**: ⚪ Not Started

**What happened**: The generated `package.json` used incorrect npm package identifiers:
- `"tanstack-query": "^5.0.0"` — wrong. Correct: `"@tanstack/react-query": "^5.17.0"`
- `"supabase": "^2.0.0"` — wrong. Correct: `"@supabase/supabase-js": "^2.39.0"`
- `"shadcn/ui": "latest"` — wrong. shadcn/ui is not an npm package at all. It is installed via
  the CLI: `npx shadcn-ui@latest init`. Listing it in package.json would cause `npm install` to fail.

**What Preflight should do**:
- Maintain a verified library name registry. Every library must be stored with its exact npm
  package identifier, not a guessed name.
- shadcn/ui must always be documented as a CLI tool, never as an npm dependency.
- `npm install` on the generated `package.json` must succeed before Preflight outputs the prompt.

**Implementation**: Add `src/services/validation/packageValidator.ts` with verified registry.

---

### 5.3 — TypeScript `@/` path alias was broken
**Status**: ⚪ Not Started

**What happened**: `tsconfig.json` was generated with:
```json
"paths": { "*": ["*"] }
```
This does not configure `@/` imports. The correct config is:
```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```
Without this, every `import { X } from '@/components/...'` would fail at TypeScript compile time.

Additionally, `vite.config.ts` was generated without the `resolve.alias` block, so even if
TypeScript accepted the import, Vite would fail to bundle it at build time.

**What Preflight should do**:
- When generating a Vite + TypeScript project with `@/` aliases, always output BOTH:
  1. The correct `paths` config in `tsconfig.json`
  2. The matching `resolve.alias` in `vite.config.ts`
- These two must always be generated together and must match each other.

**Implementation**: Add `src/services/validation/configValidator.ts`.

---

### 5.4 — Environment variables missing the required `VITE_` prefix
**Status**: ⚪ Not Started

**What happened**: `.env.example` was generated with:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```
Vite does not expose environment variables to the browser unless they are prefixed with `VITE_`.
Any code using `import.meta.env.SUPABASE_URL` would receive `undefined` at runtime.

**What Preflight should do**:
- For Vite projects, all client-accessible environment variable names must be prefixed with `VITE_`.
- Generate: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Also add a comment in `.env.example` explaining: "Vite only exposes vars with the VITE_ prefix
  to the browser."

**Implementation**: Update config validator and build generation templates.

---

### 5.5 — Supabase client singleton was never created
**Status**: ⚪ Not Started

**What happened**: Stage 01 set up everything except the most critical file: `src/lib/supabase.ts` —
the single Supabase client instance. RULES.md explicitly required this file to exist and be the only
place where Supabase is instantiated. Despite this, it was absent from the generated output.
Every subsequent service function would have no client to import.

**What Preflight should do**:
- When Supabase is in the tech stack, `src/lib/supabase.ts` must always be created in Stage 01
  (Foundation). This is a non-optional file. It must be in the Foundation stage's file list and
  its content must be fully written out.

**Implementation**: Fix `src/services/generation/buildGeneration.ts` Stage 01 template.

---

### 5.6 — Zustand v4 import syntax was wrong throughout
**Status**: ⚪ Not Started

**What happened**: Every store file used the Zustand v3 default import:
```typescript
import create from 'zustand';
```
Zustand v4 changed this to a named export:
```typescript
import { create } from 'zustand';
```
Using the v3 syntax with v4 installed causes a TypeScript error and a runtime crash.

**What Preflight should do**:
- Maintain awareness of breaking API changes between major library versions.
- When Zustand v4 is specified, always use `import { create } from 'zustand'`.

**Implementation**: Update build generation templates with correct imports.

---

### 5.7 — Supabase Auth v1 API used instead of v2
**Status**: ⚪ Not Started

**What happened**: The auth service was generated using the v1 API:
```typescript
const { user, error } = await supabase.auth.signIn({ email, password });
```
This method does not exist in Supabase v2. The correct v2 API is:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```
This would cause a runtime crash on every login attempt.

**What Preflight should do**:
- When `@supabase/supabase-js` v2 is specified, always use the v2 Auth API:
  - `signInWithPassword()` not `signIn()`
  - `signUp()` with options not positional args
  - `onAuthStateChange()` callback receives `(event, session)` not `(session)`

**Implementation**: Update build generation templates with correct Supabase v2 API.

---

### 5.8 — Two stages built the same feature (Pipeline Dashboard duplicated)
**Status**: ⚪ Not Started

**What happened**: Stage 03 was labelled "Core Architecture" but immediately built the Pipeline
Dashboard as its main deliverable. Stage 04 then built the Pipeline Dashboard again, from scratch,
with different component names and slightly different structure. This would cause the coding agent
to overwrite work it just completed, or produce conflicting component files.

**What Preflight should do**:
- Stage names and their deliverables must not overlap. One stage = one responsibility.
- "Core Architecture" should be exclusively about: ProtectedRoute, auth guards, layout shell,
  navigation wiring, and provider setup — never a feature.
- Features (Pipeline, Brainstorm, Ideas, etc.) start in the stage after architecture is complete.

**Implementation**: Fix stage scoping logic in build generation.

---

### 5.9 — Auth guard (ProtectedRoute) was never created
**Status**: ⚪ Not Started

**What happened**: Despite defining protected routes in `App.tsx`, no `ProtectedRoute` component
was ever created. The app would allow unauthenticated users to access all pages because nothing
was redirecting them to `/login`. This is a critical security gap.

**What Preflight should do**:
- For any app with authentication, a route protection component must be created in the
  Foundation or Core Architecture stage — never deferred.
- The Foundation checklist must include: "Auth guard component exists and all protected routes
  use it."

**Implementation**: Add ProtectedRoute to Stage 02/03 in build generation.

---

### 5.10 — Production Board incorrectly placed inside Dashboard
**Status**: ⚪ Not Started

**What happened**: Stage 08 instructed the coding agent to place `ProductionBoard` as a sub-component
of `Dashboard.tsx`. The Production Board is a standalone page at `/production` with its own route.
Placing it inside Dashboard would break the routing structure and make the page unreachable via URL.

**What Preflight should do**:
- Every feature that has its own route in the routing table must be a standalone page component,
  never a sub-component of another page.
- The routing table (defined in Foundation) must be the single source of truth for page structure.
  Build Prompts must not contradict it.

**Implementation**: Add routing table validation to build generation.

---

### 5.11 — AI API keys incorrectly placed in `.env` in the Deployment stage
**Status**: ⚪ Not Started

**What happened**: Stage 16 (Deployment) added `OPENAI_API_KEY` and `GEMINI_API_KEY` to `.env.example`
as environment variables. In this project, AI keys are workspace-managed — entered by the admin in
the Settings UI and stored encrypted in the Supabase database. They are never environment variables.
This instruction would have caused a developer to expose AI keys at the infrastructure level instead
of the application level.

**What Preflight should do**:
- BYOK (Bring Your Own Key) architecture means AI keys live in the database, not in env files.
- If the Brief specifies BYOK, Preflight must never add AI provider keys to `.env.example`.
- Instead, `.env.example` should include a comment: "AI keys are managed by Admins in the
  Settings UI. They are stored encrypted in the database. Do NOT add them here."

**Implementation**: Add BYOK detection and env file validation.

---

### 5.12 — Edge Functions were never set up in the Foundation or Architecture stages
**Status**: ⚪ Not Started

**What happened**: The project requires Supabase Edge Functions for all AI calls (`generate-idea`,
`generate-prompt`, `save-ai-config`, `test-ai-connection`). Despite this being defined in RULES.md
and SYSTEM_INSTRUCTIONS.md, no Build Prompt stage ever:
- Created the `supabase/functions/` directory
- Initialized the Supabase CLI
- Set up the `supabase/config.toml`
- Created even a placeholder function file

When Stage 05 (Brainstorm) said "call the Edge Function", there was no Edge Function to call.

**What Preflight should do**:
- When Edge Functions are required (AI integration, server-side key storage), a dedicated sub-step
  in Stage 02 (Database) or a separate Stage must:
  1. Run `supabase init` and `supabase link`
  2. Create the `supabase/functions/` directory
  3. Scaffold placeholder function files for every Edge Function named in the Brief
- Edge Functions must be deployed as part of the Deployment stage checklist.

**Implementation**: Add Edge Function setup stage to build generation.

---

### 5.13 — Workspace creation and invite flow completely absent from Stage 02
**Status**: ⚪ Not Started

**What happened**: Stage 02 set up the database schema correctly but never implemented:
- First-admin workspace creation (the very first signup creates a workspace)
- Invite token generation
- Invite validation (checking token is unused and not expired)
- Member signup via invite

These flows are fundamental to the app's onboarding. Without them, no one can ever log in except
the first user, and no members can join the workspace.

**What Preflight should do**:
- For invite-only applications, the Auth stage must explicitly include:
  1. First-user workspace creation flow
  2. Invite generation service function
  3. Invite token validation service function
  4. New member signup via invite flow
- These are not optional extras — they are the only way users can enter the system.

**Implementation**: Add invite-only detection and flow generation.

---

### 5.14 — File size limit was inconsistent between RULES.md and the Audit stage
**Status**: ⚪ Not Started

**What happened**: RULES.md said "Maximum file size: 200 lines." The Code Quality Audit stages
(Stages 14 and 15) said "Find files over 300 lines." This contradiction would cause the coding
agent to ignore 200-line violations until the final audit, accumulating technical debt.

**What Preflight should do**:
- Every quantitative limit defined in RULES.md must be used verbatim in the Audit stage.
  There must be zero numeric drift between the two documents.
- Before outputting, Preflight should cross-check all numeric thresholds between RULES.md and
  the Audit stage prompt.

**Implementation**: Add numeric consistency check to validation layer.

---

### 5.15 — `vercel.json` SPA routing was incorrectly configured
**Status**: ⚪ Not Started

**What happened**: The generated `vercel.json` used the `routes` key with a destination path
pointing to `/dist/$1`. This is the wrong pattern for a Vite SPA deployed on Vercel. It would
cause all client-side routes (e.g., `/ideas`, `/brainstorm`) to return a 404 on direct navigation
or page refresh. The correct pattern is:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**What Preflight should do**:
- For Vite SPA projects deployed to Vercel, always use `rewrites` not `routes` in `vercel.json`.
- Maintain deployment configuration templates per stack combination
  (Vite SPA + Vercel, Next.js + Vercel, etc.) that are known-correct.

**Implementation**: Add deployment config templates to config validator.

---

## SECTION 6 — Process / Workflow Problems

### 6.1 — No validation step between Research output and Design input
**Status**: ⚪ Not Started

**What happened**: Research results from Gemini, Perplexity, and ChatGPT contained conflicting and
sometimes irrelevant information. There was no Preflight step that helped the user filter and
validate research output before feeding it into the Design stage. The user had to do this manually.

**What Preflight should do**:
- After research is uploaded to the Vault, add a "Research Review" step that:
  1. Highlights the most relevant findings for the stated product type
  2. Flags conflicting information between sources
  3. Confirms which technical decisions are now locked in before proceeding to Design

**Implementation**: Add Research Review UI step between Research and Design modules.

---

### 6.2 — Design prompt was generated for the design tool, but no screen-by-screen workflow was suggested
**Status**: ⚪ Not Started

**What happened**: Stitch (the design tool) works best when given one screen at a time, not the
entire prompt at once. Preflight output the full prompt as a single block with no guidance on
how to use it with Stitch effectively.

**What Preflight should do**:
- Include a "How to use this prompt with [design tool]" section at the bottom of the design prompt.
- For Stitch specifically: "Paste the design system section first. Then paste one screen at a time.
  Review each screen output before continuing to the next."

**Implementation**: Add usage guide footer to design prompt template.

---

### 6.3 — Build Prompts had no dependency map between stages
**Status**: ⚪ Not Started

**What happened**: Some stages depended on files from previous stages (e.g., Stage 05 needed the
Supabase client from Stage 01 and the database schema from Stage 02), but there was no explicit
"Prerequisites" section at the top of each stage. A coding agent starting Stage 05 with no context
would not know what prior work to verify.

**What Preflight should do**:
- Every Build Prompt stage must begin with a "Prerequisites" block listing:
  - Which previous stages must be complete
  - Which specific files must exist before this stage begins
  - Which `npm run build` / `npm run typecheck` checks must pass

**Implementation**: Add prerequisites block to build stage template.

---

### 6.4 — The Build Prompts generated 16 stages, but many were redundant or mis-scoped
**Status**: ⚪ Not Started

**What happened**:
- Stages 14 and 15 were both titled "Final Audit" with nearly identical content
- Stage 03 was "Core Architecture" but built a feature
- Stage 04 duplicated Stage 03's feature
- The stage numbering jumped non-sequentially

**What Preflight should do**:
- Stage planning must follow a strict template:
  1. Foundation (project setup, config, folder structure, type definitions)
  2. Database & Auth (schema, RLS, auth flows)
  3. Core Architecture (routing, layout, auth guards, navigation)
  4–N. Features (one stage per major feature, in dependency order)
  N+1. Code Quality Audit (one audit stage only)
  N+2. Deployment
- Stages must be sequentially numbered with no gaps or duplicates.
- Stage names must accurately describe what is built in that stage.

**Implementation**: Fix stage planning logic in build generation service.

---

## SECTION 7 — Quick Reference: What Preflight Gets Right (Keep These)

These things worked well and should be preserved:

- ✅ **Brief structure** — The 7-section brief format (Problem, Users, Features, Stack, Notes) is
  well-designed and produced accurate context.
- ✅ **PRD overall structure** — Section headings, user stories, acceptance criteria format, and
  "Out of Scope" sections are well-designed.
- ✅ **RULES.md structure** — The 12-section structure (Folder Structure, Code Style, Database, State,
  Styling, AI, Error Handling, Security, Testing, Documentation, Prohibited Behaviors, Session Checklist)
  is comprehensive and well-organized.
- ✅ **SYSTEM_INSTRUCTIONS.md structure** — The 5-step workflow (READ → PLAN → IMPLEMENT → TEST →
  DOCUMENT) is exactly right for a coding agent.
- ✅ **Prohibited Behaviors section** — The ❌ format with categories (Code, Architecture, Safety,
  Workflow) is effective.
- ✅ **Database schema SQL output** — The generated SQL migration was largely correct and complete.

---

## SUMMARY TABLE

| Category | Issues | Status |
|----------|--------|--------|
| Research Prompt | 2 issues | ⚪ Not Started |
| Design Prompt | 6 issues | ⚪ Not Started |
| PRD | 4 issues | ⚪ Not Started |
| RULES.md | 3 issues | ⚪ Not Started |
| Build Prompts — Config | 5 issues | ⚪ Not Started |
| Build Prompts — Architecture | 5 issues | ⚪ Not Started |
| Build Prompts — Security | 2 issues | ⚪ Not Started |
| Build Prompts — Structure | 3 issues | ⚪ Not Started |
| Process / Workflow | 4 issues | ⚪ Not Started |

**Total: 34 distinct issues identified across all Preflight output stages.**

### Priority Matrix

| Priority | Issues | Action |
|----------|--------|--------|
| 🔴 Critical | 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.9 | Fix immediately — blocks working builds |
| 🟡 High | 5.6, 5.8, 5.10, 5.11, 5.12, 5.13, 5.15 | Fix in Phase 1 — causes runtime errors |
| 🟢 Medium | All Section 1-4, 6 | Fix in Phase 2-3 — quality improvements |

---

*Last Updated: 2026-04-01*
*Document Status: Active — Track implementation progress here*
