import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ResearchContextPanel } from "@/components/workspace/research/ResearchContextPanel";
import { ResearchFilesSection } from "@/components/workspace/research/ResearchFilesSection";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { downloadFileData, validateUploadFile } from "@/lib/fileUpload";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { formatDate } from "@/lib/utils";
import { generateResearchPrompt } from "@/services/generation/researchGeneration";

const RESEARCH_FILE_EXTENSIONS = [".pdf", ".md", ".txt"];

export const ResearchPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const toast = useToast();
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
    </div>
  );
};
