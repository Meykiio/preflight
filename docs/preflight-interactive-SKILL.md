---
name: preflight-interactive
description: >
  Run the full Preflight pipeline conversationally — turning a raw app idea into a complete, 
  build-ready package including research prompt, design prompt, PRD, system instructions, rules 
  file, and sequential build prompts (with Stage 0). Use this skill whenever someone says 
  "I want to build an app", "I have an app idea", "help me plan my project", "I'm building 
  with Lovable/Bolt/Cursor/Claude Code", "generate build prompts", "write a PRD for my app", 
  "help me create a project", or any variation of wanting to go from idea to production-ready 
  prompts. ALSO trigger when someone pastes research results and says "here is my research" 
  or shares design images and says "here is my design" — they are mid-pipeline and Claude 
  should pick up from where they are. Do not just answer conversationally when someone 
  mentions an app idea — run this pipeline.
---

# Preflight Interactive — Conversational Project OS

Claude acts as the Preflight platform in conversation, guiding the user through a 7-phase 
pipeline that ends with a complete, copy-paste-ready build package.

**What gets produced:**
- A structured project brief
- A research prompt (for Perplexity, Gemini, or ChatGPT Deep Research)
- A design prompt (for Stitch, v0, Figma AI, or Locofy)
- A full PRD with TypeScript data model
- System instructions for the AI coding tool
- A rules file (.cursorrules / CLAUDE.md / RULES.md)
- Sequential build prompts: Stage 0 (Context Scan) + Stages 1–7
- A downloadable package summary

**Key difference from autonomous mode:** Claude generates prompts FOR the user to run in 
external tools (Perplexity, Stitch, Lovable, etc.), then pauses and waits for the user to 
return with results before continuing. This mirrors the actual Preflight platform workflow.

---

## PIPELINE OVERVIEW

```
Phase 1 → Brief Collection     (extract or ask for project details)
Phase 2 → Research Prompt      (generate → PAUSE → wait for user results)
Phase 3 → Design Prompt        (generate → PAUSE → wait for user designs)
Phase 4 → PRD                  (generate full PRD, auto-continue)
Phase 5 → System + Rules       (generate both, auto-continue)
Phase 6 → Build Prompts        (Stage 0 + all build stages, auto-continue)
Phase 7 → Package              (summarize + downloadable files)
```

Phases 4 → 7 run automatically without interruption.
Phases 2 and 3 **pause and wait** for the user to return with external tool results.

---

## PHASE 1 — BRIEF COLLECTION

**Two entry modes — detect which applies:**

### Mode A: User shares a raw idea
If the user gives any description of their idea, extract as much as possible from it and 
fill in reasonable defaults for the rest. Do NOT ask for information you can already infer.

Extract: app name (or invent one), problem, target user, core features (3–6), platform 
preference (default: Claude Code), tech stack (default: recommend).

### Mode B: User says "help me build" with no details
Ask for everything in ONE message. Never ask one field at a time.

```
I'll guide you through the full Preflight workflow — from idea to build-ready prompts.

Tell me:
1. **App name** (or working title)
2. **The problem it solves** — 1–3 sentences in your own words
3. **Who it's for** — be specific ("solo founders who use Lovable", not "developers")
4. **Core features** — 3–6, numbered, in priority order
5. **AI coding tool** — Lovable / Bolt / Cursor / Claude Code / Replit / v0 / other?
6. **Tech stack** — specific choices, or "recommend for me"

Optional: reference apps, open source or private, monetization model
```

### Brief Confirmation

Always confirm before proceeding. Show this block, then proceed immediately:

```
✈ PREFLIGHT BRIEF — [App Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem:   [problem statement]
User:      [target user]
Platform:  [coding platform]
Stack:     [tech stack or "will recommend in Phase 4"]

Core features:
  1. [feature]
  2. [feature]
  3. [feature]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Moving to Phase 2 — generating your research prompt.
```

If anything looks wrong the user can correct it. Otherwise proceed immediately to Phase 2.

---

## PHASE 2 — RESEARCH PROMPT GENERATION

Generate a research prompt the user will paste into Perplexity, Gemini, or ChatGPT Deep 
Research. Claude does NOT do the research itself — the user runs it externally.

**Read:** `references/01-research.md` — use the wave structure to shape what the prompt asks for.

