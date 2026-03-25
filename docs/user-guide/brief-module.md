# Brief Module Guide

**Capture your idea in a structured format** — The foundation of every great build.

---

## What It Does

The Brief module helps you:
- Define the problem you're solving
- Identify your target users
- Prioritize core features
- Set tech stack and platform constraints
- Track completion progress

---

## When to Use It

**Always start here.** The Brief is the foundation for everything that follows:
- Research prompts reference your brief
- Design prompts use your user definitions
- PRDs expand on your feature list
- Build prompts implement your vision

**Target completion:** 80%+ before moving to Research.

---

## Step-by-Step Guide

### 1. Define the Problem

**Field:** Problem Statement

**What to write:**
- What pain point are you solving?
- Who experiences this pain?
- How do they currently solve it?
- Why is the current solution inadequate?

**Example:**
> Solo developers using AI coding tools struggle with chaotic workflows. They jump between research, design, and coding without structure. Context gets lost across chat sessions. Projects stall or get abandoned because there's no clear plan.

### 2. Describe Target Users

**Field:** Target Users

**What to include:**
- Demographics (age, role, technical level)
- Current tools they use
- Their primary goal
- Their biggest frustration

**Example:**
> Indie hackers and solo developers (25-45 years old). Technical but overwhelmed by infinite possibility. Currently use Lovable, Bolt, or Cursor. Goal: ship complete projects quickly. Frustration: projects stall due to lack of structure.

### 3. List Core Features

**Field:** Core Features (ordered list)

**How to prioritize:**
1. **Must-have** — App doesn't work without this
2. **Should-have** — Important but not critical
3. **Nice-to-have** — Adds polish, not essential

**Example:**
1. Structured brief capture with autosave
2. Research prompt generator for AI tools
3. Design prompt creator with platform variants
4. PRD generator with TypeScript types
5. Sequential build workflow

### 4. Add Tech Stack Hints

**Field:** Tech Stack Tags

**What to include:**
- Frontend framework (React, Vue, Svelte)
- Styling (Tailwind, CSS Modules, Styled Components)
- Backend/Database (Supabase, Firebase, Dexie.js)
- Key libraries (Stripe, Auth0, etc.)

**Example:**
```
React, Tailwind CSS, Dexie.js, Zustand, TypeScript
```

### 5. Select Target Platforms

**Field:** Target Platforms

**Options:**
- **AI Coding:** Lovable, Bolt, Cursor, Claude Code, Replit
- **AI Design:** Stitch, v0, Figma AI, Locofy

Select all platforms you plan to use.

### 6. Add Notes (Optional)

**Field:** Notes

Use this for:
- Additional context
- References to similar products
- Specific constraints or requirements
- Links to inspiration

---

## Tips & Best Practices

### Be Specific, Not Vague

❌ **Vague:**
> "Build a project management tool"

✅ **Specific:**
> "Build a project management tool for solo developers who use AI coding assistants. Primary feature: structured brief capture with autosave. Secondary: research prompt generation. Stack: React, Tailwind, Dexie.js."

### Focus on ONE Problem

Don't try to solve everything. The best products:
- Solve ONE problem exceptionally well
- Have a clear target user
- Say "no" to feature creep

### Write for AI, Not Humans

Remember: your brief generates AI prompts. Include:
- Specific technologies
- Clear user personas
- Prioritized feature list
- Platform constraints

### Use the Completion Score

The completion score (0-100%) guides you:
- **0-40%:** Too vague, add more detail
- **40-70%:** Getting there, refine your answers
- **70-100%:** Ready to proceed to Research

**Target:** 80%+ before moving on.

---

## Common Issues

### "I don't know my target user"

**Solution:**
- Make an educated guess
- You can refine later
- Better to have a hypothesis than nothing

### "My feature list keeps growing"

**Solution:**
- Limit to 5 core features for V1
- Move nice-to-haves to "Notes"
- Remember: you can add features in Build stage

### "The completion score is low"

**Check:**
- Is problem statement detailed? (25 points)
- Do you have at least one feature? (25 points)
- Did you describe target users? (15 points)
- Did you add tech stack tags? (10 points)
- Did you select platforms? (5 points)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘S` | Save brief (autosave enabled) |
| `⌘Enter` | Mark brief complete |

---

## Autosave

**Your brief autosaves every 800ms.** You'll see:
- **Saving...** — Changes being saved
- **Saved ✓** — Changes persisted

You can safely close the tab — your work is saved locally.

---

## Related Modules

- **[Research](research-module.md)** — Generate research prompts based on your brief
- **[Build](build-module.md)** — Implement the features you defined

---

**Next:** [Research Module Guide](research-module.md)

**Previous:** [Project Management](project-management.md)
