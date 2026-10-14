// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Frontières de couches (dépendances autorisées : de haut en bas uniquement).
 *
 *   http  ->  agent  ->  tools  ->  domain
 *
 * Une couche n'importe jamais une couche située au-dessus d'elle.
 * Le domaine est en code pur : ni LLM, ni base, ni réseau, ni système de fichiers.
 */
const forbid = (layers, message) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: layers.map((layer) => ({
        group: [`**/${layer}`, `**/${layer}/**`],
        message,
      })),
    },
  ],
});

export default tseslint.config(
  { ignores: ['node_modules/**', 'coverage/**', 'dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['eslint.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...['tools', 'agent', 'http'].map((layer) => ({
              group: [`**/${layer}`, `**/${layer}/**`],
              message: 'Le domaine ne dépend d’aucune couche supérieure (voir ARCHITECTURE.md).',
            })),
            {
              group: ['node:*'],
              message: 'Le domaine est en code pur : pas d’accès système, réseau ou fichiers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/tools/**/*.ts'],
    rules: forbid(['agent', 'http'], 'Les outils ne dépendent ni de l’agent ni de l’API (voir ARCHITECTURE.md).'),
  },
  {
    files: ['src/agent/**/*.ts'],
    rules: forbid(['http'], 'L’agent ne dépend pas de la couche HTTP (voir ARCHITECTURE.md).'),
  },
);
