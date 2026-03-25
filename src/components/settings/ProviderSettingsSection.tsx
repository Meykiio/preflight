import { ProviderCard } from "@/components/settings/ProviderCard";
import type { AIProviderSummary } from "@/hooks/useAIProviders";
import type { AIProvider } from "@/types";

interface ProviderSettingsSectionProps {
  connectedCount: number;
  isLoading: boolean;
  providerCards: AIProviderSummary[];
  onSaveProvider: (provider: AIProvider, apiKey: string) => Promise<void>;
  onSetDefault: (providerId: string) => Promise<void>;
}

export const ProviderSettingsSection = ({
  connectedCount,
  isLoading,
  providerCards,
  onSaveProvider,
  onSetDefault
}: ProviderSettingsSectionProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">key</span>
          <h2 className="font-headline text-2xl font-semibold text-on-surface">
            AI Providers
          </h2>
        </div>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          {connectedCount} core links active
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[220px] animate-pulse rounded-2xl bg-surface-container-high"
              />
            ))
          : providerCards.map((provider) => (
              <ProviderCard
                key={provider.provider}
                provider={provider}
                onSave={onSaveProvider}
                onSetDefault={onSetDefault}
              />
            ))}
      </div>
    </section>
  );
};
