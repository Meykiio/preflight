import type { Brief, Project, VaultFile } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GenerateResearchPromptParams {
  activeNodes: string[];
  brief: Brief;
  onChunk?: (chunk: string) => void;
  project: Project;
  researchFiles?: VaultFile[];
  platform?: string;
}

const formatFeatures = (brief: Brief): string =>
  brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature, index) => `${index + 1}. ${feature.text.trim()}`)
    .join("\n");

const decodeFileContent = (file: VaultFile): string => {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(file.data));
  } catch {
    return `[File: ${file.name}]`;
  }
};

/**
 * Detects if the product is an internal tool vs public product.
 * Issue 1.1: Research prompt doesn't distinguish between internal tools and public products
 */
const detectProductType = (brief: Brief): {
  isInternalTool: boolean;
  indicators: string[];
} => {
  const indicators: string[] = [];
  const problemText = brief.problem.toLowerCase();
  const featuresText = brief.coreFeatures.map(f => f.text.toLowerCase()).join(" ");
  const notesText = brief.notes?.toLowerCase() || "";

  // Internal tool indicators
  const internalPatterns = [
    { pattern: /internal/i, label: "internal" },
    { pattern: /invite-only|invite only/i, label: "invite-only" },
    { pattern: /staff-only|staff only/i, label: "staff-only" },
    { pattern: /team tool|team-only/i, label: "team tool" },
    { pattern: /admin panel|dashboard|back office|backoffice/i, label: "admin system" },
    { pattern: /not for external|no public/i, label: "not public" },
    { pattern: /workflow|automation|productivity/i, label: "workflow tool" },
  ];

  for (const { pattern, label } of internalPatterns) {
    if (pattern.test(problemText) || pattern.test(featuresText) || pattern.test(notesText)) {
      indicators.push(label);
    }
  }

  return {
    isInternalTool: indicators.length > 0,
    indicators,
  };
};

/**
 * Extracts stack-specific research questions based on tech stack.
 * Issue 1.2: Research prompt doesn't ask the right technical questions for the stated stack
 */
const getStackSpecificQuestions = (techStack: string[]): string[] => {
  const questions: string[] = [];
  const normalizedStack = techStack.map(tag => tag.toLowerCase());

  // Supabase-specific questions
  if (normalizedStack.some(tag => tag.includes("supabase"))) {
    questions.push(
      "What are the best practices for Supabase Row Level Security (RLS) policies for multi-tenant workspace isolation?",
      "How should Supabase Edge Functions be structured for long-form AI generation with streaming?",
      "What is the optimal pattern for Supabase Storage file uploads with signed URLs?",
      "How to structure CLAUDE.md / .cursorrules for full-stack Supabase projects?",
      "What are Supabase Auth v2 API patterns and common pitfalls?",
      "Should draft state be persisted in Supabase or IndexedDB for this use case?"
    );
  }

  // BYOK / AI API questions
  if (normalizedStack.some(tag => tag.includes("anthropic") || tag.includes("openai") || tag.includes("gemini"))) {
    questions.push(
      "What are the secure patterns for BYOK (Bring Your Own Key) API key storage — encrypted server-side vs client-side?",
      "How should AI API keys be rotated and managed in a multi-tenant application?",
      "What rate limiting strategies work best for AI API calls?"
    );
  }

  // TanStack Query questions
  if (normalizedStack.some(tag => tag.includes("tanstack") || tag.includes("react-query"))) {
    questions.push(
      "What are TanStack Query v5 best practices for cache invalidation in this app category?",
      "How to structure query keys for optimal cache reuse?"
    );
  }

  // Terminal coding agent questions
  if (normalizedStack.some(tag => tag.includes("cursor") || tag.includes("claude code") || tag.includes("qwen"))) {
    questions.push(
      `What are the optimal .cursorrules / CLAUDE.md patterns for ${normalizedStack.find(t => t.includes('cursor') || t.includes('claude') || t.includes('qwen'))}?`,
      "What are common failure modes when building apps like this with AI coding agents?",
      "What sequential prompt strategies work best for multi-stage builds?"
    );
  }

  // Zustand questions
  if (normalizedStack.some(tag => tag.includes("zustand"))) {
    questions.push(
      "What are Zustand v5 patterns for persisting state to backend vs local storage?",
      "How to structure Zustand stores for optimal reactivity in large apps?"
    );
  }

  // Tailwind/shadcn questions
  if (normalizedStack.some(tag => tag.includes("tailwind") || tag.includes("shadcn"))) {
    questions.push(
      "What are shadcn/ui component customization patterns for unique branding?",
      "How to structure Tailwind config for design token scalability?"
    );
  }

  return questions;
};

/**
 * Generates research sections based on product type.
 */
