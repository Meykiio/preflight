import { describe, expect, it } from "vitest";
import {
  estimateTokens,
  formatFileSize,
  truncate
} from "@/lib/utils";

describe("utils", () => {
  it("estimates tokens with a simple 4-char heuristic", () => {
    expect(estimateTokens("12345678")).toBe(2);
  });

  it("formats file sizes for kilobytes", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("truncates long strings", () => {
    expect(truncate("Preflight", 5)).toBe("Pref...");
  });
});
