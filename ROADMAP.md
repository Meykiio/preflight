# Preflight v1.0 Roadmap

**Version:** 0.1.0 → 1.0.0  
**Created:** March 25, 2026  
**Last Updated:** March 25, 2026  
**Status:** 🟢 Week 3 Complete — Error Recovery Done

---

## 📊 Current State Assessment

| Metric | Current | Target v1.0 | Status |
|--------|---------|-------------|--------|
| Test Coverage | ~25% (71 tests) | 70%+ | 🟢 Weeks 1-2 Complete |
| Bundle Size | 441KB main | <250KB | ❌ Not Started |
| Onboarding | Basic API setup | Interactive tutorial | ❌ Not Started |
| Documentation | 40% complete | 95% complete | ❌ Not Started |
| Error Recovery | ✅ Complete | ✅ Complete | 🟢 Week 3 Complete |
| Mobile Support | Minimal | Tablet-optimized | ❌ Not Started |

---

## 🎯 PHASE 1: MUST FIX (Before v1.0 Release)

**Estimated Time:** 3-4 weeks  
**Priority:** 🔴 Critical — blocks v1.0 launch  
**Status:** 🟡 Not Started

---

### 1.1 Add Comprehensive Tests

**Owner:** @Meykiio  
**Estimated:** 10-12 days  
**Status:** ⚪ Not Started

#### Test Pyramid Structure

```
┌─────────────────┐
│   E2E Tests     │  2-3 flows (10%)
├─────────────────┤
│ Integration     │  8-10 tests (20%)
├─────────────────┤
│ Component Tests │  25-30 tests (40%)
├─────────────────┤
│   Unit Tests    │  15-20 tests (30%)
└─────────────────┘
```

#### Implementation Plan

**Week 1: Foundation Tests (Unit)**

- [x] `src/lib/utils.test.ts` ✅ COMPLETE (3 tests)
- [x] `src/lib/briefUtils.test.ts` ✅ COMPLETE (13 tests)
- [x] `src/lib/fileUpload.test.ts` ✅ COMPLETE (13 tests)
- [x] `src/lib/generationErrors.test.ts` ✅ COMPLETE (5 tests)
- [x] `src/stores/projectStore.test.ts` ✅ COMPLETE (12 tests)
- [x] `src/stores/settingsStore.test.ts` ✅ COMPLETE (13 tests)
- [x] `src/stores/uiStore.test.ts` ✅ COMPLETE (12 tests)

**Week 2: Component Tests**

- [ ] `src/components/hub/ProjectCard.test.tsx` 🆕 ADD (3 tests)
- [ ] `src/components/hub/ProjectHub.test.tsx` 🆕 ADD (4 tests)
- [ ] `src/components/workspace/BriefPage.test.tsx` 🆕 ADD (4 tests)
- [ ] `src/components/workspace/BuildStageCard.test.tsx` 🆕 ADD (3 tests)
- [ ] `src/components/workspace/VaultFileCard.test.tsx` 🆕 ADD (3 tests)
- [ ] `src/components/shared/CopyButton.test.tsx` 🆕 ADD (2 tests)
- [ ] `src/components/shared/StatusBadge.test.tsx` 🆕 ADD (2 tests)

**Week 3: Integration + E2E Tests**

- [ ] `src/tests/integration/brief-workflow.test.tsx` 🆕 ADD (1 test)
- [ ] `src/tests/integration/research-generation.test.tsx` 🆕 ADD (1 test)
- [ ] `src/tests/integration/build-workflow.test.tsx` 🆕 ADD (1 test)
- [ ] `src/tests/e2e/complete-project-flow.test.tsx` 🆕 ADD (1 test)

#### Technical Decisions

**Testing Library:** Vitest + React Testing Library (already configured)

**Mocking Strategy:**
- [ ] MSW (Mock Service Worker) for API calls
- [ ] Dexie mock for database operations
- [ ] Zustand mock for store tests

