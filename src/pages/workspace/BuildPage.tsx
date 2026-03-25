import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuildStageCard } from "@/components/workspace/BuildStageCard";
import { BuildWorkflowEmptyState } from "@/components/workspace/build/BuildWorkflowEmptyState";
import { BuildWorkflowFooter } from "@/components/workspace/build/BuildWorkflowFooter";
import { BuildWorkflowHeader } from "@/components/workspace/build/BuildWorkflowHeader";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useBuildStages } from "@/hooks/useBuildStages";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { cn } from "@/lib/utils";
import { exportAllPrompts, generateFullWorkflow } from "@/services/generation/buildGeneration";
import type { BuildStage } from "@/types";

interface BuildPageProps {
  projectId: string;
}

export const BuildPage = ({ projectId }: BuildPageProps): JSX.Element => {
  const navigate = useNavigate();
  const toast = useToast();
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { getLatestByType } = useArtifacts(projectId);
  const {
    stages,
    isLoading,
    createStages,
    updateStagePrompt,
    updateStageStatus
  } = useBuildStages(projectId);
  const [platform, setPlatform] = useState("Universal");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const prd = getLatestByType("prd")?.content ?? "No PRD generated yet.";
  const completedCount = stages.filter((stage) => stage.status === "complete").length;
  const currentStageId =
    stages.find((stage) => stage.status === "in-progress")?.id ??
    stages.find((stage) => stage.status === "not-started")?.id;

  // Filter stages based on showCompleted toggle
  const displayedStages = showCompleted
    ? stages
    : stages.filter((stage) => stage.status !== "complete");

  const handleGenerateWorkflow = async (): Promise<void> => {
    if (!project || !brief) {
      toast.error("Project context is still loading.");
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);

    try {
      const generatedStages = await generateFullWorkflow({
        brief,
        platform,
        prd,
        project
      });

      await createStages(
        generatedStages.map((stage) => ({
          description: stage.description,
          name: stage.name,
          platform: stage.platform,
          promptContent: stage.promptContent,
          stageNumber: stage.stageNumber,
          status: stage.status
        }))
      );

      toast.success("Build workflow generated.");
    } catch (error) {
      const errorState = getGenerationErrorState(error);
      if (errorState.shouldRedirect) {
        navigate("/settings");
      }
      setErrorMessage(errorState.inlineMessage ?? "");
      toast.error(errorState.toastMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const cycleStatus = async (stage: BuildStage): Promise<void> => {
    const nextStatus =
      stage.status === "not-started"
        ? "in-progress"
        : stage.status === "in-progress"
          ? "complete"
          : stage.status === "complete"
            ? "not-started"
            : "locked";

    await updateStageStatus(stage.id, nextStatus);

    if (nextStatus === "complete") {
      const nextStage = stages.find((candidate) => candidate.stageNumber === stage.stageNumber + 1);
      if (nextStage && nextStage.status === "locked") {
        await updateStageStatus(nextStage.id, "not-started");
      }
    }

    toast.success("Stage status updated.");
  };

  const handleExportAll = (): void => {
    exportAllPrompts(stages);
    toast.success("Build workflow exported.");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <BuildWorkflowHeader
        isGenerating={isGenerating}
        onGenerate={() => void handleGenerateWorkflow()}
        onSelectPlatform={setPlatform}
        platform={platform}
      />

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
          {errorMessage}
        </div>
      ) : null}

      {/* Stage Controls */}
      {stages.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-label-md text-on-surface-variant">
              {completedCount} of {stages.length} stages completed
            </span>
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition",
                showCompleted
                  ? "border-outline-variant/20 bg-surface text-on-surface-variant"
                  : "border-primary/20 bg-primary/10 text-primary"
              )}
            >
              <span className="material-symbols-outlined text-sm">
                {showCompleted ? "visibility" : "visibility_off"}
              </span>
              {showCompleted ? "Hide" : "Show"} completed ({completedCount})
            </button>
          </div>
        </div>
      )}

      {/* Stages List */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-xl bg-surface-container-high" />
          ))
        ) : displayedStages.length > 0 ? (
          displayedStages.map((stage) => (
            <BuildStageCard
              key={stage.id}
              stage={stage}
              onStatusChange={(nextStage) => void cycleStatus(nextStage)}
            />
          ))
        ) : (
          <BuildWorkflowEmptyState onGenerate={() => void handleGenerateWorkflow()} />
        )}
      </div>

      <BuildWorkflowFooter
        completedCount={completedCount}
        currentStageId={currentStageId}
        onExport={handleExportAll}
        platform={platform}
        stages={stages}
      />
    </div>
  );
};
