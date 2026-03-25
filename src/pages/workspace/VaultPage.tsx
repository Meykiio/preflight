import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { VaultHeader } from "@/components/workspace/vault/VaultHeader";
import { VaultLibraryGrid } from "@/components/workspace/vault/VaultLibraryGrid";
import { VaultSidebarPanel } from "@/components/workspace/vault/VaultSidebarPanel";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { downloadFileData, validateUploadFile } from "@/lib/fileUpload";
import { estimateTokens, formatFileSize } from "@/lib/utils";
import type { VaultCategory } from "@/types";

type VaultFilter = "all" | "research" | "design" | "export";

interface UploadingFile {
  id: string;
  name: string;
}

const FILTER_OPTIONS: Array<{ label: string; value: VaultFilter }> = [
  { label: "All", value: "all" },
  { label: "Research", value: "research" },
  { label: "Designs", value: "design" },
  { label: "Exports", value: "export" }
];

const ACCEPTED_EXTENSIONS = [".pdf", ".md", ".txt", ".png", ".jpg", ".jpeg", ".json", ".zip"];

const getCategoryFromFile = (file: File): VaultCategory => {
  const normalized = file.name.toLowerCase();

  if (normalized.endsWith(".pdf") || normalized.endsWith(".md") || normalized.endsWith(".txt")) {
    return "research";
  }

  if (
    normalized.endsWith(".png") ||
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg")
  ) {
    return "design";
  }

  if (normalized.endsWith(".json") || normalized.endsWith(".zip")) {
    return "export";
  }

  return "other";
};

export const VaultPage = (): JSX.Element => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const toast = useToast();
  const { files, addFile, removeFile, toggleContext } = useVaultFiles(projectId);
  const [filter, setFilter] = useState<VaultFilter>("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return files.filter((file) => {
      const matchesCategory = filter === "all" ? true : file.category === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        file.name.toLowerCase().includes(normalizedQuery) ||
        file.mimeType.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [files, filter, search]);

  const totalBytes = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const activeFiles = useMemo(() => files.filter((file) => file.isActiveContext), [files]);
  const activeContextTokens = useMemo(
    () => activeFiles.reduce((sum, file) => sum + estimateTokens(file.name), 0),
    [activeFiles]
  );

  const handleFiles = async (incomingFiles: File[]): Promise<void> => {
    if (incomingFiles.length === 0) {
      toast.warning("Please choose at least one file to upload.");
      return;
    }

    for (const file of incomingFiles) {
      const validationMessage = validateUploadFile(file, {
        allowedExtensions: ACCEPTED_EXTENSIONS,
        existingFiles: files
      });

      if (validationMessage) {
        toast.error(validationMessage);
        continue;
      }

      const uploadId = crypto.randomUUID();
      setUploading((current) => [...current, { id: uploadId, name: file.name }]);

      try {
        const savedFile = await addFile({
          category: getCategoryFromFile(file),
          data: await file.arrayBuffer(),
          isActiveContext: false,
          mimeType: file.type || "application/octet-stream",
          name: file.name,
          size: file.size
        });

        if (savedFile) {
          toast.success(`${file.name} added to the vault.`);
        } else {
          toast.error(`Could not upload ${file.name}.`);
        }
      } catch (error) {
        toast.error(`Could not upload ${file.name}.`);
      } finally {
        setUploading((current) => current.filter((item) => item.id !== uploadId));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/json": [".json"],
      "application/zip": [".zip"]
    },
    noClick: true,
    onDrop: (acceptedFiles) => {
      void handleFiles(acceptedFiles);
    }
  });

  const uploadingCards = uploading.map((item) => ({
    id: item.id,
    projectId: projectId ?? "",
    name: item.name,
    size: 0,
    mimeType: "application/octet-stream",
    category: "other" as VaultCategory,
    isActiveContext: false,
    data: new ArrayBuffer(0),
    uploadedAt: Date.now()
  }));

  const handleDeleteFile = async (fileId: string, fileName: string): Promise<void> => {
    await removeFile(fileId);
    toast.success(`${fileName} deleted.`);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <VaultHeader
        filterOptions={FILTER_OPTIONS}
        filterValue={filter}
        onChangeFilter={(value) => setFilter(value as VaultFilter)}
        onChangeSearch={setSearch}
        projectName={project?.name}
        searchValue={search}
      />

      {/* Main Content Grid - Equal Height Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Upload & Stats (1 column) */}
        <div className="lg:col-span-1">
          <VaultSidebarPanel
            activeContextTokens={activeContextTokens}
            getInputProps={getInputProps}
            getRootProps={getRootProps}
            isDragActive={isDragActive}
            onOpenPicker={open}
            totalBytesLabel={formatFileSize(totalBytes)}
            fileCount={files.length}
          />
        </div>

        {/* Right Content - File Grid (3 columns) */}
        <div className="lg:col-span-3">
          <VaultLibraryGrid
            files={filteredFiles}
            onDeleteFile={(fileId, fileName) => void handleDeleteFile(fileId, fileName)}
            onDownloadFile={(file) => downloadFileData(file.data, file.name, file.mimeType)}
            onToggleContext={(fileId) => void toggleContext(fileId)}
            uploadingCards={uploadingCards}
          />
        </div>
      </div>
    </div>
  );
};
