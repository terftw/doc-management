import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tsEslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/out/**'],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^[A-Z_]+$',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^[A-Z_]+$',
        },
      ],
    },
  },
];
