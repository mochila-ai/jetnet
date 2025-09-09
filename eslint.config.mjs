import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', 'test-*.js', 'jest.config.js', 'test-response-formatting.js', 'tests/**']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'n8n-nodes-base': n8nNodesBase
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'n8n-nodes-base/node-dirname-against-convention': 'error',
      'n8n-nodes-base/node-filename-against-convention': 'error',
      'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
      'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
      'n8n-nodes-base/node-class-description-missing-subtitle': 'error',
      'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'error',
      'no-debugger': 'error'
    }
  }
];