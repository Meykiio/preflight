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
import type { CoreFeature, Platform } from "@/types";

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
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techStackInput, setTechStackInput] = useState("");
  const [targetPlatforms, setTargetPlatforms] = useState<Platform[]>([]);
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
    setTechStack(project.techStack);
    setTargetPlatforms(project.targetPlatforms);
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
        await updateProject(projectId, { techStack, targetPlatforms });
        setSaveState("saved");
      })();
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [brief, features, notes, problem, projectId, targetPlatforms, targetUsers, techStack]);

  const handleProjectNameBlur = async (): Promise<void> => {
    if (!projectId || !projectName.trim()) return;
    await updateProject(projectId, { name: projectName.trim() });
  };

  const addFeature = (): void =>
    setFeatures((current) => [...current, { id: crypto.randomUUID(), text: "", order: current.length + 1 }]);

  const addTargetUser = (): void => {
    const nextUser = targetUserInput.trim();
    if (!nextUser || targetUsers.includes(nextUser)) return void setTargetUserInput("");
    setTargetUsers((current) => [...current, nextUser]);
    setTargetUserInput("");
  };

  const addTechStack = (): void => {
    const nextTag = techStackInput.trim();
    if (!nextTag || techStack.includes(nextTag)) return void setTechStackInput("");
    setTechStack((current) => [...current, nextTag]);
    setTechStackInput("");
  };

  const completionReady = projectName.trim().length > 0 && problem.trim().length > 0 && features.some((feature) => feature.text.trim().length > 0);
  const completionScore = brief ? isBriefComplete(brief, { projectName, techStackCount: techStack.length, targetPlatformsCount: targetPlatforms.length }) : false;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <BriefHeader
        completionScore={completionScore}
        onBlurProjectName={() => void handleProjectNameBlur()}
        onChangeProjectName={setProjectName}
        projectName={projectName}
        saveState={saveState}
      />
      
      {/* 2-Column Grid Layout - 3:2 ratio */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
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
        <div className="lg:col-span-2 space-y-6">
          <BriefMetadataColumn
            onAddTargetUser={addTargetUser}
            onAddTechStack={addTechStack}
            onChangeTargetUserInput={setTargetUserInput}
            onChangeTechStackInput={setTechStackInput}
            onRemoveTargetUser={(user) => setTargetUsers((current) => current.filter((value) => value !== user))}
            onRemoveTechStackTag={(tag) => setTechStack((current) => current.filter((value) => value !== tag))}
            onTogglePlatform={(platform) =>
              setTargetPlatforms((current) => (current.includes(platform) ? current.filter((value) => value !== platform) : [...current, platform]))
            }
            targetPlatforms={targetPlatforms}
            targetUserInput={targetUserInput}
            targetUsers={targetUsers}
            techStack={techStack}
            techStackInput={techStackInput}
          />
        </div>
      </div>
      
      {/* Notes Section - Full Width */}
      <div className="mt-6">
        <BriefNotesSection isOpen={isNotesOpen} notes={notes} onChangeNotes={setNotes} onToggle={() => setIsNotesOpen((current) => !current)} />
      </div>
      
      {completionReady ? <BriefCompletionBanner onContinue={() => setActiveTab("research")} projectName={projectName} /> : null}
    </div>
  );
};
