import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { VaultCategory, VaultFile } from "@/types";

interface AddVaultFileInput {
  category: VaultCategory;
  data: ArrayBuffer;
  isActiveContext?: boolean;
  mimeType: string;
  name: string;
  size: number;
}

export const useVaultFiles = (projectId: string | undefined) => {
  const filesQuery = useLiveQuery(
    async (): Promise<VaultFile[]> => {
      if (!projectId) {
        return [];
      }

      return db.vaultFiles.where("projectId").equals(projectId).toArray();
    },
    [projectId]
  );

  const files = filesQuery ?? [];
  const isLoading = filesQuery === undefined;

  const addFile = async (
    input: AddVaultFileInput
  ): Promise<VaultFile | null> => {
    if (!projectId) {
      return null;
    }

    try {
      const file: VaultFile = {
        id: crypto.randomUUID(),
        projectId,
        name: input.name,
        size: input.size,
        mimeType: input.mimeType,
        category: input.category,
        isActiveContext: input.isActiveContext ?? false,
        data: input.data,
        uploadedAt: Date.now()
      };

      await db.vaultFiles.add(file);
      return file;
    } catch (error) {
      console.error("Failed to add vault file.", error);
      return null;
    }
  };

  const removeFile = async (fileId: string): Promise<void> => {
    try {
      await db.vaultFiles.delete(fileId);
    } catch (error) {
      console.error("Failed to remove vault file.", error);
    }
  };

  const toggleContext = async (fileId: string): Promise<void> => {
    try {
      const file = await db.vaultFiles.get(fileId);
      if (!file) {
        return;
      }

      await db.vaultFiles.put({
        ...file,
        isActiveContext: !file.isActiveContext
      });
    } catch (error) {
      console.error("Failed to toggle file context.", error);
    }
  };

  return {
    files,
    isLoading,
    addFile,
    removeFile,
    toggleContext
  };
};
