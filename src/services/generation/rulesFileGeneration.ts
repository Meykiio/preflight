import type { Brief, Project } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GenerateRulesFileParams {
  platform: string;
  prd: string;
  brief: Brief;
  onChunk?: (chunk: string) => void;
  project: Project;
}

/**
 * Extracts critical constraints from Brief.
 * Issue 4.2: No mention of the critical business constraint (character count)
 */
const extractCriticalConstraints = (brief: Brief): string[] => {
  const constraints: string[] = [];
  const problemText = brief.problem.toLowerCase();
  const featuresText = brief.coreFeatures.map(f => f.text.toLowerCase()).join(" ");
  const notesText = brief.notes?.toLowerCase() || "";

  const allText = problemText + " " + featuresText + " " + notesText;

  // Character/word count constraints
  const charCountMatch = allText.match(/(\d{2,5})\s*(?:to|-)\s*(\d{2,5})\s*characters?/);
  if (charCountMatch) {
    constraints.push(`**Character Count Constraint:** AI-generated content must be between ${charCountMatch[1]} and ${charCountMatch[2]} characters. This affects Edge Function architecture, database schema, and UI validation.`);
  }

  // Rate limiting constraints
  if (/rate\s*limit|throttl|request\s*per/i.test(allText)) {
    constraints.push(`**Rate Limiting:** Implement rate limiting for API calls. Track usage per user/workspace.`);
  }

  // Size constraints
  const sizeMatch = allText.match(/(\d+)\s*(?:mb|kb|bytes?)/i);
  if (sizeMatch) {
    constraints.push(`**File Size Constraint:** Maximum file upload size is ${sizeMatch[0]}. Validate on client and server.`);
  }

  // Timing constraints
  if (/timeout|under\s*\d+\s*seconds?|within\s*\d+\s*ms/i.test(allText)) {
    constraints.push(`**Timing Constraint:** Operations must complete within specified timeout. Implement retry logic and user feedback.`);
  }

  // Compliance constraints
  if (/gdpr|hipaa|compliance|audit/i.test(allText)) {
    constraints.push(`**Compliance:** Implement audit logging, data retention policies, and user data export/deletion.`);
  }

  return constraints;
};

/**
 * Gets stack-matched rules.
 * Issue 4.1: Dexie.js referenced throughout, which is completely wrong for Supabase stack
 * Issue 4.3: shadcn/ui and TanStack Query missing from style and state rules
 */
