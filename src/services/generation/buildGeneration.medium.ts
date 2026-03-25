/**
 * Medium Tier Build Generation (7-10 stages)
 * For standard apps: dashboards, blogs, small e-commerce, SaaS MVPs
 * 
 * Stage consolidation rules:
 * - Keep Foundation separate (critical)
 * - Keep Database separate (critical)
 * - Combine Auth with Database if simple
 * - One stage per major feature
 * - Combine final audit stages into one "Polish"
 */

import { generateWithAgent } from "@/services/ai";
import type { AgentType, Brief, BuildStage, Project } from "@/types";

interface GenerateMediumWorkflowParams {
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
 * Medium Tier: 7-10 stages based on feature count
 */
const getMediumStageDefinitions = (brief: Brief): { agentType: AgentType; name: string; description: string }[] => {
  const features = brief.coreFeatures.filter(f => f.text.trim());
  const featureCount = features.length;
  
  const stages: { agentType: AgentType; name: string; description: string }[] = [
    {
      agentType: "build-foundation",
      name: "Foundation",
      description: "Project setup, config, types, and Tailwind tokens"
    },
    {
      agentType: "build-database",
      name: "Database Schema",
      description: "Database tables, indexes, and relationships"
    }
  ];
  
  // Add auth stage if needed (check PRD for auth mentions)
  // For now, include as separate stage for medium builds
  stages.push({
    agentType: "build-database",
    name: "Authentication",
    description: "User auth, sessions, and permissions"
  });
  
  // Add core layout stage
  stages.push({
    agentType: "build-feature",
    name: "Core Layout",
    description: "Main layout, navigation, and shared components"
  });
  
  // Add feature stages (group if more than 4 features)
  if (featureCount <= 4) {
    // One stage per feature
    features.forEach((feature) => {
      stages.push({
        agentType: "build-feature",
        name: feature.text.trim(),
        description: "Feature implementation"
      });
    });
  } else {
    // Group features into chunks of 2-3
    const chunkSize = 3;
    for (let i = 0; i < features.length; i += chunkSize) {
      const chunk = features.slice(i, i + chunkSize);
      stages.push({
        agentType: "build-feature",
        name: `Features ${i + 1}-${Math.min(i + chunkSize, featureCount)}`,
        description: `Implementing: ${chunk.map(f => f.text.trim()).join(", ")}`
      });
    }
  }
  
  // Add integration stage if more than 3 features
  if (featureCount > 3) {
    stages.push({
      agentType: "build-feature",
      name: "Integration",
      description: "Cross-module flows and routing"
    });
  }
  
  // Combined polish stage (replaces 4 separate audit stages)
  stages.push({
    agentType: "build-audit",
    name: "Polish & Testing",
    description: "UI polish, loading states, error handling, and testing"
  });
  
  // Optional deployment stage
  stages.push({
    agentType: "build-deployment",
    name: "Deployment",
    description: "README, config, and deployment preparation"
  });
  
  return stages;
};

export const generateMediumWorkflow = ({
  brief,
  platform,
  prd,
  project
}: GenerateMediumWorkflowParams): Promise<Omit<BuildStage, "projectId">[]> => {
  const now = Date.now();
  const allStages = getMediumStageDefinitions(brief);

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
