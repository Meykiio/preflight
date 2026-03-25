# PRD Module Guide

**Generate product requirements documents** — The single source of truth for your build.

---

## What It Does

The PRD module:
- Generates complete PRDs in markdown format
- Creates system instructions for AI coding tools
- Produces rules files (.cursorrules, CLAUDE.md)
- Provides artifact generation options

---

## When to Use It

Use PRD **after Design** and before Build. This ensures:
- Requirements are fully specified
- AI coding tools have clear instructions
- Your build prompts reference complete specs

---

## Step-by-Step Guide

### 1. Generate PRD

Click **"Generate PRD"**

The AI generates a complete PRD including:
- Product overview and value proposition
- Target user archetypes
- Core feature specifications
- Technical architecture recommendations
- Data models and database schema
- Success metrics
- Out of scope (for V1)

### 2. Review the PRD

Read carefully and check:
- Are all features specified?
- Is the tech stack correct?
- Are acceptance criteria testable?
- Is anything missing?

### 3. Generate System Instructions

Select your AI coding platform:
- **Lovable** — Optimized for Lovable workflows
- **Cursor** — Includes .cursorrules format
- **Claude Code** — Includes CLAUDE.md format
- **Bolt** — Optimized for Bolt.new
- **Universal** — Platform-agnostic

Click **"Generate System Instructions"**

### 4. Generate Rules File

Select your rules file format:
- **.cursorrules** — For Cursor IDE
- **CLAUDE.md** — For Claude Code
- **rules.md** — Universal format

Click **"Generate Rules File"**

### 5. Copy All Artifacts

Copy each generated artifact:
- PRD (markdown)
- System Instructions
- Rules File

Save these for the Build stage.

---

## Tips & Best Practices

### Read the Full PRD

Don't skip this step. The PRD:
- Catches ambiguities before building
- Ensures you've thought through edge cases
- Provides a reference during build
- Helps AI tools understand your requirements

### Customize System Instructions

The generated system instructions are a starting point. Add:
- Your coding preferences
- Project-specific conventions
- Testing requirements
- Documentation standards

### Use the Rules File

Rules files prevent common AI mistakes:
- Enforces TypeScript strict mode
- Prevents files over 300 lines
- Requires error handling
- Mandates documentation

---

## PRD Structure

A complete PRD includes:

### Section 1: Product Overview
- What It Is
- Tagline
- Core Value Proposition
- What This Is Not (V1)

### Section 2: Target Users
- User archetypes (2-3 max)
- Technical level
- Primary pain points
- Goals and fears

### Section 3: Core Features
For each feature:
- Purpose (one sentence)
- User story
- Functional requirements
- Acceptance criteria
- Out of scope for V1

### Section 4: Technical Architecture
- Recommended stack
- Data model (TypeScript interfaces)
- Database schema
- Key libraries

### Section 5: Design Requirements
- Design system reference
- Critical UX requirements
- Responsive requirements

### Section 6: Success Metrics
- Name, definition, target
- Timeframe
- Why this metric

### Section 7: Out of Scope — V1
- Deferred features
- Why deferred
- Triggers for V2

### Section 8: Open Questions
- Unresolved decisions
- Options and recommendations
- Resolve by date

---

## Common Issues

### "The PRD is too long"

**Solution:**
- Long PRDs build better products
- AI coding tools handle long context
- Skim to relevant sections during build

### "System instructions don't match my tool"

**Solution:**
- Select the correct platform
- Customize instructions for your workflow
- Add tool-specific sections

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘Enter` | Generate PRD |
| `⌘C` | Copy generated content |

---

**Next:** [Build Module Guide](build-module.md)

**Previous:** [Design Module](design-module.md)