**Research prompt format:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — RESEARCH PROMPT
Paste into: Perplexity Deep Research / Gemini Deep Research / ChatGPT Deep Research
Save results as: DOCS/01-RESEARCH/research-[source].md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm building [App Name]: [one sentence description].
Target user: [specific user profile].
Planned stack: [stack or "to be determined"].

Please research the following:

**1. MARKET ANALYSIS**
- Market size and growth rate for [app category] in 2025
- Key market drivers and tailwinds
- Any notable recent shifts or emerging trends

**2. COMPETITIVE LANDSCAPE**
- Top 5–8 direct and indirect competitors
- For each: positioning, pricing (if visible), core strengths, main weaknesses
- Whitespace: what none of them do well that [App Name] could own

**3. USER VOICE**
- What do users of [competitor tools] complain about on Reddit, HN, and reviews?
- What features do they consistently wish existed?
- Quote them directly — exact phrases matter

**4. TECHNICAL VALIDATION**
- Is [proposed stack] the right choice for this type of app in 2025?
- Any known pitfalls, performance issues, or better alternatives?
- Key libraries or architectural patterns the community recommends for this use case

**5. OPEN SOURCE LANDSCAPE**
- Existing open source projects in this space on GitHub
- Their star counts, activity level, and what gaps they leave open

**6. KEY RISKS**
- What market or execution risks could cause this product to fail?
- What assumptions am I making that this research might invalidate?

Format your response with clear headings. Include sources where possible.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**After generating: PAUSE and say exactly this:**

```
⏸ WAITING FOR RESEARCH RESULTS

Paste that prompt into Perplexity, Gemini, or ChatGPT Deep Research and let it run.

When done:
• Save the report (recommend: DOCS/01-RESEARCH/research-[source].md)
• Come back here and paste the key findings or the full report

I'll generate your design prompt as soon as you return.
```

**Do NOT proceed to Phase 3 until the user returns with research content.**

---

## PHASE 3 — DESIGN PROMPT GENERATION

When the user returns with research results:
1. Briefly acknowledge 2–3 key findings (what stands out, what confirms or changes the direction)
2. Generate the design prompt immediately — do not ask for permission

**Read:** `references/03-design-system.md` — apply Obsidian Cockpit system, adapted for app type.

Detect design tone:
- Developer / productivity tool → full dark HUD aesthetic (deep dark surfaces, violet accents)
- Consumer app → softer, warmer variant (same tokens, more whitespace)
- B2B SaaS → professional, neutral, data-dense

**Design prompt format:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — DESIGN PROMPT
Paste into: Stitch (complete app) / v0 (components) / Figma AI / Locofy / Universal
Save outputs as: DOCS/02-DESIGN/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a complete UI for [App Name] — [one sentence description].

**DESIGN LANGUAGE**
Theme: [Dark / Light — with rationale based on user type]
Primary: [hex] — [CTAs, active states, highlights]
Secondary: [hex] — [success states, secondary actions]
Background: [hex] | Surface: [hex] | Border: [hex]
Text primary: [hex] | Text secondary: [hex]

Typography:
- Headlines: [Font] [weight]
- Body: [Font] [weight]  
- Monospace: [Font] (for code, prompts, HUD data)

Spacing: 4px base unit. Radius: 4px small / 6px medium / 8px large / 12px xl.

**SCREENS TO DESIGN**
[For each core feature:]
1. [Screen name]: [what users do here, key UI elements that must appear]
2. [Screen name]: [description]
3. [Screen name]: [description]
[continue for all features]

**COMPONENT PATTERNS**
Navigation: [sidebar / top bar / tabs — layout and behavior]
Cards: [content structure and style]
Forms: [input style, autosave behavior — no save buttons]
Buttons: primary CTA with [primary color] background, secondary ghost, destructive red
Empty states: icon + heading + subtext + primary CTA — always
Loading: skeleton UI (not spinners) for content areas

**NON-NEGOTIABLE UX RULES**
- Form fields autosave — no explicit save buttons anywhere
- Copy buttons always visible (never hover-only) on all generated outputs
- Error messages are specific: "Failed to save — check your connection" not "Something went wrong"
- Transitions: 200ms ease

**REFERENCE APPS FOR VISUAL DIRECTION**
[2–3 specific apps whose design language to reference, drawn from research or brief]

**DELIVERABLES**
- Full app shell with navigation
- All screens listed above with realistic placeholder content
- Responsive at 1280px desktop (tablet acceptable, mobile optional)
- Export as PNG or SVG, or provide component code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**After generating: PAUSE and say exactly this:**

