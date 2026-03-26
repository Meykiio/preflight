import { generateWithAgent } from "@/services/ai";
import type { Brief } from "@/types";

export interface TechStackRecommendation {
  frontend: { name: string; version: string; rationale: string };
  styling: { name: string; version: string; rationale: string };
  stateManagement: { name: string; version: string; rationale: string };
  database: { name: string; version: string; rationale: string };
  deployment: { name: string; rationale: string };
  alternatives: Array<{
    name: string;
    tradeoffs: string;
  }>;
}

interface GenerateTechStackRecommendationParams {
  brief: Brief;
  researchContent: string;
  projectName: string;
}

const buildTechStackPrompt = ({
  brief,
  researchContent,
  projectName
}: GenerateTechStackRecommendationParams): string => {
  const features = brief.coreFeatures
    .filter((f) => f.text.trim())
    .map((f) => f.text.trim())
    .join(", ");

  return `You are a Senior Software Architect with 15+ years of experience selecting optimal technology stacks for web applications.

Your job is to recommend the BEST technology stack for this specific project based on the brief and research provided.

## PROJECT CONTEXT

**Project Name:** ${projectName}

**Problem:** ${brief.problem}

**Target Users:** ${brief.targetUser}

**Core Features:** ${features || "Not specified"}

## RESEARCH INSIGHTS

${researchContent || "No research content provided yet."}

## YOUR TASK

Analyze the project context and research above. Recommend the optimal technology stack considering:

1. **Project Requirements** - What does this app specifically need?
2. **Team Skills** - What's easiest for non-technical founders to learn?
3. **Time to Market** - What enables fastest MVP development?
4. **Scalability** - What can grow with the project?
5. **Cost** - What has the best free/low-cost tier?
6. **Ecosystem** - What has the best documentation and community support?

## OUTPUT FORMAT

Provide your recommendation in this EXACT JSON format:

{
  "frontend": {
    "name": "Framework name",
    "version": "Major version (e.g., 18.x, 3.x)",
    "rationale": "2-3 sentences explaining WHY this framework for THIS project"
  },
  "styling": {
    "name": "CSS framework/method",
    "version": "Version",
    "rationale": "Why this styling approach"
  },
  "stateManagement": {
    "name": "State management library",
    "version": "Version",
    "rationale": "Why this state management for this project"
  },
  "database": {
    "name": "Database/persistence layer",
    "version": "Version if applicable",
    "rationale": "Why this database approach"
  },
  "deployment": {
    "name": "Deployment platform",
    "rationale": "Why this deployment option"
  },
  "alternatives": [
    {
      "name": "Alternative stack name (e.g., 'Vue + Nuxt stack')",
      "tradeoffs": "When to choose this instead (1-2 sentences)"
    }
  ]
}

## QUALITY STANDARDS

Your recommendation must be:
✅ Specific to THIS project (not generic advice)
✅ Based on the research insights provided
✅ Actionable (real package names, real versions)
✅ Honest about tradeoffs
✅ Appropriate for non-technical founders

❌ NEVER:
- Recommend enterprise-level complexity for simple apps
- Suggest technologies without explaining WHY
- Ignore the research insights
- Recommend paid tools when free alternatives exist

Output ONLY the JSON. No preamble, no markdown code blocks.`;
};

export const generateTechStackRecommendation = async (
  params: GenerateTechStackRecommendationParams
): Promise<TechStackRecommendation | null> => {
  try {
    const prompt = buildTechStackPrompt(params);
    const response = await generateWithAgent("prd", prompt);

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse tech stack recommendation as JSON");
      return null;
    }

    const recommendation = JSON.parse(jsonMatch[0]) as TechStackRecommendation;
    return recommendation;
  } catch (error) {
    console.error("Failed to generate tech stack recommendation:", error);
    return null;
  }
};
