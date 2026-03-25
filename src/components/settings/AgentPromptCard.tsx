import { useRef, useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import type { AgentSystemPrompt } from "@/types";

interface AgentPromptCardProps {
  prompt: AgentSystemPrompt;
  onReset: (promptId: string) => Promise<void>;
  onSave: (promptId: string, content: string) => Promise<void>;
}

const formatAgentLabel = (label: string): string =>
  label.replace(/-/g, " ").replace(/\b\w/g, (match: string) => match.toUpperCase());

export const AgentPromptCard = ({
  prompt,
  onReset,
  onSave
}: AgentPromptCardProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSave = async (): Promise<void> => {
    const value = textareaRef.current?.value.trim() ?? "";
    if (!value) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(prompt.id, value);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = (): void => {
    const blob = new Blob([prompt.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${prompt.agentType}-prompt.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="rounded-2xl border border-outline-variant/10 bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-headline text-lg font-semibold text-on-surface">
            {prompt.label || formatAgentLabel(prompt.agentType)}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            {prompt.agentType}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container-high"
            title="Download as Markdown"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="rounded-xl bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container-high"
          >
            {isEditing ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4">
          <textarea
            ref={textareaRef}
            defaultValue={prompt.content}
            rows={12}
            className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 font-mono text-sm text-on-surface outline-none transition focus:border-primary/40"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
              className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/15 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => void onReset(prompt.id)}
              className="rounded-xl bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container-high"
            >
              Reset to Default
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                Full System Prompt
              </span>
              <p className="mt-1 text-[10px] text-outline">
                {prompt.content.split(/\s+/).length} words • {prompt.content.length} characters • {(prompt.content.length / 4).toFixed(0)} tokens (est.)
              </p>
            </div>
            <div className="flex gap-2">
              <CopyButton text={prompt.content} size="sm" label="Copy Prompt" />
            </div>
          </div>
          <div className="relative">
            <pre className="max-h-[600px] overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-surface-container-low p-4 font-mono text-sm text-on-surface-variant custom-scrollbar border border-outline-variant/10">
              {prompt.content}
            </pre>
          </div>
        </div>
      )}
    </article>
  );
};
