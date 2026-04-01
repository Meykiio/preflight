import type { Brief, Project, VaultFile } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface DesignGenerationContext {
  brief: Brief;
  onChunk?: (chunk: string) => void;
  platform: string;
  project: Project;
  researchSummary?: string;
  designFiles?: VaultFile[];
}

/**
 * Validates color system for internal consistency.
 * Issue 2.1: Color system was internally contradictory
 */
const validateColorSystem = (colors: {
  background?: string;
  surface?: string;
  text?: string;
  border?: string;
}): {
  isValid: boolean;
  theme: "dark" | "light" | "mixed";
  issues: string[];
} => {
  const issues: string[] = [];
  const isDarkBackground = colors.background && 
    (colors.background.toLowerCase().includes("#1") || 
     colors.background.toLowerCase().includes("#0") ||
     colors.background.toLowerCase().includes("dark") ||
     colors.background.toLowerCase().includes("slate-9") ||
     colors.background.toLowerCase().includes("gray-9"));

  const isLightSurface = colors.surface &&
    (colors.surface.toLowerCase().includes("#f") || 
     colors.surface.toLowerCase().includes("#fff") ||
     colors.surface.toLowerCase().includes("white") ||
     colors.surface.toLowerCase().includes("light") ||
     colors.surface.toLowerCase().includes("slate-1") ||
     colors.surface.toLowerCase().includes("gray-1"));

  const isLightText = colors.text &&
    (colors.text.toLowerCase().includes("#2") || 
     colors.text.toLowerCase().includes("#3") ||
     colors.text.toLowerCase().includes("black") ||
     colors.text.toLowerCase().includes("slate-9") ||
     colors.text.toLowerCase().includes("gray-9"));

  const isDarkText = colors.text &&
    (colors.text.toLowerCase().includes("#f") || 
     colors.text.toLowerCase().includes("#e") ||
     colors.text.toLowerCase().includes("white") ||
     colors.text.toLowerCase().includes("slate-1") ||
     colors.text.toLowerCase().includes("gray-1"));

  if (isDarkBackground && isLightSurface) {
    issues.push("Dark background with light surface - theme conflict");
  }

  if (isDarkBackground && isLightText) {
    issues.push("Dark background with dark text - unreadable");
  }

  if (isLightSurface && isDarkText) {
    issues.push("Light surface with light text - unreadable");
  }

  return {
    isValid: issues.length === 0,
    theme: isDarkBackground ? "dark" : isLightSurface ? "light" : "mixed",
    issues,
  };
};

/**
 * Infers components needed from Brief features.
 * Issue 2.5: Shared component library was never defined
 */
const inferComponentsFromFeatures = (brief: Brief): string[] => {
  const components = new Set<string>();
  const featuresText = brief.coreFeatures.map(f => f.text.toLowerCase()).join(" ");
  const problemText = brief.problem.toLowerCase();

  // Common component patterns
  const componentPatterns: { pattern: RegExp; component: string }[] = [
    { pattern: /list|feed|stream/i, component: "Card List" },
    { pattern: /filter|sort/i, component: "Filter Bar" },
    { pattern: /search/i, component: "Search Input" },
    { pattern: /create|add|new/i, component: "Create Button / FAB" },
    { pattern: /edit|update/i, component: "Edit Modal" },
    { pattern: /delete|remove/i, component: "Delete Confirmation" },
    { pattern: /status|state/i, component: "Status Badge" },
    { pattern: /role|permission|admin|member/i, component: "Role Badge" },
    { pattern: /upload|file|image/i, component: "File Upload" },
    { pattern: /table|grid/i, component: "Data Table" },
    { pattern: /chart|graph|analytics/i, component: "Chart / Graph" },
    { pattern: /notification|alert|toast/i, component: "Toast Notifications" },
    { pattern: /pagination|page/i, component: "Pagination" },
    { pattern: /modal|dialog|popup/i, component: "Modal Dialog" },
    { pattern: /sidebar|navigation|menu/i, component: "Sidebar Navigation" },
    { pattern: /tab/i, component: "Tab Bar" },
    { pattern: /button/i, component: "Button Variants" },
    { pattern: /input|form|field/i, component: "Form Inputs" },
    { pattern: /avatar|user|profile/i, component: "User Avatar" },
    { pattern: /empty|no data/i, component: "Empty State" },
    { pattern: /loading|spinner|skeleton/i, component: "Loading States" },
    { pattern: /error|warning|alert/i, component: "Error States" },
    { pattern: /score|rating|progress/i, component: "Score / Progress Panel" },
  ];

  for (const { pattern, component } of componentPatterns) {
    if (pattern.test(featuresText) || pattern.test(problemText)) {
      components.add(component);
    }
  }

  // Always include these basics
  components.add("Empty State");
  components.add("Loading State");
  components.add("Error State");

  return Array.from(components);
};

