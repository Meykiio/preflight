<div align="center">

# ✈ Preflight

**Your launchpad. Every build.**

*The open-source Project OS for vibe coders — from raw idea to production-ready build package.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

[Documentation](docs/README.md) · [Report Bug](https://github.com/Meykiio/preflight/issues) · [Request Feature](https://github.com/Meykiio/preflight/issues)

</div>

---

## What is Preflight?

**Preflight is not a coding tool. It's the layer that precedes coding.**

If you use AI coding assistants like Lovable, Bolt, Cursor, Claude Code, Replit, or v0, you know the frustration: chaotic prompts, fragmented context, and builds that go nowhere. Preflight solves this by providing a **structured project operating system** that transforms your raw idea into a complete, AI-ready build package.

**The Problem:** Vibe coding without structure leads to abandoned projects. You jump between research, design, and coding without a clear plan. Context gets lost. Builds stall.

**The Solution:** Preflight guides you through a proven sequence: capture a structured brief → generate research prompts → create design prompts → write a PRD → generate system instructions → produce sequential build prompts. Each step builds on the last, with all context preserved.

**Who It's For:** Builders who use AI coding tools and want to ship complete projects, not just prototypes. Solo founders, indie hackers, and developers who want AI to amplify their output, not replace their judgment.

---

## Features

| Module | What It Does |
|--------|-------------|
| 📝 **Brief** | Structured idea capture — problem, users, features, stack — with autosave |
| 🔬 **Research** | Generates deep research prompts for Perplexity, Gemini, ChatGPT Deep Research |
| 🎨 **Design** | Creates design prompts for Stitch, v0, Figma AI, Locofy, Universal |
| 📋 **PRD** | Full product requirements document with TypeScript data models |
| ⚙️ **System** | System instructions + .cursorrules / CLAUDE.md for your AI coding tool |
| 🏗️ **Build** | Sequential build workflow: Foundation → Database → Features → Audit → Deploy |
| 🗄️ **Vault** | Project file storage with context injection for generations |
| 🔐 **BYOK** | Bring your own key — Anthropic, OpenAI, Google, DeepSeek, Groq, custom |

### Platform Support

Preflight generates platform-adapted prompts for:
- **AI Coding:** Lovable, Bolt, Cursor, Claude Code, Replit
- **AI Design:** Stitch, v0, Figma AI, Locofy, Uizard
- **AI Research:** Perplexity Deep Research, Gemini Deep Research, ChatGPT Deep Research

---

## Quick Start

### Prerequisites

- **Node.js 20+** ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Meykiio/preflight.git
cd preflight

# Install dependencies
pnpm install

# Copy environment example (optional - works without env vars)
cp .env.example .env

# Start development server
pnpm dev
```

Open **http://localhost:5173** → Complete onboarding → Create your first project.

**No environment variables required.** Everything runs locally in your browser. Add AI provider keys in Settings after onboarding.

---

## Usage Guide

### 1. Create a Project

1. Click **New Project** on the Project Hub
2. Enter name and description
3. Select target platforms (Lovable, Bolt, Cursor, etc.)
4. Add tech stack tags (React, Tailwind, Supabase, etc.)
5. Click **Create Project**

### 2. Fill the Brief

1. Navigate to the **Brief** tab
2. Define the problem you're solving
3. Describe target users (who, technical level, current solution)
4. List core features (ordered by priority)
5. Add tech stack hints and target platforms
6. Add notes (optional)

> 💡 **Tip:** The completion indicator shows when your brief is ready. Aim for 80%+ before proceeding.

### 3. Generate Research

1. Go to **Research** tab
2. Select context nodes (Brief, Tech Stack, User Personas)
3. Click **Generate Research Prompt**
4. Copy the generated prompt
5. Paste into Perplexity, Gemini, or ChatGPT Deep Research
6. Upload research results to the Vault

### 4. Generate Design

1. Navigate to **Design** tab
2. Select target platform (Stitch, v0, Figma AI, etc.)
3. Choose context nodes (Brief, Research Results)
4. Click **Generate Design Prompt**
5. Copy and paste into your design platform
6. Upload design outputs to the Vault

### 5. Generate PRD & System

1. Go to **PRD** tab
2. Click **Generate PRD** — wait for completion
3. Select platform for System Instructions
4. Click **Generate System Instructions**
5. Generate Rules File for your platform
6. Copy all generated content

### 6. Build Your App

1. Navigate to **Build** tab
2. Click **Generate Full Build Workflow**
3. Review generated stages
4. Start with Stage 1 (Foundation)
5. Copy prompt and paste into AI coding tool
6. Mark stages complete as you progress

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.3 + TypeScript |
| **Build** | Vite 6.2 |
| **Styling** | Tailwind CSS 3.4 |
| **State** | Zustand 5.0 |
| **Database** | Dexie.js 4.0 (IndexedDB) |
| **Routing** | React Router 6.30 |
| **AI SDKs** | OpenAI, Anthropic, Google |
| **Testing** | Vitest 4.1 |

### Design System

- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- **Theme:** Dark only (optimized for long coding sessions)
- **Icons:** Material Symbols Outlined
- **Components:** Custom + shadcn/ui patterns

---

## Configuration

All optional. Preflight works fully offline without any environment variables.

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `VITE_SUPABASE_URL` | No | Supabase dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase dashboard → Settings → API |

**AI Provider Keys:** Added in-app via Settings → AI Providers. Stored encrypted in your browser's IndexedDB — they never leave your device except when calling official provider APIs.

---

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git add . && git commit -m "feat: initial release" && git push origin main

# Import in Vercel dashboard
# Build settings auto-detected
```

### Netlify

```bash
# Push to GitHub
# Connect repo in Netlify
# Build command: npm run build
# Publish directory: dist
```

### Self-Hosted

```bash
npm run build
# Copy dist/ to any static file server
# Configure SPA rewrites (all routes → index.html)
```

---

## Development

```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Production build
pnpm build

# Preview production build
pnpm preview
```

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full workflow.

### Ways to Contribute

- 🐛 **Bug Reports** — File issues for bugs
- 💡 **Feature Requests** — Suggest improvements
- 📝 **Documentation** — Fix typos, add examples
- 🎨 **UI/UX** — Design improvements
- ⚡ **Performance** — Optimization suggestions
- 🧪 **Tests** — Add test coverage

### Before Submitting a PR

```bash
pnpm typecheck   # Zero TypeScript errors
pnpm test        # All tests pass
pnpm build       # Clean production build
```

Update documentation in `docs/` with your changes.

---

## How This Was Built

**Preflight was built in 3 days using [Qwen Code](https://github.com/QwenLM/Qwen) — a free, open-source AI pair programmer.**

I toggled between **Plan mode** (for architecture) and **YOLO mode** (for rapid implementation). When stuck, I used **Claude Desktop** for explanations. After each feature, I tested thoroughly, reported bugs, requested redesigns, and iterated until it was right.

The workflow I followed wasn't new — it was refined over **months** of building apps with AI, open-sourced as [yuno-docs](https://github.com/sifeddinemeb/yuno-docs) during the Bolt hackathon. Preflight is that workflow turned into a platform.

Read the full story in [**Behind the Scenes**](docs/behind-the-scenes/):
- [Origin Story: From yuno-docs to Preflight](docs/behind-the-scenes/origin-story.md)
- [3-Day Build with Qwen Code](docs/behind-the-scenes/vibe-coding-workflow.md)
- [Using Preflight to Rebuild Preflight](docs/behind-the-scenes/self-dogfooding.md)
- [Lessons Learned](docs/behind-the-scenes/lessons-learned.md)

---

## Roadmap

### Q2 2026
- [ ] Template marketplace (pre-built project templates)
- [ ] AI chat assistant for brief filling
- [ ] Advanced analytics dashboard
- [ ] More AI provider integrations

### Q3 2026
- [ ] Cloud sync with Supabase (optional)
- [ ] Team collaboration features
- [ ] Plugin system
- [ ] Multi-language support

---

## Acknowledgments

Built with ❤️ using [Qwen Code](https://github.com/QwenLM/Qwen) (Plan mode + YOLO mode) and [Claude Desktop](https://claude.ai/download).

**Workflow ancestor:** [yuno-docs](https://github.com/sifeddinemeb/yuno-docs) — open-source prompts from the Bolt hackathon

**Inspired by:**
- [Lovable](https://lovable.dev)
- [Bolt](https://bolt.new)
- [v0](https://v0.dev)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ⚡ by the Preflight Team**

If you find Preflight useful, please consider giving it a ⭐️!

[Documentation](docs/README.md) · [Report Bug](https://github.com/Meykiio/preflight/issues) · [Request Feature](https://github.com/Meykiio/preflight/issues)

</div>
