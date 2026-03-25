# How Preflight Was Built: A Vibe Coding Journey

**Published:** March 25, 2026 | **Read Time:** 5 minutes

---

## The Origin Story

Preflight wasn't built like traditional software. There was no detailed upfront design, no weeks of architecture planning, no comprehensive spec documents. Instead, it was built using what the community now calls **"vibe coding"** — an AI-assisted, iterative, flow-state approach to software development.

### What is Vibe Coding?

**Vibe coding** is a development methodology where:
- You describe what you want in natural language
- AI coding assistants (Cursor, Claude Code, Bolt, etc.) generate the code
- You review, tweak, and iterate in real-time
- The codebase evolves organically through conversation

It's called "vibe" coding because you're riding the flow — following your intuition about what the product should be, while AI handles the implementation details.

---

## The Problem I Was Trying to Solve

Like many developers in the AI era, I experienced the **vibe coding paradox**:

**The High:** You can build faster than ever. Ideas become prototypes in hours, not weeks.

**The Low:** Projects spiral into chaos. Without structure, you end up with:
- Fragmented context across dozens of chat sessions
- No clear requirements or acceptance criteria
- Code that works but nobody (including you) fully understands
- Abandoned projects because the path forward is unclear

I needed a system. A way to capture the structure that experienced developers hold in their heads — the **pre-flight checklist** before writing code.

---

## Building Preflight with AI Tools

### The Tools I Used

| Tool | Primary Use |
|------|-------------|
| **Cursor** | Main IDE for vibe coding with AI pair programming |
| **Claude Code** | Complex refactoring and architecture decisions |
| **v0** | Rapid UI prototyping and component generation |
| **Perplexity** | Research on best practices and design patterns |
| **Gemini** | Deep research on user experience patterns |

### The Process

I followed the exact workflow that Preflight now generates:

#### 1. The Brief (2 hours)
Instead of jumping straight into code, I wrote a structured brief:
- **Problem:** Vibe coding leads to abandoned projects without structure
- **Users:** Solo developers, indie hackers, AI-curious builders
- **Features:** Brief capture, research prompts, design prompts, PRD generation, build prompts
- **Stack:** React, Vite, TypeScript, Tailwind, Dexie.js, Zustand

#### 2. Research (1 hour)
I used Perplexity and Gemini to research:
- What makes project management tools actually get used?
- What information do AI coding assistants need to be effective?
- What are the best practices for prompt engineering?

#### 3. Design (30 minutes)
I used v0 to rapidly prototype the UI:
- Dark theme (for long coding sessions)
- Clean, minimal interface (reduce cognitive load)
- Sequential workflow visualization (show progress)

#### 4. The PRD (20 minutes)
I generated a complete PRD that defined:
- Data models (Project, Brief, Artifact, BuildStage, etc.)
- User flows (create project → fill brief → generate prompts → build)
- Success metrics (did users complete their build?)

#### 5. System Instructions (10 minutes)
I generated system instructions for my AI coding tool:
- "Always read DOCS.md before making changes"
- "Keep files under 300 lines"
- "TypeScript strict mode only"
- "Test before marking complete"

#### 6. Sequential Build (8 hours over 3 days)
I built Preflight in stages:
- **Stage 1 — Foundation:** Project structure, config, types, schema
- **Stage 2 — Database:** Dexie setup, Zustand stores, hooks
- **Stage 3 — Features:** One module at a time (Brief, Research, Design, PRD, Build, Vault)
- **Stage 4 — Audit:** Code review, refactoring, documentation
- **Stage 5 — Polish:** UI improvements, error handling, accessibility

---

## The Meta Experiment: Dogfooding Preflight

After building Preflight, I asked myself the ultimate question:

> **"Can Preflight build itself?"**

If Preflight is truly a complete system for generating AI-ready build prompts, then I should be able to use it to rebuild the exact same application.

### The Test

1. I created a new project in Preflight called "Preflight Rebuild"
2. I filled out the brief describing Preflight itself
3. I went through each module:
   - Generated research prompts
   - Generated design prompts
   - Generated the PRD
   - Generated system instructions
   - Generated the full sequential build workflow

### The Result

**It worked.**

The prompts that Preflight generated were able to rebuild Preflight. The AI coding tools understood what to build because the prompts were specific, structured, and complete.

### What This Proves

This isn't just a parlor trick. It validates the core premise of Preflight:

> **Structure + Context + Clear Prompts = Reproducible AI Coding**

When you give AI coding assistants the right context and clear instructions, they can build complex, production-ready applications — not just toy projects.

---

## Lessons Learned

### 1. AI Is a Force Multiplier, Not a Replacement

AI didn't replace my judgment — it amplified it. I still needed to:
- Define the problem clearly
- Make architectural decisions
- Review code for quality
- Test the user experience

But AI handled the tedious parts: boilerplate, repetitive code, documentation, tests.

### 2. Structure Is Everything

The difference between a successful AI build and a failed one isn't the AI — it's the **structure of your instructions**.

Vague: *"Build a project management app"*

Structured: *"Build a React app with these 6 data models, these 12 components, these 8 hooks, following these patterns..."*

Preflight exists to provide that structure.

### 3. The Prompts Are the Product

The real value of Preflight isn't the UI or the database — it's the **prompts it generates**. Those prompts encode:
- Best practices for AI coding
- Sequential dependency (don't build features before foundation)
- Context preservation (each prompt builds on previous work)
- Quality gates (build must pass before moving on)

### 4. Documentation Is Part of the Code

With AI-generated code, documentation becomes even more critical. Why?

- You didn't write every line, so you need to understand what exists
- AI makes mistakes that you need to catch on review
- Future-you (or contributors) need to understand the decisions

Preflight enforces documentation at every step.

---

## The Future of Vibe Coding

I believe we're in the early days of a fundamental shift in how software is built. Just as compilers abstracted away assembly language, and frameworks abstracted away manual DOM manipulation, **AI coding assistants are abstracting away boilerplate implementation**.

But abstraction without structure leads to chaos.

**Preflight is the structure layer for AI-assisted development.**

---

## Try It Yourself

Want to experience vibe coding with structure?

1. **Clone Preflight:** `git clone https://github.com/Meykiio/preflight.git`
2. **Run it:** `pnpm install && pnpm dev`
3. **Create a project:** Describe your idea in the brief
4. **Generate prompts:** Let Preflight structure your AI workflow
5. **Build:** Paste the prompts into Cursor, Claude Code, or Bolt

You'll experience what I experienced: the flow of vibe coding, with the confidence of structure.

---

**Next:** Read about [Self-Dogfooding: Using Preflight to Build Preflight](self-dogfooding.md)

**Previous:** [Documentation Index](../README.md)
