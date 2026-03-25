import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";

export const useFirstLaunch = () => {
  const settingsQuery = useLiveQuery(
    async () => (await db.appSettings.get("app-settings")) ?? null,
    []
  );

  const completeOnboarding = async (): Promise<void> => {
    const current = await db.appSettings.get("app-settings");
    if (!current) {
      return;
    }

    await db.appSettings.put({
      ...current,
      isOnboardingComplete: true,
      updatedAt: Date.now()
    });
  };

  return {
    isLoading: settingsQuery === undefined,
    isFirstLaunch: settingsQuery ? !settingsQuery.isOnboardingComplete : false,
    completeOnboarding
  };
};
