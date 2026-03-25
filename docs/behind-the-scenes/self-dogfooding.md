# Self-Dogfooding: Using Preflight to Build Preflight

**Published:** March 25, 2026 | **Read Time:** 5 minutes

---

## The Ultimate Test

After building Preflight with Qwen Code in 3 days, I faced the question that would validate (or invalidate) the entire concept:

> **Can Preflight successfully generate the prompts to rebuild itself?**

This isn't just a philosophical question. It's the ultimate dogfooding test. If Preflight is truly a complete system for generating AI-ready build prompts, then it should be able to describe itself well enough that an AI coding assistant can rebuild it.

---

## The Experiment

### Step 1: Create the Project

I opened Preflight and created a new project:

- **Name:** Preflight Rebuild
- **Description:** A project operating system for vibe coders
- **Status:** Ideation
- **Platforms:** Lovable, Bolt, Cursor, Claude Code, Qwen Code
- **Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Dexie.js, Zustand, React Router

### Step 2: Fill the Brief

I described Preflight itself in the Brief module:

**Problem:**
> Developers using AI coding tools struggle with chaotic workflows. They jump between research, design, and coding without structure. Context gets lost across chat sessions. Projects stall or get abandoned.

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

### Step 3: Generate All Prompts

I clicked through each module:

1. **Research** → Generated research prompt about developer tool adoption
2. **Design** → Generated design prompt for dark-themed project OS
3. **PRD** → Generated complete PRD with TypeScript data models
4. **System** → Generated system instructions for Qwen Code
5. **Build** → Generated full sequential build workflow

### Step 4: Give Prompts to Qwen Code

I took the generated build prompts and gave them to Qwen Code:

```
This is Stage 1 of 5 — the Foundation Stage.
Your ONLY job is to establish the complete technical foundation...
[Prompt continues for 2000+ words with exact specifications]
```

Qwen read the prompt. Started coding. And built... Preflight. Again.

---

## The Results

### What Worked ✅

**The prompts were complete.** Each prompt contained enough detail that Qwen could execute without asking clarifying questions.

**The sequence was correct.** Foundation → Database → Features → Audit → Deploy. Nothing was out of order.

**The context was preserved.** Each prompt referenced previous work ("use the types defined in types/index.ts").

**The output matched the original.** The AI-generated code closely resembled the code I had originally built.

### What Surprised Me 🎯

**The PRD was better than my original.** Preflight's generated PRD included edge cases and acceptance criteria I hadn't explicitly defined.

**The system instructions were more comprehensive.** The generated Qwen Code instructions included testing and documentation requirements I had only implicitly followed.

**The build prompts caught architectural decisions.** The prompts explicitly documented patterns (like "all database calls through services layer") that I had implemented but never written down.

---

## The Testing Process: My Role as QA

After Qwen finished each stage, I didn't just accept it. I tested:

### My Testing Checklist

1. **Does it build?** → `npm run build` must pass
2. **Does it type-check?** → `npm run typecheck` must pass
3. **Do tests pass?** → `npm run test` must pass
4. **Does it work?** → Manual testing in browser
5. **Is it accessible?** → Keyboard navigation, ARIA labels
6. **Is it documented?** → DOCS.md updated

### Bug Reports I Filed

When I found issues, I reported them precisely:

```
BUG: Brief autosave not working
Steps to reproduce:
1. Open project
2. Navigate to Brief tab
3. Type in problem field
4. Refresh page
Expected: Content persists
Actual: Content lost

Fix: Add debounced save with 800ms delay
```

```
REDESIGN: Build stage cards too cramped
Issue: Hard to read prompt content
Request: Make cards collapsible, add better spacing
Priority: Medium
```

```
FEATURE: Add context node selector
Use case: Users should choose which files to include in generations
Implementation: Checkbox list in Research/Design/PRD modules
Priority: High
```

Qwen would fix each issue. I'd test again. Request tweaks. Iterate until right.

---

## What This Proves

### 1. The Workflow Is Reproducible

The same workflow that built Preflight the first time could build it again. The prompts aren't magic — they're **structured descriptions** that any AI coding tool can follow.

### 2. Testing Is Non-Negotiable

AI-generated code needs human testing. I didn't trust Qwen blindly. I tested everything, reported bugs, requested fixes. That's how the app became production-ready.

### 3. Iteration Makes It Better

The first build wasn't perfect. The second build (via Preflight prompts) wasn't perfect either. But through testing → bug reports → redesigns → iteration, it became great.

### 4. The Prompts Are the Product

The real value of Preflight isn't the React components or the database schema. It's the **prompts** — the encoded knowledge of how to structure an AI-assisted build.

---

## The Meta Insight

Building Preflight twice — once manually, once via its own prompts — taught me something profound:

> **The workflow doesn't just build apps. The workflow builds the builder.**

Preflight exists because I needed structure for vibe coding. But Preflight also perpetuates that structure — it teaches users how to think about building, not just what to build.

---

## Try It Yourself

Want to replicate this experiment?

1. **Install Preflight:** `git clone https://github.com/Meykiio/preflight.git && pnpm install && pnpm dev`
2. **Create a project** describing any application you want to build
3. **Fill out the brief** with as much detail as possible
4. **Generate all prompts** in sequence
5. **Paste the build prompts** into Qwen Code, Cursor, Claude Code, or Bolt
6. **Test the result** — be the QA, report bugs, request features
7. **Iterate** until it's right

You'll experience what I experienced: the confidence that comes from structure.

---

**Next:** [Lessons Learned from Building Preflight](lessons-learned.md)

**Previous:** [How Preflight Was Built: 3 Days with Qwen Code](vibe-coding-workflow.md)
