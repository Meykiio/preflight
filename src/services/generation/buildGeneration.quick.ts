/**
 * Quick Tier Build Generation (4-6 stages)
 * For simple apps: landing pages, calculators, todo apps, single-purpose tools
 * 
 * Stage consolidation rules:
 * - Combine Foundation + Core Architecture
 * - Combine Database + simple features
 * - Bundle all simple features into one stage
 * - Combine Audit + Polish into one stage
 * - Make Deployment optional
 */

import { generateWithAgent } from "@/services/ai";
import type { AgentType, Brief, BuildStage, Project } from "@/types";

interface GenerateQuickWorkflowParams {
  brief: Brief;
  platform: string;
  prd: string;
  project: Project;
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

/**
 * Quick Tier: 4-6 stages based on feature count
 */
const getQuickStageDefinitions = (brief: Brief): { agentType: AgentType; name: string; description: string }[] => {
  const featureCount = brief.coreFeatures.filter(f => f.text.trim()).length;
  
  // 4 stages for 1-2 features
  if (featureCount <= 2) {
    return [
      {
        agentType: "build-foundation",
        name: "Foundation + Core",
        description: "Project setup, config, types, and core architecture in one stage"
      },
      {
        agentType: "build-database",
        name: "Data Layer",
        description: "Database schema and simple CRUD operations"
      },
      {
        agentType: "build-feature",
        name: "Feature Bundle",
        description: "All features implemented together"
      },
      {
        agentType: "build-audit",
        name: "Polish + Deploy",
        description: "UI polish, testing, and deployment preparation"
      }
    ];
  }
  
  // 5-6 stages for 3-4 features
  return [
    {
      agentType: "build-foundation",
      name: "Foundation",
      description: "Project setup, config, and types"
    },
    {
      agentType: "build-database",
      name: "Database + Auth",
      description: "Database schema and simple authentication"
    },
    {
      agentType: "build-feature",
      name: "Core Features (Part 1)",
      description: "First half of features"
    },
    {
      agentType: "build-feature",
      name: "Core Features (Part 2)",
      description: "Second half of features"
    },
    {
      agentType: "build-audit",
      name: "Polish",
      description: "UI refinement, loading states, error handling"
    },
    {
      agentType: "build-deployment",
      name: "Deployment",
      description: "README and deployment configuration"
    }
  ];
};

export const generateQuickWorkflow = ({
  brief,
  platform,
  prd,
  project
}: GenerateQuickWorkflowParams): Promise<Omit<BuildStage, "projectId">[]> => {
  const now = Date.now();
  const allStages = getQuickStageDefinitions(brief);

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
