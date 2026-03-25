# Preflight User Guide

**Welcome to Preflight!** This guide will help you get the most out of your project operating system.

---

## 📚 Quick Navigation

| Module | Description | Get Started |
|--------|-------------|-------------|
| **[Project Hub](project-management.md)** | Manage all your projects in one place | [Create Your First Project](project-management.md#create-your-first-project) |
| **[Brief](brief-module.md)** | Capture your idea in a structured format | [Write a Great Brief](brief-module.md#write-a-great-brief) |
| **[Research](research-module.md)** | Generate deep research prompts | [Generate Research](research-module.md#generate-research-prompt) |
| **[Design](design-module.md)** | Create design prompts for AI tools | [Generate Design](design-module.md#generate-design-prompt) |
| **[PRD](prd-module.md)** | Generate product requirements docs | [Write PRD](prd-module.md#generate-prd) |
| **[Build](build-module.md)** | Sequential build workflow | [Start Building](build-module.md#start-sequential-build) |
| **[Vault](vault-module.md)** | Store and organize files | [Upload Files](vault-module.md#upload-files) |

---

## 🚀 Getting Started (5 Minutes)

### Step 1: Create Your First Project

1. Click **"New Project"** on the Project Hub
2. Enter a project name (e.g., "My SaaS App")
3. Add a brief description
4. Select target platforms (Lovable, Bolt, Cursor, etc.)
5. Click **"Create Project"**

### Step 2: Fill Out the Brief

1. Navigate to the **Brief** tab
2. Define the problem you're solving
3. Describe your target users
4. List 3-5 core features (ordered by priority)
5. Add tech stack hints (React, Tailwind, etc.)

> 💡 **Tip:** Aim for 80%+ completion score before moving to Research.

### Step 3: Generate Your First Prompt

1. Go to **Research** tab
2. Click **"Generate Research Prompt"**
3. Copy the generated prompt
4. Paste into Perplexity, Gemini, or ChatGPT

**That's it!** You've completed your first Preflight workflow.

---

## 📖 How Preflight Works

Preflight follows a **sequential workflow** that mirrors how experienced developers think about building software:

```
┌─────────────┐
│   Brief     │ → Define the problem and users
└──────┬──────┘
       ↓
┌─────────────┐
│  Research   │ → Gather market and technical intelligence
└──────┬──────┘
       ↓
┌─────────────┐
│   Design    │ → Create UI/UX specifications
└──────┬──────┘
       ↓
┌─────────────┐
│     PRD     │ → Write complete product requirements
└──────┬──────┘
       ↓
┌─────────────┐
│    Build    │ → Generate sequential build prompts
└──────┬──────┘
       ↓
┌─────────────┐
│    Vault    │ → Store all artifacts for reference
└─────────────┘
```

**Each step builds on the previous one.** Don't skip steps — the context accumulation is what makes Preflight powerful.

---

## 💡 Best Practices

### 1. Complete Each Module Before Moving On

It's tempting to jump straight to Build, but resist the urge. Each module adds critical context:

- **Brief** → Ensures you know WHAT you're building and WHY
- **Research** → Validates assumptions and identifies blind spots
- **Design** → Defines the visual language and UX patterns
- **PRD** → Specifies exact requirements for AI coding tools
- **Build** → Generates prompts that produce production-ready code

### 2. Be Specific in Your Brief

Vague briefs produce vague prompts. Instead of:

> ❌ "Build a project management tool"

Write:

> ✅ "Build a project management tool for solo developers who use AI coding assistants. Primary feature: structured brief capture with autosave. Secondary: research prompt generation. Stack: React, Tailwind, Dexie.js."

### 3. Use Context Injection

When generating prompts in later modules, **select context nodes** from previous modules:

- Research prompt → Include Brief context
- Design prompt → Include Brief + Research results
- PRD → Include Brief + Research + Design
- Build → Include ALL previous context

This creates a **compound effect** — each prompt is smarter than the last.

### 4. Save Everything to Vault

Upload research reports, design exports, and reference materials to the Vault. Mark important files as **"Active Context"** to include them in future generations.

### 5. Iterate on Generated Prompts

The first generated prompt is a starting point. Read it carefully and:

- Add missing details
- Remove irrelevant sections
- Adjust tone for your specific AI tool
- Include project-specific constraints

---

## 🎯 Module Quick Reference

### Project Hub
- **Purpose:** Organize and track all projects
- **Key Features:** Grid/list view, status tracking, JSON import/export
- **Keyboard Shortcut:** `⌘N` (New Project)

### Brief
- **Purpose:** Capture structured project requirements
- **Key Features:** Autosave, completion scoring, feature prioritization
- **Completion Target:** 80%+ before proceeding

### Research
- **Purpose:** Generate deep research prompts
- **Key Features:** Context node selector, platform launchers, file upload
- **Output:** Research prompt for Perplexity/Gemini/ChatGPT

### Design
- **Purpose:** Create design prompts for AI tools
- **Key Features:** Platform variants (Stitch, v0, Figma AI), design history
- **Output:** Design prompt ready to paste

### PRD
- **Purpose:** Generate product requirements documents
- **Key Features:** Markdown rendering, system instructions, rules files
- **Output:** Complete PRD + .cursorrules/CLAUDE.md

### Build
- **Purpose:** Sequential build workflow
- **Key Features:** Stage tracking, prompt export, progress indicators
- **Output:** 5-stage build prompt sequence

### Vault
- **Purpose:** File storage with context injection
- **Key Features:** Upload, categorize, mark as active context
- **Supported:** PDF, MD, PNG, JSON, ZIP (max 10MB)

---

## 🔧 Tips & Tricks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `⌘N` | New project |
| `⌘S` | Save (Brief, Settings) |
| `⌘Enter` | Generate prompt |
| `⌘B` | Toggle sidebar |

### Error Recovery

If a generation fails:
1. **Don't panic** — Preflight saves progress automatically
2. Check the **ErrorRecoveryModal** for resume options
3. For network errors: wait a moment, then click **Retry**
4. For API key errors: update your key in Settings

### Offline Mode

Preflight works offline! You can:
- View all existing projects
- Edit briefs (autosaves locally)
- Browse vault files
- Review generated prompts

**Limitations:** AI generation requires internet connection.

---

## ❓ Common Questions

### "Do I need API keys to use Preflight?"

**No.** Preflight works fully offline without any API keys. You only need keys when generating AI prompts (Research, Design, PRD, Build modules).

### "Can I use Preflight with my existing AI tools?"

**Yes!** Preflight is platform-agnostic. Generated prompts work with:
- **AI Coding:** Lovable, Bolt, Cursor, Claude Code, Replit
- **AI Design:** Stitch, v0, Figma AI, Locofy
- **AI Research:** Perplexity, Gemini, ChatGPT

### "How do I share projects with my team?"

Currently, Preflight is **local-first** (data stored in your browser). To share:
1. Go to Project Hub
2. Click **Export** on a project
3. Share the JSON file with your team
4. They can **Import** it into their Preflight

Cloud sync is planned for a future release.

### "What happens if I close my browser mid-generation?"

Preflight **saves generation progress** every 500 tokens. When you return:
1. You'll see a **Resume Generation** prompt
2. Click **Resume** to continue from where you left off
3. Or **Start Over** to begin fresh

---

## 📞 Need Help?

- **Documentation:** You're reading it! Browse the module guides above.
- **Bug Reports:** [GitHub Issues](https://github.com/Meykiio/preflight/issues)
- **Feature Requests:** [GitHub Issues](https://github.com/Meykiio/preflight/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Meykiio/preflight/discussions)

---

**Next:** [Project Management Guide](project-management.md)

<div align="center">

**Built with ❤️ for vibe coders**

[Back to Documentation Index](../README.md)

</div>
