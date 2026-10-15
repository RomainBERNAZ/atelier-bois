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

## Tests métier

- Avant d'implémenter un calcul métier, explicite ses conventions et définis des exemples attendus : cas nominal, cas limites et cas distinguant les interprétations possibles. Si une convention reste ambiguë, demande une clarification plutôt que de l'inventer.
- Déduis les résultats attendus du contrat métier, indépendamment de l'implémentation testée. Un taux de couverture, même de 100 %, ne remplace pas ces vérifications.
- Chaque bug corrigé doit être reproduit par un test qui échoue avant la correction et passe après, sans modifier son attente pour le faire passer.

## Mémo des pratiques

- Consulte `docs/MEMO-AGENTS.md` lorsqu'une pratique de démarrage, de délégation ou de vérification est pertinente pour la tâche. Les règles obligatoires restent dans ces instructions.
- Enrichis ce mémo lorsqu'une nouvelle leçon pertinente est observée : indique ce qu'il faut faire, ce qu'il faut éviter, pourquoi et un exemple concret. Distingue les observations des recommandations et explicite les limites ; ne généralise pas un essai isolé et n'invente pas l'appréciation de l'utilisateur.
- Réutilise les entrées existantes et reste dans le périmètre du travail autorisé. N'en fais pas un journal de chaque modification et inclus ses mises à jour dans la prochaine PR autorisée.

## Suivi de la roadmap

- À chaque reprise après une fusion confirmée par GitHub ou par l'utilisateur, mets à jour `docs/ROADMAP.md` sans attendre de rappel ni redemander l'accord pour cette mise à jour.
- Coche uniquement les tâches entièrement réalisées par les PR fusionnées et indique leur numéro. Laisse ouverts les éléments partiels, les critères d'apprentissage et les validations humaines tant que l'utilisateur ne les a pas confirmés.
- Inclus ces mises à jour dans la prochaine PR autorisée et assure-toi que la roadmap est suivie par Git. Cette règle n'autorise ni une fusion automatique ni un push direct sur `main`.

## Commits et PR

- Messages de commit et titres de PR en français, au format `type(scope): changement concret` (scope facultatif). Décris le comportement modifié ou la garantie ajoutée, jamais seulement le nom de branche ou une formule générique.
- Le titre de la PR doit être utilisable tel quel comme titre du commit de fusion, sans retouche par l'utilisateur. Exemple : `ci: intégrer l'audit des dépendances aux vérifications locales et CI`.
- GitHub doit reprendre le titre de la PR pour les commits de fusion classique et squash (`merge_commit_title` et `squash_merge_commit_title` : `PR_TITLE`). Si ce réglage manque, signale-le ; ne change pas les réglages du dépôt sans autorisation.

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
