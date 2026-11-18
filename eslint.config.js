import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import jsdoc from 'eslint-plugin-jsdoc'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export const baseConfig = defineConfig([
  globalIgnores(['**/dist/**', '**/node_modules/**']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      // Общие правила для client и server
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { jsdoc },
    rules: {
      ...jsdoc.configs['flat/recommended-typescript-flavor'].rules,
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: false,
          },
        },
      ],
      'jsdoc/check-alignment': 'error',
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'off',
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
  },
  eslintConfigPrettier,
])

export default baseConfig
