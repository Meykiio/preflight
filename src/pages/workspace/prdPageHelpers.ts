import type { NavigateFunction } from "react-router-dom";
import { getGenerationErrorState } from "@/lib/generationErrors";

export const SYSTEM_PLATFORMS = ["Universal", "Lovable", "Cursor", "Claude Code", "Bolt"];
export const RULE_PLATFORMS = ["Universal", "Cursor", "Claude"];

export const buildPRDContextAvailability = (
  hasBrief: boolean,
  hasResearch: boolean,
  hasDesign: boolean
): Array<{ available: boolean; label: string }> => [
  { label: "Brief", available: hasBrief },
  { label: "Research", available: hasResearch },
  { label: "Design", available: hasDesign }
];

export const getRulesFileLabel = (rulesPlatform: string): string =>
  rulesPlatform === "Cursor"
    ? ".CURSORRULES"
    : rulesPlatform === "Claude"
      ? "CLAUDE.MD"
      : "RULES.MD";

export const handlePRDGenerationError = (
  error: unknown,
  navigate: NavigateFunction,
  toastError: (message: string) => void,
  setErrorMessage: (message: string) => void
): void => {
  const errorState = getGenerationErrorState(error);
  if (errorState.shouldRedirect) {
    navigate("/settings");
  }

  setErrorMessage(errorState.inlineMessage ?? "");
  toastError(errorState.toastMessage);
};
