import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/useToast";
import { useProjectStore } from "@/stores/projectStore";
import { generateWithAgent } from "@/services/ai";
import { validateUploadFile } from "@/lib/fileUpload";
import db from "@/lib/db";
import type { Brief } from "@/types";

interface ImportProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface BriefExtractionResult {
  problem: string;
  targetUser: string;
  coreFeatures: Array<{ id: string; text: string; order: number }>;
  techStack: string[];
  notes: string;
}

const BRIEF_EXTRACTION_PROMPT = `You are extracting a structured project brief from raw user notes or ideas.
From the provided text, extract:
- Problem statement (what problem this solves)
- Target user (who will use this)
- Core features (list them numbered, most important first)
- Tech stack hints (any technologies mentioned)
- Notes (anything else relevant)

Return ONLY a JSON object with these fields:
{
  "problem": "string",
  "targetUser": "string", 
  "coreFeatures": [{"id": "string", "text": "string", "order": number}],
  "techStack": ["string"],
  "notes": "string"
}

If any field is not mentioned, use sensible defaults or empty arrays. Do not include any explanation, only the JSON.`;

export const ImportProjectModal = ({ isOpen, onOpenChange }: ImportProjectModalProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const toast = useToast();
  const selectProject = useProjectStore((state) => state.selectProject);

  const [activeTab, setActiveTab] = useState<"backup" | "idea">("backup");
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Backup import refs
  const backupInputRef = useRef<HTMLInputElement>(null);
  
  // Idea import refs
  const ideaNameRef = useRef<HTMLInputElement>(null);
  const ideaTextRef = useRef<HTMLTextAreaElement>(null);
  const ideaFileRef = useRef<HTMLInputElement>(null);

  const [ideaFileName, setIdeaFileName] = useState("");
  const [ideaFileContent, setIdeaFileContent] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("backup");
      setIsImporting(false);
      setIsGenerating(false);
      setIdeaFileName("");
      setIdeaFileContent("");
      if (backupInputRef.current) backupInputRef.current.value = "";
      if (ideaNameRef.current) ideaNameRef.current.value = "";
      if (ideaTextRef.current) ideaTextRef.current.value = "";
      if (ideaFileRef.current) ideaFileRef.current.value = "";
    }
  }, [isOpen]);

  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, () => {
    onOpenChange(false);
  });

  // Handle backup JSON import
  const handleBackupImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please select a valid JSON backup file.");
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate it's a Preflight backup
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error("Invalid backup format");
      }

      // Import first project from backup
      const projectData = data.projects[0];
      const project = await createProject({
        name: projectData.name,
        description: projectData.description || "",
        status: projectData.status || "ideation",
        targetPlatforms: projectData.targetPlatforms || [],
        techStack: projectData.techStack || []
      });

      if (!project) {
        throw new Error("Failed to create project");
      }

      // Import brief if exists
      if (data.briefs && data.briefs[0]) {
        const briefData = data.briefs[0];
        const nextBrief: Brief = {
          id: briefData.id ?? crypto.randomUUID(),
          projectId: project.id,
          problem: briefData.problem || "",
          targetUser: briefData.targetUser || "",
          coreFeatures: briefData.coreFeatures || [],
          inspirations: briefData.inspirations || [],
          notes: briefData.notes || "",
          updatedAt: briefData.updatedAt || Date.now()
        };
        await db.briefs.put(nextBrief);
      }

      selectProject(project.id);
      onOpenChange(false);
      toast.success("Project imported successfully!");
      navigate(`/project/${project.id}/brief`);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import backup. Invalid file format.");
    } finally {
      setIsImporting(false);
      if (backupInputRef.current) backupInputRef.current.value = "";
    }
  }, [createProject, selectProject, onOpenChange, navigate, toast]);

  // Handle idea file upload
  const handleIdeaFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, {
      allowedExtensions: [".md", ".txt"],
      maxBytes: 10 * 1024 * 1024 // 10MB
    });

    if (validation) {
      toast.error(validation);
      return;
    }

    setIdeaFileName(file.name);
    const text = await file.text();
    setIdeaFileContent(text);
  }, [toast]);

  // Handle idea-based import with AI extraction
  const handleIdeaImport = useCallback(async () => {
    const nameValue = ideaNameRef.current?.value.trim() || "";
    const textValue = ideaTextRef.current?.value.trim() || ideaFileContent;

    if (!textValue) {
      toast.error("Please paste your idea or upload a file.");
      return;
    }

    setIsGenerating(true);
    try {
      // Create project first
      const projectName = nameValue || "New Project";
      const project = await createProject({
        name: projectName,
        description: "Imported from idea"
      });

      if (!project) {
        throw new Error("Failed to create project");
      }

      selectProject(project.id);

      // Extract brief using AI
      const extractionResult = await generateWithAgent("research", BRIEF_EXTRACTION_PROMPT + "\n\nUSER INPUT:\n" + textValue, () => {});
      
      // Parse JSON from response
      const jsonMatch = extractionResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }

      const briefData = JSON.parse(jsonMatch[0]) as BriefExtractionResult;

      // Update brief with extracted data using Dexie directly
      const currentBrief = await db.briefs.where("projectId").equals(project.id).first();
      const nextBrief: Brief = {
        id: currentBrief?.id ?? crypto.randomUUID(),
        projectId: project.id,
        problem: briefData.problem || "Problem to be defined",
        targetUser: briefData.targetUser || "Target users to be defined",
        coreFeatures: briefData.coreFeatures || [],
        inspirations: [],
        notes: briefData.notes || "",
        updatedAt: Date.now()
      };
      await db.briefs.put(nextBrief);

      onOpenChange(false);
      toast.success("Brief filled from your idea. Review and edit as needed.");
      navigate(`/project/${project.id}/brief`);
    } catch (error) {
      console.error("Idea import failed:", error);
      toast.error("Failed to extract brief. You can fill it manually.");
    } finally {
      setIsGenerating(false);
    }
  }, [createProject, selectProject, onOpenChange, navigate, toast, ideaFileContent]);

  const canSubmitIdea = useMemo(() => {
    const hasText = ideaTextRef.current?.value.trim() || ideaFileContent;
    return hasText && !isGenerating;
  }, [isGenerating, ideaFileContent]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 px-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-project-title"
        className="glass-panel w-full max-w-3xl rounded-2xl border border-outline-variant/15 bg-surface-container p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Import Project</p>
            <h2 id="import-project-title" className="mt-2 font-headline text-3xl font-bold tracking-tight text-on-surface">
              Import or Create from Idea
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 rounded-xl border border-outline-variant/15 bg-surface p-1">
          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === "backup"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">upload_file</span>
              From Backup
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("idea")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === "idea"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              From Idea
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "backup" ? (
            /* From Backup Tab */
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-outline-variant/20 bg-surface p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-outline/40">
                  folder_zip
                </span>
                <p className="mt-4 font-headline text-xl font-semibold text-on-surface">
                  Import JSON Backup
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Select a Preflight backup file (.json) to restore a complete project with all artifacts.
                </p>
                <input
                  ref={backupInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleBackupImport}
                  disabled={isImporting}
                  className="hidden"
                  id="backup-file-input"
                />
                <label
                  htmlFor="backup-file-input"
                  className="gradient-cta glow-primary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-on-primary disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">file_upload</span>
                  {isImporting ? "Importing..." : "Select Backup File"}
                </label>
              </div>
            </div>
          ) : (
            /* From Idea Tab */
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Project name (optional)
                </label>
                <input
                  ref={ideaNameRef}
                  type="text"
                  placeholder="e.g., PrintFlow, TaskMaster"
                  className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/40"
                />
                <p className="mt-1 text-xs text-on-surface-variant">
                  Leave empty and AI will infer a name from your idea.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Paste your idea or upload file
                </label>
                <textarea
                  ref={ideaTextRef}
                  rows={6}
                  placeholder="Describe your app idea, features, target users, or paste any notes..."
                  className="w-full resize-y rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/40"
                />
              </div>

              <div>
                <input
                  ref={ideaFileRef}
                  type="file"
                  accept=".md,.txt"
                  onChange={handleIdeaFileUpload}
                  disabled={isGenerating}
                  className="hidden"
                  id="idea-file-input"
                />
                <label
                  htmlFor="idea-file-input"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface transition hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">attach_file</span>
                  {ideaFileName ? `Selected: ${ideaFileName}` : "Upload .md or .txt file"}
                </label>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-xl text-primary">info</span>
                  <div className="text-sm">
                    <p className="font-semibold text-on-surface">How it works</p>
                    <p className="mt-1 text-on-surface-variant">
                      Our AI will analyze your idea and automatically fill out the Brief with problem statement, target users, core features, and tech stack recommendations. You can review and edit everything after.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleIdeaImport}
                disabled={!canSubmitIdea}
                className="gradient-cta glow-primary flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Extracting Brief...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate Brief with AI
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-6 w-full text-sm text-on-surface-variant transition hover:text-on-surface"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
