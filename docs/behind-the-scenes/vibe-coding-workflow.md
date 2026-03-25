# How Preflight Was Actually Built: 3 Days with Qwen Code

**Published:** March 25, 2026 | **Read Time:** 6 minutes

---

## The Real Story

Preflight wasn't built with Cursor. It wasn't built with Bolt. It wasn't built over weeks or months.

**Preflight was built in 3 days using Qwen Code — a free, open-source AI pair programmer.**

I toggled between **Plan mode** (for structured thinking) and **YOLO mode** (for rapid execution). When I got stuck or needed explanations, I used **Claude Desktop**. When Qwen finished implementing, I tested everything, reported bugs, proposed features, requested redesigns, and iterated until the app was complete.

This is the authentic story of how Preflight came to be.

---

## The Tools I Actually Used

| Tool | Role | How I Used It |
|------|------|---------------|
| **Qwen Code** | Primary builder | Plan mode for architecture, YOLO mode for rapid implementation |
| **Claude Desktop** | Explainer & debugger | Understanding complex issues, troubleshooting when stuck |
| **My Workflow** | The secret sauce | Structured prompts from months of iteration (yuno-docs) |

That's it. No Cursor. No Bolt credits. No expensive subscriptions. **Completely free.**

---

## The 3-Day Build Sprint

### Day 1: Foundation (12 hours)

**Goal:** Turn the workflow into an actual application

**Process:**
1. Opened Qwen Code
2. Enabled **Plan mode** for initial architecture
3. Described what I wanted: "A Project OS for vibe coders that structures the pre-build workflow"
4. Qwen generated the project structure, types, and initial components
5. Switched to **YOLO mode** for rapid implementation
6. Tested each feature as it was built
7. Reported bugs immediately
8. Iterated until stable

**What got built:**
- Project structure (React + Vite + TypeScript + Tailwind)
- Type definitions (Project, Brief, Artifact, BuildStage, etc.)
- Dexie.js database schema
- Zustand stores
- Basic routing and layout shell

**Key moment:** When Qwen finished the foundation, I didn't just accept it. I tested it. Found bugs. Reported them. Qwen fixed them. We repeated until it was solid.

---

### Day 2: Core Features (14 hours)

**Goal:** Build all 6 modules (Brief, Research, Design, PRD, Build, Vault)

**Process:**
1. Used the build prompts I had refined over months
2. Qwen implemented one module at a time
3. After each module: **test → bug report → fix → redesign → iterate**
4. Switched between Plan mode (for complex logic) and YOLO mode (for UI components)
5. Used Claude Desktop when I needed to understand why something wasn't working

**What got built:**
- **Brief Module:** Structured form with autosave, feature list, platform tags
- **Research Module:** Context node selector, AI generation with streaming
- **Design Module:** Platform variants, design history tracking
- **PRD Module:** Markdown generation, system instructions, rules files
- **Build Module:** Sequential workflow, stage cards, export functionality
- **Vault Module:** File upload, category filters, context injection

**Key moment:** The Build Module wasn't right on the first try. I requested a redesign: "Make it more visual, show progress clearly, add collapsible stages." Qwen implemented it. I tested again. Requested another tweak. Final result: the sequential build workflow you see today.

---

### Day 3: Polish & Testing (10 hours)

**Goal:** Make it production-ready

**Process:**
1. Comprehensive testing of every feature
2. Bug hunting (edge cases, error states, loading states)
3. Accessibility pass (ARIA labels, focus indicators, keyboard navigation)
4. Performance optimization (React.memo, query optimization)
5. Documentation (DOCS.md, README.md, code comments)
6. Final redesign requests (better spacing, improved colors, cleaner UI)

**What got done:**
- Error boundaries on all routes
- Toast notifications for user feedback
- Loading skeletons and empty states
- Keyboard navigation throughout
- Dark theme polish (contrast, spacing, visual hierarchy)
- Complete documentation

**Key moment:** I asked Qwen to "audit the entire codebase for quality issues." It found files that were too long, functions that needed refactoring, and missing error handling. We fixed everything before shipping.

---

## The Workflow Behind the 3-Day Build

Here's what made the 3-day sprint possible: **months of prompt refinement before I wrote a single line of code.**

