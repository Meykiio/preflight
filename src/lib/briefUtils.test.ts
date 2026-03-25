import { describe, expect, it } from "vitest";
import { getBriefCompletionScore, isBriefComplete } from "@/lib/briefUtils";
import type { Brief } from "@/types";

const createMockBrief = (overrides?: Partial<Brief>): Brief => ({
  id: "test-id",
  projectId: "project-1",
  problem: "",
  targetUser: "",
  coreFeatures: [],
  inspirations: [],
  notes: "",
  updatedAt: Date.now(),
  ...overrides
});

describe("briefUtils", () => {
  describe("getBriefCompletionScore", () => {
    it("returns 0 for empty brief", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief);
      expect(score).toBe(0);
    });

    it("adds 20 points for project name", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief, { projectName: "My App" });
      expect(score).toBe(20);
    });

    it("adds 25 points for problem", () => {
      const brief = createMockBrief({ problem: "Users struggle with X" });
      const score = getBriefCompletionScore(brief);
      expect(score).toBe(25);
    });

    it("adds 15 points for target user", () => {
      const brief = createMockBrief({ targetUser: "Developers" });
      const score = getBriefCompletionScore(brief);
      expect(score).toBe(15);
    });

    it("adds 25 points for at least one feature", () => {
      const brief = createMockBrief({
        coreFeatures: [{ id: "1", text: "Feature 1", order: 1 }]
      });
      const score = getBriefCompletionScore(brief);
      expect(score).toBe(25);
    });

    it("adds 10 points for tech stack", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief, { techStackCount: 3 });
      expect(score).toBe(10);
    });

    it("adds 5 points for target platforms", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief, { targetPlatformsCount: 2 });
      expect(score).toBe(5);
    });

    it("calculates total score correctly", () => {
      const brief = createMockBrief({
        problem: "Test problem",
        targetUser: "Test users",
        coreFeatures: [{ id: "1", text: "Feature", order: 1 }]
      });
      const score = getBriefCompletionScore(brief, {
        projectName: "Test App",
        techStackCount: 2,
        targetPlatformsCount: 1
      });
      expect(score).toBe(100); // 20+25+15+25+10+5
    });

    it("ignores empty project name", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief, { projectName: "" });
      expect(score).toBe(0);
    });

    it("ignores whitespace-only project name", () => {
      const brief = createMockBrief();
      const score = getBriefCompletionScore(brief, { projectName: "   " });
      expect(score).toBe(0);
    });
  });

  describe("isBriefComplete", () => {
    it("returns false for empty brief", () => {
      const brief = createMockBrief();
      expect(isBriefComplete(brief)).toBe(false);
    });

    it("returns true when score >= 70", () => {
      const brief = createMockBrief({
        problem: "Test problem",
        targetUser: "Test users",
        coreFeatures: [{ id: "1", text: "Feature", order: 1 }]
      });
      expect(isBriefComplete(brief, { projectName: "Test" })).toBe(true);
    });

    it("returns false when score < 70", () => {
      const brief = createMockBrief({
        problem: "Test problem"
      });
      expect(isBriefComplete(brief)).toBe(false);
    });
  });
});