/**
 * Gets distinctive font pairings.
 * Issue 2.3: Font choices triggered generic output
 */
const getFontPairing = (style: "technical" | "modern" | "minimal" = "technical"): {
  heading: string;
  body: string;
  code: string;
} => {
  const pairings = {
    technical: {
      heading: "Inter (variable weight, 400-700)",
      body: "Inter (400, 500)",
      code: "JetBrains Mono (for code blocks, inline code, metadata)",
    },
    modern: {
      heading: "Plus Jakarta Sans (variable weight, 500-800)",
      body: "Plus Jakarta Sans (400, 500, 600)",
      code: "JetBrains Mono",
    },
    minimal: {
      heading: "Geist Sans (500-700)",
      body: "Geist Sans (400, 500)",
      code: "JetBrains Mono",
    },
  };

  return pairings[style];
};

const getConstraintBlock = (platform: string): string => {
  const normalized = platform.toLowerCase();

  if (normalized === "stitch") {
    return "Use a bento-style dashboard layout, explicit component hierarchy, and production-ready spacing tokens.";
  }

  if (normalized === "v0") {
    return "Return a React + Tailwind-friendly UI prompt with clear component composition and responsive layout constraints.";
  }

  if (normalized === "figma ai") {
    return "Describe the interface with auto-layout rules, section hierarchy, and reusable component variants.";
  }

  if (normalized === "locofy") {
    return "Focus on export-friendly components, precise layout constraints, and engineering-ready annotations.";
  }

  return "Keep the prompt universal, implementation-oriented, and compatible with modern UI generation tools.";
};

