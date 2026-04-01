/**
 * Library Validator
 * 
 * Validates that generated code doesn't use prohibited libraries
 * based on the project's tech stack.
 * 
 * Issue 5.1: Dexie.js re-appeared in Build Prompts after being removed from RULES.md
 * Issue 4.1: Dexie.js referenced throughout, which is completely wrong for Supabase stack
 */

export type DatabaseType = 'supabase' | 'dexie' | 'firebase' | 'appwrite' | 'custom';
export type StackType = 'vite' | 'nextjs' | 'remix' | 'nuxt';

export interface StackConfig {
  database: DatabaseType;
  framework: StackType;
  prohibitedLibraries: string[];
  requiredLibraries: string[];
}

/**
 * Prohibited library combinations based on tech stack.
 * These are the most common and dangerous mismatches.
 */
export const PROHIBITED_COMBINATIONS: Record<string, string[]> = {
  // Supabase projects should NOT use local-first persistence libraries
  'supabase': [
    'dexie',
    'dexie-react-hooks',
    'idb',
    'localforage',
    'pouchdb',
    'rxjs', // Unless explicitly requested
  ],
  
  // Dexie projects should NOT use cloud database clients
  'dexie': [
    '@supabase/supabase-js',
    'firebase',
    '@firebase/app',
    '@appwrite/appwrite',
  ],
  
  // Vite-specific prohibitions
  'vite': [
    'webpack',
    'rollup', // Unless explicitly for library builds
  ],
  
  // Next.js specific prohibitions
  'nextjs': [
    'vite',
    'webpack-dev-server',
  ],
};

/**
 * Required libraries for specific stack combinations.
 * If these are missing, it's a critical error.
 */
export const REQUIRED_LIBRARIES: Record<string, string[]> = {
  'supabase': [
    '@supabase/supabase-js',
  ],
  
  'supabase-auth': [
    '@supabase/supabase-js',
  ],
  
  'vite-react': [
    'vite',
    '@vitejs/plugin-react',
    'react',
    'react-dom',
  ],
  
  'tanstack-query': [
    '@tanstack/react-query',
  ],
  
  'zustand': [
    'zustand',
  ],
  
  'tailwind': [
    'tailwindcss',
    'postcss',
    'autoprefixer',
  ],
};

/**
 * Library aliases and their canonical names.
 * Helps detect prohibited libraries even when referred to by nicknames.
 */
export const LIBRARY_ALIASES: Record<string, string> = {
  // Supabase
  'supabase-js': '@supabase/supabase-js',
  'supabase-client': '@supabase/supabase-js',
  'supabase': '@supabase/supabase-js',
  
  // Dexie
  'dexie-db': 'dexie',
  'dexie-react': 'dexie-react-hooks',
  
  // TanStack Query
  'react-query': '@tanstack/react-query',
  'tanstack-query': '@tanstack/react-query',
  
  // Zustand
  'zustand-store': 'zustand',
  
  // Tailwind
  'tailwind': 'tailwindcss',
  'tw': 'tailwindcss',
};

/**
 * Checks if a library is prohibited for the given stack configuration.
 * 
 * @param library - Library name to check
 * @param stack - Stack configuration
 * @returns Object with isProhibited flag and reason
 * 
 * @example
 * const result = isLibraryProhibited('dexie', { database: 'supabase', framework: 'vite' });
 * // { isProhibited: true, reason: 'Dexie is incompatible with Supabase projects' }
 */
export function isLibraryProhibited(
  library: string,
  stack: { database: DatabaseType; framework?: StackType }
): {
  isProhibited: boolean;
  reason: string;
} {
  const normalizedLibrary = library.toLowerCase().trim();
  const canonicalName = LIBRARY_ALIASES[normalizedLibrary] || normalizedLibrary;
  
  // Check database-specific prohibitions
  const dbProhibited = PROHIBITED_COMBINATIONS[stack.database] || [];
  if (dbProhibited.some(prohibited => 
    canonicalName.includes(prohibited) || prohibited.includes(canonicalName)
  )) {
    return {
      isProhibited: true,
      reason: `${canonicalName} is incompatible with ${stack.database.toUpperCase()} projects. ` +
        `Use ${stack.database === 'supabase' ? 'Supabase client for all data operations' : 'the configured database'} instead.`,
    };
  }
  
  // Check framework-specific prohibitions
  if (stack.framework) {
    const frameworkProhibited = PROHIBITED_COMBINATIONS[stack.framework] || [];
    if (frameworkProhibited.some(prohibited => 
      canonicalName.includes(prohibited) || prohibited.includes(canonicalName)
    )) {
      return {
        isProhibited: true,
        reason: `${canonicalName} is incompatible with ${stack.framework.toUpperCase()} projects.`,
      };
    }
  }
  
  return {
    isProhibited: false,
    reason: '',
  };
}

