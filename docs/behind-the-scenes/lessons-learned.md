# Lessons Learned Building Preflight

**Published:** March 25, 2026 | **Read Time:** 6 minutes

---

## 10 Insights from Building an AI-Assisted Development Tool

After building Preflight — and then using Preflight to rebuild itself — I learned more about AI-assisted development than I expected. Here are the key insights.

---

## 1. The Prompts Are the Code

**Traditional development:** The code is the product.

**AI-assisted development:** The prompts are the product.

This was the biggest mindset shift. When AI writes the code, your value as a developer shifts from:
- Writing implementation → Describing requirements
- Debugging syntax → Reviewing logic
- Memorizing APIs → Structuring context

**Lesson:** Invest time in writing better prompts. A well-structured prompt saves hours of back-and-forth with the AI.

---

## 2. Context Is King

AI coding assistants are incredibly capable — but only when they have the right context.

**Bad prompt:**
> "Add a project management feature"

**Good prompt:**
> "Add a project status field to the Project interface in types/index.ts. Valid values are: 'ideation', 'researching', 'designing', 'building', 'shipped'. Update the ProjectCard component to display the status as a badge. Use the StatusBadge component from components/shared. Add a dropdown in the project menu to change status. Update the database schema in lib/db.ts to include the status field."

The second prompt works because it:
- References specific files
- Defines exact values
- Describes the UI pattern
- Mentions related components

**Lesson:** Never assume the AI knows your codebase. Reference specific files, components, and patterns.

---

## 3. Sequential Builds Beat One-Shot Prompts

Early in building Preflight, I tried to generate the entire app in one massive prompt. Result: chaos.

The AI would:
- Create files but forget imports
- Implement features but skip tests
- Write code that conflicted with earlier code

The breakthrough came when I switched to **sequential prompts**:
1. Foundation (structure, config, types)
2. Database (schema, stores, hooks)
3. Features (one module at a time)
4. Audit (review and refactor)
5. Polish (UI, accessibility, docs)

Each stage built on the previous. Each prompt assumed the previous stage was complete and verified.

**Lesson:** Break complex builds into sequential stages. Verify each stage before moving on.

---

## 4. AI Makes Boring Mistakes

AI coding assistants are brilliant at:
- Generating boilerplate
- Implementing standard patterns
- Writing tests
- Creating documentation

They're also surprisingly bad at:
- Counting (off-by-one errors in loops)
- Naming (inconsistent variable names)
- Imports (forgetting to add new imports)
- Edge cases (null checks, empty states)

**Lesson:** Review AI-generated code carefully. The mistakes are usually simple — but they break builds.

---

## 5. Type Safety Is Non-Negotiable

Building with AI taught me to appreciate TypeScript even more.

Without strict types:
- AI would generate inconsistent data structures
- Props would have wrong types
- Function signatures would drift

With strict TypeScript:
- AI catches its own mistakes (type errors)
- Refactoring is safer (compiler catches breaks)
- Documentation is automatic (types as docs)

**Lesson:** Use TypeScript strict mode. It's not just for you — it's for the AI too.

---

## 6. Small Files Are Essential

AI coding tools work best with small, focused files.

When files grow beyond 300-400 lines:
- AI loses track of what's where
- Edits become risky (might break unrelated code)
- Understanding the file requires reading everything

When files stay under 250 lines:
- AI can hold the entire file in context
- Edits are surgical (change one function)
- Understanding is quick (one file = one responsibility)

**Lesson:** Enforce file size limits. Split files aggressively. One responsibility per file.

---

## 7. Documentation Is a Force Multiplier

I used to think documentation was optional for personal projects. AI-assisted development changed my mind.

**Why docs matter with AI:**
- AI reads your docs before coding (context!)
- Docs encode architectural decisions
- Docs prevent regression (AI knows what not to break)
- Docs help you understand what AI built

Preflight enforces documentation:
- DOCS.md is created in Stage 1
- Every feature updates DOCS.md
- JSDoc on all exports
- Comments on complex logic

**Lesson:** Write docs as you build. AI will use them to write better code.

---

## 8. Testing Catches AI Hallucinations

AI sometimes generates code that looks right but doesn't work:
- Imports from non-existent modules
- Functions that return wrong types
- Logic that works for happy paths but fails on edge cases

Tests catch these hallucinations:
- Import errors → build fails
- Type errors → TypeScript fails
- Logic errors → tests fail

**Lesson:** Run tests after every AI-generated change. Better yet, write tests before (TDD works great with AI).

---

## 9. The Human Is Still the Architect

AI can implement. But humans must architect.

**What AI does well:**
- "Create a React component that displays a list of projects"
- "Add a function to update a record in Dexie"
- "Write a test for this utility function"

**What humans must do:**
- "We need a project hub that shows all projects in a grid"
- "Data should flow from Dexie → Zustand → components"
- "The build workflow should be sequential, not random"

**Lesson:** You're the architect. AI is the builder. Know the difference.

---

## 10. Vibe Coding Is Real — But It Needs Structure

"Vibe coding" gets a bad rap. The idea that you can just "flow" with AI assistance sounds chaotic.

But after building Preflight, I realized: **vibe coding isn't the problem. Unstructured vibe coding is.**

With structure:
- Clear brief → focused research → detailed design → complete PRD → sequential build

Vibe coding becomes:
- Flow state + AI assistance + documented decisions + working software

**Lesson:** Don't reject vibe coding. Structure it. That's what Preflight does.

---

## The Meta Lesson

Building Preflight taught me something unexpected:

**The best way to learn how to build with AI is to build a tool that helps you build with AI.**

By encoding my workflow into Preflight, I was forced to:
- Articulate vague intuitions ("just structure your prompts better")
- Identify patterns ("always do foundation before features")
- Document decisions ("why we use Dexie instead of Supabase")

The tool became the teacher.

---

## Apply These Lessons

Want to apply these lessons to your own AI-assisted projects?

1. **Use Preflight** — It encodes these lessons into every prompt
2. **Read the prompts Preflight generates** — Study how they're structured
3. **Iterate on your workflow** — What works for you? What doesn't?
4. **Share what you learn** — The community is still figuring this out

---

**Previous:** [Self-Dogfooding](self-dogfooding.md)

**Back to:** [Documentation Index](../README.md)
