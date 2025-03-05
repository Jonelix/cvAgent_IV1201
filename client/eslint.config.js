/**
 * ESLint Configuration for a React project.
 * 
 * - Uses ESLint's recommended rules along with React and React Hooks plugins.
 * - Supports ECMAScript modules and JSX syntax.
 * - Ignores the `dist` directory.
 * - Configures React version 18.3.
 * - Disables `react/jsx-no-target-blank` and customizes `react-refresh/only-export-components` rule.
 * 
 * @requires @eslint/js - ESLint's core JavaScript rules.
 * @requires globals - Global variables definitions.
 * @requires eslint-plugin-react - Plugin for React-specific linting rules.
 * @requires eslint-plugin-react-hooks - Enforces the Rules of Hooks.
 * @requires eslint-plugin-react-refresh - Ensures React components support fast refresh.
 */
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