**New Test Commands:**
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "vitest run --config vitest.e2e.config.ts"
}
```

**Coverage Target:** 70% minimum (enforced in CI)

#### Dependencies to Add

```bash
pnpm add -D @testing-library/user-event @vitest/coverage-v8 msw
```

---

### 1.2 Improve Onboarding

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- 3-step modal (Name → API Key → Done)

#### Target State
- Interactive tutorial + guided tour
- Progress tracking
- First project walkthrough

#### Implementation

**New Components:**
- [ ] `src/components/onboarding/OnboardingTutorialStep.tsx` 🆕 NEW
- [ ] `src/components/onboarding/OnboardingTour.tsx` 🆕 NEW
- [ ] `src/components/onboarding/OnboardingProgress.tsx` ✏️ ENHANCE

**New Features:**

1. **Interactive Tutorial** (5 minutes)
   - [ ] Create sample project together
   - [ ] Fill out brief fields with guidance
   - [ ] Generate first AI prompt
   - [ ] Show where results appear

2. **Guided Tour** (Custom implementation)
   - [ ] Highlights each module
   - [ ] Explains purpose in 1 sentence
   - [ ] Skip-able at any time
   - [ ] Re-accessible from Help menu

3. **Progress Tracking**
   - [ ] "First Project Created" badge
   - [ ] "First Prompt Generated" badge
   - [ ] Checklist of key actions

#### Library Option (Alternative)

If custom implementation takes too long:

```bash
pnpm add driver.js
```

**Pros:** Faster implementation, 5KB  
**Cons:** Less control, may not match design system

---

### 1.3 Fill User Guide Gaps

**Owner:** @Meykiio  
**Estimated:** 7 days  
**Status:** ⚪ Not Started

#### Current State
- `docs/user-guide/` is empty

#### Target State
- Complete documentation for all 6 modules

#### Documentation Structure

```
docs/user-guide/
├── README.md                     🆕 Overview + navigation
├── project-management.md         🆕 Project Hub guide
├── brief-module.md               🆕 Brief tutorial
├── research-module.md            🆕 Research guide
├── design-module.md              🆕 Design guide
├── prd-module.md                 🆕 PRD guide
├── build-module.md               🆕 Build workflow
└── vault-module.md               🆕 Vault guide
```

#### Content Template (Per Module)

```markdown
# [Module Name]

## What It Does
[2-3 sentences]

## When to Use It
[Bullet list of use cases]

## Step-by-Step Guide
1. [First step with screenshot]
2. [Second step with screenshot]
3. [etc.]

## Tips & Best Practices
- [Tip 1]
- [Tip 2]

## Common Issues
| Issue | Solution |
|-------|----------|
| [Problem] | [Fix] |