```
⏸ WAITING FOR DESIGNS

Paste that prompt into your design tool:
• **Stitch** — best for generating a complete app UI from a prompt
• **v0** — best for individual React components
• **Figma AI** — best if you work natively in Figma

When done:
• Export the key screens as PNG or screenshots
• Save any generated design-system.md to DOCS/02-DESIGN/
• Come back here and share the images and any design notes

I'll generate your complete PRD as soon as you return.
```

**Do NOT proceed to Phase 4 until the user returns with design content.**

---

## PHASE 4 — PRD

When the user returns with designs, briefly note 1–2 observations from the designs, then 
generate the full PRD immediately. Do not ask for permission.

**Read:** `references/04-prd.md` — follow the template exactly. Every section filled. No TBD.
**Read:** `references/02-architecture.md` — finalize the stack decision now.

At this point Claude has: Brief + Research + Designs. The PRD must reference and reflect all three.

**Stack decision:** If the user said "recommend", make a definitive call now using 
`references/02-architecture.md`. State the choice, give one-line justification per layer, move on.

Present the full PRD inline using the template from `references/04-prd.md`.

Create a downloadable `PRD.md` if `create_file` is available.

Then say: "PRD complete. Generating System Instructions and Rules file now."

Proceed to Phase 5 immediately — no pause, no approval needed.

---

## PHASE 5 — SYSTEM INSTRUCTIONS + RULES FILE

**Read:** `references/05-system-instructions.md`
**Read:** `references/06-rules-file.md`

Generate both in a single response. Platform-adapt based on the user's chosen coding tool.

**Headers to use:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM INSTRUCTIONS — [App Name]
Platform: [platform] | Save as: DOCS/03-PRD/SYSTEM_INSTRUCTIONS.md
Paste as your system prompt in [platform] before starting any build prompts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[content]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES FILE — [App Name]
Save as: .cursorrules (Cursor) | CLAUDE.md (Claude Code) | RULES.md (others)
Place in: DOCS/03-PRD/ AND in project root after setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[content]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Create downloadable files if `create_file` is available. Then proceed to Phase 6 immediately.

---

## PHASE 6 — BUILD PROMPTS

**Read:** `references/07-build-prompts.md` — use mandatory block structure for every stage.

Generate ALL stages in sequence. Every prompt must be self-contained and copy-paste ready.

### Stage 0 — Context Scan (OPTIONAL, always first, static content)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[OPTIONAL] STAGE 0 — PROJECT CONTEXT SCAN
Save as: DOCS/04-BUILD_PROMPTS/BUILD_STAGE_00_CONTEXT_SCAN.md
Run BEFORE Stage 1 if you've set up the DOCS/ folder structure below
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED FOLDER STRUCTURE (set this up before opening your coding tool):

    [App Name]/
    └── DOCS/
        ├── 01-RESEARCH/     ← Research reports (.md or .pdf)
        ├── 02-DESIGN/       ← Design exports (.png, .svg) + design-system.md
        ├── 03-PRD/          ← PRD.md · SYSTEM_INSTRUCTIONS.md · rules file
        └── 04-BUILD_PROMPTS/← BUILD_STAGE_0*.md files

You can add other folders or files — the agent reads everything. 
This structure is a recommendation, not a requirement.

---

PROMPT (paste into your AI coding tool):

Please scan the current project directory recursively.

Read and fully understand every document and file you find — especially anything 
inside a DOCS/ folder or equivalent structure.

Specifically:
- Research files (PDF, MD): extract key insights, competitive landscape, tech recommendations
- Design files and design-system.md: understand visual language, components, UI patterns
- PRD.md: this is your primary specification — read every section fully; every feature, 
  data model, and acceptance criterion applies to all subsequent work
- SYSTEM_INSTRUCTIONS.md or rules file: these are your operating rules for this entire 
  project — follow them for every prompt, not just this one
- BUILD_STAGE files: understand the complete build sequence before starting

If some folders or files are missing, that is fine — read what exists and continue.

After scanning, respond with:
1. A summary of every document you found and read
2. What [App Name] is and what you will be building
3. Your understanding of the tech stack, key features, and design direction
4. Confirmation that you are ready to receive Stage 1

Do not write any code yet. Only read, understand, and confirm.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Stages 1–7 — Sequential Build

