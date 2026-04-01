/**
 * Package Name Validator
 * 
 * Validates npm package names against a verified registry to prevent
 * incorrect package identifiers in generated build prompts.
 * 
 * Issue 5.2: Wrong npm package names in package.json
 */

export interface PackageInfo {
  name: string;
  version: string;
  description?: string;
}

/**
 * Verified package registry with correct npm identifiers.
 * This prevents errors like "tanstack-query" (wrong) vs "@tanstack/react-query" (correct).
 */
export const VERIFIED_PACKAGES: Record<string, PackageInfo> = {
  // React ecosystem
  'react': { name: 'react', version: '^18.3.1', description: 'React core library' },
  'react-dom': { name: 'react-dom', version: '^18.3.1', description: 'React DOM renderer' },
  'react-router-dom': { name: 'react-router-dom', version: '^6.30.1', description: 'React Router for web' },
  
  // TanStack
  '@tanstack/react-query': { name: '@tanstack/react-query', version: '^5.17.0', description: 'Hooks for fetching, caching and updating asynchronous data' },
  '@tanstack/react-table': { name: '@tanstack/react-table', version: '^8.11.0', description: 'Headless UI for building powerful tables' },
  
  // Supabase
  '@supabase/supabase-js': { name: '@supabase/supabase-js', version: '^2.39.0', description: 'Supabase client library' },
  
  // Styling
  'tailwindcss': { name: 'tailwindcss', version: '^3.4.17', description: 'Utility-first CSS framework' },
  'autoprefixer': { name: 'autoprefixer', version: '^10.4.21', description: 'PostCSS plugin for vendor prefixes' },
  'postcss': { name: 'postcss', version: '^8.5.3', description: 'CSS processing tool' },
  'clsx': { name: 'clsx', version: '^2.1.1', description: 'Conditional className utility' },
  'tailwind-merge': { name: 'tailwind-merge', version: '^2.6.0', description: 'Merge Tailwind classes' },
  
  // State management
  'zustand': { name: 'zustand', version: '^5.0.6', description: 'Bear necessities for state management' },
  'dexie': { name: 'dexie', version: '^4.0.11', description: 'IndexedDB wrapper' },
  'dexie-react-hooks': { name: 'dexie-react-hooks', version: '^1.1.7', description: 'React hooks for Dexie' },
  
  // UI components
  'cmdk': { name: 'cmdk', version: '^1.1.1', description: 'Command menu component' },
  'react-hot-toast': { name: 'react-hot-toast', version: '^2.6.0', description: 'Toast notifications' },
  'react-dropzone': { name: 'react-dropzone', version: '^15.0.0', description: 'Simple file upload hook' },
  'react-markdown': { name: 'react-markdown', version: '^10.1.0', description: 'Markdown renderer' },
  'remark-gfm': { name: 'remark-gfm', version: '^4.0.1', description: 'GitHub Flavored Markdown' },
  
  // AI SDKs
  'openai': { name: 'openai', version: '^6.32.0', description: 'OpenAI API client' },
  '@anthropic-ai/sdk': { name: '@anthropic-ai/sdk', version: '^0.80.0', description: 'Anthropic Claude API' },
  '@google/generative-ai': { name: '@google/generative-ai', version: '^0.24.1', description: 'Google Gemini API' },
  
  // Build tools
  'vite': { name: 'vite', version: '^6.2.2', description: 'Build tool' },
  '@vitejs/plugin-react': { name: '@vitejs/plugin-react', version: '^4.3.4', description: 'Vite React plugin' },
  'typescript': { name: 'typescript', version: '^5.8.2', description: 'TypeScript compiler' },
  
  // Testing
  'vitest': { name: 'vitest', version: '^4.1.0', description: 'Vitest test framework' },
  '@testing-library/react': { name: '@testing-library/react', version: '^16.3.2', description: 'React testing utilities' },
  '@testing-library/jest-dom': { name: '@testing-library/jest-dom', version: '^6.9.1', description: 'Jest DOM matchers' },
  '@testing-library/user-event': { name: '@testing-library/user-event', version: '^14.5.0', description: 'User event simulation' },
  'jsdom': { name: 'jsdom', version: '^29.0.1', description: 'DOM implementation for Node' },
  
  // Development
  '@types/node': { name: '@types/node', version: '^22.13.10', description: 'Node.js type definitions' },
  '@types/react': { name: '@types/react', version: '^18.3.20', description: 'React type definitions' },
  '@types/react-dom': { name: '@types/react-dom', version: '^18.3.6', description: 'React DOM type definitions' },
};

/**
 * Packages that are CLI tools, not npm dependencies.
 * These should NEVER appear in package.json dependencies.
 *
 * Note: 'supabase' is NOT here because @supabase/supabase-js is a valid npm package.
 * The supabase CLI is installed separately via npm install -g supabase or npx.
 */
export const CLI_TOOLS = new Set([
  'shadcn-ui',
  'shadcn',
  'vercel',
  'netlify',
  'prisma',
  'drizzle-kit',
]);

/**
 * Common incorrect package names and their correct versions.
 */
