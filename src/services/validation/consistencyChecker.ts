/**
 * Consistency Checker
 * 
 * Cross-checks multiple generated documents for consistency:
 * - RULES.md vs Build Prompts (Issue 5.1)
 * - Numeric thresholds consistency (Issue 5.14)
 * - Library drift between documents
 */

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  inconsistencies: Inconsistency[];
}

export interface Inconsistency {
  type: 'library' | 'numeric' | 'structural' | 'security';
  severity: 'critical' | 'error' | 'warning';
  sourceDocument: string;
  targetDocument: string;
  message: string;
  fix: string;
}

/**
 * Extracts all library imports from code content.
 */
function extractLibraries(content: string): string[] {
  const libraries = new Set<string>();
  
  // Match import statements
  const importPatterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /require\(['"]([^'"]+)['"]\)/g,
  ];
  
  for (const pattern of importPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lib = match[1];
      // Extract package name from path (e.g., '@supabase/supabase-js' from '@supabase/supabase-js/client')
      const parts = lib.split('/');
      const packageName = lib.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
      libraries.add(packageName);
    }
  }
  
  return Array.from(libraries);
}

/**
 * Extracts prohibited libraries from RULES.md content.
 */
function extractProhibitedLibraries(content: string): string[] {
  const prohibited: string[] = [];
  
  // Look for prohibited section
  const prohibitedSection = content.match(/(?:prohibited|❌)[^]*?(?=\n##|\n###|$)/i);
  
  if (prohibitedSection) {
    const section = prohibitedSection[0];
    
    // Extract library names from prohibited list
    const libraryPatterns = [
      /dexie/gi,
      /indexeddb/gi,
      /localstorage/gi,
      /local-storage/gi,
    ];
    
    for (const pattern of libraryPatterns) {
      if (pattern.test(section)) {
        prohibited.push(pattern.source.replace('/gi', ''));
      }
    }
  }
  
  return prohibited;
}

/**
 * Extracts numeric thresholds from content.
 */
function extractNumericThresholds(content: string): Map<string, number> {
  const thresholds = new Map<string, number>();
  
  // Match patterns like "200 lines", "max 300", "over 500"
  const patterns = [
    /(\d+)\s*lines/i,
    /max(?:imum)?\s*(\d+)/i,
    /over\s*(\d+)/i,
    /under\s*(\d+)/i,
    /less than\s*(\d+)/i,
    /more than\s*(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const value = parseInt(match[1], 10);
      const context = content.substring(Math.max(0, match.index - 50), match.index + 50);
      
      if (context.toLowerCase().includes('file')) {
        thresholds.set('file_size_limit', value);
      }
      if (context.toLowerCase().includes('function')) {
        thresholds.set('function_size_limit', value);
      }
      if (context.toLowerCase().includes('component')) {
        thresholds.set('component_size_limit', value);
      }
    }
  }
  
  return thresholds;
}

/**
 * Checks for prohibited library usage in build prompts.
 * 
 * Issue 5.1: Dexie.js re-appeared in Build Prompts after being removed from RULES.md
 * 
 * @param rulesContent - RULES.md content
 * @param buildPrompts - Array of build stage prompts
 * @returns Consistency check result
 */
export function checkProhibitedLibraries(
  rulesContent: string,
  buildPrompts: Array<{ stage: number; content: string }>
): ConsistencyCheckResult {
  const inconsistencies: Inconsistency[] = [];
  
  // Extract prohibited libraries from RULES.md
  const prohibitedInRules = extractProhibitedLibraries(rulesContent);
  
  if (prohibitedInRules.length === 0) {
    // If no prohibited section found, check for common problematic libraries
    prohibitedInRules.push('dexie', 'indexeddb');
  }
  
  // Check each build stage
  for (const stage of buildPrompts) {
    const libraries = extractLibraries(stage.content);
    
    for (const lib of libraries) {
      const normalizedLib = lib.toLowerCase();
      const isProhibited = prohibitedInRules.some(
        prohibited => normalizedLib.includes(prohibited.toLowerCase()) ||
                     prohibited.toLowerCase().includes(normalizedLib)
      );
      
      if (isProhibited) {
        inconsistencies.push({
          type: 'library',
          severity: 'critical',
          sourceDocument: 'RULES.md',
          targetDocument: `Build Stage ${stage.stage}`,
          message: `Prohibited library "${lib}" found in Build Stage ${stage.stage} but prohibited in RULES.md`,
          fix: `Remove all references to "${lib}" from Build Stage ${stage.stage}. ` +
               `Use the stack-appropriate alternative instead.`,
        });
      }
    }
  }
  
  return {
    isConsistent: inconsistencies.length === 0,
    inconsistencies,
  };
}

/**
 * Checks for numeric threshold consistency between documents.
 * 
 * Issue 5.14: File size limit was inconsistent between RULES.md and the Audit stage
 * 
 * @param rulesContent - RULES.md content
 * @param auditContent - Audit stage content
 * @returns Consistency check result
 */
export function checkNumericThresholds(
  rulesContent: string,
  auditContent: string
): ConsistencyCheckResult {
  const inconsistencies: Inconsistency[] = [];
  
  const rulesThresholds = extractNumericThresholds(rulesContent);
  const auditThresholds = extractNumericThresholds(auditContent);
  
  // Compare file size limits
  const rulesFileSize = rulesThresholds.get('file_size_limit');
  const auditFileSize = auditThresholds.get('file_size_limit');
  
  if (rulesFileSize && auditFileSize && rulesFileSize !== auditFileSize) {
    inconsistencies.push({
      type: 'numeric',
      severity: 'error',
      sourceDocument: 'RULES.md',
      targetDocument: 'Audit Stage',
      message: `File size limit mismatch: RULES.md specifies ${rulesFileSize} lines, ` +
               `but Audit stage checks for ${auditFileSize} lines`,
      fix: `Update Audit stage to check for ${rulesFileSize} lines (matching RULES.md)`,
    });
  }
  
  // Compare function size limits
  const rulesFunctionSize = rulesThresholds.get('function_size_limit');
  const auditFunctionSize = auditThresholds.get('function_size_limit');
  
  if (rulesFunctionSize && auditFunctionSize && rulesFunctionSize !== auditFunctionSize) {
    inconsistencies.push({
      type: 'numeric',
      severity: 'warning',
      sourceDocument: 'RULES.md',
      targetDocument: 'Audit Stage',
      message: `Function size limit mismatch: RULES.md specifies ${rulesFunctionSize} lines, ` +
               `but Audit stage checks for ${auditFunctionSize} lines`,
      fix: `Update Audit stage to check for ${rulesFunctionSize} lines (matching RULES.md)`,
    });
  }
  
  return {
    isConsistent: inconsistencies.length === 0,
    inconsistencies,
  };
}

/**
 * Checks for security-related configuration drift.
 * 
 * @param rulesContent - RULES.md content
 * @param buildPrompts - Array of build stage prompts
 * @returns Consistency check result
 */
export function checkSecurityConfig(
  rulesContent: string,
  buildPrompts: Array<{ stage: number; content: string }>
): ConsistencyCheckResult {
  const inconsistencies: Inconsistency[] = [];
  
  // Check for RLS (Row Level Security) mentions
  const hasRLSRequirement = /row.?level.?security|RLS/i.test(rulesContent);
  
  if (hasRLSRequirement) {
    for (const stage of buildPrompts) {
      // Check if database stage creates tables without RLS
      if (stage.content.toLowerCase().includes('create table')) {
        const hasRLS = /enable row level security|rls/i.test(stage.content);
        
        if (!hasRLS) {
          inconsistencies.push({
            type: 'security',
            severity: 'critical',
            sourceDocument: 'RULES.md',
            targetDocument: `Build Stage ${stage.stage}`,
            message: `Database tables created in Stage ${stage.stage} without RLS enabled, ` +
                     `but RULES.md requires RLS on all tables`,
            fix: `Add "ENABLE ROW LEVEL SECURITY" to all CREATE TABLE statements in Stage ${stage.stage}`,
          });
        }
      }
      
      // Check for service role key exposure
      if (/service.?role.*key|supabase.*service.*role/i.test(stage.content)) {
        const hasWarning = /never expose|do not commit|environment variable/i.test(stage.content);
        
        if (!hasWarning) {
          inconsistencies.push({
            type: 'security',
            severity: 'critical',
            sourceDocument: 'RULES.md',
            targetDocument: `Build Stage ${stage.stage}`,
            message: `Service role key mentioned in Stage ${stage.stage} without security warning`,
            fix: `Add explicit warning: "NEVER expose service role key in client code"`,
          });
        }
      }
    }
  }
  
  return {
    isConsistent: inconsistencies.length === 0,
    inconsistencies,
  };
}

/**
 * Comprehensive consistency check across all documents.
 */
export interface AllDocuments {
  rulesContent: string;
  buildPrompts: Array<{ stage: number; content: string }>;
  auditContent?: string;
}

export function checkAllConsistencies(documents: AllDocuments): ConsistencyCheckResult {
  const allInconsistencies: Inconsistency[] = [];
  
  // Check prohibited libraries
  const libCheck = checkProhibitedLibraries(documents.rulesContent, documents.buildPrompts);
  allInconsistencies.push(...libCheck.inconsistencies);
  
  // Check numeric thresholds if audit content provided
  if (documents.auditContent) {
    const numericCheck = checkNumericThresholds(documents.rulesContent, documents.auditContent);
    allInconsistencies.push(...numericCheck.inconsistencies);
  }
  
  // Check security config
  const securityCheck = checkSecurityConfig(documents.rulesContent, documents.buildPrompts);
  allInconsistencies.push(...securityCheck.inconsistencies);
  
  return {
    isConsistent: allInconsistencies.length === 0,
    inconsistencies: allInconsistencies,
  };
}

/**
 * Quick validation for a single build stage against RULES.md.
 */
export function validateStageAgainstRules(
  stageContent: string,
  rulesContent: string,
  stageNumber: number
): ConsistencyCheckResult {
  return checkProhibitedLibraries(rulesContent, [{ stage: stageNumber, content: stageContent }]);
}
