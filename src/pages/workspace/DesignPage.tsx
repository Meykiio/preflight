import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DesignHistorySection } from "@/components/workspace/design/DesignHistorySection";
import { DesignPromptPanel } from "@/components/workspace/design/DesignPromptPanel";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { downloadFileData, validateUploadFile } from "@/lib/fileUpload";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { generateDesignPrompt } from "@/services/generation/designGeneration";

interface DesignPageProps {
  onOpenContextSelector: () => void;
}

const DESIGN_FILE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif"];

export const DesignPage = ({
  onOpenContextSelector
}: DesignPageProps): JSX.Element => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { files, addFile, removeFile } = useVaultFiles(projectId);
  const { createArtifact, getLatestByType } = useArtifacts(projectId);
  const [selectedPlatform, setSelectedPlatform] = useState("Universal");
  const [activeNodes, setActiveNodes] = useState<string[]>(["brief"]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const latestResearchPrompt = getLatestByType("research_prompt");
  const latestDesignPrompt = getLatestByType("design_prompt");
  const designFiles = useMemo(
    () => files.filter((file) => file.category === "design"),
    [files]
  );
  const researchFiles = useMemo(
    () => files.filter((file) => file.category === "research"),
    [files]
  );

  const handleGenerate = async (): Promise<void> => {
    if (!project || !brief) {
      toast.error("Project context is still loading.");
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);
    setStreamingContent("");

    try {
      const content = await generateDesignPrompt({
        brief,
        onChunk: (chunk) => setStreamingContent((current) => `${current}${chunk}`),
        platform: selectedPlatform,
        project,
        researchSummary:
          activeNodes.includes("research-results") && latestResearchPrompt?.content
            ? latestResearchPrompt.content
            : undefined,
        designFiles: designFiles.filter((f) => f.isActiveContext)
      });

      await createArtifact({
        agentSystemPromptId: "design-default",
        content,
        contextNodes: activeNodes,
        platform: selectedPlatform,
        type: "design_prompt",
        version: (latestDesignPrompt?.version ?? 0) + 1
      });

      setStreamingContent("");
      toast.success("Design prompt generated.");
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

  const handleFiles = async (fileList: FileList | null): Promise<void> => {
    if (!fileList) {
      return;
    }

    try {
      for (const file of Array.from(fileList)) {
        const validationMessage = validateUploadFile(file, {
          allowedExtensions: DESIGN_FILE_EXTENSIONS,
          existingFiles: files
        });

        if (validationMessage) {
          toast.error(validationMessage);
          continue;
        }

        const savedFile = await addFile({
          category: "design",
          data: await file.arrayBuffer(),
          isActiveContext: false,
          mimeType: file.type || "application/octet-stream",
          name: file.name,
          size: file.size
        });

        if (!savedFile) {
          toast.error(`Could not upload ${file.name}.`);
        }
      }

      toast.success("Design files added to history.");
    } catch (error) {
      toast.error("Design file upload failed.");
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string): Promise<void> => {
    await removeFile(fileId);
    toast.success(`${fileName} deleted.`);
  };

  const toggleNode = (nodeId: string): void => {
    setActiveNodes((current) =>
      current.includes(nodeId)
        ? current.filter((value) => value !== nodeId)
        : [...current, nodeId]
    );
  };

  const outputPlatforms = Array.from(
    new Set([selectedPlatform, "v0"].filter((platform) => platform !== "Universal"))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <DesignPromptPanel
        activeNodes={activeNodes}
        briefAvailable={Boolean(brief)}
        errorMessage={errorMessage}
        isGenerating={isGenerating}
        onGenerate={() => void handleGenerate()}
        onOpenContextSelector={onOpenContextSelector}
        onSelectPlatform={setSelectedPlatform}
        onToggleNode={toggleNode}
        outputPlatforms={outputPlatforms}
        promptContent={latestDesignPrompt?.content ?? null}
        researchFileCount={researchFiles.length}
        selectedPlatform={selectedPlatform}
        streamingContent={streamingContent}
      />

      <DesignHistorySection
        designFiles={designFiles}
        fileInputRef={fileInputRef}
        onDeleteFile={(fileId, fileName) => void handleDeleteFile(fileId, fileName)}
        onDownloadFile={(file) => downloadFileData(file.data, file.name, file.mimeType)}
        onUploadInputChange={(filesToUpload) => void handleFiles(filesToUpload)}
      />
    </div>
  );
};
