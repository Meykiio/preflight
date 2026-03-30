import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 200,
  className
}: TooltipProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, delay);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowTooltip(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, delay]);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2"
  };

  // Arrow position classes
  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-current",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-current",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-current",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-current"
  };

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="tooltip"
      aria-label={content}
    >
      {children}

      {showTooltip && (
        <div
          className={cn(
            "pointer-events-none absolute z-50 max-w-xs animate-in fade-in zoom-in-95 duration-150",
            positionClasses[position]
          )}
        >
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container px-3 py-2 text-xs text-on-surface shadow-elevation-2">
            {content}
            {/* Arrow */}
            <div
              className={cn(
                "absolute h-0 w-0 border-4 border-transparent",
                arrowClasses[position]
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
