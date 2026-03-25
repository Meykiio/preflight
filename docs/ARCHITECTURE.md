# Preflight Architecture

This document provides a high-level overview of Preflight's architecture and design decisions.

## System Overview

Preflight is a **local-first**, **client-side only** web application that runs entirely in the browser. No backend server is required for the core functionality.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Application                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Pages     │  │ Components  │  │    Hooks    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                        │                               │  │
│  │  ┌─────────────────────┴─────────────────────────┐   │  │
│  │  │              State Management                  │   │  │
│  │  │         (Zustand Stores + Context)             │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │                        │                               │  │
│  │  ┌─────────────────────┴─────────────────────────┐   │  │
│  │  │              Services Layer                    │   │  │
│  │  │    (AI Providers, Generation Services)         │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │                        │                               │  │
│  │  ┌─────────────────────┴─────────────────────────┐   │  │
│  │  │              Data Layer                        │   │  │
│  │  │         (Dexie.js / IndexedDB)                 │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Technologies

### Frontend Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with concurrent features |
| **TypeScript 5.8** | Type safety and developer experience |
| **Vite 6.2** | Build tool and dev server |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Zustand 5.0** | State management |
| **Dexie.js 4.0** | IndexedDB wrapper for local persistence |
| **React Router 6.30** | Client-side routing |

### AI Integration

| Provider | SDK | Purpose |
|----------|-----|---------|
| **Anthropic** | @anthropic-ai/sdk | Claude models |
| **OpenAI** | openai | GPT-4, GPT-4o |
| **Google** | @google/generative-ai | Gemini models |
| **DeepSeek** | Custom API | DeepSeek models |
| **Groq** | Custom API | Fast inference |
| **Custom** | OpenAI-compatible | Self-hosted models |

## Data Flow

### 1. User Input → State → Database

```
User Input (Form)
       ↓
React Component State
       ↓
Zustand Store Update
       ↓
Dexie.js Write Operation
       ↓
IndexedDB Persistence
```

### 2. Database → State → UI

```
IndexedDB Data
       ↓
Dexie.js Query
       ↓
useLiveQuery Hook
       ↓
Zustand Store / Component State
       ↓
React Render
```

### 3. Generation Request Flow

```
User Clicks "Generate"
       ↓
Generation Service
       ↓
AI Provider Service
       ↓
External AI API
       ↓
Streaming Response
       ↓
Chunk Handler (onChunk)
       ↓
State Update
       ↓
UI Stream Display
```

## Component Architecture

### Page Components

Located in `src/pages/`:
- **ProjectHubPage** — Project list and management
- **ProjectWorkspacePage** — Main workspace with tabs
- **SettingsPage** — Configuration and preferences

### Workspace Pages

Located in `src/pages/workspace/`:
- **BriefPage** — Project brief creation
- **ResearchPage** — Research prompt generation
- **DesignPage** — Design prompt generation
- **PRDPage** — PRD and system instructions
- **BuildPage** — Sequential build workflow
- **VaultPage** — File management
- **ShipPage** — Project versioning and credentials

### Shared Components

Located in `src/components/shared/`:
- **OutputPanel** — Streaming text display with collapse/expand
- **CopyButton** — Copy to clipboard with feedback
- **StatusBadge** — Status indicators
- **ErrorBoundary** — Error handling

## State Management

### Zustand Stores

| Store | Purpose |
|-------|---------|
| **projectStore** | Selected project, project list |
| **uiStore** | UI state (sidebar, active tab, toasts) |
| **aiStore** | AI provider configurations |
| **settingsStore** | App settings |

### When to Use What

| Pattern | Use Case |
|---------|----------|
| **Local State** | Component-specific, transient data |
| **Zustand** | Cross-component, persistent UI state |
| **IndexedDB** | User data, projects, artifacts |
| **Context** | Rarely used (Zustand preferred) |

## Database Schema

### Collections

```typescript
// Projects
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  targetPlatforms: Platform[];
  techStack: string[];
  createdAt: number;
  updatedAt: number;
}

// Briefs
interface Brief {
  id: string;
  projectId: string;
  problem: string;
  targetUser: string;
  coreFeatures: CoreFeature[];
  inspirations: string[];
  notes: string;
  updatedAt: number;
}

// Generated Artifacts
interface GeneratedArtifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  platform: string;
  content: string;
  contextNodes: string[];
  agentSystemPromptId: string;
  version: number;
  charCount: number;
  tokenEstimate: number;
  createdAt: number;
}

// Vault Files
interface VaultFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mimeType: string;
  category: VaultCategory;
  isActiveContext: boolean;
  data: ArrayBuffer;
  uploadedAt: number;
}

// Build Stages
interface BuildStage {
  id: string;
  projectId: string;
  stageNumber: number;
  name: string;
  description: string;
  status: BuildStageStatus;
  promptContent: string;
  platform: string;
  createdAt: number;
  updatedAt: number;
}

// AI Provider Config
interface AIProviderConfig {
  id: string;
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
  isDefault: boolean;
  createdAt: number;
}

// Agent System Prompts
interface AgentSystemPrompt {
  id: string;
  agentType: AgentType;
  label: string;
  content: string;
  isDefault: boolean;
  updatedAt: number;
}

// App Settings
interface AppSettings {
  id: string;
  theme: AppTheme;
  defaultProvider: AIProvider | null;
  enabledPlatformLaunchers: string[];
  streamingEnabled: boolean;
  userName: string;
  isOnboardingComplete: boolean;
  updatedAt: number;
}

// Project Versions (Ship)
interface ProjectVersion {
  id: string;
  projectId: string;
  version: string;
  name: string;
  description: string;
  zipData?: ArrayBuffer;
  zipSize: number;
  liveUrl?: string;
  createdAt: number;
}

// Credentials (Ship)
interface Credential {
  id: string;
  projectId: string;
  name: string;
  value: string;
  category: CredentialCategory;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
```

## Security Considerations

### API Key Storage

- API keys are stored **encrypted** in IndexedDB
- Keys are **never** transmitted to Preflight servers
- Keys are only used for direct API calls to providers
- Users can clear all data at any time

### Local-First Architecture

- All data lives in IndexedDB by default
- No cloud sync required (optional with Supabase)
- Works offline after initial load
- Export functionality for backups

## Performance Optimizations

### Code Splitting

- Lazy loading of page components
- Route-based code splitting
- Dynamic imports for AI provider SDKs

### Database Queries

- IndexedDB indexes on frequently queried fields
- useLiveQuery for reactive updates
- Minimal data fetching on navigation

### UI Rendering

- Memoized components where beneficial
- Virtual scrolling for long lists (future)
- Debounced autosave operations

## Testing Strategy

### Unit Tests

- Utility functions (`src/lib/utils.test.ts`)
- Generation services
- State management logic

### Integration Tests

- Component interactions
- Database operations
- AI provider integrations (mocked)

### E2E Tests (Future)

- Critical user flows
- Cross-browser testing
- Performance benchmarks

## Future Enhancements

### Cloud Sync (Optional)

- Supabase integration for cloud backup
- Real-time sync across devices
- Team collaboration features

### Plugin System

- Custom generation agents
- Third-party integrations
- Theme customization

### Advanced Features

- AI chat assistant for brief filling
- Template marketplace
- Analytics dashboard
- Multi-language support

---

*Last updated: March 2025*
