import { memo, useState, useMemo, useCallback, useEffect } from "react";
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

export const PRDPage = memo(({ projectId }: PRDPageProps): JSX.Element => {
  const navigate = useNavigate();
  const toast = useToast();
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { createArtifact, getLatestByType, deleteArtifact } = useArtifacts(projectId);
  const [systemPlatform, setSystemPlatform] = useState("Universal");
  const [rulesPlatform, setRulesPlatform] = useState("Universal");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  const [isGeneratingSystem, setIsGeneratingSystem] = useState(false);
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  const [streamingPRD, setStreamingPRD] = useState("");
  const [streamingSystem, setStreamingSystem] = useState("");
  const [streamingRules, setStreamingRules] = useState("");
  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  // Memoize derived state
  const researchPrompt = useMemo(() => getLatestByType("research_prompt"), [getLatestByType]);
  const designPrompt = useMemo(() => getLatestByType("design_prompt"), [getLatestByType]);
  const prdArtifact = useMemo(() => getLatestByType("prd"), [getLatestByType]);
  const systemArtifact = useMemo(() => getLatestByType("system_instructions"), [getLatestByType]);
  const rulesArtifact = useMemo(() => getLatestByType("rules_file"), [getLatestByType]);
  const contextAvailability = useMemo(
    () => buildPRDContextAvailability(Boolean(brief), Boolean(researchPrompt), Boolean(designPrompt)),
    [brief, researchPrompt, designPrompt]
  );

  // Auto-select available context nodes
  useEffect(() => {
    const availableNodes: string[] = [];
    if (brief) availableNodes.push("brief");
    if (researchPrompt) availableNodes.push("research");
    if (designPrompt) availableNodes.push("design");
    if (availableNodes.length > 0 && activeNodes.length === 0) {
      setActiveNodes(availableNodes);
    }
  }, [brief, researchPrompt, designPrompt, activeNodes.length]);

  const handleGeneratePRD = useCallback(async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingPRD(true);
    setStreamingPRD("");
    toast.info("Generating... You can navigate to other pages and come back.");
    try {
      const content = await generatePRD({
        brief,
        designPrompt: activeNodes.includes("design") ? designPrompt?.content : undefined,
        onChunk: (chunk) => setStreamingPRD((current) => `${current}${chunk}`),
        project,
        researchPrompt: activeNodes.includes("research") ? researchPrompt?.content : undefined
      });
      await createArtifact({
        agentSystemPromptId: "prd-default",
        content,
        contextNodes: activeNodes,
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
  }, [project, brief, activeNodes, designPrompt, researchPrompt, createArtifact, prdArtifact, navigate, toast]);

  const handleGenerateSystemInstructions = useCallback(async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingSystem(true);
    setStreamingSystem("");
    toast.info("Generating... You can navigate to other pages and come back.");
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
  }, [project, brief, systemPlatform, prdArtifact, createArtifact, systemArtifact, navigate, toast]);

  const handleGenerateRules = useCallback(async (): Promise<void> => {
    if (!project || !brief) return void toast.error("Project context is still loading.");
    setErrorMessage("");
    setIsGeneratingRules(true);
    setStreamingRules("");
    toast.info("Generating... You can navigate to other pages and come back.");
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
  }, [project, brief, rulesPlatform, prdArtifact, createArtifact, rulesArtifact, navigate, toast]);

  const toggleNode = useCallback((nodeId: string): void => {
    setActiveNodes((current) =>
      current.includes(nodeId)
        ? current.filter((id) => id !== nodeId)
        : [...current, nodeId]
    );
  }, []);

  const handleResetPRD = useCallback(async (): Promise<void> => {
    if (prdArtifact) {
      await deleteArtifact(prdArtifact.id);
      toast.success("PRD cleared.");
    }
  }, [prdArtifact, deleteArtifact, toast]);

  const handleResetSystem = useCallback(async (): Promise<void> => {
    if (systemArtifact) {
      await deleteArtifact(systemArtifact.id);
      toast.success("System instructions cleared.");
    }
  }, [systemArtifact, deleteArtifact, toast]);

  const handleResetRules = useCallback(async (): Promise<void> => {
    if (rulesArtifact) {
      await deleteArtifact(rulesArtifact.id);
      toast.success("Rules file cleared.");
    }
  }, [rulesArtifact, deleteArtifact, toast]);

  return (
    <div className="flex w-full max-w-full flex-col overflow-x-hidden px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary">article</span>
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              Product Requirements
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Generate comprehensive PRD, system instructions, and coding rules
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PRD Panel - Spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PRDDocumentPanel
            contextAvailability={contextAvailability}
            activeNodes={activeNodes}
            onToggleNode={toggleNode}
            errorMessage={errorMessage}
            isGenerating={isGeneratingPRD}
            onGenerate={() => void handleGeneratePRD()}
            prdContent={prdArtifact?.content ?? null}
            streamingContent={streamingPRD}
            isEditable={Boolean(prdArtifact)}
            onSave={async (newContent: string) => {
              if (prdArtifact) {
                await createArtifact({
                  agentSystemPromptId: prdArtifact.agentSystemPromptId,
                  content: newContent,
                  contextNodes: prdArtifact.contextNodes,
                  platform: prdArtifact.platform,
                  type: "prd",
                  version: prdArtifact.version + 1
                });
                toast.success("PRD updated.");
              }
            }}
            onReset={handleResetPRD}
          />
        </div>

        {/* Right Column - System Instructions + Rules stacked */}
        <div className="flex flex-col gap-6">
          {/* System Instructions Panel */}
          <ArtifactGeneratorPanel
            badgeLabel="AI Agent Config"
            content={systemArtifact?.content ?? null}
            description="System prompt for your AI coding assistant"
            fileLabel="SYSTEM_INSTRUCTIONS.md"
            isGenerating={isGeneratingSystem}
            onGenerate={() => void handleGenerateSystemInstructions()}
            onSelectPlatform={setSystemPlatform}
            platforms={SYSTEM_PLATFORMS}
            selectedPlatform={systemPlatform}
            streamingContent={streamingSystem}
            title="System Instructions"
            onReset={handleResetSystem}
          />

          {/* Rules File Panel */}
          <ArtifactGeneratorPanel
            badgeLabel="Coding Rules"
            content={rulesArtifact?.content ?? null}
            description="Platform-specific coding constraints"
            fileLabel={getRulesFileLabel(rulesPlatform)}
            isGenerating={isGeneratingRules}
            onGenerate={() => void handleGenerateRules()}
            onSelectPlatform={setRulesPlatform}
            platforms={RULE_PLATFORMS}
            selectedPlatform={rulesPlatform}
            streamingContent={streamingRules}
            title="Rules File"
            onReset={handleResetRules}
          />
        </div>
      </div>

      {/* Context Summary Footer */}
      {activeNodes.length > 0 && (
        <div className="mt-8 rounded-xl border border-outline-variant/10 bg-surface-container/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-base text-secondary">contextual_token</span>
            <span className="text-on-surface-variant">Active context:</span>
            <div className="flex gap-2">
              {activeNodes.map((node) => (
                <span
                  key={node}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {node}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PRDPage.displayName = "PRDPage";
