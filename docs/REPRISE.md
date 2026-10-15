# Reprendre le projet

État au 15 octobre 2026. Ce document transmet le contexte entre conversations ; vérifier les fichiers et l'état Git avant d'agir, car cette synthèse peut devenir périmée.

## Objectif et méthode

L'utilisateur veut maîtriser la délégation aux agents : ils exécutent les tâches, il relit et valide les PR. Le projet sert de support de formation pour monter en compétence au sein de l'entreprise. Semaine 1 clôturée avec son accord le 15 octobre 2026 ; premier exercice simulé de semaine 2 validé et implémenté, mini-agent réel encore à cadrer.

Lire les [instructions](../.github/copilot-instructions.md), l'[architecture](../ARCHITECTURE.md) et la [roadmap](ROADMAP.md). Le [mémo des pratiques](MEMO-AGENTS.md) contient les leçons détaillées.

Proposer un plan court et attendre sa validation avant de coder. Ne pas confondre cette validation avec une autorisation de créer une branche, commiter, publier ou fusionner. Préserver tous les changements locaux.

## Déjà fusionné

- Phase 0 terminée ; protection de `main` confirmée par l'utilisateur.
- [PR #1](https://github.com/RomainBERNAZ/atelier-bois/pull/1) : tests des limites des longueurs et de la non-mutation. Quinze tests de domaine.
- [PR #2](https://github.com/RomainBERNAZ/atelier-bois/pull/2) : audit des dépendances intégré à `npm run check`, sans doublon dans la CI. La commande nécessite désormais un accès réseau pour l'audit.

## PR #3 et PR #4 fusionnées, état local

La [PR #3](https://github.com/RomainBERNAZ/atelier-bois/pull/3) est fusionnée : confirmation par l'API GitHub le 15 octobre 2026, commit de fusion `79b97190290abc0d4129b5db6bb8edde79c6c4f4`.

Elle livre l'exercice de longueur et ses onze tests, les instructions, la roadmap, le mémo et ce document. Les sessions 2 et 3 sont cochées avec le numéro de PR. L'utilisateur a aussi validé la session 5 le 15 octobre 2026.

La [PR #4](https://github.com/RomainBERNAZ/atelier-bois/pull/4) est fusionnée le 15 octobre 2026, commit `a9dceb15db4a59167d051fa03c5b8496b64d4115`. Elle publie l'exercice de boucle simulée et ses 28 tests, le bilan de semaine 1 et les mises à jour documentaires. La roadmap intégrée laisse ouvertes les tâches du mini-agent réel.

Au 15 octobre 2026, `main` local est synchronisé avec `origin/main` à ce commit et l'arbre de travail est propre. La publication de la branche `test/publish-agent-loop-exercise` est terminée ; aucune PR de cette branche n'est en attente.

## Exercices réalisés

- Refactoring isolé : suppression de deux accumulations dupliquées, réutilisation de `sumLengths()` et du calcul de longueur nécessaire. Les six tests initiaux ont passé avant et après, sans modification.
- Bug pédagogique : le calcul comptait un trait de scie par pièce. Quatre tests de régression ont échoué avant correction puis passé avec `Math.max(0, lengths.length - 1)`, sans changer leurs attentes.
- Convention propre à l'exercice : seules les séparations entre pièces sont réservées, jamais la coupe finale. Le reste est théorique ; ce n'est pas un plan de découpe réel.
- Comparaison autorisée de deux agents sans accès au dépôt : contexte minimal, demande de clarification ; contexte riche avec convention et attentes, correction directement proposée. Les agents n'ont pas exécuté les tests ; vérification effectuée séparément. Un essai ne prouve pas une fiabilité générale.

## Semaine 2 : simulation et mini-agent réel

L'utilisateur a d'abord validé un exercice isolé dans `eval/`, puis a autorisé l'installation du SDK et la création du mini-agent dans `experiments/`. La simulation reste pédagogique ; elle ne remplace pas l'essai réel, exécuté une fois le 15 octobre 2026.

- [Exercice de boucle](../eval/agent-loop-exercise.ts) : modèle injecté, scénario prédéfini et historique explicite. Deux outils déterministes réutilisent `mm()` et `sumLengths()`.
- [Tests de boucle](../eval/agent-loop-exercise.test.ts) : 28 cas. Le premier montre la demande, les deux appels d'outils, les résultats transmis au modèle simulé et sa réponse finale ; les autres couvrent les entrées invalides, un outil inconnu, une somme hors entiers sûrs, un scénario épuisé et une limite d'appels.
- [Mini-agent réel](../experiments/copilot-agent.ts) : SDK Copilot, modèle `auto`, deux outils métier avec schémas Zod, allowlist exacte par `ToolSet` et refus des autres permissions. Chaque handler appelle `parse()` avant le calcul du domaine.
- [Lanceur](../experiments/run-copilot-agent.ts) : `npm.cmd run agent:demo`. Le lancement réel a appelé `validate_length` (400 mm), puis `sum_lengths` (1000 mm), et le modèle a repris ces résultats. Cet appel a consommé du quota.
- Le statut d'authentification SDK était faux en mode `empty`, puis vrai (`user`) en mode `copilot-cli` avec le dossier Copilot habituel. Aucun jeton n'a été lu ou journalisé.
- La réponse finale reste du texte libre ; cette démonstration ne garantit pas qu'un modèle n'inventera jamais un nombre. Les mesures de tokens/contexte/caching, MCP et les entrées de carnet restent à faire.

Les deux tâches de boucle minimale et de validation Zod des arguments d'outils sont cochées avant fusion, avec l'accord explicite de l'utilisateur. C'est une exception ponctuelle ; les autres coches restent soumises aux consignes du dépôt. Le commit `cf77332` est conservé localement sur `feat/copilot-sdk-agent` ; le push a échoué avec HTTP 403 et le navigateur intégré est déconnecté. Aucune PR n'est encore ouverte.

Pour rejouer les tests simulés : `npm.cmd test -- eval/agent-loop-exercise.test.ts`. Pour lancer l'appel réel : `npm.cmd run agent:demo` ; il utilise du quota.

## Vérifications et validations restantes

Dernier `npm.cmd run check` réussi le 15 octobre 2026 : 57 tests, lint et typecheck verts, couverture du domaine à 100 % et aucune vulnérabilité détectée. La couverture concerne `src/domain`, pas `eval/` ni `experiments/`. Relancer `npm.cmd run check` après les modifications documentaires et avant publication.

Les cinq sessions sont réalisées et le [bilan de dix lignes](journal/bilan-semaine-1.md) est rédigé. Retour personnel de l'utilisateur : « Pour le moment rien ne me semble flou puisque nous ne sommes qu'au début. » Il a ensuite accepté de clôturer la semaine 1 sur cette base et de préparer le mini-agent de semaine 2. Le recul sur la fiabilité des agents reste à construire ; ne pas présenter le critère comme démontré pour chaque type de tâche.

## Réglages GitHub confirmés

Après l'échec HTTP 422 de la précédente session, la configuration autorisée a réussi le 15 octobre 2026 et a été relue par un GET indépendant : `merge_commit_title=PR_TITLE`, `squash_merge_commit_title=PR_TITLE`. Le champ compagnon `merge_commit_message` est passé de `PR_TITLE` à `PR_BODY`. Le corps squash reste `COMMIT_MESSAGES` ; les options autorisant les fusions classiques et squash sont inchangées. La cause exacte de l'ancien HTTP 422 n'a pas été reproduite.

Les commits et titres de PR doivent être français, au format `type(scope): changement concret`. Ne pas utiliser un nom de branche comme description.

La CLI `gh` était absente. Git HTTPS et la création de PR par API ont fonctionné. Ne jamais afficher ou enregistrer les identifiants d'authentification.

## Prochaine reprise

1. Après authentification GitHub avec un compte ayant les droits d'écriture sur le dépôt, publier `feat/copilot-sdk-agent` et créer la PR associée. Le commit est localement prêt ; ne pas fusionner sans décision de l'utilisateur.
2. La roadmap coche par anticipation, avec accord explicite, la boucle réelle et la validation Zod des arguments d'outils ; les coches ne signifient pas que la PR est fusionnée.
3. Il reste à mesurer les tokens, la fenêtre de contexte et le prompt caching, puis à étudier MCP et son outil minimal.
4. Rédiger une dizaine d'entrées de carnet et recueillir la validation personnelle du critère d'apprentissage. Ne pas considérer le critère comme acquis sans confirmation.

Actualiser cette synthèse avant de changer de conversation lorsque l'état du projet évolue. Garder ici les faits utiles à la reprise, pas un historique exhaustif ; ne pas y stocker de secrets.