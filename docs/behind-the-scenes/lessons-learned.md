# Lessons Learned: Building Preflight in 3 Days with Qwen Code

**Published:** March 25, 2026 | **Read Time:** 7 minutes

---

## 10 Insights from Building an App with Free AI Tools

After building Preflight in 3 days using Qwen Code (Plan mode + YOLO mode) and Claude Desktop, I learned more about AI-assisted development than I expected. Here are the key insights — the real lessons, not the polished marketing version.

---

## 1. Free Tools Are Enough

**Myth:** You need expensive AI tools to build serious software.

**Reality:** I built Preflight with:
- **Qwen Code** — Free, open-source
- **Claude Desktop** — Free tier
- **My workflow** — Months of prompt refinement (open-source in yuno-docs)

**Total cost:** $0

**Lesson:** Don't blame your tools. Blame your workflow. A clear workflow with free tools beats a vague workflow with expensive tools.

---

## 2. Plan Mode + YOLO Mode Is the Perfect Combo

Qwen Code has two modes:
- **Plan mode** — Thinks before coding, structures the approach
- **YOLO mode** — Executes rapidly without overthinking

**My workflow:**
1. Start in Plan mode for architecture decisions
2. Switch to YOLO mode for implementation
3. Back to Plan mode when stuck
4. YOLO mode again for fixes

**Lesson:** Different tasks need different modes. Architecture needs planning. Implementation needs momentum. Learn when to use each.

---

## 3. Testing Is Your Job (Not the AI's)

**Mistake I almost made:** Trusting Qwen's output without testing.

**What I actually did:**
1. Qwen implements a feature
2. I test it thoroughly
3. I find bugs → report them precisely
4. I propose fixes → "Add debounced save with 800ms delay"
5. Qwen fixes
6. I test again
7. Repeat until right

**Lesson:** AI is the builder. You are the QA. Never skip testing.

---

## 4. Bug Reports Are a Skill

**Bad bug report:**
> "Brief autosave broken"

**Good bug report:**
> "Brief autosave not working. Steps: 1) Open project 2) Navigate to Brief tab 3) Type in problem field 4) Refresh page. Expected: Content persists. Actual: Content lost. Fix: Add debounced save with 800ms delay."

**Lesson:** Learn to write precise bug reports. It saves hours of back-and-forth.

---

## 5. Redesigns Are Normal (Not Failures)

First version of the Build Module:
- Too cramped
- Hard to read prompts
- No collapsible stages

I requested a redesign:
> "Make cards collapsible. Add better spacing. Show progress more clearly."

Qwen implemented it. I tested. Requested another tweak. Final result: the sequential build workflow you see today.

**Lesson:** Don't accept the first output. Request redesigns. Iterate until it's right.

---

## 6. Claude Desktop for Explanations, Qwen for Building

I used each tool for its strength:

**Qwen Code:**
- Building features
- Following structured prompts
- Rapid iteration

**Claude Desktop:**
- Explaining why something broke
- Debugging complex issues
- Second opinion on architecture

**Lesson:** Use the right tool for the right job. Don't force one tool to do everything.

---

## 7. The Workflow Is Months in the Making

Preflight took 3 days to build. But the workflow behind it took **months** to refine.

**Timeline:**
- **Months 1-2:** Messy vibe coding, learning what doesn't work
- **Months 3-4:** Creating prompts to solve chaos
- **Month 5:** Open-sourcing as yuno-docs (Bolt hackathon)
- **Months 6-8:** Using workflow to build apps, refining prompts
- **Month 9:** Realizing the workflow should be the product
- **3 days:** Building Preflight

**Lesson:** "Overnight success" is a myth. The 3-day build was possible because of months of iteration before.

---

## 8. Structure Beats Talent

I'm not a genius developer. I'm a developer with **structure**.

The yuno-docs workflow gave me:
- Clear brief template
- Research prompt structure
- Design prompt format
- Sequential build process

Anyone can follow this structure. You don't need to be talented — you need to be structured.

**Lesson:** Don't rely on talent. Rely on structure. Structure scales. Talent doesn't.

---

## 9. AI Amplifies You, Doesn't Replace You

**What AI did:**
- Generated boilerplate
- Implemented features from prompts
- Fixed bugs I reported
- Refactored when I requested

**What I did:**
- Defined what to build
- Tested every feature
- Reported bugs precisely
- Requested redesigns
- Proposed new features
- Made architectural decisions

**Lesson:** AI amplifies your output. But you're still the architect, the tester, the product manager.

---

## 10. Ship Then Iterate

**Perfectionist approach:**
> "I need to plan everything perfectly before building."

**My approach:**
> "Build in 3 days. Ship. Test. Fix. Iterate."

Preflight wasn't perfect after 3 days. It was **complete**. The perfection came from weeks of iteration after shipping.

**Lesson:** Don't wait for perfect. Ship fast. Iterate based on real use.

---

## The Meta Lesson: Build the Builder

The most surprising insight from building Preflight:

> **The best way to learn AI-assisted development is to build a tool for AI-assisted development.**

By encoding my workflow into Preflight, I was forced to:
- Articulate vague intuitions ("structure your prompts better")
- Identify patterns ("always do foundation before features")
- Document decisions ("why we use Dexie instead of Supabase")

The tool became the teacher. Building Preflight taught me how to build with AI.

---

## Apply These Lessons

Want to apply these lessons?

1. **Get Qwen Code** — It's free
2. **Learn Plan/YOLO modes** — Use each appropriately
3. **Create your workflow** — Structured prompts for your use case
4. **Test everything** — Be the QA
5. **Write precise bug reports** — Save hours of debugging
6. **Request redesigns** — Don't accept the first output
7. **Ship fast, iterate** — Perfection comes after shipping

---

## The Real Secret

The secret isn't Qwen Code. It isn't Claude Desktop. It isn't even the prompts.

**The real secret is: iteration.**

Build → Test → Bug Report → Fix → Redesign → Iterate → Repeat

That's how Preflight was built. That's how you can build too.

---

**Previous:** [Self-Dogfooding](self-dogfooding.md)

**Back to:** [Documentation Index](../README.md)