const getResearchSections = (isInternalTool: boolean, techStack: string[], platform: string): string => {
  if (isInternalTool) {
    return `### RESEARCH AREA 1 — Internal Tool Architecture
Generate highly specific QUESTIONS for the AI to answer:
- What are the team workflow patterns this tool must support?
- What role-based access control (RBAC) patterns fit this use case? (admin, member, viewer, etc.)
- What are internal adoption friction points for tools like this?
- How do teams currently solve this problem? (specific workflows, spreadsheets, manual processes)
- What data ownership and governance requirements apply?
- What audit logging and compliance needs exist?
- What integrations with existing internal tools are needed? (Slack, Notion, Google Workspace, etc.)

### RESEARCH AREA 2 — Technical Stack Deep Dive
${getStackSpecificQuestions(techStack).map(q => `- ${q}`).join("\n")}

### RESEARCH AREA 3 — Design System for Internal Tools
Generate QUESTIONS for:
- What are best-in-class internal tool references? (name 3-5 specific B2B SaaS admin panels)
- What information density is appropriate for expert users?
- What keyboard shortcuts and power user features are expected?
- What accessibility requirements are critical for workplace compliance?
- What dark mode expectations exist for tools used 8+ hours daily?

### RESEARCH AREA 4 — Prompt Engineering for AI Coding
Generate QUESTIONS specific to the chosen coding platform:
- What are best practices for building internal tools with ${techStack.join(", ")}?
- How to structure system instructions for multi-stage internal tool builds?
- What are common failure modes when building admin panels and dashboards?
- What .cursorrules/CLAUDE.md patterns work best for team projects?`;
  }

  // Public product research sections
  return `### RESEARCH AREA 1 — Market & Audience Analysis
Generate highly specific QUESTIONS for the AI to answer:
- What is the precise demographic profile of [target user]?
- What is the market size? (TAM, SAM, SOM with 2024-2027 projections with specific numbers)
- What are the top 5-10 friction points for [user type]?
- How do users currently solve this problem? (specific workflows)
- What communities do they inhabit? (name specific Reddit subreddits, Discord servers, Facebook groups)
- What topics generate the most engagement in these communities?

### RESEARCH AREA 2 — Competitive Landscape
Generate QUESTIONS for:
- Who are the direct competitors? (list 5-10 companies with funding amounts, pricing tiers, key differentiators)
- Who are the dangerous incumbents that could crush this app?
- What gap analysis reveals whitespace opportunities?
- What would make this app go viral?
- What are recent launches in this space (last 12 months)?
- What acquisitions happened in this category?

### RESEARCH AREA 3 — Technology Stack Deep Dive
${getStackSpecificQuestions(techStack).map(q => `- ${q}`).join("\n")}

### RESEARCH AREA 4 — Design System & UX Patterns
Generate QUESTIONS for:
- What are best-in-class reference apps for [app category]? (name 3-5 specific apps)
- What cognitive load reduction patterns apply to this user type?
- What are dark/light mode expectations for this audience?
- What are mobile vs desktop usage patterns for this use case?
- What accessibility requirements are critical for this user demographic?
- What typography and color psychology principles apply here?
- What specific component patterns should be used?

### RESEARCH AREA 5 — Prompt Engineering & AI Coding
Generate QUESTIONS specific to the chosen coding platform (Lovable, Bolt, Cursor, etc.):
- What are best practices for [target platform]?
- How to structure system instructions optimally for this platform?
- What are common failure modes when building apps like this?
- What is the optimal .cursorrules/CLAUDE.md structure for this project?
- What sequential prompt strategies work best?
- What are community-verified super-prompt patterns for this category?`;
};

export const generateResearchPrompt = ({
  activeNodes,
  brief,
  onChunk,
  project,
  researchFiles = [],
  platform = "Universal"
}: GenerateResearchPromptParams): Promise<string> => {
  const includeBrief = activeNodes.includes("brief");
  const includeTechStack = activeNodes.includes("tech-stack");
  const includeUsers = activeNodes.includes("user-personas");
  const includeResearchFiles = activeNodes.includes("research-results") && researchFiles.length > 0;

  // Detect product type (Issue 1.1)
  const { isInternalTool, indicators } = detectProductType(brief);

  // Build research files context
  const researchFilesContext = includeResearchFiles
    ? researchFiles.map((file) => `### ${file.name}\n${decodeFileContent(file)}`).join("\n\n")
    : "";

  // Get dynamic research sections based on product type (Issue 1.2)
  const techStack = includeTechStack ? project.techStack : [];
  const dynamicSections = getResearchSections(isInternalTool, techStack, platform);

  const userContent = [
    `PROJECT: ${project.name}`,
    project.description ? `SUMMARY: ${project.description}` : null,
    `TARGET PLATFORM: ${platform}`,
    `PRODUCT TYPE: ${isInternalTool ? "INTERNAL TOOL" : "PUBLIC PRODUCT"}`,
    isInternalTool ? `DETECTED INDICATORS: ${indicators.join(", ")}` : null,
    "",
    "## Context",
    includeBrief
      ? `Problem:\n${brief.problem || "No problem statement captured yet."}`
      : "Problem:\nNot included in this run.",
    includeBrief
      ? `Core Features:\n${formatFeatures(brief) || "No core features captured yet."}`
      : "Core Features:\nNot included in this run.",
    includeTechStack
      ? `Tech Stack Hints:\n${techStack.join(", ") || "No tech stack hints yet."}`
      : "Tech Stack Hints:\nNot included in this run.",
    includeUsers
      ? `Target Users:\n${brief.targetUser || "No target users captured yet."}`
      : "Target Users:\nNot included in this run.",
    includeResearchFiles
      ? `## Research Files Context\n${researchFilesContext}`
      : null,
    "",
    "## Dynamic Research Sections",
    dynamicSections,
    "",
    "## Output Format",
    "Provide your research in this structure:",
    "1. Executive Summary (150-200 words)",
    isInternalTool 
      ? "2. Internal Tool Architecture (with specific data and patterns)"
      : "2. Market & Audience (with specific data and numbers)",
    "3. Technology Recommendations (with specific versions and rationale)",
    "4. Design & UX Guidance (with reference apps and patterns)",
    "5. Prompt Engineering Best Practices (for the target platform)",
    "6. Key Risks & Blind Spots (what I don't know yet)",
    "7. Recommended Next Steps (actionable roadmap)"
  ].filter(Boolean);

  return generateWithAgent("research", userContent.join("\n\n"), onChunk);
};
