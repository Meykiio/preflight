import { useRef, useState } from "react";
import { PROVIDER_CATALOG } from "@/lib/ai/providerCatalog";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";

export interface ProviderCardValue {
  id?: string;
  provider: AIProvider;
  model: string;
  isDefault: boolean;
  hasKey: boolean;
  maskedKey: string;
}

interface ProviderCardProps {
  provider: ProviderCardValue;
  onSave: (provider: AIProvider, apiKey: string) => Promise<void>;
  onSetDefault: (providerId: string) => Promise<void>;
}

export const ProviderCard = ({
  provider,
  onSave,
  onSetDefault
}: ProviderCardProps): JSX.Element => {
  const config = PROVIDER_CATALOG[provider.provider];
  const providerId = provider.id;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (): Promise<void> => {
    const value = inputRef.current?.value.trim() ?? "";
    if (!value) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(provider.provider, value);
      setIsEditing(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-lowest text-primary">
          <span className="material-symbols-outlined">{config.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              provider.hasKey ? "bg-secondary" : "bg-tertiary"
            )}
          />
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              provider.hasKey ? "text-secondary" : "text-tertiary"
            )}
          >
            {provider.hasKey ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-headline text-sm font-semibold text-on-surface">
            {config.label}
          </h3>
          {providerId ? (
            <button
              type="button"
              onClick={() => void onSetDefault(providerId)}
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                provider.isDefault
                  ? "bg-primary/10 text-primary"
                  : "bg-surface text-on-surface-variant hover:text-on-surface"
              )}
            >
              {provider.isDefault ? "Default" : "Set Default"}
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3">
            <input
              ref={inputRef}
              type="password"
              autoFocus
              placeholder={`Paste your ${config.keyLabel.toLowerCase()}`}
              className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 font-mono text-sm text-on-surface outline-none transition focus:border-primary/40"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void handleSave()}
                className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/15 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">
              {provider.hasKey ? provider.maskedKey : "No key connected"}
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full p-2 text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface hover:text-primary"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
