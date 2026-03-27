import { memo, useMemo, useState, useCallback } from "react";
import { AgentPromptsSection } from "@/components/settings/AgentPromptsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DiagnosticsCard } from "@/components/settings/DiagnosticsCard";
import { PlatformLaunchersSection } from "@/components/settings/PlatformLaunchersSection";
import { ProviderSettingsSection } from "@/components/settings/ProviderSettingsSection";
import { RoutingSettingsSection } from "@/components/settings/RoutingSettingsSection";
import { StorageSection } from "@/components/settings/StorageSection";
import { UsageLogsModal } from "@/components/settings/UsageLogsModal";
import { useAIProviders } from "@/hooks/useAIProviders";
import { useAgentPrompts } from "@/hooks/useAgentPrompts";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/useToast";
import type { UsageLogEntry } from "@/lib/appData";
import { clearAllAppData, exportAppData, getUsageLogs } from "@/lib/appData";
import { PROVIDER_CATALOG } from "@/lib/ai/providerCatalog";
import {
  buildProviderCards,
  downloadJsonFile
} from "@/pages/settings/settingsPageHelpers";
import type { AIProvider } from "@/types";

export const SettingsPage = memo((): JSX.Element => {
  const toast = useToast();
  const { settings, updateSettings } = useSettings();
  const { providers, defaultProvider, isLoading: isProvidersLoading, saveProvider, setDefault } =
    useAIProviders();
  const { prompts, isLoading: isPromptsLoading, updatePrompt, resetToDefault } =
    useAgentPrompts();
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [usageLogs, setUsageLogs] = useState<UsageLogEntry[]>([]);

  // Memoize derived state
  const providerCards = useMemo(() => buildProviderCards(providers), [providers]);
  const connectedCount = useMemo(() => providers.filter((provider) => provider.hasKey).length, [providers]);
  const availableModels = useMemo(
    () => defaultProvider
      ? PROVIDER_CATALOG[defaultProvider.provider].models
      : PROVIDER_CATALOG.anthropic.models,
    [defaultProvider]
  );

  const handleSaveProvider = useCallback(async (
    provider: AIProvider,
    apiKey: string
  ): Promise<void> => {
    const existing = providers.find((item) => item.provider === provider);
    const config = PROVIDER_CATALOG[provider];

    const result = await saveProvider({
      id: existing?.id,
      provider,
      apiKey,
      isDefault: existing?.isDefault ?? connectedCount === 0,
      model: existing?.model ?? config.defaultModel
    });

    if (result) {
      toast.success(`${config.label} connected.`);
    } else {
      toast.error(`Could not save ${config.label}.`);
    }
  }, [providers, connectedCount, saveProvider, toast]);

  const handleToggleLauncher = useCallback((launcherId: string): void => {
    const isEnabled = settings?.enabledPlatformLaunchers.includes(launcherId) ?? false;
    const next = isEnabled
      ? settings?.enabledPlatformLaunchers.filter((value) => value !== launcherId) ?? []
      : [...(settings?.enabledPlatformLaunchers ?? []), launcherId];
    void updateSettings({ enabledPlatformLaunchers: next });
    toast.success("Launcher updated.");
  }, [settings, updateSettings, toast]);

  const handleOpenLogs = useCallback(async (): Promise<void> => {
    const logs = await getUsageLogs();
    setUsageLogs(logs);
    setIsLogsOpen(true);
  }, []);

  const handleClearAllData = useCallback(async (): Promise<void> => {
    const confirmed = window.confirm(
      "Clear all local Preflight data? This will remove projects, vault files, prompts, and settings."
    );

    if (!confirmed) {
      return;
    }

    await clearAllAppData();
    window.location.reload();
  }, []);

  const handleSetDefault = useCallback(async (providerId: string): Promise<void> => {
    await setDefault(providerId);
    toast.success("Default provider updated.");
  }, [setDefault, toast]);

  const handleToggleStreaming = useCallback((): void => {
    void updateSettings({ streamingEnabled: !settings?.streamingEnabled });
  }, [settings, updateSettings]);

  const handleUpdateModel = useCallback((model: string): void => {
    if (!defaultProvider?.id) {
      return;
    }

    void saveProvider({
      id: defaultProvider.id,
      provider: defaultProvider.provider,
      apiKey: "",
      isDefault: true,
      model
    });
  }, [defaultProvider, saveProvider]);

  const handleExportJson = useCallback(async (): Promise<void> => {
    const payload = await exportAppData();
    downloadJsonFile(payload, "preflight-export.json");
    toast.success("Workspace JSON exported.");
  }, [toast]);

  const handleResetPrompt = useCallback(async (promptId: string): Promise<void> => {
    const saved = await resetToDefault(promptId);
    if (saved) {
      toast.success("Agent prompt reset.");
    } else {
      toast.error("Could not reset the agent prompt.");
    }
  }, [resetToDefault, toast]);

  const handleSavePrompt = useCallback(async (promptId: string, content: string): Promise<void> => {
    const saved = await updatePrompt(promptId, { content, isDefault: false });
    if (saved) {
      toast.success("Agent prompt updated.");
    } else {
      toast.error("Could not update the agent prompt.");
    }
  }, [updatePrompt, toast]);

  const handleChangeUserName = useCallback((userName: string): void => {
    void updateSettings({ userName });
  }, [updateSettings]);

  const handleModalClose = useCallback(() => {
    setIsLogsOpen(false);
  }, []);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 py-8">
        <header className="mb-8">
          <h1 className="font-headline text-headline-2xl font-bold text-on-surface">
            Workspace Settings
          </h1>
          <p className="mt-2 font-mono text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">
            Engine configuration & authentication
          </p>
        </header>

        {/* Settings Grid - Full Width */}
        <div className="space-y-6">
          <ProviderSettingsSection
            connectedCount={connectedCount}
            isLoading={isProvidersLoading}
            onSaveProvider={handleSaveProvider}
            onSetDefault={handleSetDefault}
            providerCards={providerCards}
          />

          {/* Intelligence Routing + Platform Launchers - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoutingSettingsSection
              availableModels={availableModels}
              defaultProviderId={defaultProvider?.id}
              defaultProviderModel={defaultProvider?.model}
              isStreamingEnabled={settings?.streamingEnabled ?? true}
              onToggleStreaming={handleToggleStreaming}
              onUpdateModel={handleUpdateModel}
            />

            <PlatformLaunchersSection
              enabledLaunchers={settings?.enabledPlatformLaunchers ?? []}
              onToggleLauncher={handleToggleLauncher}
            />
          </div>

          <AppearanceSection
            userName={settings?.userName ?? ""}
            onChangeUserName={handleChangeUserName}
          />

          <AgentPromptsSection
            isLoading={isPromptsLoading}
            onReset={handleResetPrompt}
            onSave={handleSavePrompt}
            prompts={prompts}
          />

          {/* Storage & Diagnostics - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StorageSection
              onClearAllData={handleClearAllData}
              onExportJson={handleExportJson}
              onOpenLogs={handleOpenLogs}
            />

            <DiagnosticsCard />
          </div>
        </div>
      </section>

      <UsageLogsModal
        entries={usageLogs}
        isOpen={isLogsOpen}
        onClose={handleModalClose}
      />
    </>
  );
});

SettingsPage.displayName = "SettingsPage";
