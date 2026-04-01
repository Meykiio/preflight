import React from "react";
import {
  runFullValidation,
  type ValidationResult,
} from "@/services/validation";

interface ValidationDashboardProps {
  packageJson?: string;
  tsconfig?: string;
  viteConfig?: string;
  envExample?: string;
  vercelJson?: string;
  rulesContent?: string;
  buildStages?: Array<{ stage: number; content: string }>;
  auditContent?: string;
  framework?: string;
  onDismiss?: () => void;
}

export const ValidationDashboard: React.FC<ValidationDashboardProps> = ({
  packageJson,
  tsconfig,
  viteConfig,
  envExample,
  vercelJson,
  rulesContent,
  buildStages,
  auditContent,
  framework,
  onDismiss,
}) => {
  // Run validation
  const result: ValidationResult = runFullValidation({
    packageJson,
    tsconfig,
    viteConfig,
    envExample,
    vercelJson,
    rulesContent,
    buildStages,
    auditContent,
    framework,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "error":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "warning":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🔴";
      case "error":
        return "🟠";
      case "warning":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Validation Results
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Checking generated content against 34 known issues
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {result.criticalErrors}
              </div>
              <div className="text-sm text-gray-400">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {result.errors}
              </div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {result.warnings}
              </div>
              <div className="text-sm text-gray-400">Warnings</div>
            </div>
          </div>

          {/* Overall Status */}
          <div className="mt-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
            <div className="flex items-center gap-2">
              {result.isValid ? (
                <>
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-semibold text-green-400">
                      All Critical Checks Passed
                    </div>
                    <div className="text-sm text-gray-400">
                      Ready for review and use
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-red-400">
                      Critical Issues Found
                    </div>
                    <div className="text-sm text-gray-400">
                      Fix before proceeding to build
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-6">
          {result.allIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-lg font-semibold text-white">
                No Issues Found!
              </div>
              <div className="text-sm text-gray-400 mt-2">
                All validation checks passed successfully
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {result.allIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(
                    issue.severity
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{getIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-75">
                          {issue.type}
                        </span>
                        <span className="text-xs font-bold uppercase">
                          {issue.severity}
                        </span>
                      </div>
                      <div className="font-medium text-white mb-2">
                        {issue.message}
                      </div>
                      <div className="text-sm opacity-75">
                        <span className="font-semibold">Fix:</span>{" "}
                        {issue.fix}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50 flex justify-end gap-3">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Review Later
          </button>
          {result.isValid ? (
            <button
              onClick={onDismiss}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue to Build
            </button>
          ) : (
            <button
              onClick={onDismiss}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Fix Issues First
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationDashboard;
