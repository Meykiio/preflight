import { useState } from "react";
import { AgentPromptCard } from "@/components/settings/AgentPromptCard";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { AgentSystemPrompt } from "@/types";

interface AgentPromptsSectionProps {
  isLoading: boolean;
  prompts: AgentSystemPrompt[];
  onReset: (promptId: string) => Promise<void>;
  onSave: (promptId: string, content: string) => Promise<void>;
}

const GENERATION_AGENTS = ["research", "design", "prd", "system-instructions", "rules-file"];
const BUILD_AGENTS = ["build-foundation", "build-database", "build-feature", "build-audit", "build-deployment"];

const formatCategoryLabel = (category: string): string => {
  if (category === "generation") return "Generation Agents";
  if (category === "build") return "Build Agents";
  return category;
};

export const AgentPromptsSection = ({
  isLoading,
  prompts,
  onReset,
  onSave
}: AgentPromptsSectionProps): JSX.Element => {
  const toast = useToast();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("generation");

  const generationPrompts = prompts.filter((p) => GENERATION_AGENTS.includes(p.agentType));
  const buildPrompts = prompts.filter((p) => BUILD_AGENTS.includes(p.agentType));

  const categories = [
    { id: "generation", prompts: generationPrompts, count: generationPrompts.length },
    { id: "build", prompts: buildPrompts, count: buildPrompts.length }
  ];

  const handleExportPrompts = (): void => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "0.2.0",
      prompts: prompts.map((p) => ({
        id: p.id,
        agentType: p.agentType,
        label: p.label,
        content: p.content,
        isDefault: p.isDefault
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "preflight-agent-prompts.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Agent prompts exported.");
  };

  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">tune</span>
          <h2 className="font-headline text-2xl font-semibold text-on-surface">
            Agent Prompts
          </h2>
        </div>
        <button
          type="button"
          onClick={handleExportPrompts}
          className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
          title="Export all agent prompts as JSON"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">download</span>
            Export All
          </span>
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl bg-surface-container-high"
              />
            ))
          : categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-outline-variant/10 bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("material-symbols-outlined text-primary", expandedCategory === category.id ? "expand_less" : "expand_more")}>
                      {expandedCategory === category.id ? "expand_less" : "expand_more"}
                    </span>
                    <div>
                      <p className="font-headline text-lg font-semibold text-on-surface">
                        {formatCategoryLabel(category.id)}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                        {category.count} {category.count === 1 ? "agent" : "agents"}
                      </p>
                    </div>
                  </div>
                </button>

                {expandedCategory === category.id && (
                  <div className="border-t border-outline-variant/10 px-5 pb-5 pt-2">
                    <div className="space-y-4">
                      {category.prompts.map((prompt) => (
                        <AgentPromptCard
                          key={prompt.id}
                          prompt={prompt}
                          onReset={onReset}
                          onSave={onSave}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>
    </section>
  );
};
