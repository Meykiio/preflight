# Preflight Validation Rules

**Purpose**: This document describes the automated validation rules that check generated content against the 34 known issues identified in real end-to-end testing.

**Location**: `src/services/validation/`

---

## Validation Architecture

```
src/services/validation/
├── packageValidator.ts      # Issue 5.2: Wrong npm package names
├── libraryValidator.ts      # Issues 5.1, 4.1: Wrong database library
├── configValidator.ts       # Issues 5.3, 5.4, 5.15: Config files
├── consistencyChecker.ts    # Issues 5.1, 5.14: Cross-document drift
└── index.ts                 # Unified validation API
```

---

## Rule Categories

### 1. Package Name Validation (`packageValidator.ts`)

**Issue Fixed**: 5.2 — Wrong npm package names in package.json

**Rules**:
| Incorrect | Correct | Fix Applied |
|-----------|---------|-------------|
| `tanstack-query` | `@tanstack/react-query` | Auto-correct |
| `supabase` | `@supabase/supabase-js` | Auto-correct |
| `shadcn/ui` | (CLI tool) | Flag as error |
| `react-query` | `@tanstack/react-query` | Auto-correct |

**Verified Package Registry**: 40+ packages with correct names and versions

**CLI Tools Detection**: shadcn-ui, supabase, vercel, netlify, prisma, drizzle-kit

---

### 2. Library Stack Compatibility (`libraryValidator.ts`)

**Issues Fixed**: 
- 5.1 — Dexie.js re-appeared in Build Prompts after being removed from RULES.md
- 4.1 — Dexie.js referenced throughout, which is completely wrong for Supabase stack

**Prohibited Combinations**:

| Stack Type | Prohibited Libraries | Reason |
|------------|---------------------|--------|
| Supabase | Dexie, IndexedDB, localStorage, PouchDB | Wrong data layer |
| Dexie | Supabase, Firebase, Appwrite | Conflicting persistence |
| Vite | Webpack, Rollup | Wrong build tool |
| Next.js | Vite, webpack-dev-server | Wrong build tool |

**Required Libraries**:

| Feature | Required Packages |
|---------|------------------|
| Supabase | `@supabase/supabase-js` |
| TanStack Query | `@tanstack/react-query` |
| Zustand | `zustand` |
| Tailwind | `tailwindcss`, `postcss`, `autoprefixer` |

**Import Scanner**: Detects prohibited imports in code content with line numbers

---

### 3. Configuration Validation (`configValidator.ts`)

**Issues Fixed**:
- 5.3 — TypeScript `@/` path alias was broken
- 5.4 — Environment variables missing the required `VITE_` prefix
- 5.15 — `vercel.json` SPA routing was incorrectly configured

#### tsconfig.json Validation

