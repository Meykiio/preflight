import type { Brief, Project } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GeneratePRDParams {
  brief: Brief;
  designPrompt?: string;
  onChunk?: (chunk: string) => void;
  project: Project;
  researchPrompt?: string;
}

/**
 * Determines correct framing based on tech stack.
 * Issue 3.1: "Local-first" framing used for a cloud Supabase project
 */
const getDataFraming = (techStack: string[]): "local-first" | "cloud-backed" | "hybrid" => {
  const normalizedStack = techStack.map(tag => tag.toLowerCase());
  
  if (normalizedStack.some(tag => tag.includes("supabase") || tag.includes("firebase") || tag.includes("appwrite"))) {
    return "cloud-backed";
  }
  
  if (normalizedStack.some(tag => tag.includes("dexie") || tag.includes("indexeddb") || tag.includes("pouchdb"))) {
    if (normalizedStack.some(tag => tag.includes("supabase") || tag.includes("firebase"))) {
      return "hybrid";
    }
    return "local-first";
  }
  
  // Default to cloud-backed for modern apps
  return "cloud-backed";
};

/**
 * Auto-derives data tables from Brief features.
 * Issue 3.2: Data model was incomplete
 */
const deriveTablesFromFeatures = (brief: Brief): string[] => {
  const tables: string[] = [];
  const featuresText = brief.coreFeatures.map(f => f.text.toLowerCase()).join(" ");
  const problemText = brief.problem.toLowerCase();
  const notesText = brief.notes?.toLowerCase() || "";

  // Common entity patterns
  const entityPatterns: { pattern: RegExp; table: string }[] = [
    { pattern: /project|workspace|team/i, table: "workspaces" },
    { pattern: /user|member|admin|role/i, table: "users" },
    { pattern: /invite|invitation/i, table: "invites" },
    { pattern: /idea|concept|suggestion/i, table: "ideas" },
    { pattern: /note|comment|feedback/i, table: "comments" },
    { pattern: /task|todo|action/i, table: "tasks" },
    { pattern: /file|document|attachment|upload/i, table: "files" },
    { pattern: /setting|preference|config/i, table: "settings" },
    { pattern: /log|audit|history/i, table: "audit_logs" },
    { pattern: /notification|alert/i, table: "notifications" },
    { pattern: /template|preset/i, table: "templates" },
    { pattern: /ad|campaign|creative/i, table: "ad_campaigns" },
    { pattern: /prompt|generation|ai/i, table: "ai_generations" },
    { pattern: /score|rating|review/i, table: "scores" },
    { pattern: /status|workflow|pipeline/i, table: "statuses" },
    { pattern: /tag|category|label/i, table: "tags" },
  ];

  const allText = featuresText + " " + problemText + " " + notesText;

  for (const { pattern, table } of entityPatterns) {
    if (pattern.test(allText) && !tables.includes(table)) {
      tables.push(table);
    }
  }

  // Always include users table for apps with auth
  if (/admin|member|user|role|permission/i.test(allText)) {
    if (!tables.includes("users")) {
      tables.push("users");
    }
  }

  return tables;
};

/**
 * Gets correct library versions with semver ranges.
 * Issue 3.3: Wrong library version cited
 * Issue 3.4: Libraries from Brief absent from PRD tech stack
 */
const getLibraryVersions = (techStack: string[]): Record<string, string> => {
  const normalizedStack = techStack.map(tag => tag.toLowerCase());
  const versions: Record<string, string> = {};

  // Core React (always include if React mentioned)
  if (normalizedStack.some(tag => tag.includes("react"))) {
    versions["react"] = "^18.3.1";
    versions["react-dom"] = "^18.3.1";
  }

  // TypeScript
  if (normalizedStack.some(tag => tag.includes("typescript") || tag.includes("ts"))) {
    versions["typescript"] = "^5.8.2";
  }

  // Vite
  if (normalizedStack.some(tag => tag.includes("vite"))) {
    versions["vite"] = "^6.2.2";
    versions["@vitejs/plugin-react"] = "^4.3.4";
  }

  // Supabase (Issue 3.3: use v2, not v1)
  if (normalizedStack.some(tag => tag.includes("supabase"))) {
    versions["@supabase/supabase-js"] = "^2.39.0"; // Correct: v2 API
  }

  // TanStack Query v5 (not v4)
  if (normalizedStack.some(tag => tag.includes("tanstack") || tag.includes("react-query"))) {
    versions["@tanstack/react-query"] = "^5.17.0";
  }

  // Zustand v5
  if (normalizedStack.some(tag => tag.includes("zustand"))) {
    versions["zustand"] = "^5.0.6";
  }

  // Dexie v4
  if (normalizedStack.some(tag => tag.includes("dexie"))) {
    versions["dexie"] = "^4.0.11";
    versions["dexie-react-hooks"] = "^1.1.7";
  }

  // Tailwind
  if (normalizedStack.some(tag => tag.includes("tailwind"))) {
    versions["tailwindcss"] = "^3.4.17";
    versions["autoprefixer"] = "^10.4.21";
    versions["postcss"] = "^8.5.3";
  }

  // React Router v6
  if (normalizedStack.some(tag => tag.includes("react-router"))) {
    versions["react-router-dom"] = "^6.30.1";
  }

  // shadcn/ui (CLI tool, not npm package)
  if (normalizedStack.some(tag => tag.includes("shadcn"))) {
    // Note: shadcn/ui is installed via CLI, not npm
    // Add comment in PRD about this
  }

  // Testing
  if (normalizedStack.some(tag => tag.includes("vitest") || tag.includes("test"))) {
    versions["vitest"] = "^4.1.0";
    versions["@testing-library/react"] = "^16.3.2";
    versions["@testing-library/jest-dom"] = "^6.9.1";
  }

  return versions;
};