const getStackMatchedRules = (techStack: string[]): {
  databaseRules: string;
  stateRules: string;
  stylingRules: string;
  routingRules: string;
  prohibitedRules: string;
} => {
  const normalizedStack = techStack.map(tag => tag.toLowerCase());
  const hasSupabase = normalizedStack.some(tag => tag.includes("supabase"));
  const hasDexie = normalizedStack.some(tag => tag.includes("dexie"));
  const hasTanStackQuery = normalizedStack.some(tag => tag.includes("tanstack") || tag.includes("react-query"));
  const hasZustand = normalizedStack.some(tag => tag.includes("zustand"));
  const hasShadcn = normalizedStack.some(tag => tag.includes("shadcn"));
  const hasReactRouter = normalizedStack.some(tag => tag.includes("react-router"));
  const hasTailwind = normalizedStack.some(tag => tag.includes("tailwind"));

  // Database rules (Issue 4.1)
  const databaseRules = hasSupabase
    ? `### Database Rules (Supabase)
- ✅ Use \`@supabase/supabase-js\` v2 for all database operations
- ✅ Row Level Security (RLS) enabled on ALL tables
- ✅ Service role key NEVER in client code — server-side only
- ✅ Single Supabase client instance in \`src/lib/supabase.ts\`
- ✅ All database calls in \`src/services/\` layer
- ✅ TypeScript types generated from Supabase schema
- ❌ NEVER use Dexie, IndexedDB, localStorage, or PouchDB for data persistence
- ❌ NEVER bypass the services layer with direct Supabase calls from components`
    : hasDexie
    ? `### Database Rules (Dexie.js / IndexedDB)
- ✅ Use \`dexie\` v4 for all database operations
- ✅ Use \`useLiveQuery\` for reactive reads in components
- ✅ Async functions with try/catch for writes
- ✅ Increment version number on schema changes
- ✅ Use \`crypto.randomUUID()\` for IDs, \`Date.now()\` for timestamps
- ❌ NEVER use Supabase, Firebase, or other cloud databases`
    : `### Database Rules
- ✅ Define database abstraction layer
- ✅ All operations return { data, error } pattern
- ❌ NEVER hardcode database calls in components`;

  // State management rules (Issue 4.3)
  const stateRules = hasTanStackQuery && hasZustand
    ? `### State Management Rules
- ✅ **Server State:** Use TanStack Query v5 for server state (caching, background sync)
  - Query keys: [\`entity\`, id] or [\`entity\`, filters]
  - Cache invalidation on mutations
  - Optimistic updates where appropriate
- ✅ **Client State:** Use Zustand v5 for UI state
  - Named export: \`import { create } from 'zustand'\`
  - One store per domain (uiStore, projectStore, etc.)
  - Persist to backend on every write (not localStorage)
  - Async actions with error handling
- ❌ NEVER duplicate state between TanStack Query and Zustand
- ❌ NEVER use useState for shared state across components`
    : hasZustand
    ? `### State Management Rules
- ✅ Use Zustand v5 for all client state
  - Named export: \`import { create } from 'zustand'\` (v4+ syntax)
  - One store per domain
  - Persist to backend on every write
- ❌ NEVER use useState for shared state
- ❌ NEVER use localStorage for persistence`
    : `### State Management Rules
- ✅ Use useState for local component state
- ✅ Use Context or Zustand for shared state
- ❌ NEVER pass state through more than 3 component levels (use Context)`;

  // Styling rules (Issue 4.3)
  const stylingRules = hasShadcn && hasTailwind
    ? `### Styling Rules (shadcn/ui + Tailwind)
- ✅ Use shadcn/ui components as base (extend in \`src/components/ui/\`)
- ✅ Use Tailwind utilities for custom styling
- ✅ No custom CSS except in \`src/index.css\`
- ✅ No inline styles for static values
- ✅ Use design tokens from \`tailwind.config.ts\`
- ✅ Use \`clsx\` and \`tailwind-merge\` for conditional classes
- ❌ NEVER use hardcoded hex values — use Tailwind tokens
- ❌ NEVER use @apply in production code`
    : hasTailwind
    ? `### Styling Rules (Tailwind)
- ✅ Use Tailwind utilities only
- ✅ No custom CSS except in \`src/index.css\`
- ✅ No inline styles for static values
- ✅ Use design tokens from \`tailwind.config.ts\`
- ❌ NEVER use hardcoded hex values
- ❌ NEVER use @apply in production code`
    : `### Styling Rules
- ✅ Use CSS modules or styled-components
- ✅ Consistent naming convention
- ❌ NEVER use inline styles for static values`;

  // Routing rules
  const routingRules = hasReactRouter
    ? `### Routing Rules (React Router)
- ✅ Use React Router v6 with \`createBrowserRouter\`
- ✅ Route protection with \`ProtectedRoute\` component
- ✅ Lazy load route components with \`React.lazy()\`
- ✅ Use \`useLoaderData\`, \`useActionData\` for data
- ✅ All routes defined in central config
- ❌ NEVER import route components directly in App.tsx`
    : `### Routing Rules
- ✅ Define all routes centrally
- ✅ Protect authenticated routes
- ❌ NEVER allow direct access to protected routes`;

  // Prohibited rules (stack-matched)
  const prohibitedItems: string[] = [];
  
  if (hasSupabase) {
    prohibitedItems.push(
      "❌ Dexie, IndexedDB, localStorage, PouchDB (using Supabase)",
      "❌ Service role key in client code",
      "❌ Direct Supabase calls from UI components"
    );
  }
  if (hasDexie) {
    prohibitedItems.push(
      "❌ Supabase, Firebase (using Dexie)",
      "❌ Direct IndexedDB API (use Dexie)"
    );
  }
  if (hasZustand) {
    prohibitedItems.push(
      "❌ useState for shared state",
      "❌ localStorage persistence"
    );
  }
  if (hasTanStackQuery) {
    prohibitedItems.push(
      "❌ useEffect for data fetching",
      "❌ Manual caching logic"
    );
  }

  const prohibitedRules = `### Prohibited Behaviors

**Code Quality:**
- ❌ \`any\` type (use TypeScript strict mode)
- ❌ Files over 200 lines (split into smaller modules)
- ❌ Functions over 40 lines (refactor)
- ❌ \`console.log\` in production code
- ❌ Unused imports or variables
- ❌ Hardcoded strings (use i18n or constants)

**Architecture:**
- ❌ Business logic in components
- ❌ Circular imports
- ❌ Unapproved packages (check with user first)
${prohibitedItems.map(item => `- ${item}`).join("\n")}

**Security:**
- ❌ API keys in React state or code
- ❌ Disabling strict mode or ESLint rules
- ❌ Committing .env files
- ❌ RLS disabled on any table

**Workflow:**
- ❌ Scope creep (stick to the task)
- ❌ Skipping build/test commands
- ❌ Marking stage complete without passing build
- ❌ Modifying working features without reason`;

  return {
    databaseRules,
    stateRules,
    stylingRules,
    routingRules,
    prohibitedRules,
  };
};

