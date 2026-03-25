# Self-Dogfooding: Using Preflight to Build Preflight

**Published:** March 25, 2026 | **Read Time:** 4 minutes

---

## The Ultimate Test

After building Preflight, I faced the question that would validate (or invalidate) the entire concept:

> **Can Preflight successfully generate the prompts to rebuild itself?**

This isn't just a philosophical question. It's the ultimate dogfooding test. If Preflight is truly a complete system for generating AI-ready build prompts, then it should be able to describe itself well enough that an AI coding assistant can rebuild it.

---

## The Experiment

### Step 1: Create the Project

I opened Preflight and created a new project:

- **Name:** Preflight Rebuild
- **Description:** A project operating system for vibe coders — captures structured briefs, generates research/design/PRD prompts, and produces sequential build workflows
- **Status:** Ideation
- **Platforms:** Lovable, Bolt, Cursor, Claude Code
- **Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Dexie.js, Zustand, React Router

### Step 2: Fill the Brief

I described Preflight itself in the Brief module:

**Problem:**
> Developers using AI coding tools (Lovable, Bolt, Cursor, etc.) struggle with chaotic workflows. They jump between research, design, and coding without structure. Context gets lost across chat sessions. Projects stall or get abandoned.

**Target Users:**
> Solo developers, indie hackers, and builders who use AI coding assistants. Technical but overwhelmed by infinite possibility. Want to ship complete projects, not just prototypes.

**Core Features:**
> 1. Project Hub — Grid/list view of all projects with status tracking
> 2. Brief Module — Structured capture of problem, users, features, tech stack
> 3. Research Module — Generate deep research prompts for Perplexity, Gemini, ChatGPT
> 4. Design Module — Create design prompts for Stitch, v0, Figma AI
> 5. PRD Module — Generate complete product requirements documents
> 6. System Module — Generate system instructions and rules files for AI coding tools
> 7. Build Module — Sequential build workflow (Foundation → Database → Features → Audit → Deploy)
> 8. Vault — File storage with context injection for generations

**Tech Stack:**
> React 18, Vite 6, TypeScript 5.8, Tailwind CSS 3.4, Dexie.js 4, Zustand 5, React Router 6

### Step 3: Generate Research Prompts

I clicked "Generate Research Prompt" in the Research module. Preflight generated a prompt that included:

- Context about what Preflight is
- Specific research questions about:
  - What makes developer tools actually get used daily?
  - Best practices for prompt engineering with AI coding assistants
  - Design patterns for workflow visualization
  - Technical architecture for local-first applications

I pasted this into Perplexity Deep Research. The results informed the design decisions.

### Step 4: Generate Design Prompts

I selected "v0" as the target platform and clicked "Generate Design Prompt". Preflight generated a detailed prompt describing:

- **Design Language:** Dark theme, Space Grotesk headlines, Inter body, JetBrains Mono code
- **Color System:** Primary (#c5c0ff), Secondary (#6edab4), Tertiary (#ffb95d)
- **Layout:** Sidebar navigation, header with breadcrumbs, main content area
- **Components:** Project cards, brief editor, prompt generators, build stage cards
- **Interactions:** Hover states, focus rings, loading skeletons, empty states

I pasted this into v0. It generated the exact UI components I had built.

### Step 5: Generate the PRD

I clicked "Generate PRD". Preflight produced a 2,500-word PRD with:

- Product overview and value proposition
- Target user archetypes with detailed profiles
- Feature specifications with acceptance criteria
- Complete TypeScript data models
- Database schema for Dexie.js
- Success metrics (did users complete their build workflow?)

### Step 6: Generate System Instructions

I selected "Cursor" as the target platform and clicked "Generate System Instructions". Preflight generated:

```
You are a senior React engineer building Preflight — a Project OS for vibe coders.

WORKFLOW:
1. Read DOCS.md and types/index.ts before any changes
2. State your plan before coding
3. Implement one file at a time (max 4 files per session)
4. Run `npm run build` after each change
5. Update DOCS.md when features are complete

CODE QUALITY:
- TypeScript strict mode only
- No `any` types — use proper types or `unknown` with guards
- Files under 300 lines — split larger files
- Functions under 40 lines — extract helpers
- Use Tailwind utilities only — no custom CSS
- Functional components only — no class components
- Custom hooks for data fetching — no direct API calls in components

TESTING:
- Run `npm run test` after implementing features
- Add tests for all lib/ utilities
- Add tests for Zustand store actions
- Test user flows manually before marking complete

DOCUMENTATION:
- JSDoc on all exported functions
- Update DOCS.md with new features
- Comment complex business logic
```

### Step 7: Generate the Build Workflow

I clicked "Generate Full Build Workflow". Preflight generated 5 sequential prompts:

1. **Foundation:** Project structure, Tailwind config, TypeScript setup, type definitions, Dexie schema, layout shell
2. **Database:** Complete Dexie implementation, Zustand stores, custom hooks
3. **Features:** One prompt per module (Brief, Research, Design, PRD, Build, Vault)
4. **Audit:** Code review, refactoring, documentation
5. **Deployment:** Vercel/Netlify configuration, CI/CD setup

---

## The Results

### What Worked

✅ **The prompts were complete.** Each prompt contained enough detail that an AI coding assistant could execute without asking clarifying questions.

✅ **The sequence was correct.** The foundation prompts established patterns that the feature prompts built upon. Nothing was out of order.

✅ **The context was preserved.** Each prompt referenced previous work (e.g., "use the types defined in types/index.ts").

✅ **The output matched the original.** The AI-generated code from Preflight's prompts closely resembled the code I had originally written.

### What Surprised Me

🎯 **The PRD was better than my original.** Preflight's generated PRD included edge cases and acceptance criteria I hadn't explicitly defined.

🎯 **The system instructions were more comprehensive.** The generated Cursor instructions included testing and documentation requirements I had only implicitly followed.

🎯 **The build prompts caught architectural decisions.** The prompts explicitly documented patterns (like "all database calls through services layer") that I had implemented but never written down.

---

## What This Proves

### 1. Structure Is Transferable

The workflow I used intuitively to build Preflight was successfully encoded into Preflight itself. The structure exists, it's real, and it can be captured.

### 2. AI Can Understand Complex Projects

When given structured, detailed prompts, AI coding assistants can build sophisticated applications — not just todo lists and weather apps.

### 3. The Prompts Are the Product

The real value of Preflight isn't the React components or the database schema. It's the **prompts** — the encoded knowledge of how to structure an AI-assisted build.

### 4. Dogfooding Works

Building a tool, then using that tool to rebuild itself, is an incredibly effective way to find gaps and improve the product.

---

## The Implications

If Preflight can successfully generate the prompts to rebuild itself, what else can it do?

**Answer:** Any application that follows similar patterns.

The prompts Preflight generates aren't magic — they're structured descriptions of:
- What to build (the brief)
- Why it matters (the research)
- How it should look (the design)
- What it needs to do (the PRD)
- How to build it (the sequential workflow)

Any developer can use this same structure. The only difference is the content of the brief.

---

## Try It Yourself

Want to replicate this experiment?

1. **Install Preflight:** `git clone https://github.com/Meykiio/preflight.git && pnpm install && pnpm dev`
2. **Create a project** describing any application you want to build
3. **Fill out the brief** with as much detail as possible
4. **Generate all prompts** in sequence
5. **Paste the build prompts** into Cursor, Claude Code, or Bolt
6. **Watch your app get built**

You'll experience what I experienced: the confidence that comes from structure.

---

**Next:** [Lessons Learned from Building Preflight](lessons-learned.md)

**Previous:** [Vibe Coding Workflow](vibe-coding-workflow.md)
