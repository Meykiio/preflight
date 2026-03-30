# Preflight — Comprehensive Changelog

## [0.2.0] - 2026-03-29 — Final Touches Release

### 🎉 Major Features Added

#### Claude Skills Integration
- **NEW:** Claude Skills section in Settings page
- Download `preflight-interactive-SKILL.md` for use in Claude Desktop
- Complete usage instructions with step-by-step guide
- Run full Preflight pipeline conversationally in Claude

#### Tooltips & Help System
- **NEW:** Reusable Tooltip component with 4-position support
- Tooltips on Project Hub pipeline icons (Brief, Research, Design, PRD, System, Rules, Build)
- Hover explanations for all major UI elements
- Keyboard accessible tooltips

#### Import from Idea (AI-Powered)
- **NEW:** Import modal with two tabs:
  - **From Backup:** Import full JSON backup (existing feature)
  - **From Idea:** AI-powered brief extraction from MD/TXT files
- Paste app idea or upload `.md`/`.txt` file
- AI extracts: problem, target users, features, tech stack, notes
- Auto-populates Brief with extracted data
- Navigate directly to Brief tab for review

### 🐛 Bug Fixes

#### Research Page
- Fixed "Generate Research" button overflow at all zoom levels
- Added `whitespace-nowrap` to button and badge
- Improved flex container wrapping

#### Project Hub
- Fixed "Select Multiple" button not activating selection mode
- Fixed navigation after canceling batch selection
- Proper state reset on cancel

#### PRD Page
- Fixed horizontal overflow at all viewport sizes
- Changed layout to 3-column grid (PRD spans 2, System+Rules span 1)
- Added `break-all` to code blocks for long line wrapping

### ✨ UX Improvements

#### Navigation
- **NEW:** "Next: Research →" button in workspace header
- Removed Floating Action Button (FAB)
- Cleaner header design with navigation built-in

#### Generate Buttons
- All Generate buttons now use `gradient-cta glow-primary` styling
- Prominent, easy-to-find placement on all pages
- Consistent labeling: "Generate Research", "Generate Design", etc.

#### Reset Functionality
- **NEW:** Reset button on all generated content panels
- Research, Design, PRD, System Instructions, Rules files
- Confirmation dialog: "Clear generated content? This cannot be undone."
- Build page: "Reset Workflow" button in header

#### Build Workflow
- **NEW:** Stage 0 Context Scan (optional pre-build step)
- Always shown first in build stage list
- Explains recommended DOCS folder structure
- Downloadable as `BUILD_STAGE_00_CONTEXT_SCAN.md`
- Hide Generate CTA after workflow exists
- "Export All" button moved to header (top of page)

### 📦 New Files

#### Components
- `src/components/hub/ImportProjectModal.tsx` — AI-powered import
- `src/components/settings/ClaudeSkillsSection.tsx` — Claude skills download
- `src/components/shared/Tooltip.tsx` — Reusable tooltip component
- `src/components/workspace/build/StageZeroCard.tsx` — Stage 0 context scan

#### Public Assets
- `public/skills/preflight-interactive-SKILL.md` — Claude skill file

### 🗑️ Removed
- `src/components/shared/FloatingActionButton.tsx` — Replaced with header nav
- `src/components/workspace/ContextNodeSelector.tsx` — Removed sidebar

### 📝 Documentation
- Updated README.md with new features
- Updated CHANGELOG.md with comprehensive history
- Updated DOCS.md with current file structure

---

## [0.1.0] - 2026-03-27 — Round 2 Release

### 🎉 Major Features

#### Editable Prompts
- **NEW:** Edit button on all generated outputs
- Research, Design, PRD, System Instructions, Rules files
- Inline textarea editing with Save/Cancel
- Edits persist to Dexie database
- Copy/Download use edited content

#### Generation Toast Notifications
- **NEW:** Info toast on generation start
  - "Generating... You can navigate to other pages and come back."
- Success toast on completion
  - "Research prompt ready.", "Design prompt ready.", etc.
- 4-second duration for info toasts

