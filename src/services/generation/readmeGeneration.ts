import type { Brief, Project, GeneratedArtifact, BuildStage } from "@/types";
import { generateWithAgent } from "@/services/ai";

interface GenerateReadmeParams {
  project: Project;
  brief: Brief | null;
  artifacts: GeneratedArtifact[];
  stages: BuildStage[];
  techStack?: string[];
  onChunk?: (chunk: string) => void;
}

const formatFeatures = (brief: Brief): string =>
  brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature) => `- ${feature.text.trim()}`)
    .join("\n") || "- Features to be defined";

const formatArtifacts = (artifacts: GeneratedArtifact[]): string => {
  const types = new Set(artifacts.map((a) => a.type.replace(/_/g, " ")));
  if (types.size === 0) return "No artifacts generated yet.";
  return Array.from(types)
    .map((type) => `- ${type.charAt(0).toUpperCase() + type.slice(1)}`)
    .join("\n");
};

const formatBuildProgress = (stages: BuildStage[]): string => {
  const completed = stages.filter((s) => s.status === "complete").length;
  const total = stages.length;
  if (total === 0) return "Build not started";
  const percentage = Math.round((completed / total) * 100);
  return `${completed}/${total} stages complete (${percentage}%)`;
};

export const generateReadme = ({
  project,
  brief,
  artifacts,
  stages,
  techStack,
  onChunk
}: GenerateReadmeParams): Promise<string> => {
  const userContent = [
    `Generate a comprehensive, professional README.md for the following project. Make it impressive for the GitHub community to attract contributors and stars.`,
    ``,
    `## PROJECT INFORMATION`,
    `Name: ${project.name}`,
    `Description: ${project.description || "An innovative project built with Preflight"}`,
    `Status: ${project.status}`,
    `Target Platforms: ${project.targetPlatforms.join(", ") || "Not specified"}`,
    ``,
    `## BRIEF CONTEXT`,
    brief?.problem ? `Problem: ${brief.problem}` : "Problem: To be defined",
    brief?.targetUser ? `Target Users: ${brief.targetUser}` : "Target Users: To be defined",
    brief?.coreFeatures && brief.coreFeatures.length > 0 ? `\nCore Features:\n${formatFeatures(brief)}` : "",
    ``,
    `## TECH STACK`,
    techStack && techStack.length > 0 ? techStack.join(", ") : "Modern web technologies (React, TypeScript, Tailwind CSS, Vite)",
    ``,
    `## GENERATED ARTIFACTS`,
    formatArtifacts(artifacts),
    ``,
    `## BUILD PROGRESS`,
    formatBuildProgress(stages),
    ``,
    `## README REQUIREMENTS`,
    `Create a README.md with the following sections:`,
    `1. Hero banner with project name, tagline, and badges (build status, license, version)`,
    `2. About section - What is this project, who it's for`,
    `3. Features - Comprehensive feature list with emojis`,
    `4. Tech Stack - All technologies used with icons`,
    `5. Quick Start - Installation and setup (5 minutes max)`,
    `6. Usage Guide - How to use each feature`,
    `7. Project Structure - Folder organization`,
    `8. Available Scripts - Development commands`,
    `9. Contributing - How to contribute`,
    `10. License - MIT license info`,
    `11. Acknowledgments - Built with Preflight`,
    ``,
    `Make the README:`,
    `- Visually appealing with emojis and clear hierarchy`,
    `- Easy to scan with clear section headers`,
    `- Include code blocks for installation and usage`,
    `- Add badges for technologies used`,
    `- Write in a friendly, welcoming tone`,
    `- Optimize for GitHub discovery`,
    ``,
    `Output ONLY the README.md content in markdown format. No preamble or explanations.`
  ].filter(Boolean);

  return generateWithAgent("prd", userContent.join("\n\n"), onChunk);
};
