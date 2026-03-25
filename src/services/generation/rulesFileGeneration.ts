import type { Brief, Project } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GenerateRulesFileParams {
  platform: string;
  prd: string;
  brief: Brief;
  onChunk?: (chunk: string) => void;
  project: Project;
}

const RULE_TEMPLATES: Record<string, string[]> = {
  Universal: [
    "# Technical Constraints",
    "- Strict TypeScript",
    "- Functional React only",
    "- Small files and explicit error handling"
  ],
  Cursor: [
    "# Technical Constraints",
    "- Respect project rules and file references",
    "- Keep prompts scoped and reversible",
    "# UI Integrity Rules",
    "- Use the project token system",
    "- Preserve tonal layering and layout structure"
  ],
  Claude: [
    "# Session Instructions",
    "- Summarize progress and next actions",
    "- Avoid large context resets",
    "# Code Rules",
    "- Keep changes modular and documented"
  ]
};

export const generateRulesFile = ({
  platform,
  prd,
  brief,
  onChunk,
  project
}: GenerateRulesFileParams): Promise<string> => {
  const normalized =
    platform === "Claude Code" || platform === "Claude" ? "Claude" : platform;
  const template = RULE_TEMPLATES[normalized] || RULE_TEMPLATES.Universal;

  const content = [
    ...template,
    "",
    "# Project Context",
    `- Project: ${project.name}`,
    `- Problem: ${brief.problem || "No problem statement captured yet."}`,
    `- Platforms: ${project.targetPlatforms.join(", ") || "Web"}`,
    "",
    "# PRD Reference",
    prd
  ].join("\n");

  return generateWithAgent("rules-file", content, onChunk);
};
