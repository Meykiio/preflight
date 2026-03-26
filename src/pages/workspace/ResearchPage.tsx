import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { TechStackModal } from "@/components/workspace/research/TechStackModal";
import { ResearchContextPanel } from "@/components/workspace/research/ResearchContextPanel";
import { ResearchFilesSection } from "@/components/workspace/research/ResearchFilesSection";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/useToast";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { downloadFileData, validateUploadFile } from "@/lib/fileUpload";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { formatDate } from "@/lib/utils";
import { generateTechStackRecommendation, type TechStackRecommendation } from "@/services/generation/techStackRecommendation";
import { generateResearchPrompt } from "@/services/generation/researchGeneration";

const RESEARCH_FILE_EXTENSIONS = [".pdf", ".md", ".txt"];

export const ResearchPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const toast = useToast();
  const { updateProject } = useProjects();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { files, addFile, removeFile, toggleContext } = useVaultFiles(projectId);
  const { createArtifact, getLatestByType } = useArtifacts(projectId);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showTechStackModal, setShowTechStackModal] = useState(false);
  const [techStackRecommendation, setTechStackRecommendation] = useState<TechStackRecommendation | null>(null);
  const [isGeneratingTechStack, setIsGeneratingTechStack] = useState(false);
  const latestArtifact = getLatestByType("research_prompt");
  const researchFiles = useMemo(() => files.filter((file) => file.category === "research"), [files]);
  const nodeAvailability = useMemo(
    () => ({
      brief: Boolean(brief?.problem || brief?.notes || brief?.targetUser || brief?.coreFeatures.some((feature) => feature.text.trim())),
      techStack: Boolean(project?.techStack.length),
      userPersonas: Boolean(brief?.targetUser.trim())
    }),
    [brief, project]
  );

  useEffect(() => {
    setActiveNodes((current) =>
      current.length > 0
        ? current
        : [
            nodeAvailability.brief ? "brief" : null,
            nodeAvailability.techStack ? "tech-stack" : null,
            nodeAvailability.userPersonas ? "user-personas" : null
          ].filter(Boolean) as string[]
    );
  }, [nodeAvailability]);

  const toggleNode = (nodeId: string): void =>
    setActiveNodes((current) => (current.includes(nodeId) ? current.filter((value) => value !== nodeId) : [...current, nodeId]));

  const handleGenerate = async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGenerating(true);
    setStreamingContent("");
    try {
      const content = await generateResearchPrompt({
        project,
        brief,
        activeNodes,
        researchFiles: researchFiles.filter((f) => f.isActiveContext),
        platform: "Universal",
        onChunk: (chunk) => setStreamingContent((current) => `${current}${chunk}`)
      });
      await createArtifact({
        agentSystemPromptId: "research-default",
        content,
        contextNodes: activeNodes,
        platform: "universal",
        type: "research_prompt",
        version: (latestArtifact?.version ?? 0) + 1
      });
      setStreamingContent("");
      toast.success("Research prompt generated.");
    } catch (error) {
      const errorState = getGenerationErrorState(error);
      if (errorState.shouldRedirect) navigate("/settings");
      setErrorMessage(errorState.inlineMessage ?? "");
      toast.error(errorState.toastMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTechStack = async (): Promise<void> => {
    if (!project || !brief || !latestArtifact) {
      toast.error("Please generate research first.");
      return;
    }
    setIsGeneratingTechStack(true);
    try {
      const recommendation = await generateTechStackRecommendation({
        projectName: project.name,
        brief,
        researchContent: latestArtifact.content
      });
      if (recommendation) {
        setTechStackRecommendation(recommendation);
        setShowTechStackModal(true);
        toast.success("Tech stack recommendation ready!");
      } else {
        toast.error("Failed to generate tech stack recommendation.");
      }
    } catch (error) {
      console.error("Tech stack generation failed:", error);
      toast.error("Tech stack generation failed.");
    } finally {
      setIsGeneratingTechStack(false);
    }
  };

  const handleAcceptTechStack = async (): Promise<void> => {
    if (!project || !techStackRecommendation) return;
    const techStack = [
      techStackRecommendation.frontend.name,
      techStackRecommendation.styling.name,
      techStackRecommendation.stateManagement.name,
      techStackRecommendation.database.name
    ];
    await updateProject(project.id, { techStack });
    setShowTechStackModal(false);
    setTechStackRecommendation(null);
    toast.success("Tech stack saved to project!");
  };

  const handleFiles = async (fileList: FileList | null): Promise<void> => {
    if (!fileList || !projectId) return;
    try {
      for (const file of Array.from(fileList)) {
        const validationMessage = validateUploadFile(file, {
          allowedExtensions: RESEARCH_FILE_EXTENSIONS,
          existingFiles: files
        });
        if (validationMessage) {
          toast.error(validationMessage);
          continue;
        }
        const savedFile = await addFile({
          category: "research",
          data: await file.arrayBuffer(),
          isActiveContext: false,
          mimeType: file.type || "text/plain",
          name: file.name,
          size: file.size
        });
        if (!savedFile) toast.error(`Could not upload ${file.name}.`);
      }
      toast.success("Research results added to the vault.");
    } catch {
      toast.error("Research file upload failed.");
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string): Promise<void> => {
    await removeFile(fileId);
    toast.success(`${fileName} deleted.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Tech Stack Banner - Shows after research completes */}
      {latestArtifact && !isGenerating && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-3xl text-primary">lightbulb</span>
            <div className="flex-1">
              <h3 className="font-headline text-lg font-semibold text-on-surface">
                Research Complete! Get Your Tech Stack Recommendation
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Our AI has analyzed your brief and research. Get a personalized tech stack recommendation 
                tailored to your project's specific needs.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerateTechStack}
                  disabled={isGeneratingTechStack}
                  className="gradient-cta glow-primary flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-on-primary disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">psychology</span>
                  {isGeneratingTechStack ? "Generating..." : "Generate Tech Stack"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/project/${projectId}/build`)}
                  className="rounded-xl border border-outline-variant/15 bg-surface-container px-6 py-3 text-sm text-on-surface transition hover:bg-surface-bright"
                >
                  Skip to Build
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <ResearchContextPanel
          activeNodes={activeNodes}
          errorMessage={errorMessage}
          isGenerating={isGenerating}
          nodeAvailability={nodeAvailability}
          onGenerate={() => void handleGenerate()}
          onToggleNode={toggleNode}
          projectTechStackCount={project?.techStack.length ?? 0}
          projectUserContext={brief?.targetUser || undefined}
          statusMeta={brief ? `v1.2 Updated ${formatDate(brief.updatedAt)}` : undefined}
        />
        <OutputPanel
          title="Deep Research Prompt"
          content={latestArtifact?.content ?? null}
          emptyIcon="analytics"
          emptyTitle="Generate your first research prompt"
          emptyDescription="Select the context nodes you want to inject, then generate the prompt for external LLM analysis."
          fileLabel="research_prompt.md"
          isStreaming={isGenerating}
          platforms={["Perplexity", "Gemini", "ChatGPT"]}
          streamingContent={streamingContent}
        />
      </div>
      <ResearchFilesSection
        fileInputRef={fileInputRef}
        isDragging={isDragging}
        onDeleteFile={(fileId, fileName) => void handleDeleteFile(fileId, fileName)}
        onDownloadFile={(file) => downloadFileData(file.data, file.name, file.mimeType)}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        onToggleContext={(fileId) => void toggleContext(fileId)}
        onUploadInputChange={(filesToUpload) => void handleFiles(filesToUpload)}
        researchFiles={researchFiles}
      />

      {/* Tech Stack Modal */}
      <TechStackModal
        isOpen={showTechStackModal}
        onClose={() => {
          setShowTechStackModal(false);
          setTechStackRecommendation(null);
        }}
        recommendation={techStackRecommendation}
        onAccept={handleAcceptTechStack}
        projectName={project?.name ?? "Your Project"}
      />
    </div>
  );
};
