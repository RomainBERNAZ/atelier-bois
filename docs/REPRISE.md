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

## PR #3 fusionnée et état local

La [PR #3](https://github.com/RomainBERNAZ/atelier-bois/pull/3) est fusionnée : confirmation par l'API GitHub le 15 octobre 2026, commit de fusion `79b97190290abc0d4129b5db6bb8edde79c6c4f4`.

Elle livre l'exercice et ses onze tests, les instructions, la roadmap, le mémo et ce document. Les sessions 2 et 3 sont désormais cochées avec le numéro de PR. L'utilisateur a aussi validé la session 5 le 15 octobre 2026.

`main` local a été synchronisé par avance rapide avec `origin/main`. La modification locale de la roadmap a été préservée par une mise en réserve temporaire puis restaurée. L'utilisateur a autorisé le 15 octobre 2026 la publication des cinq fichiers en attente : documentation, bilan et exercice de boucle simulée avec ses tests. Ils sont destinés à une PR sur la branche `test/publish-agent-loop-exercise` ; vérifier son état avant la reprise. Ne pas supprimer ou réinitialiser d'éventuels changements locaux.

## Exercices réalisés

- Refactoring isolé : suppression de deux accumulations dupliquées, réutilisation de `sumLengths()` et du calcul de longueur nécessaire. Les six tests initiaux ont passé avant et après, sans modification.
- Bug pédagogique : le calcul comptait un trait de scie par pièce. Quatre tests de régression ont échoué avant correction puis passé avec `Math.max(0, lengths.length - 1)`, sans changer leurs attentes.
- Convention propre à l'exercice : seules les séparations entre pièces sont réservées, jamais la coupe finale. Le reste est théorique ; ce n'est pas un plan de découpe réel.
- Comparaison autorisée de deux agents sans accès au dépôt : contexte minimal, demande de clarification ; contexte riche avec convention et attentes, correction directement proposée. Les agents n'ont pas exécuté les tests ; vérification effectuée séparément. Un essai ne prouve pas une fiabilité générale.

## Préparation de semaine 2 : boucle simulée

L'utilisateur a choisi de continuer dans le chat et a validé un exercice isolé dans `eval/`, sans dépendance, connexion CLI ni appel au modèle. Ce choix ne remplace pas le livrable réel prévu dans `experiments/` et ne valide pas les cases de semaine 2.

- [Exercice de boucle](../eval/agent-loop-exercise.ts) : modèle injecté, scénario prédéfini et historique explicite. Deux outils autorisés, `validate_length` et `sum_lengths`, réutilisent `mm()` et `sumLengths()` ; leurs arguments et les réponses du faux modèle sont validés avant usage.
- [Tests de boucle](../eval/agent-loop-exercise.test.ts) : 28 cas. Le premier montre une demande, la validation d'une longueur, la somme des longueurs, les résultats transmis au faux modèle et la réponse finale. Les autres couvrent les entrées invalides, un outil inconnu, une somme hors entiers sûrs, un scénario épuisé et une limite d'appels.
- La limite compte tous les appels au faux modèle, réponse finale comprise. Les erreurs arrêtent l'exercice ; aucune commande issue du modèle n'est exécutée.
- Limites : aucune décision réelle de LLM, aucun schéma Zod, aucun réseau ni MCP. La réponse finale est du texte prédéfini, pas un calcul ; la simulation ne garantit pas l'absence de nombres inventés par un futur vrai modèle.

Pour rejouer la démonstration : `npm test -- eval/agent-loop-exercise.test.ts`. Lire le premier test avec l'utilisateur avant de connecter un vrai modèle.

Copilot CLI est présent dans WSL en version `1.0.98`. La connexion y signale un stockage de jeton en clair : `libsecret` et GNOME Keyring sont absents, tandis que D-Bus fonctionne. Aucun composant de trousseau n'a été installé pendant le diagnostic. L'utilisateur prévoit de cloner le projet côté Windows et d'utiliser la CLI native avec le Gestionnaire d'identifiants Windows ; ne pas accepter le stockage en clair ni lancer une connexion à sa place. Le SDK n'est pas une dépendance du projet et l'accès organisationnel au CLI reste non confirmé. Le SDK Copilot permet un accès programmatique avec un abonnement éligible, distinct d'une clé API OpenAI ou Anthropic ; ne pas imposer un nouvel abonnement sans examiner cette possibilité.

## Vérifications et validations restantes

Les contrôles incluent désormais les tests de la boucle simulée : `npm run check` a réussi le 15 octobre 2026 avec 54 tests, une couverture du domaine de 100 % et aucune vulnérabilité détectée. Le rapport de couverture reste limité au domaine, pas à `eval/`. Relancer `npm run check` après de nouvelles modifications et avant publication.

Les cinq sessions sont réalisées et le [bilan de dix lignes](journal/bilan-semaine-1.md) est rédigé. Retour personnel de l'utilisateur : « Pour le moment rien ne me semble flou puisque nous ne sommes qu'au début. » Il a ensuite accepté de clôturer la semaine 1 sur cette base et de préparer le mini-agent de semaine 2. Le recul sur la fiabilité des agents reste à construire ; ne pas présenter le critère comme démontré pour chaque type de tâche.

## Réglages GitHub confirmés

Après l'échec HTTP 422 de la précédente session, la configuration autorisée a réussi le 15 octobre 2026 et a été relue par un GET indépendant : `merge_commit_title=PR_TITLE`, `squash_merge_commit_title=PR_TITLE`. Le champ compagnon `merge_commit_message` est passé de `PR_TITLE` à `PR_BODY`. Le corps squash reste `COMMIT_MESSAGES` ; les options autorisant les fusions classiques et squash sont inchangées. La cause exacte de l'ancien HTTP 422 n'a pas été reproduite.

Les commits et titres de PR doivent être français, au format `type(scope): changement concret`. Ne pas utiliser un nom de branche comme description.

La CLI `gh` était absente. Git HTTPS et la création de PR par API ont fonctionné. Ne jamais afficher ou enregistrer les identifiants d'authentification.

## Prochaine conversation

1. Vérifier `git status`, les différences locales et les instructions actuelles.
2. Expliquer le premier test de la boucle simulée avec l'utilisateur : qui choisit l'outil, qui calcule et comment le résultat revient au modèle. Ensuite seulement, cadrer le branchement d'un vrai modèle. La roadmap prévoit `experiments/`, absent de l'architecture actuelle : obtenir l'accord pour sa création et sa configuration, ainsi que pour toute dépendance ou modification de fichier protégé.
3. Vérifier la PR de `test/publish-agent-loop-exercise`. Après sa fusion par l'utilisateur, un `git pull` sur `main` côté Windows récupérera les changements ; utiliser `npm ci` pour installer les dépendances propres à Windows. Une nouvelle PR ou une fusion nécessite une autorisation distincte. Ne pas pousser directement sur `main`.
4. L'accord de préparation de semaine 2 n'autorise ni l'installation de dépendances, ni des appels LLM payants, ni la création d'un serveur MCP sans cadrage validé.

Actualiser cette synthèse avant de changer de conversation lorsque l'état du projet évolue. Garder ici les faits utiles à la reprise, pas un historique exhaustif ; ne pas y stocker de secrets.