/**
 * Scans content for prohibited library imports.
 * 
 * @param content - Code content to scan
 * @param stack - Stack configuration
 * @returns Array of prohibited imports found
 * 
 * @example
 * const content = `import { createClient } from '@supabase/supabase-js';
 * import { Dexie } from 'dexie';`;
 * 
 * const prohibited = scanForProhibitedImports(content, { database: 'supabase' });
 * // ['dexie']
 */
export function scanForProhibitedImports(
  content: string,
  stack: { database: DatabaseType; framework?: StackType }
): Array<{ library: string; line: number; reason: string }> {
  const prohibited: Array<{ library: string; line: number; reason: string }> = [];
  const lines = content.split('\n');
  
  // Regex patterns for common import statements
  const importPatterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,  // import X from 'package'
    /import\s+['"]([^'"]+)['"]/g,                // import 'package'
    /require\(['"]([^'"]+)['"]\)/g,              // require('package')
  ];
  
  lines.forEach((line, index) => {
    for (const pattern of importPatterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const importedLibrary = match[1];
        const result = isLibraryProhibited(importedLibrary, stack);
        
        if (result.isProhibited) {
          prohibited.push({
            library: importedLibrary,
            line: index + 1,
            reason: result.reason,
          });
        }
      }
    }
  });
  
  return prohibited;
}

/**
 * Validates that all required libraries for a feature are present.
 * 
 * @param feature - Feature name (e.g., 'supabase-auth', 'tanstack-query')
 * @param installedLibraries - Array of installed library names
 * @returns Object with missing libraries and validation status
 */
export function validateRequiredLibraries(
  feature: string,
  installedLibraries: string[]
): {
  isComplete: boolean;
  missing: string[];
  present: string[];
} {
  const required = REQUIRED_LIBRARIES[feature] || [];
  const normalizedInstalled = installedLibraries.map(lib => lib.toLowerCase());
  
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const lib of required) {
    const canonicalName = LIBRARY_ALIASES[lib.toLowerCase()] || lib;
    if (normalizedInstalled.some(installed => 
      installed.includes(canonicalName) || canonicalName.includes(installed)
    )) {
      present.push(lib);
    } else {
      missing.push(lib);
    }
  }
  
  return {
    isComplete: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Generates a stack configuration object from project brief.
 * 
 * @param techStack - Array of tech stack tags from brief
 * @returns Stack configuration object
 */
export function generateStackConfig(techStack: string[]): StackConfig {
  const normalizedStack = techStack.map(tag => tag.toLowerCase());
  
  // Detect database type
  let database: DatabaseType = 'dexie'; // Default to local-first
  if (normalizedStack.some(tag => tag.includes('supabase'))) {
    database = 'supabase';
  } else if (normalizedStack.some(tag => tag.includes('firebase'))) {
    database = 'firebase';
  } else if (normalizedStack.some(tag => tag.includes('appwrite'))) {
    database = 'appwrite';
  }
  
  // Detect framework
  let framework: StackType = 'vite'; // Default to Vite
  if (normalizedStack.some(tag => tag.includes('nextjs') || tag.includes('next.js'))) {
    framework = 'nextjs';
  } else if (normalizedStack.some(tag => tag.includes('remix'))) {
    framework = 'remix';
  } else if (normalizedStack.some(tag => tag.includes('nuxt'))) {
    framework = 'nuxt';
  }
  
  // Get prohibited libraries for this stack
  const prohibitedLibraries = [
    ...(PROHIBITED_COMBINATIONS[database] || []),
    ...(PROHIBITED_COMBINATIONS[framework] || []),
  ];
  
  // Get required libraries for this stack
  const requiredLibraries = [
    ...(REQUIRED_LIBRARIES[database] || []),
    ...(REQUIRED_LIBRARIES[framework] || []),
  ];
  
  return {
    database,
    framework,
    prohibitedLibraries,
    requiredLibraries,
  };
}