export const getDesignPromptForPlatform = (
  platform: string,
  context: Omit<DesignGenerationContext, "platform">
): string => {
  const featureList = context.brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature) => `- ${feature.text.trim()}`)
    .join("\n");

  const designFilesContext = context.designFiles && context.designFiles.length > 0
    ? context.designFiles.map((f) => `- ${f.name}`).join("\n")
    : "No design files attached.";

  // Infer components from features (Issue 2.5)
  const components = inferComponentsFromFeatures(context.brief);

  // Get distinctive font pairing (Issue 2.3)
  const fonts = getFontPairing("technical");

  // Detect role-based UI needs (Issue 2.6)
  const hasRoleBasedUI = context.brief.coreFeatures.some(f => 
    /admin|member|role|permission|rbac/i.test(f.text)
  );

  return [
    `## ⚠️ DESIGN QUALITY GATES`,
    `Before generating, validate:`,
    `- ✅ Color system is internally consistent (no dark bg + light surface conflicts)`,
    `- ✅ Font pairing is distinctive (not Roboto/Open Sans commodity pairing)`,
    `- ✅ All components are defined with anatomy, variants, and states`,
    ``,
    `<context>`,
    `Product: ${context.project.name}`,
    `Summary: ${context.project.description || "No one-line summary captured yet."}`,
    `Problem: ${context.brief.problem || "No problem statement captured yet."}`,
    `Target user: ${context.brief.targetUser || "No target-user data captured yet."}`,
    `Research context: ${context.researchSummary || "No prior research artifact yet."}`,
    `Design references: ${designFilesContext}`,
    `</context>`,
    ``,
    `<design_language>`,
    `**Typography:**`,
    `- Headings: ${fonts.heading}`,
    `- Body: ${fonts.body}`,
    `- Code: ${fonts.code}`,
    ``,
    `**Color System:** (use Preflight dark theme by default)`,
    `- Background: Dark surface (#0A0A0F or similar)`,
    `- Surface: Dark elevated (#12121A or similar)`,
    `- Text: Light (#F5F5F5 primary, #A0A0A0 secondary)`,
    `- Accent: Primary glow color (blue/purple gradient)`,
    `- Semantic: Success (#22C55E), Warning (#F59E0B), Error (#EF4444), Info (#3B82F6)`,
    `</design_language>`,
    ``,
    `<components>`,
    `**Required Component Library:** (inferred from features)`,
    components.map(c => `- ${c}`).join("\n"),
    ``,
    `**Component Anatomy Requirements:**`,
    `For EACH component above, specify:`,
    `- Purpose and usage`,
    `- Visual anatomy (dimensions, colors, typography, icon, border radius, shadow)`,
    `- All variants (default, hover, active, disabled, loading, error)`,
    `- Interaction behavior (click, keyboard nav, focus ring, transitions)`,
    `</components>`,
    ``,
    `<pages>`,
    featureList || "- No core features captured yet.",
    ``,
    `**Page Description Requirements:**`,
    `For EACH page, specify:`,
    `- Exact layout grid (e.g., "3-column on desktop, single on mobile")`,
    `- All filter pills with labels (e.g., "All / Draft / Pending / Approved")`,
    `- Card/component anatomy with field-level detail`,
    `- Empty state: illustration + heading + description + CTA`,
    `- Loading state: skeleton layout description`,
    `- Error state: icon + heading + description + recovery action`,
    `${hasRoleBasedUI ? `- Admin view vs Member view differences` : ""}`,
    `</pages>`,
    ``,
    `${hasRoleBasedUI ? `<role_based_ui>\n**Admin vs Member View Deltas:**\nFor each page, specify what Admins see that Members don't:\n- Admin-only actions (approve, reject, bulk delete, settings)\n- Admin-only data (analytics, user management, audit logs)\n- Member restrictions (what they cannot access or modify)\n</role_based_ui>\n` : ""}`,
    `<navigation>`,
    `**Navigation Specification:**`,
    `For EVERY tab/link, include:`,
    `- Label (exact text)`,
    `- Icon name (Lucide or Material Symbols)`,
    `- Order position (1st, 2nd, 3rd, etc.)`,
    `- Route path`,
    `</navigation>`,
    ``,
    `<constraints>`,
    getConstraintBlock(platform),
    `Use the Preflight visual language: premium dark UI, tonal surface layering, primary glow accents, and strong hierarchy.`,
    `</constraints>`,
    ``,
    `## HOW TO USE THIS PROMPT WITH ${platform.toUpperCase()}`,
    `${platform.toLowerCase() === "stitch" 
      ? "**Recommended workflow:**\n1. Paste the <design_language> section first to establish the design system\n2. Paste one <page> section at a time\n3. Review each screen output before continuing to the next\n4. Use the <components> section as a reference library throughout"
      : "**Recommended workflow:**\n1. Paste the entire prompt\n2. Review the design system output first\n3. Then generate pages one at a time using the established system"
    }`,
  ].join("\n");
};

export const generateDesignPrompt = (
  context: DesignGenerationContext
): Promise<string> =>
  generateWithAgent(
    "design",
    getDesignPromptForPlatform(context.platform, {
      brief: context.brief,
      project: context.project,
      researchSummary: context.researchSummary,
      designFiles: context.designFiles
    }),
    context.onChunk
  );
