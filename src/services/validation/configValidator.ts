/**
 * Configuration Validator
 * 
 * Validates generated configuration files for common errors:
 * - TypeScript path aliases (Issue 5.3)
 * - Vite resolve aliases (Issue 5.3)
 * - Environment variable prefixes (Issue 5.4)
 * - Vercel SPA routing (Issue 5.15)
 */

export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigError[];
  warnings: ConfigWarning[];
  correctedContent?: string;
}

export interface ConfigError {
  file: string;
  field: string;
  message: string;
  fix: string;
  severity: 'critical' | 'error';
}

export interface ConfigWarning {
  file: string;
  field: string;
  message: string;
  suggestion: string;
  severity: 'warning';
}

/**
 * Validates tsconfig.json for correct path alias configuration.
 * 
 * Issue 5.3: TypeScript `@/` path alias was broken
 * 
 * @param content - tsconfig.json content
 * @returns Validation result with errors and corrections
 */
export function validateTsConfig(content: string): ConfigValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigWarning[] = [];
  
  try {
    const config = JSON.parse(content);
    let corrected = false;
    
    // Check compilerOptions exists
    if (!config.compilerOptions) {
      errors.push({
        file: 'tsconfig.json',
        field: 'compilerOptions',
        message: 'Missing compilerOptions section',
        fix: 'Add compilerOptions section with baseUrl and paths',
        severity: 'critical',
      });
      return { isValid: false, errors, warnings };
    }
    
    // Check baseUrl
    if (!config.compilerOptions.baseUrl) {
      errors.push({
        file: 'tsconfig.json',
        field: 'compilerOptions.baseUrl',
        message: 'Missing baseUrl for path aliases',
        fix: 'Set baseUrl to "." to enable path aliases',
        severity: 'critical',
      });
      corrected = true;
    }
    
    // Check paths configuration
    const paths = config.compilerOptions.paths;
    
    if (!paths) {
      errors.push({
        file: 'tsconfig.json',
        field: 'compilerOptions.paths',
        message: 'Missing paths configuration for @/ aliases',
        fix: 'Add paths: { "@/*": ["./src/*"] }',
        severity: 'critical',
      });
      corrected = true;
    } else {
      // Check for incorrect path patterns
      const incorrectPatterns = ['*', '{*}', '*.*'];
      for (const [alias, pathMapping] of Object.entries(paths)) {
        const mappings = Array.isArray(pathMapping) ? pathMapping : [pathMapping];
        
        // Check if @/* alias exists and is correct
        if (alias === '@/*' || alias === '@') {
          const correctMapping = './src/*';
          const hasCorrectMapping = mappings.some(m => m === correctMapping);
          
          if (!hasCorrectMapping) {
            errors.push({
              file: 'tsconfig.json',
              field: `compilerOptions.paths.${alias}`,
              message: `Incorrect path mapping for ${alias}. Found: ${JSON.stringify(mappings)}`,
              fix: `Change to ["${correctMapping}"]`,
              severity: 'critical',
            });
            corrected = true;
          }
        }
        
        // Check for incorrect wildcard-only patterns
        if (alias === '*' && mappings.some(m => incorrectPatterns.includes(m))) {
          warnings.push({
            file: 'tsconfig.json',
            field: `compilerOptions.paths.${alias}`,
            message: 'Wildcard-only path pattern may conflict with @/ aliases',
            suggestion: 'Consider removing or making more specific',
            severity: 'warning',
          });
        }
      }
    }
    
    // Check strict mode
    if (!config.compilerOptions.strict) {
      warnings.push({
        file: 'tsconfig.json',
        field: 'compilerOptions.strict',
        message: 'TypeScript strict mode is not enabled',
        suggestion: 'Enable strict mode for better type safety: "strict": true',
        severity: 'warning',
      });
    }
    
    // Auto-correct if needed
    let correctedContent: string | undefined;
    if (corrected) {
      if (!config.compilerOptions.baseUrl) {
        config.compilerOptions.baseUrl = '.';
      }
      if (!config.compilerOptions.paths) {
        config.compilerOptions.paths = {};
      }
      if (!config.compilerOptions.paths['@/*']) {
        config.compilerOptions.paths['@/*'] = ['./src/*'];
      }
      correctedContent = JSON.stringify(config, null, 2);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedContent,
    };
  } catch (error) {
    errors.push({
      file: 'tsconfig.json',
      field: 'json',
      message: 'Invalid JSON syntax',
      fix: 'Fix JSON syntax errors',
      severity: 'critical',
    });
    return { isValid: false, errors, warnings };
  }
}

