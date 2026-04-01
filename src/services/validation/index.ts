/**
 * Validation Services
 * 
 * Central export for all validation utilities.
 * Use these validators to ensure generated content is correct
 * before showing it to users.
 */

import {
  validateDependencies as validateDeps,
  CLI_TOOLS as CLI_TOOLS_PKG,
  VERIFIED_PACKAGES,
  PACKAGE_CORRECTIONS,
  type PackageInfo,
} from './packageValidator';

import {
  isLibraryProhibited,
  scanForProhibitedImports,
  validateRequiredLibraries,
  generateStackConfig,
  PROHIBITED_COMBINATIONS,
  REQUIRED_LIBRARIES,
  LIBRARY_ALIASES,
  type StackConfig,
  type DatabaseType,
  type StackType,
} from './libraryValidator';

import {
  validateTsConfig,
  validateViteConfig,
  validateEnvFile,
  validateVercelConfig,
  validateAllConfigs as validateAllCfgs,
  type ConfigValidationResult,
  type ConfigError,
  type ConfigWarning,
  type AllConfigs,
} from './configValidator';

import {
  checkProhibitedLibraries,
  checkNumericThresholds,
  checkSecurityConfig,
  checkAllConsistencies as checkAllCons,
  validateStageAgainstRules,
  type ConsistencyCheckResult,
  type Inconsistency,
  type AllDocuments,
} from './consistencyChecker';

// Re-export all validators
export {
  validateDeps as validateDependencies,
  CLI_TOOLS_PKG as CLI_TOOLS,
  VERIFIED_PACKAGES,
  PACKAGE_CORRECTIONS,
  type PackageInfo,
  isLibraryProhibited,
  scanForProhibitedImports,
  validateRequiredLibraries,
  generateStackConfig,
  PROHIBITED_COMBINATIONS,
  REQUIRED_LIBRARIES,
  LIBRARY_ALIASES,
  type StackConfig,
  type DatabaseType,
  type StackType,
  validateTsConfig,
  validateViteConfig,
  validateEnvFile,
  validateVercelConfig,
  validateAllCfgs as validateAllConfigs,
  type ConfigValidationResult,
  type ConfigError,
  type ConfigWarning,
  type AllConfigs,
  checkProhibitedLibraries,
  checkNumericThresholds,
  checkSecurityConfig,
  checkAllCons as checkAllConsistencies,
  validateStageAgainstRules,
  type ConsistencyCheckResult,
  type Inconsistency,
  type AllDocuments,
};

// Also export from packageValidator directly
export * from './packageValidator';

/**
 * Combined validation result for all checks.
 */
export interface ValidationResult {
  isValid: boolean;
  criticalErrors: number;
  errors: number;
  warnings: number;
  allIssues: Array<{
    type: 'package' | 'library' | 'config' | 'consistency';
    severity: 'critical' | 'error' | 'warning';
    message: string;
    fix: string;
  }>;
}

/**
 * Run all validations on generated build content.
 * 
 * @param params - All generated content to validate
 * @returns Comprehensive validation result
 */
export function runFullValidation(params: {
  packageJson?: string;
  tsconfig?: string;
  viteConfig?: string;
  envExample?: string;
  vercelJson?: string;
  rulesContent?: string;
  buildStages?: Array<{ stage: number; content: string }>;
  auditContent?: string;
  framework?: string;
}): ValidationResult {
  const allIssues: ValidationResult['allIssues'] = [];
  let criticalErrors = 0;
  let errors = 0;
  let warnings = 0;

  // 1. Validate package.json
  if (params.packageJson) {
    try {
      const deps = JSON.parse(params.packageJson).dependencies || {};
      const { errors: pkgErrors, cliTools } = validateDeps(deps);

      for (const error of pkgErrors) {
        allIssues.push({
          type: 'package',
          severity: 'error',
          message: error,
          fix: 'Update package.json with correct package names',
        });
        errors++;
      }

      for (const tool of cliTools) {
        allIssues.push({
          type: 'package',
          severity: 'critical',
          message: `"${tool}" is a CLI tool and should not be in dependencies`,
          fix: `Remove from package.json and install separately with npx`,
        });
        criticalErrors++;
      }
    } catch {
      allIssues.push({
        type: 'package',
        severity: 'critical',
        message: 'Invalid package.json syntax',
        fix: 'Fix JSON syntax',
      });
      criticalErrors++;
    }
  }

  // 2. Validate configs
  if (params.tsconfig || params.viteConfig || params.envExample || params.vercelJson) {
    const { isValid, allErrors } = validateAllCfgs({
      tsconfig: params.tsconfig,
      viteConfig: params.viteConfig,
      envExample: params.envExample,
      vercelJson: params.vercelJson,
      framework: params.framework,
    });

    for (const err of allErrors) {
      allIssues.push({
        type: 'config',
        severity: err.severity,
        message: err.message,
        fix: err.severity === 'warning' ? (err as ConfigWarning).suggestion : (err as ConfigError).fix,
      });

      if (err.severity === 'critical') criticalErrors++;
      else if (err.severity === 'error') errors++;
      else warnings++;
    }
  }

  // 3. Check consistency
  if (params.rulesContent && params.buildStages && params.buildStages.length > 0) {
    const { inconsistencies } = checkAllCons({
      rulesContent: params.rulesContent,
      buildPrompts: params.buildStages,
      auditContent: params.auditContent,
    });

    for (const inc of inconsistencies) {
      allIssues.push({
        type: 'consistency',
        severity: inc.severity,
        message: inc.message,
        fix: inc.fix,
      });

      if (inc.severity === 'critical') criticalErrors++;
      else if (inc.severity === 'error') errors++;
      else warnings++;
    }
  }

  return {
    isValid: criticalErrors === 0 && errors === 0,
    criticalErrors,
    errors,
    warnings,
    allIssues,
  };
}
