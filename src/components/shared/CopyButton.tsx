import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { cn, copyToClipboard } from "@/lib/utils";

interface CopyButtonProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  text: string;
}

const SIZE_CLASSES: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base"
};

export const CopyButton = ({
  label = "Copy",
  size = "md",
  text
}: CopyButtonProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopy = async (): Promise<void> => {
    const didCopy = await copyToClipboard(text);

    if (didCopy) {
      setIsCopied(true);
      return;
    }

    toast.error("Copy failed. Please try again.");
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-high text-on-surface transition duration-200 hover:bg-surface-bright",
        SIZE_CLASSES[size]
      )}
    >
      <span className="material-symbols-outlined text-base">
        {isCopied ? "check" : "content_copy"}
      </span>
      <span>{isCopied ? "Copied!" : label}</span>
    </button>
  );
};
