import { PROVIDER_CATALOG, PROVIDER_ORDER } from "@/lib/ai/providerCatalog";
import type { AIProviderSummary } from "@/hooks/useAIProviders";

export const buildProviderCards = (
  providers: AIProviderSummary[]
): AIProviderSummary[] =>
  PROVIDER_ORDER.map((provider) => {
    const connected = providers.find((item) => item.provider === provider);

    return (
      connected ?? {
        provider,
        model: PROVIDER_CATALOG[provider].defaultModel,
        hasKey: false,
        id: undefined,
        isDefault: false,
        maskedKey: ""
      }
    );
  });

export const downloadJsonFile = (payload: unknown, fileName: string): void => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
