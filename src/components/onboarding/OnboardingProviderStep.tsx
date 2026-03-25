import type { RefObject } from "react";
import { PROVIDER_CATALOG, PROVIDER_ORDER } from "@/lib/ai/providerCatalog";
import type { AIProvider } from "@/types";

interface OnboardingProviderStepProps {
  apiKeyRef: RefObject<HTMLInputElement>;
  errorMessage: string;
  isVerifying: boolean;
  onSelectProvider: (provider: AIProvider) => void;
  onToggleApiVisibility: () => void;
  onVerify: () => void;
  selectedProvider: AIProvider;
  showApiKey: boolean;
}

export const OnboardingProviderStep = ({
  apiKeyRef,
  errorMessage,
  isVerifying,
  onSelectProvider,
  onToggleApiVisibility,
  onVerify,
  selectedProvider,
  showApiKey
}: OnboardingProviderStepProps): JSX.Element => {
  const providerConfig = PROVIDER_CATALOG[selectedProvider];

  return (
    <div className="p-10">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
          Connect your AI
        </h1>
        <p className="mt-3 text-on-surface-variant">Bring your own key - free forever.</p>
      </div>

      <div className="mt-10">
        <label className="mb-4 block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Select Provider
        </label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {PROVIDER_ORDER.map((provider) => {
            const item = PROVIDER_CATALOG[provider];
            const isSelected = provider === selectedProvider;

            return (
              <button
                key={provider}
                type="button"
                onClick={() => onSelectProvider(provider)}
                className={`rounded-xl border p-4 text-center transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isSelected
                    ? "border-primary bg-primary/10 text-on-surface"
                    : "border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${
                    isSelected ? "text-primary" : "opacity-50"
                  }`}
                >
                  {item.icon}
                </span>
                <p className="mt-3 font-headline text-sm font-semibold">{item.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            {providerConfig.keyLabel}
          </label>
          <a
            href={providerConfig.helpUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary transition hover:underline"
          >
            How to get your API key
          </a>
        </div>

        <div className="relative">
          <input
            ref={apiKeyRef}
            data-autofocus
            type={showApiKey ? "text" : "password"}
            placeholder={`Paste your ${providerConfig.keyLabel.toLowerCase()}`}
            className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-5 py-4 pr-14 font-mono text-sm text-on-surface outline-none transition focus:border-primary/40"
          />
          <button
            type="button"
            onClick={onToggleApiVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition hover:text-on-surface"
          >
            <span className="material-symbols-outlined">
              {showApiKey ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
            {errorMessage}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onVerify}
        disabled={isVerifying}
        className="gradient-cta glow-primary mt-10 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 font-semibold text-on-primary disabled:opacity-70"
      >
        {isVerifying ? (
          <>
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </>
        )}
      </button>

      <div className="mt-6 flex flex-col gap-3 text-[10px] uppercase tracking-[0.22em] text-outline/60 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span>Encrypted on-device</span>
        </div>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-8 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-primary/40 md:block">
        <p>Latency: 24ms</p>
        <p className="mt-1">Region: EU-WEST</p>
        <p className="mt-1">Uptime: 99.98%</p>
      </div>

      <div className="pointer-events-none absolute right-8 top-8 hidden text-right font-mono text-[10px] uppercase tracking-[0.24em] text-primary/40 md:block">
        <p>Preflight v0.1.0</p>
        <p className="mt-1">Alpha Access</p>
      </div>
    </div>
  );
};
