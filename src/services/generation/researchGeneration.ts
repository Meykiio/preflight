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

  // Build research files context
  const researchFilesContext = includeResearchFiles
    ? researchFiles.map((file) => `### ${file.name}\n${decodeFileContent(file)}`).join("\n\n")
    : "";

  const userContent = [
    `PROJECT: ${project.name}`,
    project.description ? `SUMMARY: ${project.description}` : null,
    `TARGET PLATFORM: ${platform}`,
    "",
    "## Context",
    includeBrief
      ? `Problem:\n${brief.problem || "No problem statement captured yet."}`
      : "Problem:\nNot included in this run.",
    includeBrief
      ? `Core Features:\n${formatFeatures(brief) || "No core features captured yet."}`
      : "Core Features:\nNot included in this run.",
    includeTechStack
      ? `Tech Stack Hints:\n${project.techStack.join(", ") || "No tech stack hints yet."}`
      : "Tech Stack Hints:\nNot included in this run.",
    includeUsers
      ? `Target Users:\n${brief.targetUser || "No target users captured yet."}`
      : "Target Users:\nNot included in this run.",
    includeResearchFiles
      ? `## Research Files Context\n${researchFilesContext}`
      : null,
    "",
    "## Research Objectives",
    "- Market analysis for the product category and target audience.",
    "- Competitive landscape and whitespace opportunities.",
    "- Recommended technical patterns, libraries, and architecture choices.",
    "- UX and design references that fit the app category.",
    "- Prompt-engineering tactics for AI-assisted software delivery.",
    "",
    "## Output Format",
    "- Executive summary",
    "- Market and audience findings",
    "- Competitive analysis",
    "- Technical stack recommendations",
    "- UX and design guidance",
    "- Risks, unknowns, and next-step recommendations"
  ].filter(Boolean);

  return generateWithAgent("research", userContent.join("\n\n"), onChunk);
};
