<div align="center">

# ✈️ Preflight

**Your launchpad. Every build.**

*The open-source Project OS for vibe coders — from raw idea to production-ready build package.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

[Documentation](docs/README.md) · [Report Bug](https://github.com/Meykiio/preflight/issues) · [Request Feature](https://github.com/Meykiio/preflight/issues)

<img src="public/assets/project-hub.png" alt="Preflight Project Hub" width="100%" style="border-radius: 12px; margin: 20px 0; border: 1px solid #333;" />

</div>

---

## What is Preflight?

**Preflight is the layer that comes before coding.**

If you use AI tools like Lovable, Bolt, Cursor, or Claude Code, you know how it feels when things get messy. Prompts get weird, you lose track of your plan, and the AI starts making mistakes because it doesn't have the full picture.

Preflight is a structured "Operating System" for your projects. It helps you turn a rough idea into a complete, AI-ready plan. No more "vibe coding" into a dead end.

### How it works:
1.  **Capture your idea** in a structured brief.
2.  **Generate research & design prompts** to get all your assets ready.
3.  **Create a solid PRD** and system instructions.
4.  **Follow a step-by-step build workflow** that keeps the AI on track.

---

## 📸 Guided Tour

### 1. Project Hub
Manage all your builds in one place. See exactly where each project stands.
<img src="public/assets/project-hub.png" alt="Project Hub" width="100%" style="border-radius: 8px; border: 1px solid #222;" />

### 2. The Brief
Don't just say "build an Uber for dogs." Preflight helps you define the problem, the users, and the actual features you need.
<img src="public/assets/brief-module.png" alt="Brief Module" width="100%" style="border-radius: 8px; border: 1px solid #222;" />

### 3. Deep Research & Design
Generate high-quality prompts for Perplexity or v0 to get the data and designs you need before you write a single line of code.
<div align="center">
  <img src="public/assets/research-module.png" alt="Research" width="48%" style="border-radius: 8px; border: 1px solid #222;" />
  <img src="public/assets/design-module.png" alt="Design" width="48%" style="border-radius: 8px; border: 1px solid #222;" />
</div>

### 4. PRD & System Setup
Generate a full Product Requirements Document and the exact `.cursorrules` or `CLAUDE.md` your AI agent needs to behave like a senior engineer.
<img src="public/assets/prd-module.png" alt="PRD Module" width="100%" style="border-radius: 8px; border: 1px solid #222;" />

### 5. Sequential Build
The magic part. Preflight breaks your build into logical stages: Foundation → Database → Features → Audit → Deploy. Paste these prompts one by one for a perfect build.
<img src="public/assets/build-module.png" alt="Build Workflow" width="100%" style="border-radius: 8px; border: 1px solid #222;" />

---

## ⚡ Quick Start

### 1. Install & Run
You'll need **Node.js 20+** and **pnpm** (or npm).

```bash
# Clone the repo
git clone https://github.com/Meykiio/preflight.git
cd preflight

# Install stuff
pnpm install

# Start it up
pnpm dev
```

### 2. Connect your AI
Go to **Settings → AI Providers** and add your keys (Anthropic, OpenAI, or Google). Your keys stay on your computer—they are never sent to our servers.

---

## 🛠 Tech Stack
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS (Dark Mode by default)
- **Database:** Dexie.js (Local-first, lives in your browser)
- **State:** Zustand

---

## ❓ Common Issues

### "Network Error" or "404" with Gemini
If you're getting a network error when connecting Google Gemini:
1.  Make sure your API key is correct from [Google AI Studio](https://aistudio.google.com/).
2.  Check if Gemini is available in your region.
3.  We've updated the model IDs—try selecting `gemini-1.5-pro` or `gemini-2.0-flash` from the list.

### Why is it local-only?
Because your project ideas and API keys are private. Preflight stores everything in your browser's IndexedDB. No accounts, no subscriptions, just you and your code.

---

## 🤝 Contributing
I'm just one person building this, so help is always welcome! Check out [CONTRIBUTING.md](.github/CONTRIBUTING.md) if you want to jump in.

---

<div align="center">

Made with ⚡ by the Preflight team.
If this helps you ship faster, give it a ⭐!

[Report a Bug](https://github.com/Meykiio/preflight/issues) · [Request a Feature](https://github.com/Meykiio/preflight/issues)

</div>