**Required Configuration**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true
  }
}
```

**Checks**:
- ✅ `baseUrl` must be set to `.`
- ✅ `paths` must include `@/*` → `./src/*`
- ✅ `strict` mode should be enabled (warning if not)

#### vite.config.ts Validation

**Required Configuration**:
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Checks**:
- ✅ `resolve.alias` must be present
- ✅ `@` alias must point to `./src`
- ✅ `path` module must be imported

#### .env.example Validation (Vite projects)

**Required Format**:
```bash
# Vite only exposes vars with VITE_ prefix to the browser
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Checks**:
- ✅ `SUPABASE_URL` must be `VITE_SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY` must be `VITE_SUPABASE_ANON_KEY`
- ✅ AI API keys should NOT be in .env for BYOK projects (warning)
- ✅ Explanatory comment about VITE_ prefix

#### vercel.json Validation (Vite SPA)

**Required Configuration**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Checks**:
- ✅ Must use `rewrites` not `routes`
- ✅ Destination must be `/index.html` (not `/dist/$1`)

---

### 4. Consistency Checking (`consistencyChecker.ts`)

**Issues Fixed**:
- 5.1 — Dexie.js re-appeared in Build Prompts after being removed from RULES.md
- 5.14 — File size limit was inconsistent between RULES.md and the Audit stage

#### Prohibited Library Consistency

**Process**:
1. Extract prohibited libraries from RULES.md "Prohibited" section
2. Scan all Build Prompt stages for imports
3. Flag any stage using prohibited libraries

**Example**:
```
RULES.md says: "❌ Never use Dexie"
Build Stage 02 has: import { Dexie } from 'dexie'
→ CRITICAL ERROR: Prohibited library found
```

#### Numeric Threshold Consistency

**Process**:
1. Extract numeric thresholds from RULES.md (e.g., "max 200 lines")
2. Extract thresholds from Audit stage
3. Compare and flag mismatches

**Example**:
```
RULES.md: "Files over 200 lines must be split"
Audit Stage: "Find files over 300 lines"
→ ERROR: Numeric drift detected (200 vs 300)
```

#### Security Configuration Consistency

**Checks**:
- ✅ RLS mentioned in RULES.md → All CREATE TABLE statements must have RLS
- ✅ Service role key mentioned → Must include security warning

---

## Usage

### Programmatic API

```typescript
import { runFullValidation } from "@/services/validation";

const result = runFullValidation({
  packageJson: '{"dependencies": {...}}',
  tsconfig: '{"compilerOptions": {...}}',
  viteConfig: 'export default {...}',
  envExample: 'VITE_SUPABASE_URL=...',
  vercelJson: '{"rewrites": [...]}',
  rulesContent: '# Rules...',
  buildStages: [
    { stage: 1, content: '...' },
    { stage: 2, content: '...' },
  ],
  auditContent: '...',
  framework: 'vite',
});

console.log(result);
// {
//   isValid: boolean,
//   criticalErrors: number,
//   errors: number,
//   warnings: number,
//   allIssues: Array<{ type, severity, message, fix }>
// }
```

### Validation Dashboard Component

```tsx
import { ValidationDashboard } from "@/components/workspace/ValidationDashboard";

<ValidationDashboard
  packageJson={generatedPackageJson}
  tsconfig={generatedTsConfig}
  rulesContent={generatedRulesContent}
  buildStages={generatedBuildStages}
  onDismiss={() => setShowValidation(false)}
/>
```

---

## Severity Levels

| Level | Color | Action Required |
|-------|-------|----------------|
| **Critical** | 🔴 Red | Blocks build — fix immediately |
| **Error** | 🟠 Orange | Should fix before proceeding |
| **Warning** | 🟡 Yellow | Review and fix if applicable |

---

## Integration Points

### Generation Services

Each generation service now includes quality gates:

- **researchGeneration.ts**: Product type detection, stack-aware questions
- **designGeneration.ts**: Color validation, component inference, font defaults
- **prdGeneration.ts**: Stack-aware framing, data model derivation, library versions
- **rulesFileGeneration.ts**: Stack-matched rules, critical constraints
- **buildGeneration.ts**: Stage 01 requirements (Supabase client, path aliases, env prefix)

### Pre-Output Validation

Before showing generated content to users:

1. Run `runFullValidation()` on generated content
2. If critical errors found → show ValidationDashboard
3. If valid → allow user to proceed

---

## Extending Validation Rules

### Adding a New Rule

1. **Create validator function** in appropriate file:
   ```typescript
   export function validateNewRule(content: string): ValidationResult {
     // Check logic
     return { isValid, errors, warnings };
   }
   ```

2. **Add to unified API** in `index.ts`:
   ```typescript
   export function runFullValidation(params: AllConfigs): ValidationResult {
     // Include new rule
     const newRuleResult = validateNewRule(params.content);
     allIssues.push(...newRuleResult.errors);
   }
   ```

3. **Update PREFLIGHT_IMPROVEMENTS.md** with rule status

### Best Practices

- ✅ One rule per function
- ✅ Clear error messages with fix instructions
- ✅ Auto-correct when safe to do so
- ✅ Test with real generated content

---

## Current Coverage

| Category | Rules | Status |
|----------|-------|--------|
| Package Names | 40+ verified packages | ✅ Complete |
| Library Compatibility | 8 prohibited combinations | ✅ Complete |
| Config Files | tsconfig, vite, env, vercel | ✅ Complete |
| Consistency | Cross-document drift | ✅ Complete |
| **Total Issues Covered** | **34 issues** | ✅ **Complete** |

---

*Last Updated: 2026-04-01*
*Document Status: Active — Track new validation rules here*