export const generateRulesFile = ({
  platform,
  prd,
  brief,
  onChunk,
  project
}: GenerateRulesFileParams): Promise<string> => {
  // Extract critical constraints (Issue 4.2)
  const constraints = extractCriticalConstraints(brief);

  // Get stack-matched rules (Issues 4.1, 4.3)
  const stackRules = getStackMatchedRules(project.techStack);

  const content = [
    `# ${project.name} — Project Rules`,
    ``,
    `**Stack:** ${project.techStack.join(", ")}`,
    `**Purpose:** ${brief.problem || "TBD"}`,
    `**Platform:** ${platform}`,
    ``,
    `> Read this file completely before beginning any task.`,
    ``,
    `## ⚠️ RULES QUALITY GATES`,
    `Before generating, validate:`,
    `- ✅ Database rules match stack (NO Dexie for Supabase projects!)`,
    `- ✅ All libraries in tech stack appear in relevant sections`,
    `- ✅ Critical constraints documented: ${constraints.length > 0 ? constraints.length : "None detected"}`,
    ``,
    `## Architecture Overview`,
    `\`\`\``,
    `src/`,
    `  components/     # UI components`,
    `  pages/          # Route components`,
    `  hooks/          # Custom hooks`,
    `  stores/         # Zustand stores`,
    `  lib/            # Utilities, DB client`,
    `  services/       # API/database operations`,
    `  types/          # TypeScript interfaces`,
    `\`\`\``,
    ``,
    stackRules.databaseRules,
    ``,
    stackRules.stateRules,
    ``,
    stackRules.stylingRules,
    ``,
    stackRules.routingRules,
    ``,
    `### Error Handling Rules`,
    `- Every async function returns { data, error } pattern`,
    `- User-facing errors must be human-readable`,
    `- Never swallow errors silently — log AND surface to user`,
    ``,
    `### Testing Rules`,
    `- Test-first for new features`,
    `- Required tests: all lib/ functions, Zustand store actions, API/service calls with mocks`,
    `- Test file naming: *.test.ts`,
    `- Test runner: vitest`,
    `- CI requirement: all tests must pass`,
    ``,
    `### Documentation Rules`,
    `- DOCS.md mandatory after every session`,
    `- JSDoc mandatory for all exports with @param, @returns, @throws, @example`,
    ``,
    constraints.length > 0 
      ? [
          `### Critical Business Constraints`,
          ...constraints,
          ``,
        ].join("\n")
      : "",
    stackRules.prohibitedRules,
    ``,
    `## Project Context`,
    `- Project: ${project.name}`,
    `- Problem: ${brief.problem || "No problem statement captured yet."}`,
    `- Platforms: ${project.targetPlatforms.join(", ") || "Web"}`,
    ``,
    `# PRD Reference`,
    prd
  ].join("\n");

  return generateWithAgent("rules-file", content, onChunk);
};
