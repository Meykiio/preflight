import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { AppSettings } from "@/types";

export const useSettings = () => {
  const settingsQuery = useLiveQuery(
    async () => (await db.appSettings.get("app-settings")) ?? null,
    []
  );

  const updateSettings = async (
    updates: Partial<AppSettings>
  ): Promise<AppSettings | null> => {
    try {
      const current = await db.appSettings.get("app-settings");
      if (!current) {
        return null;
      }

      const nextSettings: AppSettings = {
        ...current,
        ...updates,
        updatedAt: Date.now()
      };

      await db.appSettings.put(nextSettings);
      return nextSettings;
    } catch (error) {
      console.error("Failed to update settings.", error);
      return null;
    }
  };

  return {
    settings: settingsQuery ?? null,
    isLoading: settingsQuery === undefined,
    updateSettings
  };
};
