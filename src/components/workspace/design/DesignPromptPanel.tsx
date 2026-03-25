import { OutputPanel } from "@/components/shared/OutputPanel";
import { ResearchContextCard } from "@/components/workspace/ResearchContextCard";

interface DesignPromptPanelProps {
  activeNodes: string[];
  briefAvailable: boolean;
  errorMessage: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onOpenContextSelector: () => void;
  onSelectPlatform: (platform: string) => void;
  onToggleNode: (nodeId: string) => void;
  outputPlatforms: string[];
  promptContent: string | null;
  researchFileCount: number;
  selectedPlatform: string;
  streamingContent: string;
}

const PLATFORM_OPTIONS = ["Stitch", "v0", "Figma AI", "Locofy", "Universal"];

export const DesignPromptPanel = ({
  activeNodes,
  briefAvailable,
  errorMessage,
  isGenerating,
  onGenerate,
  onOpenContextSelector,
  onSelectPlatform,
  onToggleNode,
  outputPlatforms,
  promptContent,
  researchFileCount,
  selectedPlatform,
  streamingContent
}: DesignPromptPanelProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="font-headline text-[28px] font-bold tracking-tight text-on-surface">
            Design Prompt
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Shape the visual system and interface direction for the selected platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => onSelectPlatform(platform)}
              className={`rounded-xl border-b-2 px-4 py-2 text-sm transition ${
                selectedPlatform === platform
                  ? "border-primary bg-surface-container-high text-primary"
                  : "border-transparent text-outline hover:text-on-surface"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-outline">
            Context Nodes
          </p>
          <ResearchContextCard
            checked={activeNodes.includes("brief")}
            description="Use the current brief structure as the base UI context."
            disabled={!briefAvailable}
            icon="description"
            label="Brief"
            onToggle={() => onToggleNode("brief")}
            statusLabel={briefAvailable ? "Available" : "Missing data"}
          />
          <ResearchContextCard
            checked={activeNodes.includes("research-results")}
            description="Use saved research prompts and vault uploads to influence the interface direction."
            disabled={researchFileCount === 0}
            icon="analytics"
            label="Research results"
            metadata={
              researchFileCount > 0 ? `${researchFileCount} research files available` : undefined
            }
            onToggle={() => onToggleNode("research-results")}
            statusLabel={researchFileCount > 0 ? "Available" : "Missing data"}
          />
          <button
            type="button"
            onClick={onOpenContextSelector}
            className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface transition hover:bg-surface-container-high"
          >
            + Add context
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="gradient-cta glow-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Generate Design Prompt"}
          </button>

          {errorMessage ? (
            <div className="rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div>
          <OutputPanel
            title="Generated Prompt"
            content={promptContent}
            emptyIcon="architecture"
            emptyTitle="No design prompt generated yet"
            emptyDescription="Choose a target platform, confirm the context nodes, then generate a prompt."
            fileLabel="design_prompt.txt"
            isStreaming={isGenerating}
            platforms={outputPlatforms}
            streamingContent={streamingContent}
            variant="terminal"
          />
        </div>
      </div>
    </section>
  );
};
