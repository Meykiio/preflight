import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { useShip } from "@/hooks/useShip";
import { useToast } from "@/hooks/useToast";
import { useBrief } from "@/hooks/useBrief";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBuildStages } from "@/hooks/useBuildStages";
import { downloadFileData } from "@/lib/fileUpload";
import { generateReadme } from "@/services/generation/readmeGeneration";
import { cn } from "@/lib/utils";
import type { CredentialCategory } from "@/types";

interface ShipPageProps {
  projectId: string;
}

export const ShipPage = ({ projectId }: ShipPageProps): JSX.Element => {
  const { project } = useProject(projectId);
  const { brief } = useBrief(projectId);
  const { artifacts } = useArtifacts(projectId);
  const { stages } = useBuildStages(projectId);
  const {
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
  } = useShip(projectId);
  const toast = useToast();

  const [isUploadingVersion, setIsUploadingVersion] = useState(false);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [editingLiveUrl, setEditingLiveUrl] = useState<string | null>(null);
  const [liveUrlInput, setLiveUrlInput] = useState("");
  const [newCredential, setNewCredential] = useState({
    name: "",
    value: "",
    category: "api_key" as CredentialCategory,
    notes: ""
  });
  const [showCredentialValue, setShowCredentialValue] = useState<Record<string, boolean>>({});
  const [isGeneratingReadme, setIsGeneratingReadme] = useState(false);
  const [streamingReadme, setStreamingReadme] = useState("");
  const [showFullReadme, setShowFullReadme] = useState(false);

  const handleVersionUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      toast.error("Please upload a ZIP file.");
      return;
    }

    setIsUploadingVersion(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      await addVersion({
        name: file.name.replace(/\.zip$/i, ""),
        description: `Version uploaded from ${file.name}`,
        version: `v${versions.length + 1}.0.0`,
        zipData: arrayBuffer,
        zipSize: file.size
      });
      toast.success("Project version uploaded.");
    } catch (error) {
      toast.error("Failed to upload version.");
    } finally {
      setIsUploadingVersion(false);
      event.target.value = "";
    }
  };

  const handleDownloadVersion = async (versionId: string, fileName: string): Promise<void> => {
    const zipData = await getVersionZip(versionId);
    if (!zipData) {
      toast.error("Failed to download version.");
      return;
    }
    downloadFileData(zipData, fileName, "application/zip");
    toast.success("Download started.");
  };

  const handleSaveLiveUrl = async (versionId: string): Promise<void> => {
    await updateLiveUrl(versionId, liveUrlInput);
    setEditingLiveUrl(null);
    toast.success("Live URL updated.");
  };

  const handleGenerateReadme = async (): Promise<void> => {
    if (!project || !brief) {
      toast.error("Project data not available.");
      return;
    }

    setIsGeneratingReadme(true);
    setStreamingReadme("");
    setShowFullReadme(false);

    try {
      const readmeContent = await generateReadme({
        project,
        brief,
        artifacts,
        stages,
        techStack: project.techStack,
        onChunk: (chunk) => setStreamingReadme((current) => `${current}${chunk}`)
      });

      // Auto-download after generation completes
      const blob = new Blob([readmeContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "README.md";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("README.md generated.");
    } catch (error) {
      toast.error("Failed to generate README.");
    } finally {
      setIsGeneratingReadme(false);
    }
  };

  const handleAddCredential = async (): Promise<void> => {
    if (!newCredential.name || !newCredential.value) {
      toast.error("Name and value are required.");
      return;
    }

    try {
      await addCredential(newCredential);
      setNewCredential({ name: "", value: "", category: "api_key", notes: "" });
      setIsAddingCredential(false);
      toast.success("Credential added.");
    } catch (error) {
      toast.error("Failed to add credential.");
    }
  };

  const handleCopyCredential = async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Credential copied to clipboard.");
    } catch (error) {
      toast.error("Failed to copy credential.");
    }
  };

  const toggleCredentialVisibility = (credentialId: string): void => {
    setShowCredentialValue((prev) => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="rounded-2xl bg-surface-container p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Loading</p>
          <p className="mt-3 text-on-surface-variant">Loading project archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      {/* Header */}
      <section className="mb-8 rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-[28px] font-bold tracking-tight text-on-surface">
              Ship
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Manage project versions, credentials, and deployment for {project?.name}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGenerateReadme}
              className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/20"
            >
              Generate README
            </button>
            <button
              type="button"
              onClick={() => exportCredentials()}
              className="rounded-xl bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container-high"
            >
              Export Credentials
            </button>
          </div>
        </div>
      </section>

      {/* README Generation Panel - Full Width */}
      {(isGeneratingReadme || streamingReadme) && (
        <section className="mb-8 rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">description</span>
              <h2 className="font-headline text-xl font-semibold text-on-surface">
                README.md Preview
              </h2>
            </div>
            <div className="flex gap-2">
              {streamingReadme && !isGeneratingReadme && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowFullReadme(!showFullReadme)}
                    className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                  >
                    {showFullReadme ? "Collapse" : "Expand"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([streamingReadme], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "README.md";
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/20"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>

          {isGeneratingReadme ? (
            <div className="rounded-xl border border-primary/30 bg-surface p-6">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-on-surface-variant">
                {streamingReadme || "Generating README..."}
                <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-primary align-middle" />
              </pre>
            </div>
          ) : streamingReadme ? (
            <div className={cn(
              "rounded-xl border border-outline-variant/10 bg-surface p-6",
              !showFullReadme && "max-h-[400px] overflow-hidden"
            )}>
              <pre className={cn(
                "whitespace-pre-wrap break-words font-mono text-sm text-on-surface-variant",
                !showFullReadme && "overflow-hidden"
              )}>
                {streamingReadme}
              </pre>
              {!showFullReadme && (
                <div className="relative mt-2">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
                </div>
              )}
            </div>
          ) : null}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Versions */}
        <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-semibold text-on-surface">
              Project Versions
            </h2>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".zip"
                onChange={handleVersionUpload}
                className="hidden"
                disabled={isUploadingVersion}
              />
              <span className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/20">
                {isUploadingVersion ? "Uploading..." : "Upload ZIP"}
              </span>
            </label>
          </div>

          <div className="mt-6 space-y-3">
            {versions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/20 bg-surface p-6 text-center">
                <p className="text-sm text-on-surface-variant">No versions uploaded yet.</p>
                <p className="mt-1 text-xs text-outline">Upload your first project build ZIP.</p>
              </div>
            ) : (
              versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {version.version}
                      </span>
                      <span className="truncate font-headline text-sm font-semibold text-on-surface">
                        {version.name}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-on-surface-variant">
                      {version.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-outline">
                      <span>{(version.zipSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Live URL */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-on-surface-variant">Live URL:</span>
                      {editingLiveUrl === version.id ? (
                        <>
                          <input
                            type="url"
                            value={liveUrlInput}
                            onChange={(e) => setLiveUrlInput(e.target.value)}
                            placeholder="https://your-app.vercel.app"
                            className="flex-1 rounded border border-outline-variant/15 bg-surface-container-low px-2 py-1 text-xs text-on-surface outline-none focus:border-primary/40"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveLiveUrl(version.id)}
                            className="rounded bg-primary/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-primary"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLiveUrl(null)}
                            className="rounded bg-surface px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {version.liveUrl ? (
                            <a
                              href={version.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:underline"
                            >
                              {version.liveUrl}
                            </a>
                          ) : (
                            <span className="text-on-surface-variant">Not deployed</span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLiveUrl(version.id);
                              setLiveUrlInput(version.liveUrl || "");
                            }}
                            className="text-[9px] uppercase tracking-[0.1em] text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadVersion(version.id, `${version.name}.zip`)}
                      className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
                      title="Download ZIP"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVersion(version.id)}
                      className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-tertiary"
                      title="Delete version"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Credentials Vault */}
        <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-semibold text-on-surface">
              Credentials Vault
            </h2>
            <button
              type="button"
              onClick={() => setIsAddingCredential(!isAddingCredential)}
              className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/20"
            >
              {isAddingCredential ? "Cancel" : "Add Credential"}
            </button>
          </div>

          {isAddingCredential && (
            <div className="mt-4 space-y-3 rounded-xl border border-outline-variant/10 bg-surface p-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Name
                </label>
                <input
                  type="text"
                  value={newCredential.name}
                  onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
                  placeholder="e.g., OpenAI API Key"
                  className="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Value
                </label>
                <input
                  type="text"
                  value={newCredential.value}
                  onChange={(e) => setNewCredential({ ...newCredential, value: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Category
                </label>
                <select
                  value={newCredential.category}
                  onChange={(e) => setNewCredential({ ...newCredential, category: e.target.value as CredentialCategory })}
                  className="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40"
                >
                  <option value="api_key">API Key</option>
                  <option value="database">Database</option>
                  <option value="oauth">OAuth</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={newCredential.notes}
                  onChange={(e) => setNewCredential({ ...newCredential, notes: e.target.value })}
                  placeholder="Additional context"
                  className="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCredential}
                className="w-full rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/20"
              >
                Save Credential
              </button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {credentials.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/20 bg-surface p-6 text-center">
                <p className="text-sm text-on-surface-variant">No credentials stored.</p>
                <p className="mt-1 text-xs text-outline">Store API keys and secrets securely.</p>
              </div>
            ) : (
              credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-sm font-semibold text-on-surface">
                        {cred.name}
                      </span>
                      <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-on-surface-variant">
                        {cred.category.replace("_", " ")}
                      </span>
                    </div>
                    {cred.notes && (
                      <p className="mt-1 truncate text-xs text-on-surface-variant">
                        {cred.notes}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <code className="rounded bg-surface-container-low px-2 py-1 text-xs text-secondary">
                        {showCredentialValue[cred.id] ? cred.value : "••••••••••••"}
                      </code>
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(cred.id)}
                        className="rounded p-1 text-on-surface-variant transition hover:bg-surface-container-high"
                        title={showCredentialValue[cred.id] ? "Hide" : "Show"}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showCredentialValue[cred.id] ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyCredential(cred.value)}
                        className="rounded p-1 text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
                        title="Copy to clipboard"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] text-outline">
                      Last updated: {new Date(cred.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCredential(cred.id)}
                    className="ml-4 rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