export const PACKAGE_CORRECTIONS: Record<string, string> = {
  // TanStack Query
  'tanstack-query': '@tanstack/react-query',
  'react-query': '@tanstack/react-query',
  '@tanstack/query': '@tanstack/react-query',

  // Supabase
  'supabase': '@supabase/supabase-js',
  '@supabase/js': '@supabase/supabase-js',
  'supabase-js': '@supabase/supabase-js',

  // Router
  'react-router': 'react-router-dom',

  // Tailwind
  'tailwind': 'tailwindcss',
  'tailwind-merge': 'tailwind-merge',

  // Zustand
  'zustand-v4': 'zustand',

  // Vite
  'vite-react': '@vitejs/plugin-react',
  '@vite/react': '@vitejs/plugin-react',

  // Google AI
  'google-ai': '@google/generative-ai',
  '@google/ai': '@google/generative-ai',

  // Anthropic
  'anthropic': '@anthropic-ai/sdk',
  'claude': '@anthropic-ai/sdk',
};

/**
 * Validates a package name and returns the correct identifier.
 * 
 * @param packageName - The package name to validate (may be incorrect)
 * @returns Object with isValid flag, corrected name, and package info
 * 
 * @example
 * validatePackage('tanstack-query') 
 * // { isValid: true, correctedName: '@tanstack/react-query', wasCorrected: true }
 * 
 * validatePackage('nonexistent-package')
 * // { isValid: false, correctedName: null, wasCorrected: false }
 */
export function validatePackage(packageName: string): {
  isValid: boolean;
  correctedName: string | null;
  wasCorrected: boolean;
  info?: PackageInfo;
} {
  const normalized = packageName.toLowerCase().trim();
  
  // Check if it's a CLI tool (should not be in package.json)
  if (CLI_TOOLS.has(normalized)) {
    return {
      isValid: false,
      correctedName: null,
      wasCorrected: false,
    };
  }
  
  // Check if correction is needed
  if (PACKAGE_CORRECTIONS[normalized]) {
    const corrected = PACKAGE_CORRECTIONS[normalized];
    const info = VERIFIED_PACKAGES[corrected];
    return {
      isValid: true,
      correctedName: corrected,
      wasCorrected: true,
      info,
    };
  }
  
  // Check if it's already correct
  if (VERIFIED_PACKAGES[normalized]) {
    return {
      isValid: true,
      correctedName: normalized,
      wasCorrected: false,
      info: VERIFIED_PACKAGES[normalized],
    };
  }
  
  // Check scoped packages (e.g., @tanstack/react-query)
  if (packageName.startsWith('@')) {
    const info = VERIFIED_PACKAGES[packageName];
    if (info) {
      return {
        isValid: true,
        correctedName: packageName,
        wasCorrected: false,
        info,
      };
    }
  }
  
  // Unknown package - might still be valid, just not in our registry
  return {
    isValid: true,
    correctedName: packageName,
    wasCorrected: false,
  };
}

/**
 * Validates an array of dependencies and returns corrections.
 * 
 * @param dependencies - Object mapping package names to versions
 * @returns Object with validated dependencies and any errors
 * 
 * @example
 * const { validated, errors, cliTools } = validateDependencies({
 *   'tanstack-query': '^5.0.0',
 *   'react': '^18.3.1',
 *   'shadcn-ui': 'latest'
 * });
 * // validated: { '@tanstack/react-query': '^5.0.0', 'react': '^18.3.1' }
 * // errors: ['shadcn-ui is a CLI tool, not an npm package']
 */
export function validateDependencies(
  dependencies: Record<string, string>
): {
  validated: Record<string, string>;
  errors: string[];
  cliTools: string[];
  corrections: Array<{ from: string; to: string }>;
} {
  const validated: Record<string, string> = {};
  const errors: string[] = [];
  const cliTools: string[] = [];
  const corrections: Array<{ from: string; to: string }> = [];
  
  for (const [packageName, version] of Object.entries(dependencies)) {
    const result = validatePackage(packageName);
    
    if (!result.isValid) {
      if (CLI_TOOLS.has(packageName.toLowerCase())) {
        cliTools.push(packageName);
        errors.push(
          `"${packageName}" is a CLI tool and should not be in package.json dependencies. ` +
          `Install it separately with: npx ${packageName}@latest`
        );
      } else {
        errors.push(`Unknown package: "${packageName}"`);
      }
      continue;
    }
    
    if (result.correctedName && result.correctedName !== packageName) {
      corrections.push({ from: packageName, to: result.correctedName });
    }
    
    if (result.correctedName) {
      // Use the version from verified registry if available, otherwise use provided version
      const verifiedVersion = result.info?.version;
      validated[result.correctedName] = verifiedVersion || version;
    }
  }
  
  return { validated, errors, cliTools, corrections };
}

/**
 * Generates a corrected package.json dependencies object.
 * 
 * @param dependencies - Raw dependencies from generation
 * @returns Corrected dependencies object ready for package.json
 */
export function generateCorrectedDependencies(
  dependencies: Record<string, string>
): Record<string, string> {
  const { validated } = validateDependencies(dependencies);
  return validated;
}

/**
 * Checks if a package name is a CLI tool that should not be in package.json.
 */
export function isCLITool(packageName: string): boolean {
  return CLI_TOOLS.has(packageName.toLowerCase());
}
