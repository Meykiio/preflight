# Changelog

All notable changes to Preflight will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — March 25, 2026

### Added

**Project Hub**
- Project grid/list view with filters by status
- Project sorting (updated, created, name)
- JSON import/export for project data
- Batch selection and deletion
- Status tracking (Ideation → Researching → Designing → Building → Shipped)

**Brief Module**
- Structured brief capture (problem, target users, core features, tech stack)
- Autosave with 800ms debounce
- Completion scoring indicator
- Feature list with reordering
- Tech stack and platform tagging

**Research Module**
- Context node selector (Brief, Tech Stack, User Personas)
- AI research prompt generation with streaming output
- Platform launchers (Perplexity, Gemini, ChatGPT Deep Research)
- File upload to vault (PDF, MD, PNG, JSON, ZIP)
- Active context injection toggle

**Design Module**
- Platform-specific design prompts (Stitch, v0, Figma AI, Locofy, Universal)
- AI design prompt generation with streaming output
- Design history tracking
- File upload and organization

**PRD Module**
- AI-powered PRD generation in markdown
- System instructions generation (platform-adapted)
- Rules file generation (.cursorrules, CLAUDE.md, universal)
- Copy and download functionality

**Build Module**
- Sequential build workflow (Foundation → Database → Features → Audit → Deploy)
- AI generation for each stage
- Stage status tracking (Locked → Not Started → In Progress → Complete)
- Export all prompts functionality
- Collapsible stage cards

**Vault Module**
- File upload with drag-and-drop
- Category organization (Research, Design, Export, Other)
- Context injection toggle for generations
- File search and filtering
- Integrity metrics

**Settings Module**
- BYOK AI provider management (Anthropic, OpenAI, Google, DeepSeek, Groq, Custom)
- Agent prompt customization for all agent types
- Platform launcher toggles
- Usage logs modal
- JSON export all data
- Clear all data functionality

**UI/UX**
- Splash screen with animated progress
- First-run onboarding flow
- Global command palette (⌘K / Ctrl+K)
- Dark theme only (optimized for long sessions)
- Error boundary for crash protection
- Toast notifications for user feedback
- Responsive design (mobile-friendly)

**Technical**
- Local-first architecture with Dexie.js (IndexedDB)
- Zustand state management
- React Router for navigation
- TypeScript strict mode
- Vitest test runner with initial utility tests
- GitHub Actions CI workflow
- Deployment configs for Vercel and Netlify

### Technical Decisions

- **Local-first:** All data stored in browser IndexedDB — no server required
- **BYOK model:** Users provide their own AI provider keys — keys never leave device except for official API calls
- **Context node system:** Modular context injection across modules
- **Sequential build:** Stage-based workflow ensures proper foundation before features
- **Dark theme only:** Optimized for developers during long coding sessions

---

## [Unreleased]

### Planned
- Template marketplace (pre-built project templates)
- AI chat assistant for brief filling
- Cloud sync with Supabase (optional)
- Team collaboration features
- Plugin system
- Multi-language support

---

**Latest Version:** 0.1.0
**Release Date:** March 25, 2026
**Status:** Production-ready
