import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Base config
const baseConfig = compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier',
);

// Common rules
const commonRules = {
  'prettier/prettier': 'error',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

// Next.js specific config
const nextConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['document-management/**/*.{ts,tsx,js,jsx}'],
    rules: {
      ...commonRules,
    },
  },
];

// Backend config
const backendConfig = [
  ...baseConfig,
  {
    files: ['document-management-api/**/*.{ts,js}'],
    rules: {
      ...commonRules,
    },
  },
];

// Combined configuration
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'document-management/.next/**',
      'document-management/out/**',
      '**/package-lock.json',
      '**/components.json',
      '**/next-env.d.ts',
      '**/postcss.config.mjs',
      '**/.vscode/**',
    ],
  },
  ...nextConfig,
  ...backendConfig,
];
