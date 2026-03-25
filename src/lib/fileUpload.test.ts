import { describe, expect, it, vi } from "vitest";
import {
  getFileExtension,
  validateUploadFile,
  downloadFileData,
  MAX_UPLOAD_BYTES
} from "@/lib/fileUpload";
import type { VaultFile } from "@/types";

describe("fileUpload", () => {
  describe("getFileExtension", () => {
    it("returns extension for file with extension", () => {
      expect(getFileExtension("document.pdf")).toBe(".pdf");
      expect(getFileExtension("image.PNG")).toBe(".png");
      expect(getFileExtension("archive.zip")).toBe(".zip");
    });

    it("returns empty string for file without extension", () => {
      expect(getFileExtension("README")).toBe("");
      expect(getFileExtension("file")).toBe("");
    });

    it("returns extension for hidden files with extension", () => {
      expect(getFileExtension(".gitignore")).toBe(".gitignore");
    });

    it("handles multiple dots correctly", () => {
      expect(getFileExtension("file.name.pdf")).toBe(".pdf");
      expect(getFileExtension("archive.tar.gz")).toBe(".gz");
    });
  });

  describe("validateUploadFile", () => {
    const createMockFile = (overrides?: Partial<File>): File =>
      new File(["test content"], "test.pdf", { type: "application/pdf" });

    const defaultOptions = {
      allowedExtensions: [".pdf", ".md", ".txt", ".png", ".jpg", ".json"],
      existingFiles: [] as Array<Pick<VaultFile, "name">>
    };

    it("returns null for valid file", () => {
      const file = createMockFile();
      const result = validateUploadFile(file, defaultOptions);
      expect(result).toBe(null);
    });

    it("returns error for empty file", () => {
      const file = new File([], "empty.pdf", { type: "application/pdf" });
      const result = validateUploadFile(file, defaultOptions);
      expect(result).toContain("is empty and was skipped");
    });

    it("returns error for file exceeding size limit", () => {
      const largeContent = new ArrayBuffer(MAX_UPLOAD_BYTES + 1);
      const file = new File([largeContent], "large.pdf", {
        type: "application/pdf"
      });
      const result = validateUploadFile(file, defaultOptions);
      expect(result).toContain("is larger than 10 MB and was skipped");
    });

    it("returns error for unsupported file type", () => {
      const file = new File(["test"], "document.exe", {
        type: "application/octet-stream"
      });
      const result = validateUploadFile(file, defaultOptions);
      expect(result).toContain("is not a supported file type");
    });

    it("returns error for duplicate file name", () => {
      const file = createMockFile();
      const options = {
        ...defaultOptions,
        existingFiles: [{ name: "test.pdf" }]
      };
      const result = validateUploadFile(file, options);
      expect(result).toContain("already exists in this project");
    });

    it("is case-insensitive for duplicate detection", () => {
      const file = createMockFile({ name: "TEST.PDF" });
      const options = {
        ...defaultOptions,
        existingFiles: [{ name: "test.pdf" }]
      };
      const result = validateUploadFile(file, options);
      expect(result).toContain("already exists in this project");
    });

    it("allows file with different name", () => {
      const file = new File(["test"], "other.pdf", { type: "application/pdf" });
      const options = {
        ...defaultOptions,
        existingFiles: [{ name: "test.pdf" }]
      };
      const result = validateUploadFile(file, options);
      expect(result).toBe(null);
    });

    it("respects custom maxBytes", () => {
      const largeContent = new ArrayBuffer(1024);
      const file = new File([largeContent], "file.pdf", {
        type: "application/pdf"
      });
      const options = {
        ...defaultOptions,
        maxBytes: 512
      };
      const result = validateUploadFile(file, options);
      expect(result).toContain("is larger than 10 MB and was skipped");
    });
  });

  describe("downloadFileData", () => {
    it("creates and clicks download link", () => {
      const clickSpy = vi.fn();
      const createSpy = vi.spyOn(document, "createElement");
      createSpy.mockImplementation((tagName: string) => {
        if (tagName === "a") {
          return {
            href: "",
            download: "",
            click: clickSpy
          } as unknown as HTMLAnchorElement;
        }
        return document.createElement(tagName);
      });

      const data = new ArrayBuffer(10);
      downloadFileData(data, "test.pdf", "application/pdf");

      expect(clickSpy).toHaveBeenCalled();
      createSpy.mockRestore();
    });
  });
});
