import { CopyButton } from "@/components/shared/CopyButton";
import { downloadAsFile } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface ArtifactGeneratorPanelProps {
  badgeLabel: string;
  content: string | null;
  description: string;
  fileLabel: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onSelectPlatform: (platform: string) => void;
  platforms: string[];
  selectedPlatform: string;
  streamingContent: string;
  title: string;
  onReset?: () => void;
}

const PREVIEW_HEIGHT = 200;

export const ArtifactGeneratorPanel = ({
  badgeLabel,
  content,
  description,
  fileLabel,
  isGenerating,
  onGenerate,
  onSelectPlatform,
  platforms,
  selectedPlatform,
  streamingContent,
  title,
  onReset
}: ArtifactGeneratorPanelProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);
  const hasFinishedStreaming = useRef(false);
  
  const displayContent = isGenerating ? streamingContent : (content ?? "");
  const hasContent = Boolean(content || (isGenerating && streamingContent));

  // Auto-scroll during streaming
  useEffect(() => {
    if (isGenerating && contentRef.current && streamingContent) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [isGenerating, streamingContent]);

  // Track when streaming finishes
  useEffect(() => {
    if (!isGenerating && content && !hasFinishedStreaming.current) {
      hasFinishedStreaming.current = true;
    }
  }, [isGenerating, content]);

  // Reset expand state when new generation starts
  useEffect(() => {
    if (isGenerating) {
      hasFinishedStreaming.current = false;
      setIsExpanded(false);
    }
  }, [isGenerating]);

  const showExpanded = isExpanded;
  const showCollapsed = !isExpanded && !isGenerating;

  return (
    <section className="glass-panel w-full max-w-full rounded-2xl border border-outline-variant/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-headline text-headline-md font-semibold text-on-surface">{title}</h2>
          <p className="mt-2 text-body-sm text-on-surface-variant">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary/10 px-3 py-1 font-mono text-label-sm uppercase tracking-[0.18em] text-secondary">
          {badgeLabel}
        </span>
      </div>

      <div className="mt-4 flex shrink-0 flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            onClick={() => onSelectPlatform(platform)}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs transition ${
              selectedPlatform === platform
                ? "bg-surface-container-high text-primary border border-primary/20"
                : "text-outline hover:text-on-surface border border-outline-variant/20"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 font-mono text-label-sm uppercase tracking-[0.18em] text-on-surface-variant border border-outline-variant/20">
          {fileLabel}
        </span>
        <div className="shrink-0 flex items-center gap-2">
          {onReset && content && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear generated content? This cannot be undone.")) {
                  onReset();
                }
              }}
              className="rounded-lg border border-outline-variant/20 bg-surface p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-tertiary"
              title="Reset"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => downloadAsFile(content ?? "", fileLabel)}
            disabled={!content}
            className="rounded-lg border border-outline-variant/20 bg-surface p-2 text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
            title={`Download ${title}`}
          >
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
          <CopyButton text={content ?? ""} size="sm" />
        </div>
      </div>

      {/* Content Display with Collapsed Streaming */}
      {hasContent && (
        <div className="mt-4">
          {(isGenerating || (showCollapsed && displayContent.split("\n").length > 8)) ? (
            <div
              className="relative overflow-hidden rounded-xl border border-outline-variant/10"
              style={{ height: PREVIEW_HEIGHT }}
            >
              <pre
                ref={contentRef}
                className="h-full overflow-auto overflow-x-auto rounded-xl bg-surface-container-lowest p-4 font-mono text-sm text-secondary whitespace-pre-wrap break-all"
                style={{ maxHeight: PREVIEW_HEIGHT }}
              >
                {isGenerating && streamingContent
                  ? `${streamingContent}▋`
                  : content || `Generate ${title.toLowerCase()} to populate this panel.`}
              </pre>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-surface-container" />
            </div>
          ) : showExpanded ? (
            <div className="mt-3">
              {/* Top collapse button */}
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
              {/* Expanded content with overflow protection */}
              <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-surface-container-lowest p-4 font-mono text-sm text-secondary">
                {displayContent}
              </pre>
            </div>
          ) : null}

          {/* Expand/Collapse Buttons */}
          {!isGenerating && displayContent.split("\n").length > 8 && (
            <div className="mt-3 text-center">
              {showCollapsed ? (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                  Show full {title.toLowerCase()}
                </button>
              ) : null}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        className="gradient-cta glow-primary mt-4 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
      >
        {isGenerating ? "Generating..." : `Generate ${title}`}
      </button>
    </section>
  );
};
