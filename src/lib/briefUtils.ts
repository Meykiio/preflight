import type { Brief } from "@/types";

interface BriefCompletionMeta {
  projectName?: string;
  targetPlatformsCount?: number;
  techStackCount?: number;
}

export const getBriefCompletionScore = (
  brief: Brief,
  meta: BriefCompletionMeta = {}
): number => {
  let score = 0;

  if (meta.projectName?.trim()) {
    score += 20;
  }

  if (brief.problem.trim()) {
    score += 25;
  }

  if (brief.targetUser.trim()) {
    score += 15;
  }

  if (brief.coreFeatures.filter((feature) => feature.text.trim()).length >= 1) {
    score += 25;
  }

  if ((meta.techStackCount ?? 0) > 0) {
    score += 10;
  }

  if ((meta.targetPlatformsCount ?? 0) > 0) {
    score += 5;
  }

  return score;
};

export const isBriefComplete = (
  brief: Brief,
  meta: BriefCompletionMeta = {}
): boolean => getBriefCompletionScore(brief, meta) >= 70;
