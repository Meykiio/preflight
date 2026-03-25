interface RoutingSettingsSectionProps {
  availableModels: string[];
  defaultProviderId?: string;
  defaultProviderModel?: string;
  isStreamingEnabled: boolean;
  onToggleStreaming: () => void;
  onUpdateModel: (model: string) => void;
}

export const RoutingSettingsSection = ({
  availableModels,
  defaultProviderId,
  defaultProviderModel,
  isStreamingEnabled,
  onToggleStreaming,
  onUpdateModel
}: RoutingSettingsSectionProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">psychology</span>
        <h2 className="font-headline text-2xl font-semibold text-on-surface">
          Intelligence Routing
        </h2>
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Default Workspace Model
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Select the primary model for new generation tasks.
            </p>
          </div>
          <select
            value={defaultProviderModel ?? availableModels[0]}
            disabled={!defaultProviderId}
            onChange={(event) => onUpdateModel(event.target.value)}
            className="min-w-[280px] rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 font-mono text-sm text-on-surface outline-none transition focus:border-primary/40 disabled:opacity-50"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-outline-variant/10 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Streaming Response
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Visualize the model thinking in real-time.
              </p>
            </div>
            <button
              type="button"
              aria-label="Toggle streaming responses"
              onClick={onToggleStreaming}
              className={`relative h-7 w-12 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isStreamingEnabled ? "bg-primary-container" : "bg-surface-container-highest"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isStreamingEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
