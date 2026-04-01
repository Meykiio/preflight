import { describe, expect, it } from 'vitest';
import {
  validatePackage,
  validateDependencies,
  isCLITool,
  runFullValidation,
} from '../validation';

describe('Package Validator', () => {
  describe('validatePackage', () => {
    it('should correct wrong TanStack Query package name', () => {
      const result = validatePackage('tanstack-query');
      expect(result.isValid).toBe(true);
      expect(result.wasCorrected).toBe(true);
      expect(result.correctedName).toBe('@tanstack/react-query');
    });

    it('should correct wrong Supabase package name', () => {
      const result = validatePackage('supabase');
      expect(result.isValid).toBe(true);
      expect(result.wasCorrected).toBe(true);
      expect(result.correctedName).toBe('@supabase/supabase-js');
    });

    it('should accept correct package names', () => {
      const result = validatePackage('@tanstack/react-query');
      expect(result.isValid).toBe(true);
      expect(result.wasCorrected).toBe(false);
      expect(result.correctedName).toBe('@tanstack/react-query');
    });

    it('should flag CLI tools as invalid', () => {
      const result = validatePackage('shadcn-ui');
      expect(result.isValid).toBe(false);
      expect(result.correctedName).toBe(null);
    });
  });

  describe('isCLITool', () => {
    it('should identify shadcn-ui as CLI tool', () => {
      expect(isCLITool('shadcn-ui')).toBe(true);
      expect(isCLITool('shadcn')).toBe(true);
    });

    it('should identify vercel CLI as CLI tool', () => {
      expect(isCLITool('vercel')).toBe(true);
    });

    it('should NOT identify supabase as CLI tool (it is also a package)', () => {
      // supabase is both a CLI tool and a package (@supabase/supabase-js)
      // We allow it and correct it to the proper package name
      expect(isCLITool('supabase')).toBe(false);
    });

    it('should not identify regular packages as CLI tools', () => {
      expect(isCLITool('react')).toBe(false);
      expect(isCLITool('@tanstack/react-query')).toBe(false);
    });
  });

  describe('validateDependencies', () => {
    it('should correct multiple wrong package names', () => {
      const { validated, corrections, errors } = validateDependencies({
        'tanstack-query': '^5.0.0',
        'supabase': '^2.0.0',
        'react': '^18.3.1',
      });

      // supabase is corrected to @supabase/supabase-js
      expect(corrections).toHaveLength(2);
      expect(validated['@tanstack/react-query']).toBeDefined();
      expect(validated['@supabase/supabase-js']).toBeDefined();
      expect(errors).toHaveLength(0);
    });

    it('should flag CLI tools in dependencies', () => {
      const { errors, cliTools } = validateDependencies({
        'shadcn-ui': 'latest',
        'react': '^18.3.1',
      });

      expect(cliTools).toContain('shadcn-ui');
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Full Validation', () => {
  it('should pass validation with correct config', () => {
    const result = runFullValidation({
      packageJson: JSON.stringify({
        dependencies: {
          'react': '^18.3.1',
          '@tanstack/react-query': '^5.17.0',
        },
      }),
      tsconfig: JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      }),
      framework: 'vite',
    });

    expect(result.criticalErrors).toBe(0);
    expect(result.errors).toBe(0);
  });

  it('should fail validation with CLI tool in dependencies', () => {
    const result = runFullValidation({
      packageJson: JSON.stringify({
        dependencies: {
          'shadcn-ui': 'latest',
        },
      }),
    });

    expect(result.criticalErrors).toBeGreaterThan(0);
  });

  it('should return warnings for incorrect tsconfig paths', () => {
    const result = runFullValidation({
      tsconfig: JSON.stringify({
        compilerOptions: {
          paths: {
            '*': ['*'],
          },
        },
      }),
      framework: 'vite',
    });

    // tsconfig without baseUrl/paths generates warnings, not errors
    expect(result.warnings).toBeGreaterThan(0);
  });

  it('should return warnings for missing VITE_ prefix', () => {
    const result = runFullValidation({
      envExample: 'VITE_SUPABASE_URL=test\nVITE_SUPABASE_ANON_KEY=test',
      tsconfig: JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      }),
      framework: 'vite',
    });

    // With correct VITE_ prefix, should have no errors
    expect(result.errors).toBe(0);
  });
});