#### Reset Prompts
- **NEW:** Reset button next to Regenerate
- Confirmation dialog before clearing
- Deletes artifact from Dexie
- Returns page to pre-generation state
- Build page: "Reset Workflow" deletes all stages

### 🐛 Bug Fixes

#### Project Hub
- Fixed "Select Multiple" button regression
- Proper state management for batch mode
- Navigation works after canceling selection

#### PRD Page Overflow
- Fixed content overflowing at all zoom levels
- Added `overflow-x-hidden` to page container
- Added `break-all` to code blocks
- Responsive grid layout for panels

#### Build Page
- Hide Generate CTA after stages exist
- "Reset Workflow" button in header
- "Export All" moved to top of page

### ✨ UX Improvements

#### Project Card Pipeline Icons
- All icons now clickable
- Navigate to corresponding tab on click
- Last icon changed to `rocket_launch` for Ship tab
- Cursor pointer and title attributes added

#### PRD Page Layout
- Complete rebuild with modern 3-column grid
- PRD panel spans 2 columns on large screens
- System Instructions + Rules stacked in right column
- Context summary footer showing active nodes
- Cleaner visual hierarchy

### 📝 Technical
- All 71 tests passing
- Zero TypeScript errors
- Clean production build (660 modules)

---

## [0.0.1] - 2026-03-23 — Initial Release

### 🎉 Core Features

#### Project Management
- Project Hub with grid/list views
- Create, edit, delete projects
- Status tracking (Ideation, Researching, Designing, Building, Shipped)
- JSON import/export
- Batch selection and deletion

#### Brief Module
- Structured idea capture
- Problem statement, target users, core features
- Tech stack tags
- Platform selection
- Completion scoring
- Autosave every 800ms

#### Research Module
- Generate research prompts for Perplexity, Gemini, ChatGPT
- Context node selection (Brief, Tech Stack, User Personas)
- Streaming output
- Upload research results to Vault
- Tech Stack recommendation from AI

#### Design Module
- Generate design prompts for Stitch, v0, Figma AI, Locofy
- Platform-specific prompt generation
- Context injection from Brief and Research
- Design history with file uploads

#### PRD Module
- Generate complete PRD with TypeScript data models
- System instructions for AI coding tools
- Rules files (.cursorrules, CLAUDE.md, RULES.md)
- Platform-specific adaptations
- Context injection from Brief, Research, Design

#### Build Module
- Sequential build workflow (Foundation → Database → Features → Audit → Deploy)
- Stage status tracking (Locked, Not Started, In Progress, Complete)
- Export all prompts as markdown
- Progress indicators
- Stage-by-stage execution

#### Vault Module
- File storage with categories (Research, Design, Export, Other)
- Drag-and-drop uploads
- Context injection toggle
- File search and filtering
- Max 10MB per file

#### Settings
- BYOK (Bring Your Own Key) AI providers
- Anthropic, OpenAI, Google, DeepSeek, Groq, Custom
- Platform launcher toggles
- Agent prompt customization
- Theme selection (Dark/Light/System)
- Usage logs
- JSON export

### 🛠️ Technical Stack

- **Frontend:** React 18.3 + TypeScript 5.8
- **Build:** Vite 6.2
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand 5.0
- **Database:** Dexie.js 4.0 (IndexedDB)
- **Routing:** React Router 6.30
- **Testing:** Vitest 4.1 (71 tests)

### 🎨 Design System

- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- **Theme:** Dark-first with tonal surface system
- **Icons:** Material Symbols Outlined
- **Components:** Custom + shadcn/ui patterns

### 📦 Quality

- 71 automated tests
- TypeScript strict mode
- ESLint compliance
- Production-ready build

---

## Future Roadmap

### Q2 2026
- [ ] Template marketplace
- [ ] AI chat assistant for brief filling
- [ ] Advanced analytics dashboard
- [ ] More AI provider integrations

### Q3 2026
- [ ] Cloud sync with Supabase (optional)
- [ ] Team collaboration features
- [ ] Plugin system
- [ ] Multi-language support

---

**Last Updated:** March 29, 2026
**Version:** 0.2.0