### The yuno-docs Origin

Months ago, I was like every other vibe coder:
- Messy desktop with scattered files
- Lost context across chat sessions
- Projects that stalled halfway
- Credit limits on platforms

I started creating **structured prompts** to solve my own problems:
- A brief template to capture ideas properly
- Research prompts that actually gathered useful info
- Design prompts that produced consistent results
- Build prompts that followed a logical sequence

I open-sourced this workflow during the **Bolt hackathon** as [yuno-docs](https://github.com/sifeddinemeb/yuno-docs).

### From Workflow to Platform

Using yuno-docs, I built multiple apps. Each time:
1. Follow the prompts
2. Note what worked and what didn't
3. Refine the prompts
4. Build again

After months of this, the workflow was solid. But I realized:

> **The workflow itself should be the product.**

Not just prompts in a GitHub repo — but an actual platform that:
- Stores projects properly
- Keeps context organized
- Generates prompts dynamically
- Tracks progress through the workflow

That's when I decided to build Preflight.

---

## The Real Build Process: Test → Report → Iterate

Here's the actual loop I followed for 3 days:

```
1. Qwen implements a feature (Plan mode → YOLO mode)
2. I test it thoroughly
3. I find bugs → report them with specific steps to reproduce
4. I propose features → "This would be better if..."
5. I request redesigns → "Make this cleaner, use better spacing"
6. Qwen implements fixes and improvements
7. I test again
8. Repeat until it's right
```

This wasn't passive AI coding. This was **active collaboration**:
- I was the product manager (what to build)
- I was the QA engineer (testing, bug reports)
- I was the designer (redesign requests)
- Qwen was the builder (implementation)

---

## Why Qwen Code?

I chose Qwen Code because:
- **Free and open-source** — No subscription, no credit limits
- **Plan mode** — Structured thinking for complex decisions
- **YOLO mode** — Rapid execution when you know what you want
- **Understands context** — Can follow multi-step workflows
- **Good at React** — Knows modern patterns and best practices

Claude Desktop complemented Qwen:
- **Better explanations** — When I needed to understand why something broke
- **Debugging help** — Complex issues that needed deep analysis
- **Second opinion** — Validating architectural decisions

But Qwen did the actual building.

---

## The Results

**3 days.** That's it.

From "I should build this" to "This is production-ready" in 72 hours of actual work.

**What shipped:**
- 6 complete modules
- 10 agent prompt templates
- Sequential build workflow
- Local-first database
- Complete documentation
- Production deployment configs

**Code quality:**
- TypeScript strict mode
- Component memoization
- Error boundaries
- Accessibility compliance
- Test coverage

All built with free tools, following a workflow I refined over months.

---

## What This Proves

### 1. Free Tools Are Enough

You don't need:
- Paid Cursor subscriptions
- Bolt credits
- Expensive AI tools

You need:
- A clear workflow
- Structured prompts
- Free AI tools (Qwen Code)
- Iterative testing

### 2. The Workflow Is the Product

The code is secondary. The real value is:
- The prompts that guide the AI
- The testing process that catches bugs
- The iteration that refines the result
- The structure that prevents chaos

### 3. AI Doesn't Replace You — It Amplifies You

I didn't just watch Qwen code. I:
- Defined what to build
- Tested every feature
- Reported bugs precisely
- Requested redesigns
- Proposed new features
- Iterated until it was right

AI amplified my output. But **I** was still the architect, the tester, the product manager.

---

## Try the Same Approach

Want to build something similar?

1. **Get Qwen Code** — It's free and open-source
2. **Learn the modes** — Plan mode for thinking, YOLO mode for doing
3. **Create your workflow** — Structured prompts for your use case
4. **Test everything** — Don't trust AI output blindly
5. **Report bugs** — Be specific about what's wrong
6. **Request redesigns** — Ask for improvements
7. **Iterate** — Repeat until it's right

That's how Preflight was built. That's how you can build too.

---

**Next:** [Self-Dogfooding: Using Preflight to Build Preflight](self-dogfooding.md)

**Previous:** [Origin Story: From yuno-docs to Preflight](origin-story.md)

**Back to:** [Documentation Index](../README.md)
