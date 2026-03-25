import { useRef, useState } from "react";
import { OnboardingCompleteStep } from "@/components/onboarding/OnboardingCompleteStep";
import { OnboardingNameStep } from "@/components/onboarding/OnboardingNameStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingProviderStep } from "@/components/onboarding/OnboardingProviderStep";
import { useAIProviders } from "@/hooks/useAIProviders";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useSettings } from "@/hooks/useSettings";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { PROVIDER_CATALOG } from "@/lib/ai/providerCatalog";
import { createProviderFromConfig } from "@/services/ai";
import { useToast } from "@/hooks/useToast";
import type { AIProvider } from "@/types";

interface OnboardingFlowProps {
  onComplete: () => Promise<void>;
}

type OnboardingStep = 1 | 2 | 3;

export const OnboardingFlow = ({
  onComplete
}: OnboardingFlowProps): JSX.Element => {
  const toast = useToast();
  const { settings, updateSettings } = useSettings();
  const { saveProvider } = useAIProviders();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [name, setName] = useState(settings?.userName ?? "");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("anthropic");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationAttempts, setValidationAttempts] = useState(0);
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(true, () => undefined);

  const handleContinueName = async (): Promise<void> => {
    await updateSettings({ userName: name.trim() });
    setStep(2);
  };

  const handleVerifyProvider = async (): Promise<void> => {
    const apiKey = apiKeyRef.current?.value.trim() ?? "";
    if (!apiKey) {
      setErrorMessage("Enter an API key to continue.");
      return;
    }

    setErrorMessage("");
    setIsVerifying(true);

    try {
      const provider = await createProviderFromConfig({
        id: "onboarding-provider",
        provider: selectedProvider,
        apiKey,
        model: PROVIDER_CATALOG[selectedProvider].defaultModel,
        isDefault: true,
        createdAt: Date.now()
      });

      await provider.validateKey(apiKey);
      await saveProvider({
        provider: selectedProvider,
        apiKey,
        isDefault: true,
        model: PROVIDER_CATALOG[selectedProvider].defaultModel
      });
      toast.success(`${PROVIDER_CATALOG[selectedProvider].label} verified.`);
      setStep(3);
    } catch (error) {
      const errorState = getGenerationErrorState(error);
      const attempts = validationAttempts + 1;
      setValidationAttempts(attempts);
      setErrorMessage(
        attempts >= 3
          ? `${errorState.inlineMessage ?? errorState.toastMessage} Double-check the key source and provider selection.`
          : errorState.inlineMessage ?? errorState.toastMessage
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/80 px-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Preflight onboarding"
        className="glass-panel noise-texture relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container"
      >
        <OnboardingProgress step={step} />

        {step === 1 ? (
          <OnboardingNameStep
            name={name}
            onChangeName={setName}
            onContinue={() => void handleContinueName()}
          />
        ) : null}

        {step === 2 ? (
          <OnboardingProviderStep
            apiKeyRef={apiKeyRef}
            errorMessage={errorMessage}
            isVerifying={isVerifying}
            onSelectProvider={setSelectedProvider}
            onToggleApiVisibility={() => setShowApiKey((current) => !current)}
            onVerify={() => void handleVerifyProvider()}
            selectedProvider={selectedProvider}
            showApiKey={showApiKey}
          />
        ) : null}

        {step === 3 ? (
          <OnboardingCompleteStep onComplete={() => void onComplete()} />
        ) : null}
      </div>
    </div>
  );
};
