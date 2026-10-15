# Architecture

> Document vivant. Toute règle de structure qui change se change ici, avec une décision dans `docs/decisions/`.

## Principe

Le LLM décide quoi appeler. Des outils en code pur calculent. Aucun prix, aucune dimension, aucun total n'est produit par le modèle.

## Couches

```
http   ->  agent  ->  tools  ->  domain
```

| Couche | Rôle | Peut importer | Ne peut pas importer |
| --- | --- | --- | --- |
| `src/domain` | Logique métier en code pur : pièces, planches, découpe, calcul de coûts | rien d'extérieur (ni `node:*`) | `tools`, `agent`, `http` |
| `src/tools` | Outils appelables par l'agent : validation d'entrée, accès aux données, appel du domaine | `domain` | `agent`, `http` |
| `src/agent` | Boucle d'agent, prompts, appels au fournisseur de LLM | `tools`, `domain` | `http` |
| `src/http` | API exposée au front | `agent`, `tools`, `domain` | (aucune restriction vers le bas) |

Les règles sont appliquées par ESLint (`eslint.config.js`) : un import interdit casse `npm run lint` et donc la CI.

## Dossiers hors couches

- `eval/` : cas d'évaluation (vérifications déterministes, puis jugement qualitatif).
- `experiments/` : prototypes pédagogiques isolés, non intégrés au produit ni aux couches de production.
- `prompts/` : prompts versionnés. Aucune modification sans évaluation avant et après.
- `infra/` : infrastructure (conteneurs, Terraform, déploiement), à partir de la phase 6.
- `docs/decisions/` : décisions d'architecture. `docs/specs/` : une spec par tâche. `docs/journal/` : carnet de bord.

Le front Angular s'ajoutera dans un dossier `web/` séparé, avec son propre `package.json`, quand on arrivera à la phase 6 (ou plus tôt si besoin).

## Garde-fous automatiques

- TypeScript en mode strict (`tsconfig.json`).
- ESLint type-checked + frontières de couches.
- Couverture minimale de 90 % sur `src/domain` (`vitest.config.ts`).
- CI bloquante : typecheck, lint, tests, couverture, audit des dépendances.