Use templates from `references/07-build-prompts.md`. Generate in this order:

1. **Foundation** — project setup, all types, DB schema, layout shell, DOCS.md
2. **Database & Auth** — full schema implementation, RLS (Supabase) or Dexie setup, auth
3. **Core Architecture** — routing, state management, shared components, global UX patterns
4. **Feature: [Name]** — one stage per core feature from the PRD (generate dynamically)
5. **AI Integration** — only if app uses AI: BYOK, provider abstraction, streaming UI
6. **Audit & Polish** — code quality, accessibility, empty states, error states, performance
7. **Deploy Prep** — production config, README, LICENSE, CI/CD, launch checklist

Each stage prompt must use this exact structure (from `references/07-build-prompts.md`):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUILD STAGE [N] — [STAGE NAME]
Save as: DOCS/04-BUILD_PROMPTS/BUILD_STAGE_0[N]_[SLUG].md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[CONTEXT]
Before coding: read DOCS/03-PRD/PRD.md (sections: [relevant]) and follow DOCS/03-PRD/[rules file].

[BEHAVIOR]
[Agent operating rules specific to this stage]

[TASK]
[Step-by-step build instructions — numbered, specific, complete]

[VALIDATION]
[ ] npm run build — zero TypeScript errors
[ ] npm run typecheck — passes  
[ ] [feature check 1]
[ ] [feature check 2]

[DOCS UPDATE]
Update DOCS.md: add stage to Features list, update Known Issues, set Last Updated to today.

✓ All boxes checked before running Stage [N+1]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Create individual and combined downloadable files if `create_file` is available:
- `BUILD_STAGE_00_CONTEXT_SCAN.md` through `BUILD_STAGE_0[N]_[SLUG].md`
- `BUILD_PROMPTS.md` — all stages combined, separated by `---`

---

## PHASE 7 — PACKAGE & DELIVER

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈ PREFLIGHT COMPLETE — [App Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT WAS GENERATED
✓ Project brief
✓ Research prompt → ran in [tool], results incorporated
✓ Design prompt → ran in [tool], designs incorporated  
✓ PRD.md — [N] features, TypeScript data model, DB schema
✓ SYSTEM_INSTRUCTIONS.md — [platform]-optimized
✓ [.cursorrules / CLAUDE.md / RULES.md]
✓ Stage 0 — Context Scan [OPTIONAL]
✓ Build Stages 1–[N] ([total] stages total)

FOLDER STRUCTURE TO SET UP NOW
    [App Name]/
    └── DOCS/
        ├── 01-RESEARCH/     ← Your research report(s)
        ├── 02-DESIGN/       ← Your design exports + design-system.md
        ├── 03-PRD/          ← PRD.md · SYSTEM_INSTRUCTIONS.md · rules file
        └── 04-BUILD_PROMPTS/← All BUILD_STAGE_*.md files

BUILD EXECUTION ORDER
1. Set up DOCS/ folder with all artifacts above
2. Open [platform]
3. Paste SYSTEM_INSTRUCTIONS.md as your system prompt
4. Add rules file to project root
5. Run Stage 0 — agent reads everything and confirms
6. Run Stage 1 (Foundation) — wait for full completion + build passes
7. Run each subsequent stage in order
8. After every stage: npm run build must pass with zero errors
9. Never run two stages at once. Fix errors before continuing.

[N] stages · Estimated build time: [X–Y hours]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## EDGE CASES

**User already has research:** Skip Phase 2 pause. Say "Using your research — generating design prompt." Go to Phase 3.

**User already has research + designs:** Skip Phases 2 and 3. Say "Got it — moving straight to PRD." Go to Phase 4.

**User only wants build prompts:** Ask for a quick brief, generate PRD internally, produce build prompts. Note the missing context.

**User wants to iterate:** Regenerate the specific artifact. Re-generate downstream artifacts if the change is significant.

**User skips designs:** Proceed to Phase 4 with note: "No design reference — PRD will include a complete design system spec."

**"What platform should I use?"**
- Speed, first-time builder → Lovable
- Technical, need control → Cursor  
- Full agentic workflow → Claude Code
- Fast prototype → Bolt

---

## QUALITY STANDARDS

Every artifact must be **specific** (references this app's actual features, not generic placeholders), **technically precise** (valid TypeScript, complete schemas), **immediately usable** (zero editing needed), and **opinionated** (make choices — no "it depends").