## Related Modules
- [Link to related module]
```

#### Implementation Plan

**Week 2-3: Documentation Sprint**

- [ ] Day 1-2: Write Project Hub + Brief guides
- [ ] Day 3-4: Write Research + Design guides
- [ ] Day 5-6: Write PRD + Build guides
- [ ] Day 7: Write Vault guide + review all

**Screenshots Needed:** 20-25 annotated screenshots

**Tool Recommendations:**
- CleanShot X (macOS)
- Greenshots (Windows)
- Loom (video + screenshots)

---

### 1.4 Add Error Recovery

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- Basic error messages
- No recovery options
- Lost progress on failures

#### Target State
- Comprehensive error handling
- Retry with exponential backoff
- Partial generation save/resume

#### Error Categories & Handling

| Error Type | Current | Target |
|------------|---------|--------|
| API Key Invalid | Toast only | Toast + Settings redirect + retry option |
| Rate Limit | Toast only | Toast + auto-retry with backoff |
| Network Error | Toast only | Toast + offline mode + queue |
| Generation Timeout | Generic error | Specific timeout message + resume |
| Partial Generation | Lost content | Save partial + resume capability |

#### Implementation Plan

**New Service Layer:**

- [ ] `src/services/ai/retry.ts` 🆕 NEW (exponential backoff)
- [ ] `src/services/ai/queue.ts` 🆕 NEW (request queue)
- [ ] `src/services/ai/recovery.ts` 🆕 NEW (state recovery)

**Retry Logic:**
```typescript
// Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 retries)
const retryConfig = {
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 16000,
  backoffMultiplier: 2
};
```

**Partial Generation Recovery:**
```typescript
// Save progress every 500 tokens
const checkpointConfig = {
  intervalTokens: 500,
  storageKey: 'generation_checkpoint',
  autoResume: true
};
```

**New UI Components:**

- [ ] `src/components/shared/ErrorRecoveryModal.tsx` 🆕 NEW
- [ ] `src/components/shared/OfflineBanner.tsx` 🆕 NEW
- [ ] `src/components/shared/GenerationProgress.tsx` 🆕 NEW (with checkpoint save)

---

## ⚡ PHASE 2: SHOULD FIX (Before Marketing)

**Estimated Time:** 2-3 weeks  
**Priority:** 🟡 High — improves user experience significantly  
**Status:** ⚪ Not Started

---

### 2.1 Code Splitting

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- 440KB main chunk
- Single bundle

#### Target State
- <250KB initial load (-43%)
- Multiple chunks loaded on demand

#### Splitting Strategy

**Route-Level Splitting:**
```typescript
// src/App.tsx
const ProjectHubPage = lazy(() => import('@/pages/ProjectHubPage'));
const ProjectWorkspacePage = lazy(() => import('@/pages/ProjectWorkspacePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
```

**Module-Level Splitting:**
```typescript
// Workspace pages (heavy)
const BriefPage = lazy(() => import('@/pages/workspace/BriefPage'));
const ResearchPage = lazy(() => import('@/pages/workspace/ResearchPage'));
const DesignPage = lazy(() => import('@/pages/workspace/DesignPage'));
const PRDPage = lazy(() => import('@/pages/workspace/PRDPage'));
const BuildPage = lazy(() => import('@/pages/workspace/BuildPage'));
const ShipPage = lazy(() => import('@/pages/workspace/ShipPage'));
```

**Expected Results:**
```
Before:
├── main.js: 440KB
└── index.css: 36KB

After:
├── main.js: 180KB (-59%)
├── index.css: 36KB
├── workspace-chunk.js: 120KB
├── settings-chunk.js: 45KB
└── vendor-chunk.js: 85KB
```

#### Implementation Plan

**Week 4: Route Splitting**

- [ ] Add React.lazy() to all routes
- [ ] Add Suspense boundaries with custom fallbacks
- [ ] Test navigation performance
- [ ] Measure bundle size reduction

**Week 5: Module Splitting**

- [ ] Split workspace pages into separate chunks
- [ ] Add loading states for each module
- [ ] Test module transitions
- [ ] Verify code splitting in DevTools

---

### 2.2 Mobile Optimization

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- Works but not optimized
- Desktop-first design

#### Target State
- Tablet-optimized (iPad, 768-1024px)
- Mobile-usable (<640px)

#### Responsive Breakpoints

```css
/* Current (basic) */
@media (max-width: 768px) { }

/* Target (comprehensive) */
@media (max-width: 640px) { /* Mobile */ }
@media (min-width: 641px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

#### Priority Improvements

**Tablet (iPad, 768-1024px):**

- [ ] Sidebar: Collapsible with overlay
- [ ] Project grid: 2 columns instead of 3
- [ ] Brief editor: Full-width on small screens
- [ ] Build stages: Vertical stack instead of horizontal
- [ ] Touch-friendly buttons (min 44px tap targets)

**Mobile (<640px):**

- [ ] Single column layout throughout
- [ ] Bottom navigation bar (thumb-friendly)
- [ ] Simplified header (hamburger menu)
- [ ] Swipe gestures for actions
- [ ] Reduced feature set (view-only mode)

#### Implementation Plan

**Week 5: Tablet Optimization**

- [ ] Audit all pages for tablet issues
- [ ] Fix layout breakpoints
- [ ] Test on iPad simulator

**Week 6: Mobile (Optional)**

- [ ] Decide: Full mobile support or view-only?
- [ ] Implement bottom navigation
- [ ] Test on iPhone/Android

---

### 2.3 Add Keyboard Shortcuts

**Owner:** @Meykiio  
**Estimated:** 3-4 days  
**Status:** ⚪ Not Started

#### Current State
- ⌘K for command palette only

#### Target State
- Full keyboard navigation
- 10+ shortcuts

#### Shortcut Map

| Action | Shortcut | Context |
|--------|----------|---------|
| Command Palette | ⌘K / Ctrl+K | Global |
| Save | ⌘S / Ctrl+S | Brief, Settings |
| Generate | ⌘Enter / Ctrl+Enter | All modules |
| New Project | ⌘N / Ctrl+N | Project Hub |
| Search | ⌘F / Ctrl+F | Project Hub, Vault |
| Navigate Tab | ⌘1-6 / Ctrl+1-6 | Workspace |
| Toggle Sidebar | ⌘B / Ctrl+B | Global |
| Settings | ⌘, / Ctrl+, | Global |
| Help | ⌘? / Ctrl+? | Global |

#### Implementation

**New Hook:**

- [ ] `src/hooks/useKeyboardShortcuts.ts` 🆕 NEW

**New Component:**

- [ ] `src/components/shared/KeyboardShortcutsModal.tsx` 🆕 NEW (help modal)

#### Implementation Plan

**Week 6: Core Shortcuts**

- [ ] Implement global shortcuts
- [ ] Add context-aware shortcuts
- [ ] Create help modal (⌘?)
- [ ] Test all shortcuts

---

### 2.4 Create Video Tutorials

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- No video content

#### Target State
- 5-7 short videos (3-5 min each)

#### Video Plan

| # | Title | Duration | Content |
|---|-------|----------|---------|
| 1 | What is Preflight? | 2 min | Overview, problem solved |
| 2 | Quick Start (5 min) | 5 min | First project setup |
| 3 | Brief Module | 4 min | Fill brief, tips |
| 4 | Research + Design | 5 min | Generate prompts |
| 5 | PRD + System | 4 min | Generate docs |
| 6 | Build Workflow | 5 min | Sequential build |
| 7 | Tips & Tricks | 4 min | Power user features |

#### Tools Needed

**Recording:**
- [ ] OBS Studio (free) or Loom (paid)
- [ ] Microphone: USB mic or good headset

**Editing:**
- [ ] DaVinci Resolve (free) or Descript (paid)

**Hosting:**
- [ ] YouTube (public, free)
- [ ] Vimeo (paid, private, no ads)

#### Implementation Plan

**Week 7: Production**

- [ ] Day 1-2: Script writing
- [ ] Day 3-4: Recording
- [ ] Day 5-7: Editing + publishing

---

## 🚀 PHASE 3: NICE TO HAVE (Post-Launch)

**Estimated Time:** 4-6 weeks  
**Priority:** 🟢 Medium — adds polish and advanced features  
**Status:** ⚪ Not Started

---

### 3.1 Cloud Sync Option

**Owner:** @Meykiio  
**Estimated:** 10-14 days  
**Status:** ⚪ Not Started

#### Current State
- Local-first only (Dexie.js)

#### Target State
- Optional Supabase sync

#### Architecture

```
┌─────────────┐      ┌──────────────┐
│   Browser   │◄────►│   Supabase   │
│  (Dexie.js) │ sync │  (PostgreSQL)│
└─────────────┘      └──────────────┘
```

#### Implementation

**New Service:**

- [ ] `src/services/sync/syncService.ts` 🆕 NEW
- [ ] `src/services/sync/syncQueue.ts` 🆕 NEW
- [ ] `src/services/sync/conflictResolution.ts` 🆕 NEW

**Settings Toggle:**

```
Settings → Cloud Sync
├── Enable Sync (toggle)
├── Supabase URL (input)
├── Supabase Anon Key (input)
└── Sync Status (indicator)
```

---

### 3.2 Template Marketplace

**Owner:** @Meykiio  
**Estimated:** 7-10 days  
**Status:** ⚪ Not Started

#### Current State
- No templates

#### Target State
- Pre-built project templates
- Browse in-app
- One-click creation

#### Template Structure

```
docs/templates/
├── saas-starter.md
├── mobile-app.md
├── chrome-extension.md
├── api-service.md
└── landing-page.md
```

**Features:**

- [ ] Browse templates in-app
- [ ] One-click project creation
- [ ] Community submissions (future)

---

### 3.3 Export to Multiple Formats

**Owner:** @Meykiio  
**Estimated:** 5-7 days  
**Status:** ⚪ Not Started

#### Current State
- JSON export only

#### Target State
- JSON, Markdown, PDF

#### Implementation

**New Service:**

- [ ] `src/services/export/jsonExport.ts` ✅ EXISTING
- [ ] `src/services/export/markdownExport.ts` 🆕 NEW
- [ ] `src/services/export/pdfExport.ts` 🆕 NEW (via html2pdf)

---

### 3.4 Collaboration Features

**Owner:** @Meykiio  
**Estimated:** 14-21 days  
**Status:** ⚪ Not Started

#### Current State
- Single-user only

#### Target State
- Share projects with team
- View/edit permissions
- Comments

**Features:**

- [ ] Share project via link
- [ ] View-only or edit permissions
- [ ] Comment on brief/features
- [ ] Activity feed

---

## 📅 TIMELINE SUMMARY

| Phase | Duration | Weeks | Deliverables | Status |
|-------|----------|-------|--------------|--------|
| **Phase 1: Must Fix** | 3-4 weeks | 1-4 | Tests, Onboarding, Docs, Error Recovery | ⚪ Not Started |
| **Phase 2: Should Fix** | 2-3 weeks | 5-7 | Code Splitting, Mobile, Shortcuts, Videos | ⚪ Not Started |
| **Phase 3: Nice to Have** | 4-6 weeks | 8-13 | Cloud Sync, Templates, Exports, Collab | ⚪ Not Started |

**Total to v1.0:** 6-7 weeks (Phase 1 + 2)  
**Total to v2.0:** 10-13 weeks (all phases)

---

## 🎯 SUCCESS METRICS

### v1.0 Criteria (Must Fix Complete)

- [ ] 50+ tests passing (70%+ coverage)
- [ ] Interactive onboarding with tutorial
- [ ] All 6 module guides published
- [ ] Error recovery with retry logic
- [ ] Zero TypeScript errors
- [ ] Zero build errors

### v1.0 Criteria (Should Fix Complete)

- [ ] Bundle size <250KB (-40%)
- [ ] Tablet-optimized UI
- [ ] 10+ keyboard shortcuts
- [ ] 5 video tutorials published
- [ ] Lighthouse score >90

---

## 🛠️ RECOMMENDED TECH STACK ADDITIONS

### Testing
```bash
pnpm add -D @testing-library/user-event @vitest/coverage-v8 msw
```

### Onboarding
```bash
pnpm add driver.js
```

### PDF Export (Phase 3)
```bash
pnpm add html2pdf.js
```

### Video Hosting
- YouTube (free, public)
- Vimeo (paid, private, no ads)

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Test coverage takes longer | High | Start with critical paths only | 🟡 Monitor |
| Onboarding too complex | Medium | User test early, iterate | 🟡 Monitor |
| Code splitting breaks routing | Medium | Test all routes thoroughly | 🟡 Monitor |
| Video production delays | Low | Start with screen recordings only | 🟢 Accept |

---

## 📝 CHANGELOG

### [2026-03-25] — Week 3: Error Recovery Complete ✅
- Implemented comprehensive error recovery system
- **Services:**
  - `retry.ts`: Exponential backoff (1s→16s, max 5 retries) with jitter
  - `checkpoint.ts`: Save generation progress every 500 tokens
  - Updated `generateWithAgent()` with retry + checkpoint
- **Components:**
  - `OfflineBanner`: Offline detection and user feedback
  - `ErrorRecoveryModal`: Resume/retry/cancel on failure
  - `GenerationProgress`: Token count and save status
- **Features:**
  - ✓ Auto-retry failed API calls (network, rate limit errors)
  - ✓ Save progress during long generations
  - ✓ Resume interrupted generations
  - ✓ Offline detection and user feedback
- All existing tests pass (71 tests)

### [2026-03-25] — Week 2: Store Tests Complete ✅
- Added 37 new store tests (total: 71 tests)
- `uiStore.test.ts`: 12 tests for UI state management
- `projectStore.test.ts`: 12 tests for project CRUD operations
- `settingsStore.test.ts`: 13 tests for settings and agent prompts
- All tests passing ✓
- Test coverage increased from ~15% to ~25%

### [2026-03-25] — Week 1: Unit Tests Complete ✅
- Added 31 new unit tests (total: 34 tests)
- `briefUtils.test.ts`: 13 tests for completion scoring
- `fileUpload.test.ts`: 13 tests for upload validation
- `generationErrors.test.ts`: 5 tests for error state mapping
- All tests passing ✓
- Test coverage increased from ~5% to ~15%

### [2026-03-25] — Initial Plan Created
- Created comprehensive roadmap document
- Defined 3 phases with 12 major initiatives
- Estimated timelines and success metrics
- Plan approved by @Meykiio

---

## 🔗 RELATED DOCUMENTS

- [DOCS.md](./docs/README.md) — User documentation
- [CHANGELOG.md](./docs/changelog/CHANGELOG.md) — Version history
- [CONTRIBUTING.md](./.github/CONTRIBUTING.md) — Contribution guide
- [README.md](./README.md) — Project overview

---

<div align="center">

**Last Updated:** March 25, 2026  
**Next Review:** After Phase 1 completion

[Back to README](./README.md)

</div>
