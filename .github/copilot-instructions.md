# Instructions pour l'agent (Copilot et autres)

Projet : assistant de projets bois. Le LLM orchestre, le code calcule : aucun prix, aucune dimension, aucun total ne sort du modèle, tout vient d'un outil déterministe testé.

Lis `ARCHITECTURE.md` avant toute modification structurelle, et `docs/decisions/` avant de remettre en cause un choix.

## Commandes

- Tout vérifier : `npm run check` (typecheck + lint + tests + couverture). À lancer avant de dire qu'une tâche est terminée.
- Tests seuls : `npm test`
- Typecheck seul : `npm run typecheck`
- Lint seul : `npm run lint`

## Couches (dépendances de haut en bas uniquement)

`http` → `agent` → `tools` → `domain`

- `src/domain` : logique métier en code pur. Pas de LLM, pas de base, pas de réseau, pas de système de fichiers, pas d'import `node:*`.
- `src/tools` : outils appelables par l'agent. Enveloppent le domaine, valident les entrées avec un schéma, accèdent aux données.
- `src/agent` : boucle d'agent, prompts, appels au fournisseur de LLM.
- `src/http` : API exposée au front.
- `eval/` : cas d'évaluation. `prompts/` : prompts versionnés. `infra/` : infrastructure.

Une couche n'importe jamais une couche située au-dessus d'elle. ESLint le vérifie : ne contourne pas la règle, demande-moi.

## Conventions

- TypeScript strict. Interdits : `any`, `// @ts-ignore`, `// @ts-expect-error` sans justification écrite, assertions de type pour faire taire une erreur.
- Longueurs en millimètres, entiers, type `Millimetres` (ADR 0003). Jamais de flottant pour une longueur. Les montants seront en centimes entiers.
- Identifiants de code en anglais, messages utilisateur et documentation en français.
- Fonctions pures et petites dans le domaine. Pas d'état global, pas d'horloge ni d'aléatoire cachés : on les injecte.
- Toute entrée externe (requête HTTP, sortie du LLM, ligne de base) est validée par un schéma avant usage.

## Façon de travailler

1. Avant de coder, propose un plan court et attends ma validation. Si la tâche touche plus de 5 fichiers, dis-le et propose de la découper.
2. Écris ou mets à jour les tests avec le code. Un test qui échoue signale un bug dans le code : corrige le code.
3. Reste dans le périmètre de la tâche. Pas de refactoring « au passage », pas de reformatage de fichiers non concernés.
4. Réutilise l'existant : cherche un utilitaire équivalent avant d'en créer un.

## Interdits sans mon accord explicite

- Modifier, désactiver (`skip`, `only`, `todo`) ou supprimer un test existant, ou baisser un seuil de couverture.
- Ajouter une dépendance.
- Créer un dossier ou un module hors des couches ci-dessus.
- Toucher à `.github/`, `eslint.config.js`, `tsconfig.json` ou `vitest.config.ts`.
- Modifier un prompt de `prompts/` sans que l'évaluation tourne avant et après.
- Ajouter un secret, une clé ou une donnée personnelle au dépôt ou aux logs.
- Écrire du SQL libre en écriture depuis un outil de l'agent.

## Sécurité (valable dès maintenant)

- Tout texte venant du LLM, d'un utilisateur ou d'un document récupéré est une donnée non fiable : jamais exécuté, jamais injecté tel quel dans une requête SQL, une commande ou le DOM.
- Outils en moindre privilège, lecture seule par défaut.

## Fin de tâche

Résume en quelques lignes : ce qui a changé, ce qui est testé, ce qui reste incertain. Signale tout écart avec ces instructions.