/**
 * Formats tech stack table with correct versions.
 */
const formatTechStackTable = (techStack: string[]): string => {
  const versions = getLibraryVersions(techStack);
  const framing = getDataFraming(techStack);

  let table = "| Layer | Technology | Version | Purpose |\n";
  table += "|-------|-----------|---------|--------|\n";

  // Add each library with its version
  for (const [lib, version] of Object.entries(versions)) {
    const purpose = getLibraryPurpose(lib);
    table += `| **${lib}** | ${lib} | ${version} | ${purpose} |\n`;
  }

  // Add framing note
  if (framing === "cloud-backed") {
    table += "\n**Architecture Note:** This is a **cloud-backed** application using Supabase. All data persistence goes through Supabase client. Do NOT use \"local-first\" framing.\n";
  } else if (framing === "hybrid") {
    table += "\n**Architecture Note:** This is a **hybrid** application with local cache (Dexie) and cloud sync (Supabase).\n";
  }

  return table;
};

const getLibraryPurpose = (lib: string): string => {
  const purposes: Record<string, string> = {
    "react": "UI framework",
    "react-dom": "React DOM renderer",
    "typescript": "Type safety",
    "vite": "Build tool and dev server",
    "@vitejs/plugin-react": "Vite React plugin",
    "@supabase/supabase-js": "Cloud database and auth",
    "@tanstack/react-query": "Server state management",
    "zustand": "Client state management",
    "dexie": "IndexedDB wrapper for local persistence",
    "dexie-react-hooks": "React hooks for Dexie",
    "tailwindcss": "Utility-first CSS framework",
    "autoprefixer": "PostCSS vendor prefixes",
    "postcss": "CSS processing",
    "react-router-dom": "Client-side routing",
    "vitest": "Test runner",
    "@testing-library/react": "React testing utilities",
    "@testing-library/jest-dom": "Jest DOM matchers",
  };
  return purposes[lib] || "Utility";
};

export const generatePRD = ({
  brief,
  designPrompt,
  onChunk,
  project,
  researchPrompt
}: GeneratePRDParams): Promise<string> => {
  const features = brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature, index) => `${index + 1}. ${feature.text.trim()}`)
    .join("\n");

  // Get stack-aware framing (Issue 3.1)
  const framing = getDataFraming(project.techStack);

  // Derive tables from features (Issue 3.2)
  const tables = deriveTablesFromFeatures(brief);

  // Format tech stack with correct versions (Issues 3.3, 3.4)
  const techStackTable = formatTechStackTable(project.techStack);

  const markdown = [
    `## ⚠️ PRD QUALITY GATES`,
    `Before generating, validate:`,
    `- ✅ Framing matches stack: ${framing.toUpperCase()} (NOT "local-first" for Supabase)`,
    `- ✅ All data tables derived from features: ${tables.length} tables identified`,
    `- ✅ All Brief libraries included in tech stack with correct versions`,
    `- ✅ Semver ranges used (^2.x), not hardcoded patch versions`,
    ``,
    `## Product Overview`,
    `${project.name} is a ${framing} project operating system for vibe coders focused on ${brief.problem || "a not-yet-defined problem space"}.`,
    ``,
    `**Framing Note:** This application uses **${framing}** architecture.`,
    `${framing === "cloud-backed" ? "All data persistence goes through Supabase. Do NOT use 'local-first' terminology." : ""}`,
    `${framing === "hybrid" ? "Local cache (Dexie) syncs with cloud (Supabase) for offline-first experience." : ""}`,
    ``,
    `## Target Users`,
    `- ${brief.targetUser || "Target users still need to be defined."}`,
    ``,
    `## Core Features`,
    features || "- No core features have been captured yet.",
    ``,
    `## Data Model (Auto-Derived from Features)`,
    `**Tables identified:** ${tables.join(", ") || "users (default)"}`,
    ``,
    `For each table above, the PRD must specify:`,
    `- All columns with types`,
    `- Primary key and foreign keys`,
    `- Indexes for query performance`,
    `- RLS policies (if using Supabase)`,
    `- All valid enum values for status columns`,
    `- Timestamp columns (created_at, updated_at)`,
    ``,
    `## Technical Architecture`,
    ``,
    `### Tech Stack`,
    techStackTable,
    ``,
    `**Note on shadcn/ui:** shadcn/ui is a CLI tool, not an npm package. Install with: \`npx shadcn-ui@latest init\``,
    ``,
    `### Key Libraries`,
    `- **All libraries from Brief are included above** — zero drift between Brief and PRD`,
    `- **Versions use semver ranges** (e.g., ^2.39.0) — not hardcoded patches`,
    `- **Supabase v2 API** — uses \`signInWithPassword()\` not \`signIn()\``,
    `- **Zustand v5** — uses named export \`import { create } from 'zustand'\``,
    `- **TanStack Query v5** — uses \`@tanstack/react-query\` package name`,
    ``,
    `## Research Context`,
    researchPrompt || "No research prompt has been generated yet.",
    ``,
    `## Design Requirements`,
    designPrompt || "No design prompt has been generated yet.",
    ``,
    `## Success Metrics`,
    `- Time to first generated artifact under 90 seconds`,
    `- Prompt generation flow adopted across all major modules`,
    `- Stable ${framing} workflow with clear context continuity`,
    ``,
    `## Out of Scope`,
    `${framing === "cloud-backed" ? `- Local-first architecture (this is cloud-backed)` : `- Cloud sync in the open-source default build`}`,
    `- Multi-user collaboration`,
    `- Production analytics pipelines`
  ].join("\n");

  return generateWithAgent("prd", markdown, onChunk);
};
