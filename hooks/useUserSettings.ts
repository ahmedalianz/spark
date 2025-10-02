import { api } from "@/convex/_generated/api";
import { UserSettings } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useCallback } from "react";

export const useUserSettings = () => {
  const { userId } = useAuth();

  const settings = useQuery(
    api.userSettings.getByUserId,
    userId ? { userId } : "skip"
  );

  const updateSettings = useMutation(api.userSettings.update);

  const updateSetting = useCallback(
    async (category: keyof UserSettings, key: string, value: any) => {
      if (!userId) return;

      await updateSettings({
        userId,
        category,
        key,
        value,
        updatedAt: Date.now(),
      });
    },
    [userId, updateSettings]
  );

  const bulkUpdateSettings = useCallback(
    async (
      updates: { category: keyof UserSettings; key: string; value: any }[]
    ) => {
      if (!userId) return;

      for (const update of updates) {
        await updateSettings({
          userId,
          category: update.category,
          key: update.key,
          value: update.value,
          updatedAt: Date.now(),
        });
      }
    },
    [userId, updateSettings]
  );

  return {
    settings: settings as UserSettings | null,
    updateSetting,
    bulkUpdateSettings,
    isLoading: settings === undefined,
  };
};
