# The Origin Story: From yuno-docs to Preflight

**Published:** March 25, 2026 | **Read Time:** 5 minutes

---

## Before Preflight: The Messy Early Days

I wasn't always organized. Before Preflight, I was just another vibe coder struggling with the chaos:

- **Messy desktop** — Dozens of half-finished projects scattered everywhere
- **Lost files and docs** — Context lost across chat sessions
- **Credit limits** — Hitting paywalls on vibe coding platforms
- **Multiple projects** — Hard to keep organized, hard to track progress
- **Fragmented workflow** — Jumping between research, design, and code without structure

Sound familiar? It should. This is what early vibe coding felt like for most of us.

---

## The Problem: Vibe Coding Platforms Had Limits

I tried all the platforms:

| Platform | Problem |
|----------|---------|
| **Lovable** | Credit limits, can't export everything |
| **Bolt** | Great for prototypes, hard to maintain long-term |
| **Replit** | Good for collaboration, but locked into their ecosystem |
| **Cursor** | Excellent AI, but expensive subscription |

They all had the same issues:
- **Credits run out** — You hit a paywall mid-project
- **Context gets lost** — Each chat session is isolated
- **No project organization** — Everything is a flat list
- **Generated code is disposable** — Hard to iterate long-term

I needed something different. Not a platform — a **workflow** I could own.

---

## The Solution: Create My Own Prompts

Instead of relying on platform-specific workflows, I started creating **structured prompts**:

### Phase 1: The Brief Template

```
PROJECT BRIEF
=============
Problem: [What problem does this solve?]
Target Users: [Who uses this?]
Core Features: [List in priority order]
Tech Stack: [React, Tailwind, etc.]
Platforms: [Lovable, Bolt, Cursor, etc.]
```

This simple template solved the "what am I building?" problem.

### Phase 2: Research Prompts

```
RESEARCH PROMPT
===============
Context: [Paste brief here]
Research Goals:
1. Market size and audience
2. Competitive landscape
3. Technical recommendations
4. Design patterns
Output Format: [Structured markdown]
```

This solved the "I don't know what I don't know" problem.

### Phase 3: Design Prompts

```
DESIGN PROMPT
=============
Product: [App description]
Design Language: [Dark theme, minimal, etc.]
Components: [List of components needed]
Interactions: [Hover states, animations, etc.]
Platform: [v0, Stitch, Figma AI]
```

This solved the "make it pretty but also functional" problem.

### Phase 4: Build Prompts

```
BUILD WORKFLOW
==============
Stage 1: Foundation (types, schema, routing)
Stage 2: Database (Dexie/Supabase setup)
Stage 3: Features (one module at a time)
Stage 4: Audit (code review, refactoring)
Stage 5: Polish (UI, accessibility, docs)
```

This solved the "how do I actually build this?" problem.

---

## yuno-docs: Open-Sourcing the Workflow

During the **Bolt hackathon**, I decided to open-source my workflow.

**yuno-docs** was born: https://github.com/sifeddinemeb/yuno-docs

It contained:
- All the prompt templates
- The sequential build workflow
- Documentation on how to use it
- Examples of apps built with it

**Why open-source?**
- Help other vibe coders escape chaos
- Get feedback to improve the workflow
- Build in public (accountability)

---

## Using the Workflow: Building App After App

With yuno-docs, I built multiple applications. Each one taught me something:

### App 1: The First Test
- **Used:** Basic yuno-docs prompts
- **Result:** Worked, but rough edges
- **Learned:** Need more specific design prompts

### App 2: The Iteration
- **Used:** Refined prompts with better structure
- **Result:** Cleaner code, better UX
- **Learned:** Build prompts need to enforce testing

### App 3: The Breakthrough
- **Used:** Complete workflow with all refinements
- **Result:** Production-ready in hours
- **Learned:** The workflow itself is the product

Each app followed the same pattern:
1. Fill the brief
2. Generate research
3. Generate design
4. Generate PRD + system instructions
5. Run sequential build
6. Test → bug report → fix → iterate

The workflow worked. But it was still just prompts in a GitHub repo.

---

## The Realization: The Workflow Should Be the Platform

One day, after finishing another app with yuno-docs, I realized:

> **I'm using a workflow to solve platform limitations. But what if the workflow WAS the platform?**

Instead of prompts in a markdown file, what if I built:
- A **Project Hub** to organize everything
- A **Brief module** to capture ideas properly
- A **Research module** to generate prompts dynamically
- A **Design module** for platform-specific design prompts
- A **PRD module** for complete specifications
- A **Build module** for sequential workflows
- A **Vault** to store all files and context

That's when Preflight was conceived.

---

## From Idea to Reality: The 3-Day Sprint

I didn't spend months planning Preflight. I used the workflow to build itself.

**Day 1:** Foundation (project structure, types, database)
**Day 2:** Features (all 6 modules)
**Day 3:** Polish (testing, accessibility, docs)

Built with:
- **Qwen Code** (Plan mode + YOLO mode)
- **Claude Desktop** (for explanations when stuck)
- **My yuno-docs workflow** (the prompts that guided everything)

Tested with:
- **Me as QA** — Testing every feature, reporting bugs
- **Iteration** — Requesting redesigns until it was right

---

## The Full Circle Moment

After building Preflight, I did something meta:

**I used Preflight to rebuild Preflight.**

1. Created a project in Preflight called "Preflight Rebuild"
2. Filled out the brief (describing Preflight itself)
3. Generated all prompts (research, design, PRD, build)
4. Gave the prompts to Qwen Code
5. Watched it rebuild the same app

**Result:** It worked. Preflight successfully generated the prompts to rebuild itself.

This proved:
- The workflow was complete
- The prompts were specific enough
- The structure was reproducible

---

## Why This Story Matters

Preflight isn't just another tool. It's:

1. **The culmination of months of iteration** — Not a weekend project, but months of prompt refinement
2. **Built by a vibe coder, for vibe coders** — I lived the problems I'm solving
3. **Platform-agnostic** — Works with any AI coding tool (Qwen, Cursor, Claude Code, Bolt)
4. **Free and open-source** — No credits, no subscriptions, no paywalls
5. **Proven in production** — Used to build itself (the ultimate dogfooding test)

---

## The Mission

**Preflight's mission is simple:**

Help vibe coders escape chaos and ship complete projects.

How?
- Structure without rigidity
- Guidance without hand-holding
- Prompts that actually work
- A workflow that scales

---

## Join the Journey

Preflight is open-source. The workflow is documented. The prompts are available.

**Your turn:**
1. Clone Preflight
2. Use it for your next project
3. Report bugs, propose features
4. Contribute to the workflow
5. Build something amazing

---

**Next:** [How Preflight Was Built: 3 Days with Qwen Code](vibe-coding-workflow.md)

**Previous:** [Documentation Index](../README.md)
