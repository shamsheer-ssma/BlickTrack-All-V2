/**
 * File: eslint.config.mjs
 * Purpose: ESLint configuration for the BlickTrack backend API. Defines code quality rules, TypeScript-specific linting, and Prettier integration. Ensures consistent code style and catches potential issues during development.
 *
 * Key Functions / Components / Classes:
 *   - ESLint configuration: Main linting configuration
 *   - TypeScript rules: TypeScript-specific linting rules
 *   - Prettier integration: Code formatting rules
 *   - Jest globals: Test environment globals
 *   - Custom rules: Project-specific linting rules
 *
 * Inputs:
 *   - TypeScript source files
 *   - Jest test files
 *   - Configuration files
 *
 * Outputs:
 *   - Linting errors and warnings
 *   - Code style enforcement
 *   - TypeScript type checking
 *   - Prettier formatting
 *
 * Dependencies:
 *   - @eslint/js for base ESLint rules
 *   - typescript-eslint for TypeScript support
 *   - eslint-plugin-prettier for Prettier integration
 *   - globals for environment globals
 *
 * Notes:
 *   - Implements comprehensive TypeScript linting
 *   - Includes Prettier for code formatting
 *   - Supports Jest test environment
 *   - Configures custom rules for project needs
 *   - Ensures code quality and consistency
 */

// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);
