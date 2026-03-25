import type { Brief, Project } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GeneratePRDParams {
  brief: Brief;
  designPrompt?: string;
  onChunk?: (chunk: string) => void;
  project: Project;
  researchPrompt?: string;
}

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

  const markdown = [
    `## Product Overview`,
    `${project.name} is a local-first project operating system for vibe coders focused on ${brief.problem || "a not-yet-defined problem space"}.`,
    ``,
    `## Target Users`,
    `- ${brief.targetUser || "Target users still need to be defined."}`,
    ``,
    `## Core Features`,
    features || "- No core features have been captured yet.",
    ``,
    `## Technical Requirements`,
    `- Suggested stack: ${project.techStack.join(", ") || "React, TypeScript, Tailwind, Dexie, Zustand"}`,
    `- Platforms: ${project.targetPlatforms.join(", ") || "Local-first web application"}`,
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
    `- Stable local-first workflow with clear context continuity`,
    ``,
    `## Out of Scope`,
    `- Cloud sync in the open-source default build`,
    `- Multi-user collaboration`,
    `- Production analytics pipelines`
  ].join("\n");

  return generateWithAgent("prd", markdown, onChunk);
};
