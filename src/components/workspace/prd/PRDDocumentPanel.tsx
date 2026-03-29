import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "@/components/shared/CopyButton";
import { downloadAsFile } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface ContextNode {
  available: boolean;
  label: string;
  id: string;
}

interface PRDDocumentPanelProps {
  contextAvailability: ContextNode[];
  activeNodes?: string[];
  onToggleNode?: (nodeId: string) => void;
  errorMessage: string;
  isGenerating: boolean;
  onGenerate: () => void;
  prdContent: string | null;
  streamingContent: string;
  isEditable?: boolean;
  onSave?: (content: string) => void;
  onReset?: () => void;
}

const PREVIEW_HEIGHT = 300;

export const PRDDocumentPanel = ({
  contextAvailability,
  activeNodes = [],
  onToggleNode,
  errorMessage,
  isGenerating,
  onGenerate,
  prdContent,
  streamingContent,
  isEditable = false,
  onSave,
  onReset
}: PRDDocumentPanelProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const hasContent = Boolean(prdContent || (isGenerating && streamingContent));
  const displayContent = isEditing ? editedContent : (isGenerating ? streamingContent : prdContent ?? "");

  // Initialize edited content when content changes
  useEffect(() => {
    if (prdContent && !isEditing) {
      setEditedContent(prdContent);
    }
  }, [prdContent, isEditing]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isGenerating && contentRef.current && streamingContent) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [isGenerating, streamingContent]);

  return (
    <section className="w-full max-w-full rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">
            PRD
          </h2>
          {activeNodes.length > 0 && (
            <span className="shrink-0 rounded-full bg-secondary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-secondary" title={`${activeNodes.length} context items active`}>
              {activeNodes.length} Context
            </span>
          )}
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            v0.4.2-alpha
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {onReset && prdContent && !isEditing && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear generated content? This cannot be undone.")) {
                  onReset();
                }
              }}
              className="shrink-0 rounded-xl bg-surface px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high hover:text-tertiary"
              title="Reset PRD"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          )}
          {isEditable && !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="shrink-0 rounded-xl bg-surface px-4 py-2 text-sm text-on-surface transition hover:bg-surface-container-high"
              title="Edit PRD"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          ) : null}
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onSave?.(editedContent);
                  setIsEditing(false);
                }}
                className="shrink-0 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                title="Save changes"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedContent(prdContent ?? "");
                  setIsEditing(false);
                }}
                className="shrink-0 rounded-xl bg-surface px-4 py-2 text-sm text-on-surface transition hover:bg-surface-container-high"
                title="Cancel edits"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => downloadAsFile(prdContent ?? "", "PRD.md")}
                disabled={!prdContent}
                className="shrink-0 rounded-xl bg-surface px-4 py-2 text-sm text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
                title="Download PRD as Markdown"
              >
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
              <CopyButton text={prdContent ?? ""} size="sm" label="Copy as Markdown" />
            </>
          )}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="gradient-cta glow-primary shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : prdContent ? "Regenerate" : "Generate PRD"}
          </button>
        </div>
      </div>

      {/* Context Selection */}
      <div className="mt-4 rounded-xl border border-outline-variant/10 bg-surface p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-outline">
          Include Context
        </p>
        <div className="flex flex-wrap gap-2">
          {contextAvailability.map((node) => (
            <label
              key={node.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                !node.available
                  ? "cursor-not-allowed border-outline-variant/10 bg-surface opacity-50"
                  : activeNodes.includes(node.id)
                    ? "border-primary/20 bg-primary/10"
                    : "border-outline-variant/10 bg-surface hover:bg-surface-container-high"
              }`}
            >
              <input
                type="checkbox"
                checked={activeNodes.includes(node.id)}
                onChange={() => onToggleNode?.(node.id)}
                disabled={!node.available}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-on-surface">{node.label}</span>
              {node.available ? (
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-secondary">
                  Available
                </span>
              ) : (
                <span className="rounded-full bg-surface px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-outline">
                  Missing
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
          {errorMessage}
        </div>
      ) : null}

      {isGenerating && streamingContent ? (
        // Streaming state with fixed height and blur
        <div className="mt-6">
          <div
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-surface shadow-[0_0_20px_rgba(197,192,255,0.1)]"
            style={{ height: PREVIEW_HEIGHT }}
          >
            <div
              ref={contentRef}
              className="h-full overflow-y-auto p-6 font-mono text-sm text-on-surface backdrop-blur-[2px]"
              style={{ maxHeight: PREVIEW_HEIGHT }}
            >
              {streamingContent}
              <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-primary align-middle" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container" />
          </div>
        </div>
      ) : hasContent && !isGenerating ? (
        // Content ready - show expandable view
        <>
          {isExpanded ? (
            <div className="mt-6">
              {/* Top collapse button - always visible when expanded */}
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">expand_less</span>
                  Collapse
                </button>
              </div>
              {/* Expanded content with overflow protection or edit mode */}
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="h-[600px] w-full resize-y rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 font-mono text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : (
                <div className="prose prose-invert max-w-none overflow-x-auto rounded-2xl border border-outline-variant/10 bg-surface p-6 prose-headings:font-headline prose-h2:text-primary prose-h3:text-secondary prose-code:text-primary prose-pre:bg-surface-container-lowest">
                  <div className="min-w-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <div
                className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface"
                style={{ height: PREVIEW_HEIGHT }}
              >
                <div
                  className="h-full overflow-y-auto p-6"
                  style={{ maxHeight: PREVIEW_HEIGHT }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-surface-container" />
              </div>
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                  Show full PRD
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-outline-variant/20 bg-surface px-6 py-12 text-center">
          <p className="font-headline text-xl font-semibold text-on-surface">
            No PRD generated yet
          </p>
          <p className="mt-3 text-sm text-on-surface-variant">
            Generate a structured PRD from the current project context.
          </p>
          <button
            type="button"
            onClick={onGenerate}
            className="gradient-cta glow-primary mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
          >
            Generate PRD
          </button>
        </div>
      )}
    </section>
  );
};
