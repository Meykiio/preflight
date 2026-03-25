import type { VaultFile } from "@/types";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const DEFAULT_LIMIT_LABEL = "10 MB";

export interface UploadValidationOptions {
  allowedExtensions: string[];
  existingFiles?: Array<Pick<VaultFile, "name">>;
  maxBytes?: number;
}

const normalizeFileName = (fileName: string): string => fileName.trim().toLowerCase();

export const getFileExtension = (fileName: string): string => {
  const extensionStart = fileName.lastIndexOf(".");
  return extensionStart === -1 ? "" : fileName.slice(extensionStart).toLowerCase();
};

export const validateUploadFile = (
  file: File,
  { allowedExtensions, existingFiles = [], maxBytes = MAX_UPLOAD_BYTES }: UploadValidationOptions
): string | null => {
  if (file.size === 0) {
    return `${file.name} is empty and was skipped.`;
  }

  if (file.size > maxBytes) {
    return `${file.name} is larger than ${DEFAULT_LIMIT_LABEL} and was skipped.`;
  }

  const extension = getFileExtension(file.name);
  if (!allowedExtensions.includes(extension)) {
    return `${file.name} is not a supported file type.`;
  }

  const normalizedName = normalizeFileName(file.name);
  if (
    existingFiles.some((existingFile) => normalizeFileName(existingFile.name) === normalizedName)
  ) {
    return `${file.name} already exists in this project.`;
  }

  return null;
};

export const downloadFileData = (
  data: ArrayBuffer,
  fileName: string,
  mimeType: string
): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
