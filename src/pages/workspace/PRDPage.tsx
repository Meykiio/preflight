import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtifactGeneratorPanel } from "@/components/workspace/prd/ArtifactGeneratorPanel";
import { PRDDocumentPanel } from "@/components/workspace/prd/PRDDocumentPanel";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { buildPRDContextAvailability, getRulesFileLabel, handlePRDGenerationError, RULE_PLATFORMS, SYSTEM_PLATFORMS } from "@/pages/workspace/prdPageHelpers";
import { generatePRD } from "@/services/generation/prdGeneration";
import { generateRulesFile } from "@/services/generation/rulesFileGeneration";
import { generateSystemInstructions } from "@/services/generation/systemInstructionsGeneration";

interface PRDPageProps {
  projectId: string;
}

export const PRDPage = ({ projectId }: PRDPageProps): JSX.Element => {
  const navigate = useNavigate();
  const toast = useToast();
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { createArtifact, getLatestByType } = useArtifacts(projectId);
  const [systemPlatform, setSystemPlatform] = useState("Universal");
  const [rulesPlatform, setRulesPlatform] = useState("Universal");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  const [isGeneratingSystem, setIsGeneratingSystem] = useState(false);
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  const [streamingPRD, setStreamingPRD] = useState("");
  const [streamingSystem, setStreamingSystem] = useState("");
  const [streamingRules, setStreamingRules] = useState("");
  const researchPrompt = getLatestByType("research_prompt");
  const designPrompt = getLatestByType("design_prompt");
  const prdArtifact = getLatestByType("prd");
  const systemArtifact = getLatestByType("system_instructions");
  const rulesArtifact = getLatestByType("rules_file");
  const contextAvailability = buildPRDContextAvailability(Boolean(brief), Boolean(researchPrompt), Boolean(designPrompt));

  const handleGeneratePRD = async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingPRD(true);
    setStreamingPRD("");
    try {
      const content = await generatePRD({
        brief,
        designPrompt: designPrompt?.content,
        onChunk: (chunk) => setStreamingPRD((current) => `${current}${chunk}`),
        project,
        researchPrompt: researchPrompt?.content
      });
      await createArtifact({
        agentSystemPromptId: "prd-default",
        content,
        contextNodes: ["brief", "research", "design"].filter((node) =>
          node === "brief" ? Boolean(brief) : node === "research" ? Boolean(researchPrompt) : Boolean(designPrompt)
        ),
        platform: "universal",
        type: "prd",
        version: (prdArtifact?.version ?? 0) + 1
      });
      setStreamingPRD("");
      toast.success("PRD generated.");
    } catch (error) {
      handlePRDGenerationError(error, navigate, toast.error, setErrorMessage);
    } finally {
      setIsGeneratingPRD(false);
    }
  };

  const handleGenerateSystemInstructions = async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingSystem(true);
    setStreamingSystem("");
    try {
      const content = await generateSystemInstructions({
        platform: systemPlatform,
        prd: prdArtifact?.content || "No PRD generated yet.",
        brief,
        onChunk: (chunk) => setStreamingSystem((current) => `${current}${chunk}`),
        project
      });
      await createArtifact({
        agentSystemPromptId: "system-instructions-default",
        content,
        contextNodes: ["brief", "prd"],
        platform: systemPlatform,
        type: "system_instructions",
        version: (systemArtifact?.version ?? 0) + 1
      });
      setStreamingSystem("");
      toast.success("System instructions generated.");
    } catch (error) {
      handlePRDGenerationError(error, navigate, toast.error, setErrorMessage);
    } finally {
      setIsGeneratingSystem(false);
    }
  };

  const handleGenerateRules = async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingRules(true);
    setStreamingRules("");
    try {
      const content = await generateRulesFile({
        platform: rulesPlatform,
        prd: prdArtifact?.content || "No PRD generated yet.",
        brief,
        onChunk: (chunk) => setStreamingRules((current) => `${current}${chunk}`),
        project
      });
      await createArtifact({
        agentSystemPromptId: "rules-file-default",
        content,
        contextNodes: ["brief", "prd"],
        platform: rulesPlatform,
        type: "rules_file",
        version: (rulesArtifact?.version ?? 0) + 1
      });
      setStreamingRules("");
      toast.success("Rules file generated.");
    } catch (error) {
      handlePRDGenerationError(error, navigate, toast.error, setErrorMessage);
    } finally {
      setIsGeneratingRules(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      {/* PRD Panel - Full Width */}
      <div className="mb-6">
        <PRDDocumentPanel
          contextAvailability={contextAvailability}
          errorMessage={errorMessage}
          isGenerating={isGeneratingPRD}
          onGenerate={() => void handleGeneratePRD()}
          prdContent={prdArtifact?.content ?? null}
          streamingContent={streamingPRD}
        />
      </div>

      {/* System Instructions & Rules - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArtifactGeneratorPanel
          badgeLabel="Live Context"
          content={systemArtifact?.content ?? null}
          description="Paste this as the system prompt for your AI coding tool."
          fileLabel="SYSTEM_PROMPT.TXT"
          isGenerating={isGeneratingSystem}
          onGenerate={() => void handleGenerateSystemInstructions()}
          onSelectPlatform={setSystemPlatform}
          platforms={SYSTEM_PLATFORMS}
          selectedPlatform={systemPlatform}
          streamingContent={streamingSystem}
          title="System Instructions"
        />
        <ArtifactGeneratorPanel
          badgeLabel="Neural_Sync_Optimized"
          content={rulesArtifact?.content ?? null}
          description="Platform-specific agent constraints."
          fileLabel={getRulesFileLabel(rulesPlatform)}
          isGenerating={isGeneratingRules}
          onGenerate={() => void handleGenerateRules()}
          onSelectPlatform={setRulesPlatform}
          platforms={RULE_PLATFORMS}
          selectedPlatform={rulesPlatform}
          streamingContent={streamingRules}
          title="Rules File"
        />
      </div>
    </div>
  );
};
