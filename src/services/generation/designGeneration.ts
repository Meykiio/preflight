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

const getConstraintBlock = (platform: string): string => {
  const normalized = platform.toLowerCase();

  if (normalized === "stitch") {
    return "Use a bento-style dashboard layout, explicit component hierarchy, and production-friendly spacing tokens.";
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

  return [
    `<context>`,
    `Product: ${context.project.name}`,
    `Summary: ${context.project.description || "No one-line summary captured yet."}`,
    `Problem: ${context.brief.problem || "No problem statement captured yet."}`,
    `Target user: ${context.brief.targetUser || "No target-user data captured yet."}`,
    `Research context: ${context.researchSummary || "No prior research artifact yet."}`,
    `Design references: ${designFilesContext}`,
    `</context>`,
    ``,
    `<pages>`,
    featureList || "- No core features captured yet.",
    `</pages>`,
    ``,
    `<constraints>`,
    getConstraintBlock(platform),
    `Use the Preflight visual language: premium dark UI, tonal surface layering, primary glow accents, and strong hierarchy.`,
    `</constraints>`
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
