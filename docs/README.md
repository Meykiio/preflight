# Preflight — Documentation

**Version:** 0.1.0 | **Last Updated:** March 25, 2026

Welcome to the Preflight documentation hub. This is your complete guide to understanding, using, and contributing to Preflight — the Project OS for vibe coders.

---

## 🚀 Quick Start

**New to Preflight?** Start here:

1. **[Getting Started →](getting-started/installation.md)** — Installation and setup
2. **[Quick Start Guide →](getting-started/quick-start.md)** — Build your first project in 5 minutes
3. **[User Guide →](user-guide/project-management.md)** — Learn all the features

**Already familiar?** Jump to:
- **[Build Prompts →](build-prompts/overview.md)** — Generate AI-ready build prompts
- **[Technical Docs →](technical/architecture.md)** — Architecture and API reference
- **[Contributing →](contributing/workflow.md)** — How to contribute

---

## 📚 Documentation Index

### Getting Started

| Document | Description |
|----------|-------------|
| [Installation](getting-started/installation.md) | How to install and run Preflight locally |
| [Quick Start](getting-started/quick-start.md) | Build your first project in 5 minutes |
| [Configuration](getting-started/configuration.md) | Environment variables and settings |

### User Guide

| Document | Description |
|----------|-------------|
| [Project Management](user-guide/project-management.md) | Using the Project Hub to manage projects |
| [Brief Module](user-guide/brief-module.md) | Writing structured project briefs |
| [Research Module](user-guide/research-module.md) | Generating deep research prompts |
| [Design Module](user-guide/design-module.md) | Creating design prompts for AI tools |
| [PRD Module](user-guide/prd-module.md) | Generating PRDs and system instructions |
| [Build Module](user-guide/build-module.md) | Sequential build workflow |
| [Vault Module](user-guide/vault-module.md) | File storage and context injection |

### Technical Documentation

| Document | Description |
|----------|-------------|
| [Architecture](technical/architecture.md) | System architecture and design decisions |
| [Tech Stack](technical/tech-stack.md) | Detailed technology choices and versions |
| [Database Schema](technical/database-schema.md) | Dexie.js schema and data models |
| [Folder Structure](technical/folder-structure.md) | Code organization |
| [API Reference](technical/api-reference.md) | Hooks, services, and utilities |

### Build Prompts

| Document | Description |
|----------|-------------|
| [Overview](build-prompts/overview.md) | How to use the build prompts |
| [Sequential Prompts](build-prompts/sequential-prompts.md) | The complete build prompt sequence |
| [Agent Prompts](build-prompts/agent-prompts/) | Individual agent prompt templates |

### Behind the Scenes

| Document | Description |
|----------|-------------|
| [Vibe Coding Workflow](behind-the-scenes/vibe-coding-workflow.md) | How I used AI tools to build Preflight |
| [Self-Dogfooding](behind-the-scenes/self-dogfooding.md) | Using Preflight to rebuild itself |
| [Lessons Learned](behind-the-scenes/lessons-learned.md) | Key insights from the build process |

### Contributing

| Document | Description |
|----------|-------------|
| [Workflow](contributing/workflow.md) | Contribution workflow and process |
| [Coding Standards](contributing/coding-standards.md) | Code style and quality guidelines |
| [Pull Requests](contributing/pull-requests.md) | How to submit a PR |

### Changelog

| Document | Description |
|----------|-------------|
| [Changelog](changelog/CHANGELOG.md) | Version history and release notes |

---

## 🎯 What is Preflight?

**Preflight is not a coding tool. It's the layer that precedes coding.**

Preflight is a **Project Operating System** for vibe coders — builders who use AI coding assistants (Lovable, Bolt, Cursor, Claude Code, Replit, v0) to build apps. It eliminates chaotic, fragmented workflows by providing a structured, AI-ready build pipeline.

### The Problem

Vibe coding without structure leads to abandoned projects. You jump between research, design, and coding without a clear plan. Context gets lost. Builds stall.

### The Solution

Preflight guides you through a proven sequence:
1. **Capture** a structured brief (problem, users, features, stack)
2. **Generate** research prompts for Perplexity, Gemini, ChatGPT
3. **Create** design prompts for Stitch, v0, Figma AI
4. **Write** a complete PRD with TypeScript data models
5. **Generate** system instructions and rules files
6. **Produce** sequential build prompts (Foundation → Database → Features → Audit → Deploy)

Each step builds on the last, with all context preserved.

---

## 🔗 Quick Links

- **[GitHub Repository](https://github.com/Meykiio/preflight)** — Source code and issues
- **[Report a Bug](https://github.com/Meykiio/preflight/issues)** — File a bug report
- **[Request a Feature](https://github.com/Meykiio/preflight/issues)** — Suggest improvements
- **[Main README](../README.md)** — Project overview and quick start

---

## 📖 How This Was Built

Preflight was built using the very workflow it prescribes. I used AI coding assistants (primarily Cursor and Claude Code) to build the application following the structured process that Preflight generates.

**The Meta Story:** After building Preflight, I used Preflight itself to rebuild the same application — to test if the prompts it generates actually work. The result? **It worked perfectly.** Preflight successfully generated the prompts to rebuild itself.

Read more about this journey in **[Behind the Scenes](behind-the-scenes/)**.

---

## 🤝 Contributing

Contributions are welcome! Preflight is open-source (MIT license) and thrives on community input.

**Before contributing:**
1. Read the **[Contributing Guide](contributing/workflow.md)**
2. Check existing **[Issues](https://github.com/Meykiio/preflight/issues)**
3. Follow the **[Coding Standards](contributing/coding-standards.md)**

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🎨 Design improvements
- ⚡ Performance optimizations
- 🧪 Add tests

---

## 📬 Support

- **Documentation Issues:** If you find something unclear in these docs, [file an issue](https://github.com/Meykiio/preflight/issues) with the "documentation" label.
- **General Questions:** Open a [Discussion](https://github.com/Meykiio/preflight/discussions) for questions.
- **Bug Reports:** Use the [Bug Report Template](https://github.com/Meykiio/preflight/issues/new?template=bug_report.md).

---

<div align="center">

**Built with ❤️ and AI by the Preflight Team**

[Back to Main README](../README.md)

</div>
