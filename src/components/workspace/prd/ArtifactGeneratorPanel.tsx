import { CopyButton } from "@/components/shared/CopyButton";
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
  title
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
    <section className="glass-panel rounded-2xl border border-outline-variant/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-headline text-headline-md font-semibold text-on-surface">{title}</h2>
          <p className="mt-2 text-body-sm text-on-surface-variant">{description}</p>
        </div>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-mono text-label-sm uppercase tracking-[0.18em] text-secondary">
          {badgeLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            onClick={() => onSelectPlatform(platform)}
            className={`rounded-xl px-3 py-2 text-xs transition ${
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
        <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-label-sm uppercase tracking-[0.18em] text-on-surface-variant border border-outline-variant/20">
          {fileLabel}
        </span>
        <CopyButton text={content ?? ""} size="sm" />
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
                className="h-full overflow-auto rounded-xl bg-surface-container-lowest p-4 font-mono text-sm text-secondary"
                style={{ maxHeight: PREVIEW_HEIGHT }}
              >
                {isGenerating && streamingContent
                  ? `${streamingContent}▋`
                  : content || `Generate ${title.toLowerCase()} to populate this panel.`}
              </pre>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-surface-container" />
            </div>
          ) : showExpanded ? (
            <pre className="rounded-xl bg-surface-container-lowest p-4 font-mono text-sm text-secondary">
              {displayContent}
            </pre>
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
              ) : (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">expand_less</span>
                  Collapse
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        className="gradient-cta glow-primary mt-4 rounded-xl px-4 py-3 text-sm font-semibold text-on-primary"
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </section>
  );
};
