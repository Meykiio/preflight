import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BriefCompletionBanner } from "@/components/workspace/brief/BriefCompletionBanner";
import { BriefHeader } from "@/components/workspace/brief/BriefHeader";
import { BriefMetadataColumn } from "@/components/workspace/brief/BriefMetadataColumn";
import { BriefNotesSection } from "@/components/workspace/brief/BriefNotesSection";
import { BriefPrimaryColumn } from "@/components/workspace/brief/BriefPrimaryColumn";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useProjects } from "@/hooks/useProjects";
import { isBriefComplete } from "@/lib/briefUtils";
import { useUIStore } from "@/stores/uiStore";
import type { CoreFeature } from "@/types";

export const BriefPage = (): JSX.Element => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const { brief, updateBrief } = useBrief(projectId);
  const { updateProject } = useProjects();
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const [projectName, setProjectName] = useState("");
  const [problem, setProblem] = useState("");
  const [features, setFeatures] = useState<CoreFeature[]>([]);
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [targetUserInput, setTargetUserInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const skipAutosave = useRef(true);

  useEffect(() => {
    if (!project || !brief) return;
    setProjectName(project.name);
    setProblem(brief.problem);
    setFeatures(brief.coreFeatures.length > 0 ? brief.coreFeatures : [{ id: crypto.randomUUID(), text: "", order: 1 }]);
    setTargetUsers(brief.targetUser.split(",").map((value) => value.trim()).filter(Boolean));
    setNotes(brief.notes);
    skipAutosave.current = true;
  }, [brief, project]);

  useEffect(() => {
    if (!projectId || !brief) return;
    if (skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }
    setSaveState("saving");
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        await updateBrief({
          problem,
          targetUser: targetUsers.join(", "),
          coreFeatures: features.map((feature, index) => ({ ...feature, order: index + 1 })),
          notes
        });
        setSaveState("saved");
      })();
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [brief, features, notes, problem, projectId, targetUsers]);

  const handleProjectNameBlur = async (): Promise<void> => {
    if (!projectId || !projectName.trim() || !project) return;
    await updateProject(projectId, { name: projectName.trim(), targetPlatforms: project.targetPlatforms, techStack: project.techStack });
  };

  const addFeature = (): void =>
    setFeatures((current) => [...current, { id: crypto.randomUUID(), text: "", order: current.length + 1 }]);

  const addTargetUser = (): void => {
    const nextUser = targetUserInput.trim();
    if (!nextUser || targetUsers.includes(nextUser)) return void setTargetUserInput("");
    setTargetUsers((current) => [...current, nextUser]);
    setTargetUserInput("");
  };

  const completionReady = projectName.trim().length > 0 && problem.trim().length > 0 && features.some((feature) => feature.text.trim().length > 0);
  const completionScore = brief ? isBriefComplete(brief, { projectName }) : false;

  return (
    <div className="workspace-max-width">
      <BriefHeader
        completionScore={completionScore}
        onBlurProjectName={() => void handleProjectNameBlur()}
        onChangeProjectName={setProjectName}
        projectName={projectName}
        saveState={saveState}
      />

      {/* 2-Column Grid Layout */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <BriefPrimaryColumn
            features={features}
            onAddFeature={addFeature}
            onChangeProblem={setProblem}
            onRemoveFeature={(featureId) =>
              setFeatures((current) => current.filter((feature) => feature.id !== featureId).map((feature, index) => ({ ...feature, order: index + 1 })))
            }
            onUpdateFeature={(featureId, value) =>
              setFeatures((current) => current.map((feature) => (feature.id === featureId ? { ...feature, text: value } : feature)))
            }
            problem={problem}
          />
        </div>
        <div className="space-y-6">
          <BriefMetadataColumn
            onAddTargetUser={addTargetUser}
            onChangeTargetUserInput={setTargetUserInput}
            onRemoveTargetUser={(user) => setTargetUsers((current) => current.filter((value) => value !== user))}
            targetUserInput={targetUserInput}
            targetUsers={targetUsers}
          />
        </div>
      </div>

      {/* Notes Section - Full Width */}
      <div className="mt-6">
        <BriefNotesSection isOpen={isNotesOpen} notes={notes} onChangeNotes={setNotes} onToggle={() => setIsNotesOpen((current) => !current)} />
      </div>

      {/* Completion Banner */}
      {completionReady && (
        <div className="mt-6">
          <BriefCompletionBanner onContinue={() => setActiveTab("research")} projectName={projectName} />
        </div>
      )}
    </div>
  );
};
