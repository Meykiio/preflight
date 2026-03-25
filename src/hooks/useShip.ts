import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { Credential, CredentialCategory, ProjectVersion } from "@/types";

export const useShip = (projectId: string | undefined) => {
  // Load project versions
  const versionsQuery = useLiveQuery(
    async (): Promise<ProjectVersion[]> => {
      if (!projectId) {
        return [];
      }

      return db.projectVersions
        .where("projectId")
        .equals(projectId)
        .reverse()
        .sortBy("createdAt");
    },
    [projectId]
  );

  // Load credentials
  const credentialsQuery = useLiveQuery(
    async (): Promise<Credential[]> => {
      if (!projectId) {
        return [];
      }

      return db.credentials
        .where("projectId")
        .equals(projectId)
        .reverse()
        .sortBy("updatedAt");
    },
    [projectId]
  );

  const versions = versionsQuery ?? [];
  const credentials = credentialsQuery ?? [];
  const isLoading = versionsQuery === undefined || credentialsQuery === undefined;

  // Add new version with ZIP file
  const addVersion = async (input: {
    name: string;
    description: string;
    version: string;
    zipData: ArrayBuffer;
    zipSize: number;
    liveUrl?: string;
  }): Promise<ProjectVersion | null> => {
    if (!projectId) {
      return null;
    }

    try {
      const version: ProjectVersion = {
        id: crypto.randomUUID(),
        projectId,
        version: input.version,
        name: input.name,
        description: input.description,
        zipData: input.zipData,
        zipSize: input.zipSize,
        liveUrl: input.liveUrl,
        createdAt: Date.now()
      };

      await db.projectVersions.add(version);
      return version;
    } catch (error) {
      console.error("Failed to add project version.", error);
      return null;
    }
  };

  // Delete version
  const deleteVersion = async (versionId: string): Promise<void> => {
    try {
      await db.projectVersions.delete(versionId);
    } catch (error) {
      console.error("Failed to delete project version.", error);
    }
  };

  // Get version ZIP data for download
  const getVersionZip = async (versionId: string): Promise<ArrayBuffer | null> => {
    try {
      const version = await db.projectVersions.get(versionId);
      return version?.zipData ?? null;
    } catch (error) {
      console.error("Failed to get version ZIP.", error);
      return null;
    }
  };

  // Update live URL
  const updateLiveUrl = async (versionId: string, liveUrl: string): Promise<void> => {
    try {
      const version = await db.projectVersions.get(versionId);
      if (!version) return;

      await db.projectVersions.put({
        ...version,
        liveUrl
      });
    } catch (error) {
      console.error("Failed to update live URL.", error);
    }
  };

  // Add credential
  const addCredential = async (input: {
    name: string;
    value: string;
    category: CredentialCategory;
    notes?: string;
  }): Promise<Credential | null> => {
    if (!projectId) {
      return null;
    }

    try {
      const credential: Credential = {
        id: crypto.randomUUID(),
        projectId,
        name: input.name,
        value: input.value,
        category: input.category,
        notes: input.notes,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await db.credentials.add(credential);
      return credential;
    } catch (error) {
      console.error("Failed to add credential.", error);
      return null;
    }
  };

  // Update credential
  const updateCredential = async (
    credentialId: string,
    updates: Partial<Credential>
  ): Promise<Credential | null> => {
    try {
      const current = await db.credentials.get(credentialId);
      if (!current) {
        return null;
      }

      const updated: Credential = {
        ...current,
        ...updates,
        updatedAt: Date.now()
      };

      await db.credentials.put(updated);
      return updated;
    } catch (error) {
      console.error("Failed to update credential.", error);
      return null;
    }
  };

  // Delete credential
  const deleteCredential = async (credentialId: string): Promise<void> => {
    try {
      await db.credentials.delete(credentialId);
    } catch (error) {
      console.error("Failed to delete credential.", error);
    }
  };

  // Export credentials as JSON
  const exportCredentials = async (): Promise<void> => {
    if (!projectId) return;

    try {
      const allCredentials = await db.credentials
        .where("projectId")
        .equals(projectId)
        .toArray();

      const exportData = {
        exportedAt: Date.now(),
        projectId,
        credentials: allCredentials.map((cred) => ({
          id: cred.id,
          name: cred.name,
          category: cred.category,
          notes: cred.notes,
          createdAt: cred.createdAt,
          updatedAt: cred.updatedAt
          // Note: value is NOT exported for security
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `credentials-export-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export credentials.", error);
    }
  };

  return {
    versions,
    credentials,
    isLoading,
    addVersion,
    deleteVersion,
    getVersionZip,
    updateLiveUrl,
    addCredential,
    updateCredential,
    deleteCredential,
    exportCredentials
  };
};
