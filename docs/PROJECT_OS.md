# Preflight - The Project OS for Vibe Coders

Preflight is an open-source, local-first tool designed to structure the workflow of "vibe coding"—using AI coding assistants (like Lovable, Bolt, Cursor, Replit, v0) to build applications. It guides you through a sequential process from raw idea to a production-ready build package.

---

## 🚀 Quick Start

### 1. Installation
Ensure you have **Node.js 20+** and **pnpm** installed.

```bash
git clone https://github.com/Meykiio/preflight.git
cd preflight
pnpm install
pnpm dev
```
Open `http://localhost:5173` to begin.

### 2. Setup AI Providers
Preflight is **BYOK** (Bring Your Own Key).
1. Navigate to **Settings → AI Providers**.
2. Add your API keys for Anthropic, OpenAI, or Google Gemini.
3. Set a default provider.
*Note: Your keys are encrypted and stored locally in your browser.*

### 3. Your First Project
1. Go to the **Project Hub** and click **"New Project"**.
2. Define your project name, target platforms, and tech stack.
3. Follow the pipeline: **Brief → Research → Design → PRD → Build**.

---

## 🏗️ Core Modules

### 1. Brief
Capture the problem, target users, and core features. Use **"Import from Idea"** to extract a structured brief from raw text or markdown files.

### 2. Research
Generate optimized prompts for Perplexity or Gemini Deep Research. Inject your brief and tech stack as context to get high-signal architectural and competitive analysis.

### 3. Design
Generate UI/UX design prompts for Stitch, v0, or Figma AI. Context-aware prompts ensure your design aligns with your brief and research.

### 4. PRD & System
Generate a comprehensive Product Requirements Document (PRD) with auto-derived data models. From the PRD, generate **System Instructions** (`.cursorrules`, `CLAUDE.md`) tailored to your build platform.

### 5. Build Workflow
Generate a multi-stage, sequential build plan:
- **Foundation:** Environment & scaffolding.
- **Database:** Schema & Auth setup.
- **Features:** Modular implementation of core features.
- **Audit & Polish:** Performance, accessibility, and UI refinement.

### 6. Vault
Local storage for research results, design assets, and export packages. Files in the Vault can be "activated" to be included in future AI generations as context.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend:** React 18.3 + TypeScript
- **Build Tool:** Vite 6.2
- **Styling:** Tailwind CSS 3.4 (Dark-only theme)
- **State Management:** Zustand 5.0
- **Database:** Dexie.js (IndexedDB) for local-first storage
- **Testing:** Vitest

### Folder Structure
- `src/components/`: Domain-specific UI (Hub, Workspace, Onboarding).
- `src/services/`: AI provider abstractions and prompt generation logic.
- `src/stores/`: Zustand stores for project and UI state.
- `src/lib/`: Database schema, security utilities, and shared helpers.

### Security Model
- **Local-First:** All project data remains in your browser's IndexedDB.
- **Encrypted Keys:** AI API keys are encrypted using the Web Crypto API before being persisted to local storage.
- **Privacy:** No data is sent to Preflight servers; communication happens directly between your browser and AI providers.

---

## 🤖 Claude Skills Integration

Use Preflight conversationally in Claude Desktop:
1. Go to **Settings → Claude Skills**.
2. Download `preflight-interactive-SKILL.md`.
3. Follow the instructions in Claude Desktop to add it as a skill.

---

## 🔧 Troubleshooting & FAQ

**"No AI provider configured"**
Ensure you've added an API key in Settings and marked it as the default provider.

**"Data persistence issues"**
Preflight uses IndexedDB. If you clear your browser data or use Incognito mode, your projects may be lost. Use **Settings → Storage → Export JSON** for backups.

**"Encryption Error"**
If you encounter encryption errors, try resetting your AI keys in Settings. This can happen if the browser's local storage salt is cleared.

---

## 📜 License
Preflight is open-source software licensed under the [MIT License](../LICENSE).