/**
 * Validates vite.config.ts for correct resolve alias configuration.
 * 
 * Issue 5.3: Vite resolve alias was missing
 * 
 * @param content - vite.config.ts content
 * @returns Validation result with errors
 */
export function validateViteConfig(content: string): ConfigValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigWarning[] = [];
  
  // Check for resolve.alias configuration
  const hasAliasImport = content.includes("from 'path'") || content.includes('from "path"');
  const hasResolveAlias = content.includes('resolve:') && content.includes('alias:');
  const hasAtPathAlias = content.includes("'@/'") || content.includes('"@/"');
  
  if (!hasResolveAlias) {
    errors.push({
      file: 'vite.config.ts',
      field: 'resolve.alias',
      message: 'Missing resolve.alias configuration for @/ path aliases',
      fix: 'Add resolve: { alias: { "@": path.resolve(__dirname, "./src") } }',
      severity: 'critical',
    });
  }
  
  if (!hasAtPathAlias && hasResolveAlias) {
    warnings.push({
      file: 'vite.config.ts',
      field: 'resolve.alias',
      message: 'resolve.alias found but @/ alias may not be configured',
      suggestion: 'Ensure alias includes { "@": path.resolve(__dirname, "./src") }',
      severity: 'warning',
    });
  }
  
  if (!hasAliasImport && hasResolveAlias) {
    errors.push({
      file: 'vite.config.ts',
      field: 'imports',
      message: 'resolve.alias used but path module not imported',
      fix: "Add: import path from 'path'",
      severity: 'error',
    });
  }
  
  // Check for correct alias pattern
  const correctAliasPatterns = [
    /alias:\s*\{\s*['"]@['"]\s*:\s*path\.resolve\([^)]+\)/,
    /alias:\s*\{\s*['"]@\/['"]\s*:\s*path\.resolve\([^)]+\)/,
  ];
  
  const hasCorrectAlias = correctAliasPatterns.some(pattern => pattern.test(content));
  
  if (hasResolveAlias && !hasCorrectAlias) {
    warnings.push({
      file: 'vite.config.ts',
      field: 'resolve.alias',
      message: 'resolve.alias format may be incorrect',
      suggestion: 'Use: { "@": path.resolve(__dirname, "./src") }',
      severity: 'warning',
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates .env.example for correct Vite environment variable prefixes.
 * 
 * Issue 5.4: Environment variables missing the required VITE_ prefix
 * 
 * @param content - .env.example content
 * @param framework - Framework type (vite, nextjs, etc.)
 * @returns Validation result with errors
 */
export function validateEnvFile(content: string, framework: string = 'vite'): ConfigValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigWarning[] = [];
  const lines = content.split('\n');
  
  if (framework === 'vite') {
    // Check for common non-prefixed variables that should be prefixed
    const vitePrefixRequired = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'API_KEY', 'API_URL'];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (trimmedLine.startsWith('#') || !trimmedLine) {
        continue;
      }
      
      const match = trimmedLine.match(/^([A-Z_]+)=/);
      if (match) {
        const varName = match[1];
        
        // Check if variable should have VITE_ prefix
        if (vitePrefixRequired.some(required => varName === required || varName.endsWith('_' + required))) {
          if (!varName.startsWith('VITE_')) {
            errors.push({
              file: '.env.example',
              field: varName,
              message: `Environment variable "${varName}" is missing VITE_ prefix`,
              fix: `Rename to "VITE_${varName}" for Vite to expose it to the browser`,
              severity: 'critical',
            });
          }
        }
        
        // Check for AI API keys (should NOT be in env for BYOK projects)
        if (varName.includes('OPENAI') || varName.includes('GEMINI') || varName.includes('ANTHROPIC')) {
          warnings.push({
            file: '.env.example',
            field: varName,
            message: `AI API key "${varName}" found in environment file`,
            suggestion: 'For BYOK (Bring Your Own Key) architecture, AI keys should be stored in the database, not in .env. Add a comment explaining this.',
            severity: 'warning',
          });
        }
      }
    }
    
    // Check if there's an explanatory comment about VITE_ prefix
    const hasViteComment = lines.some(line => 
      line.toLowerCase().includes('vite') && 
      line.toLowerCase().includes('prefix') &&
      line.toLowerCase().includes('vite_')
    );
    
    if (!hasViteComment && lines.some(line => line.includes('='))) {
      warnings.push({
        file: '.env.example',
        field: 'comments',
        message: 'No explanatory comment about VITE_ prefix',
        suggestion: 'Add comment: "Vite only exposes vars with VITE_ prefix to the browser"',
        severity: 'warning',
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates vercel.json for correct SPA routing configuration.
 * 
 * Issue 5.15: vercel.json SPA routing was incorrectly configured
 * 
 * @param content - vercel.json content
 * @param framework - Framework type (vite, nextjs, etc.)
 * @returns Validation result with errors
 */
export function validateVercelConfig(content: string, framework: string = 'vite'): ConfigValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigWarning[] = [];
  
  try {
    const config = JSON.parse(content);
    
    if (framework === 'vite') {
      // Check for incorrect routes pattern
      if (config.routes) {
        const hasIncorrectRoute = config.routes.some((route: any) => 
          route.dest && route.dest.includes('/dist/')
        );
        
        if (hasIncorrectRoute) {
          errors.push({
            file: 'vercel.json',
            field: 'routes',
            message: 'Incorrect routing pattern for Vite SPA',
            fix: 'Use "rewrites" instead of "routes": { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }',
            severity: 'critical',
          });
        }
      }
      
      // Check for correct rewrites pattern
      const hasCorrectRewrites = config.rewrites && 
        Array.isArray(config.rewrites) &&
        config.rewrites.some((rewrite: any) => 
          rewrite.source === '/(.*)' && 
          rewrite.destination === '/index.html'
        );
      
      if (!hasCorrectRewrites && !config.routes) {
        warnings.push({
          file: 'vercel.json',
          field: 'rewrites',
          message: 'No SPA routing configuration found',
          suggestion: 'Add rewrites for SPA: { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }',
          severity: 'warning',
        });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push({
      file: 'vercel.json',
      field: 'json',
      message: 'Invalid JSON syntax',
      fix: 'Fix JSON syntax errors',
      severity: 'critical',
    });
    return { isValid: false, errors, warnings };
  }
}

/**
 * Comprehensive config validation for all configuration files.
 */
export interface AllConfigs {
  tsconfig?: string;
  viteConfig?: string;
  envExample?: string;
  vercelJson?: string;
  framework?: string;
}

export function validateAllConfigs(configs: AllConfigs): {
  isValid: boolean;
  allErrors: Array<ConfigError | ConfigWarning>;
} {
  const allErrors: Array<ConfigError | ConfigWarning> = [];
  let isValid = true;
  
  if (configs.tsconfig) {
    const result = validateTsConfig(configs.tsconfig);
    allErrors.push(...result.errors, ...result.warnings);
    if (!result.isValid) isValid = false;
  }
  
  if (configs.viteConfig) {
    const result = validateViteConfig(configs.viteConfig);
    allErrors.push(...result.errors, ...result.warnings);
    if (!result.isValid) isValid = false;
  }
  
  if (configs.envExample) {
    const result = validateEnvFile(configs.envExample, configs.framework || 'vite');
    allErrors.push(...result.errors, ...result.warnings);
    if (!result.isValid) isValid = false;
  }
  
  if (configs.vercelJson) {
    const result = validateVercelConfig(configs.vercelJson, configs.framework || 'vite');
    allErrors.push(...result.errors, ...result.warnings);
    if (!result.isValid) isValid = false;
  }
  
  return {
    isValid,
    allErrors,
  };
}
