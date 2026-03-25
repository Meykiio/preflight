# Getting Started with Preflight

Welcome to Preflight! This guide will help you get up and running in under 5 minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher — [Download](https://nodejs.org/)
- **pnpm** (recommended) or npm — [Install pnpm](https://pnpm.io/installation)
- **Git** — [Download](https://git-scm.com/)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/preflight/preflight.git
cd preflight
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required dependencies. It should take about 1-2 minutes.

### Step 3: Start Development Server

```bash
pnpm dev
```

Preflight will start and open in your default browser at `http://localhost:5176`.

## 🎯 Your First Project

### Create a Project

1. Click the **"New Project"** button
2. Fill in the project details:
   - **Name**: "My Awesome App"
   - **Description**: "A revolutionary app that..."
   - **Target Platforms**: Select your AI coding tools (Lovable, Bolt, Cursor, etc.)
   - **Tech Stack**: Add tags like "React", "Tailwind", "Supabase"
3. Click **"Create Project"**

### Fill Out the Brief

1. Navigate to the **Brief** tab
2. Complete these sections:
   - **The Problem**: What problem are you solving?
   - **Target User**: Who will use your app?
   - **Core Features**: List features in priority order
   - **Tech Stack Hints**: Your preferred technologies
   - **Target Platforms**: Where will you build?
3. Watch the completion indicator — aim for 100%

### Generate Research Prompt

1. Go to the **Research** tab
2. Select context nodes to include:
   - ✓ Brief (always include)
   - ✓ Tech Stack (if you have tech hints)
   - ✓ User Personas (if defined)
3. Click **"Generate Research Prompt"**
4. Copy the generated prompt
5. Paste into Perplexity, Gemini Deep Research, or ChatGPT
6. Upload research results to the Vault

### Generate Design Prompt

1. Navigate to the **Design** tab
2. Select your target platform:
   - Stitch (for bento-style layouts)
   - v0 (for React + Tailwind)
   - Figma AI (for design files)
   - Universal (platform-agnostic)
3. Select context nodes:
   - ✓ Brief
   - ✓ Research Results (if uploaded)
4. Click **"Generate Design Prompt"**
5. Copy and paste into your chosen platform
6. Upload design outputs to the Vault

### Generate PRD & System Instructions

1. Go to the **PRD** tab
2. Click **"Generate PRD"** — wait for completion
3. Select platform for System Instructions:
   - Universal (works with all platforms)
   - Lovable (optimized for Lovable)
   - Cursor (includes .cursorrules guidance)
   - Claude Code (includes CLAUDE.md guidance)
4. Click **"Generate System Instructions"**
5. Generate Rules File for your platform
6. Copy all generated content

### Build Your App

1. Navigate to the **Build** tab
2. Click **"Generate Full Build Workflow"**
3. Review the generated stages:
   - Stage 01: Foundation
   - Stage 02: Database & Auth
   - Stage 03-N: Feature Blocks
   - Stage N+1: Integration Layer
   - Stage N+2: Audit & Refactor
   - Stage N+3: Polish
4. Start with Stage 1:
   - Click **"Copy Prompt"**
   - Paste into your AI coding tool
   - Implement the generated code
   - Mark stage as complete
5. Continue through all stages
6. Export all prompts for reference

## ⚙️ Configuration

### Set Up AI Providers

1. Go to **Settings** → **AI Providers**
2. Add your API keys:
   - **Anthropic** (Claude) — [Get API Key](https://console.anthropic.com/settings/keys)
   - **OpenAI** (GPT-4) — [Get API Key](https://platform.openai.com/api-keys)
   - **Google** (Gemini) — [Get API Key](https://aistudio.google.com/app/apikey)
   - **DeepSeek** — [Get API Key](https://platform.deepseek.com/api_keys)
   - **Groq** — [Get API Key](https://console.groq.com/keys)
   - **Custom** — For OpenAI-compatible endpoints
3. Set a default provider
4. Test the connection

### Configure Platform Launchers

1. Go to **Settings** → **Platform Launchers**
2. Toggle platforms you use:
   - Lovable
   - Bolt
   - Cursor
   - v0
   - Replit
   - Perplexity
   - Gemini
   - ChatGPT
3. These will appear as quick-launch buttons

### Customize Agent Prompts

1. Go to **Settings** → **Agent Prompts**
2. Expand any agent category:
   - Generation Agents (Research, Design, PRD, etc.)
   - Build Agents (Foundation, Database, Feature, etc.)
3. Click **"Edit"** to customize prompts
4. Click **"Save"** to apply changes
5. Click **"Reset to Default"** to restore defaults

## 📚 Next Steps

### Learn More

- Read the [Architecture Guide](ARCHITECTURE.md) for technical details
- Check out the [Agent Prompts Guide](agent-prompts.md) for customization
- See the [Deployment Guide](deployment.md) for production setup

### Join the Community

- [GitHub Discussions](https://github.com/preflight/preflight/discussions) — Ask questions
- [Discord](https://discord.gg/preflight) — Chat with other users
- [Twitter](https://twitter.com/preflight_dev) — Stay updated

### Contribute

- Report bugs on [GitHub Issues](https://github.com/preflight/preflight/issues)
- Suggest features on [GitHub Issues](https://github.com/preflight/preflight/issues)
- Read the [Contributing Guide](../.github/CONTRIBUTING.md)

## 🆘 Troubleshooting

### Common Issues

**"No AI provider configured"**
- Go to Settings → AI Providers
- Add at least one API key
- Set it as default

**"Project context is still loading"**
- Wait a moment for data to load from IndexedDB
- Refresh the page if it persists
- Check browser console for errors

**Streaming not working**
- Check your internet connection
- Verify API key is valid
- Try disabling streaming in Settings

**Build fails**
- Check that all previous stages are complete
- Ensure PRD and System Instructions are generated
- Review error messages in the console

### Get Help

- Check the [FAQ](#faq) section
- Search [GitHub Issues](https://github.com/preflight/preflight/issues)
- Ask in [Discord](https://discord.gg/preflight)
- Open a new [Issue](https://github.com/preflight/preflight/issues)

## FAQ

**Q: Is my data stored locally or in the cloud?**
A: By default, all data is stored locally in your browser's IndexedDB. Cloud sync is optional and coming soon.

**Q: Can I use Preflight offline?**
A: Yes! After the initial load, Preflight works offline. AI generation requires internet connection.

**Q: How do I backup my projects?**
A: Use the Export JSON feature in Settings → Storage. This creates a backup file you can import later.

**Q: Can I collaborate with a team?**
A: Team collaboration is on the roadmap. Currently, Preflight is designed for individual builders.

**Q: Which AI models work best?**
A: We recommend:
- Research: Claude 3.5 Sonnet or GPT-4o
- Design: Claude 3.5 Sonnet
- PRD: Claude 3.5 Sonnet or GPT-4o
- Build: Claude 3.5 Sonnet

**Q: Is Preflight free?**
A: Yes, Preflight is open-source and free to use. You only pay for your own AI API usage.

---

Happy building! 🚀
