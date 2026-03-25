import { memo, useState, useEffect, useRef } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { PlatformLaunchers } from "@/components/shared/PlatformLaunchers";
import { cn, downloadAsFile } from "@/lib/utils";

interface OutputPanelProps {
  content: string | null;
  emptyDescription: string;
  emptyIcon?: string;
  emptyTitle: string;
  fileLabel?: string;
  isLoading?: boolean;
  isStreaming?: boolean;
  platforms?: string[];
  streamingContent?: string;
  title: string;
  variant?: "default" | "terminal";
}

const PREVIEW_HEIGHT = 200; // Fixed height in pixels

const OutputPanelComponent = ({
  content,
  emptyDescription,
  emptyIcon = "inventory_2",
  emptyTitle,
  fileLabel,
  isLoading = false,
  isStreaming = false,
  platforms = [],
  streamingContent = "",
  title,
  variant = "default"
}: OutputPanelProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);
  const hasFinishedStreaming = useRef(false);

  const resolvedContent = isStreaming ? streamingContent : content ?? "";
  const hasContent = Boolean(resolvedContent.trim());
  const contentLines = resolvedContent.split("\n");
  const isLongContent = contentLines.length > 6;

  // Track when streaming finishes
  useEffect(() => {
    if (!isStreaming && streamingContent && !hasFinishedStreaming.current) {
      hasFinishedStreaming.current = true;
    }
  }, [isStreaming, streamingContent]);

  // Reset expand state when new streaming starts
  useEffect(() => {
    if (isStreaming) {
      hasFinishedStreaming.current = false;
      setIsExpanded(false);
    }
  }, [isStreaming]);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [isStreaming, streamingContent]);

  // Determine if we should show expanded view
  const showExpanded = isExpanded;
  const showStreamingView = isStreaming;
  const showCollapsedView = !isExpanded && !isStreaming;

  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-4 border-b border-outline-variant/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-headline text-xl font-semibold text-on-surface">
            {title}
          </p>
          {fileLabel ? (
            <span className="mt-2 inline-flex rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              {fileLabel}
            </span>
          ) : null}
        </div>

        {hasContent && !isStreaming ? (
          <div className="flex flex-wrap items-center gap-3">
            {platforms.length > 0 ? <PlatformLaunchers platforms={platforms} /> : null}
            <CopyButton text={resolvedContent} size="sm" />
            <button
              type="button"
              onClick={() => downloadAsFile(resolvedContent, `${title.toLowerCase().replace(/\s+/g, "-")}.md`)}
              className="flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              title="Download as markdown file"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
            {!isExpanded && isLongContent && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
                Expand
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">
                  expand_less
                </span>
                Collapse
              </button>
            )}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3 rounded-xl border border-dashed border-outline-variant/10 bg-surface p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-3 animate-pulse rounded bg-surface-container-high",
                index === 3 ? "w-2/3" : "w-full"
              )}
            />
          ))}
        </div>
      ) : hasContent ? (
        <div
          className={cn(
            "mt-4 rounded-xl p-4 transition-all duration-300",
            variant === "terminal"
              ? "bg-surface-container-lowest font-mono text-sm text-secondary"
              : "border border-dashed border-outline-variant/10 bg-surface",
            isStreaming && "border-primary/30 shadow-[0_0_20px_rgba(197,192,255,0.1)]"
          )}
        >
          {/* Fixed height container during streaming or when collapsed with long content */}
          {(showStreamingView || (showCollapsedView && isLongContent)) && (
            <div
              className="relative overflow-hidden rounded-lg"
              style={{ height: PREVIEW_HEIGHT }}
            >
              <pre
                ref={contentRef}
                className={cn(
                  "whitespace-pre-wrap break-words text-sm text-on-surface",
                  showStreamingView && "backdrop-blur-[2px]"
                )}
                style={{ 
                  height: "100%",
                  maxHeight: PREVIEW_HEIGHT,
                  overflowY: "auto"
                }}
              >
                {resolvedContent}
                {isStreaming ? (
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-primary align-middle" />
                ) : null}
              </pre>
              
              {/* Gradient fade at bottom */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container" />
            </div>
          )}
          
          {/* Full content when expanded */}
          {showExpanded && (
            <pre className="whitespace-pre-wrap break-words text-sm text-on-surface">
              {resolvedContent}
            </pre>
          )}
          
          {/* Show expand button after streaming completes or for long collapsed content */}
          {!isStreaming && !isExpanded && isLongContent && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">expand_more</span>
                Show full prompt ({contentLines.length} lines)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-outline-variant/20 bg-surface px-6 py-10 text-center">
          <span className="material-symbols-outlined text-5xl text-outline/40">
            {emptyIcon}
          </span>
          <p className="font-headline text-xl font-semibold text-on-surface">
            {emptyTitle}
          </p>
          <p className="mt-3 text-sm text-on-surface-variant">{emptyDescription}</p>
        </div>
      )}
    </section>
  );
};

export const OutputPanel = memo(OutputPanelComponent);
OutputPanel.displayName = "OutputPanel";
