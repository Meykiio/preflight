import type { Brief, Project } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GenerateSystemInstructionsParams {
  platform: string;
  prd: string;
  brief: Brief;
  onChunk?: (chunk: string) => void;
  project: Project;
}

const PLATFORM_CONTEXT: Record<string, string> = {
  Universal: "Use the instructions in any coding agent with strict modularity and testing discipline.",
  Lovable: "Keep prompts scoped to single features and avoid touching auth or data flows unless required.",
  Cursor: "Respect repo rules, use file references, and keep edits localized and reviewable.",
  "Claude Code": "Manage session context carefully and summarize progress after each meaningful change.",
  Bolt: "Favor isolated components and avoid leaking state across unrelated surfaces."
};

export const generateSystemInstructions = ({
  platform,
  prd,
  brief,
  onChunk,
  project
}: GenerateSystemInstructionsParams): Promise<string> => {
  const content = [
    "CONTEXT:",
    `Project: ${project.name}`,
    `Problem: ${brief.problem || "No problem statement captured yet."}`,
    "",
    "OBJECTIVE:",
    `Build the next project phase for ${project.name} with clean modular architecture and zero regressions.`,
    "",
    "SYSTEM:",
    PLATFORM_CONTEXT[platform] || PLATFORM_CONTEXT.Universal,
    "",
    "CONSTRAINTS:",
    "- TypeScript strict mode only",
    "- Keep files small and composable",
    "- Update docs after every meaningful change",
    "- Do not add dependencies without explicit approval",
    "",
    "REFERENCE PRD:",
    prd
  ].join("\n");

  return generateWithAgent("system-instructions", content, onChunk);
};
