import { memo, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { BriefCompletionBanner } from "@/components/workspace/brief/BriefCompletionBanner";
import { BriefMetadataColumn } from "@/components/workspace/brief/BriefMetadataColumn";
import { BriefNotesSection } from "@/components/workspace/brief/BriefNotesSection";
import { BriefPrimaryColumn } from "@/components/workspace/brief/BriefPrimaryColumn";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useProjects } from "@/hooks/useProjects";
import { isBriefComplete } from "@/lib/briefUtils";
import { useUIStore } from "@/stores/uiStore";
import type { CoreFeature } from "@/types";

export const BriefPage = memo((): JSX.Element => {
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
  }, [brief, features, notes, problem, projectId, targetUsers, updateBrief]);

  const handleProjectNameBlur = useCallback(async (): Promise<void> => {
    if (!projectId || !projectName.trim() || !project) return;
    await updateProject(projectId, { name: projectName.trim(), targetPlatforms: project.targetPlatforms, techStack: project.techStack });
  }, [projectId, projectName, project, updateProject]);

  const addFeature = useCallback((): void =>
    setFeatures((current) => [...current, { id: crypto.randomUUID(), text: "", order: current.length + 1 }]), []);

  const addTargetUser = useCallback((): void => {
    const nextUser = targetUserInput.trim();
    if (!nextUser || targetUsers.includes(nextUser)) return void setTargetUserInput("");
    setTargetUsers((current) => [...current, nextUser]);
    setTargetUserInput("");
  }, [targetUserInput, targetUsers]);

  const handleRemoveFeature = useCallback((featureId: string): void => {
    setFeatures((current) => current.filter((feature) => feature.id !== featureId).map((feature, index) => ({ ...feature, order: index + 1 })));
  }, []);

  const handleUpdateFeature = useCallback((featureId: string, value: string): void => {
    setFeatures((current) => current.map((feature) => (feature.id === featureId ? { ...feature, text: value } : feature)));
  }, []);

  const handleChangeProblem = useCallback((value: string): void => {
    setProblem(value);
  }, []);

  const handleChangeNotes = useCallback((value: string): void => {
    setNotes(value);
  }, []);

  const handleToggleNotes = useCallback((): void => {
    setIsNotesOpen((current) => !current);
  }, []);

  const handleRemoveTargetUser = useCallback((user: string): void => {
    setTargetUsers((current) => current.filter((value) => value !== user));
  }, []);

  const handleChangeTargetUserInput = useCallback((value: string): void => {
    setTargetUserInput(value);
  }, []);

  // Memoize derived state
  const completionReady = useMemo(
    () => projectName.trim().length > 0 && problem.trim().length > 0 && features.some((feature) => feature.text.trim().length > 0),
    [projectName, problem, features]
  );
  const completionScore = useMemo(
    () => brief ? isBriefComplete(brief, { projectName }) : false,
    [brief, projectName]
  );

  return (
    <div className="w-full px-8 py-6">
      {/* 2-Column Grid Layout - Left wider (main content), Right narrower (metadata) */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
        <div className="space-y-6">
          <BriefPrimaryColumn
            features={features}
            onAddFeature={addFeature}
            onChangeProblem={handleChangeProblem}
            onRemoveFeature={handleRemoveFeature}
            onUpdateFeature={handleUpdateFeature}
            problem={problem}
          />
        </div>
        <div className="space-y-6">
          <BriefMetadataColumn
            onAddTargetUser={addTargetUser}
            onChangeTargetUserInput={handleChangeTargetUserInput}
            onRemoveTargetUser={handleRemoveTargetUser}
            targetUserInput={targetUserInput}
            targetUsers={targetUsers}
          />
        </div>
      </div>

      {/* Notes Section - Full Width */}
      <div className="mt-6">
        <BriefNotesSection isOpen={isNotesOpen} notes={notes} onChangeNotes={handleChangeNotes} onToggle={handleToggleNotes} />
      </div>

      {/* Completion Banner */}
      {completionReady && (
        <div className="mt-6">
          <BriefCompletionBanner onContinue={() => setActiveTab("research")} projectName={projectName} />
        </div>
      )}
    </div>
  );
});

BriefPage.displayName = "BriefPage";
