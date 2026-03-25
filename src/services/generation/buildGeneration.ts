import { generateWithAgent } from "@/services/ai";
import type { AgentType, Brief, BuildStage, Project } from "@/types";

interface GenerateFullWorkflowParams {
  brief: Brief;
  platform: string;
  prd: string;
  project: Project;
}

interface WorkflowStageDefinition {
  agentType: AgentType;
  description: string;
  name: string;
}

const buildStagePrompt = (
  title: string,
  brief: Brief,
  prd: string,
  platform: string
): string => {
  const features = brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature, index) => `${index + 1}. ${feature.text.trim()}`)
    .join("\n");

  return [
    `Stage: ${title}`,
    `Platform: ${platform}`,
    "",
    "Use the project context below to execute this stage cleanly:",
    `Problem: ${brief.problem || "No problem statement captured yet."}`,
    `Core Features:\n${features || "No core features captured yet."}`,
    "",
    "Reference PRD:",
    prd
  ].join("\n");
};

const getStageDefinitions = (brief: Brief): WorkflowStageDefinition[] => {
  const fixedStages: WorkflowStageDefinition[] = [
    {
      agentType: "build-foundation",
      name: "Foundation",
      description: "Environment, tokens, core scaffolding."
    },
    {
      agentType: "build-database",
      name: "Database & Auth",
      description: "Local data structures and future cloud hooks."
    },
    {
      agentType: "build-feature",
      name: "Core Architecture",
      description: "Shared layout, stores, and service organization."
    }
  ];

  const featureStages: WorkflowStageDefinition[] = brief.coreFeatures
    .filter((feature) => feature.text.trim())
    .map((feature) => ({
      agentType: "build-feature",
      name: feature.text.trim(),
      description: "Feature block implementation."
    }));

  const finalStages: WorkflowStageDefinition[] = [
    {
      agentType: "build-feature",
      name: "Integration Layer",
      description: "Cross-module flows and routing handoff."
    },
    {
      agentType: "build-audit",
      name: "Audit & Refactor",
      description: "Quality, consistency, and maintainability pass."
    },
    {
      agentType: "build-audit",
      name: "Bug Fix Cycle",
      description: "Stability and regression cleanup."
    },
    {
      agentType: "build-audit",
      name: "Polish",
      description: "Loading, empty states, and motion refinement."
    },
    {
      agentType: "build-audit",
      name: "Final Audit",
      description: "Security, accessibility, and performance review."
    },
    {
      agentType: "build-deployment",
      name: "Deployment Prep",
      description: "README, config, and deployment readiness."
    }
  ];

  return [...fixedStages, ...featureStages, ...finalStages];
};

export const generateFullWorkflow = ({
  brief,
  platform,
  prd,
  project
}: GenerateFullWorkflowParams): Promise<Omit<BuildStage, "projectId">[]> => {
  const now = Date.now();
  const allStages = getStageDefinitions(brief);

  return Promise.all(
    allStages.map(async (stage, index) => ({
      id: crypto.randomUUID(),
      stageNumber: index + 1,
      name: stage.name,
      description: stage.description,
      status: index === 0 ? "not-started" : "locked",
      promptContent: await generateWithAgent(
        stage.agentType,
        [
          `Project: ${project.name}`,
          `Platform: ${platform}`,
          `Stage Name: ${stage.name}`,
          `Stage Description: ${stage.description}`,
          "",
          buildStagePrompt(stage.name, brief, prd, platform)
        ].join("\n")
      ),
      platform,
      createdAt: now,
      updatedAt: now
    }))
  );
};

export const exportAllPrompts = (stages: BuildStage[]): void => {
  const content = stages
    .map(
      (stage) =>
        `## Stage ${stage.stageNumber.toString().padStart(2, "0")} - ${stage.name}\n\n\`\`\`\n${stage.promptContent}\n\`\`\``
    )
    .join("\n\n---\n\n");

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "preflight-build-workflow.md";
  link.click();
  URL.revokeObjectURL(url);
};
