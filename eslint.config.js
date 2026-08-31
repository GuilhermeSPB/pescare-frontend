import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Regras de arquitetura (feature-based / Bulletproof React):
      // - uma feature nao pode importar de outra feature diretamente
      // - o codigo deve fluir em uma direcao: shared -> features -> app
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            { target: './src/features/auth', from: './src/features', except: ['./auth'] },
            {
              target: './src/features/buyers',
              from: './src/features',
              except: ['./buyers'],
            },
            { target: './src/features/species', from: './src/features', except: ['./species'] },
            {
              target: './src/features/fishing-methods',
              from: './src/features',
              except: ['./fishing-methods'],
            },
            {
              target: './src/features/fishing-bans',
              from: './src/features',
              except: ['./fishing-bans'],
            },
            {
              target: './src/features/location-fishings',
              from: './src/features',
              except: ['./location-fishings'],
            },
            { target: './src/features/alerts', from: './src/features', except: ['./alerts'] },

            { target: './src/features', from: './src/app' },
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
                './src/config',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
    },
  },
)
