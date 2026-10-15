# Développer un projet avec des agents

Mémo évolutif : démarrer un projet, déléguer son développement et vérifier les résultats. Il sera enrichi avec les leçons d'Atelier bois, pas avec chaque modification du dépôt.

Ce document explique les pratiques. Les règles obligatoires restent dans les [instructions de l'agent](../.github/copilot-instructions.md), les choix de structure dans l'[architecture](../ARCHITECTURE.md) et les décisions dans les [ADR](decisions/0001-stack-node-typescript.md). La [roadmap](ROADMAP.md) décrit la progression, pas une preuve de fiabilité.

## Démarrer un projet de zéro

### Ordre de démarrage

1. Définir le besoin : utilisateur visé, problème concret et résultat observable. Préciser aussi ce que le projet ne doit pas faire.
2. Choisir une première tranche utilisable, assez petite pour être vérifiée. Ne pas demander tout le produit en une seule mission.
3. Identifier les risques et invariants : calculs exacts, données privées, accès réseau, budget et actions irréversibles. Garder les calculs métier en code déterministe lorsque leur exactitude est essentielle.
4. Choisir une stack et une structure minimales selon le besoin. Consigner les décisions importantes et leurs raisons ; ne pas reprendre toute l'architecture d'un autre projet par réflexe.
5. Initialiser un environnement reproductible : version du runtime, manifeste, fichier de verrouillage, exclusions Git et procédure de démarrage. Ne jamais versionner de secret.
6. Écrire les premières instructions de l'agent : périmètre, conventions, validations et opérations nécessitant un accord. Les garder courtes et adaptées au projet.
7. Mettre en place les contrôles locaux et CI, puis protéger la branche principale avec les contrôles requis. Une CI verte n'empêche pas un contournement si la protection manque.
8. Livrer une première fonctionnalité avec ses tests et une PR relue. Vérifier ce parcours avant d'élargir le produit.

### Bonnes et mauvaises pratiques

| À faire | À éviter | Pourquoi et exemple |
| --- | --- | --- |
| Décrire un résultat vérifiable. | « Crée une application complète et robuste. » | Une demande vague laisse l'agent choisir le besoin. Ici : produire une liste de débit à partir d'un projet validé, sans inventer de dimension. |
| Installer les garde-fous dès le premier incrément. | Repousser tests, frontières de couches et sécurité à la fin. | Les premières décisions deviennent des habitudes. Ici, les longueurs sont des entiers validés avant l'arrivée d'un LLM. |
| Commencer avec les dépendances nécessaires. | Ajouter une base, du RAG et plusieurs agents sans usage précis. | Chaque composant ajoute du coût et des modes de panne. Un besoin démontré justifie l'ajout. |
| Exécuter les contrôles dans un environnement reproductible. | Se fier uniquement au succès sur la machine de l'agent. | Les versions et installations peuvent différer. Utiliser le verrouillage des dépendances en CI. |

## Déléguer une tâche

### Les informations utiles

- **Objectif :** comportement attendu et raison du changement.
- **Point de départ :** fichier, fonction, commande en échec ou exemple reproductible.
- **Contrat :** conventions métier, entrées permises et exemples de résultats attendus.
- **Périmètre :** ce qui peut changer et ce qui doit rester intact.
- **Vérification :** tests et commandes à exécuter, avec critères de réussite.
- **Permissions :** autorisation ou non d'ajouter une dépendance, déléguer, commiter, publier une branche ou ouvrir une PR. La fusion reste une décision distincte.

### Exemple de demande

```text
Objectif : corriger le comptage des séparations dans l'exercice eval/length-exercise.ts.
Convention : réserver uniquement les séparations entre pièces, pas la coupe finale.
Cas attendus : aucune pièce ne consomme rien ; une seule pièce ne consomme aucun trait.
Périmètre : exercice et tests associés ; ne pas modifier le domaine de production.
Préserver les signatures, les validations et les tests existants.
Proposer un plan court, puis attendre mon accord avant de modifier les fichiers.
Reproduire le bug par un test, corriger le code et lancer npm run check.
Ne pas commiter, publier ou fusionner sans autorisation.
```

### Bonnes et mauvaises pratiques

| À faire | À éviter | Pourquoi et exemple |
| --- | --- | --- |
| Fournir le contrat et des exemples pertinents. | Donner tout l'historique sans préciser le résultat attendu. | Le contexte utile réduit les ambiguïtés ; son volume seul ne les résout pas. |
| Accepter une clarification quand le besoin est ambigu. | Juger l'agent uniquement à sa vitesse de production de code. | Demander combien de coupes compter peut être plus fiable que choisir une convention au hasard. |
| Déléguer une tâche bornée avec des critères explicites. | Confondre autonomie et permissions illimitées. | L'agent peut exécuter seul tout en s'arrêtant avant une décision métier ou une action non autorisée. |
| Découper les missions quand les risques ou responsabilités diffèrent. | Ajouter des changements sans rapport pour grossir une PR. | Une petite PR cohérente est plus facile à vérifier qu'un assemblage artificiel. |

## Vérifier les résultats

### Tests et contrat métier

| À faire | À éviter | Pourquoi et exemple |
| --- | --- | --- |
| Calculer les attentes à partir du contrat, indépendamment du code testé. | Recopier la formule de production dans le test pour obtenir l'attente. | Le test pourrait reproduire exactement la même erreur. |
| Tester le cas nominal, les limites et les interprétations concurrentes. | Assimiler une couverture de 100 % à une garantie de correction. | Une formule peut être exécutée sans que ses erreurs soient observables dans les cas choisis. |
| Reproduire le bug avant de le corriger, puis conserver le test. | Modifier l'attente pour rendre le test vert. | La séquence échec puis succès montre que le test détecte effectivement ce défaut. |
| Confirmer le périmètre du rapport de couverture. | Lire un pourcentage comme s'il concernait tout le dépôt. | Ici, le seuil et le rapport portent sur le domaine ; l'exercice dans eval/ n'en fait pas partie. |

Les tests de mutation peuvent compléter ces contrôles : une modification volontaire d'une formule devrait faire échouer les tests pertinents. Ils ne sont pas installés dans ce projet et ne remplacent pas un contrat métier correct.

### Revue et livraison

- Relire les hypothèses métier, les attentes des tests et les effets du changement, pas seulement son style.
- Vérifier les résultats des commandes, le diff et les fichiers réellement inclus dans le commit. Un fichier indexé n'est ni commité ni publié.
- Donner au commit et à la PR un titre qui décrit le changement concret, en français et au format prévu par le projet.
- Vérifier que GitHub reprend le titre de la PR pour les commits de fusion classique et squash. Un bon titre de commit local ne corrige pas le message de fusion généré par GitHub ; les réglages du dépôt nécessitent une autorisation et une vérification après modification.
- Après une fusion confirmée, mettre à jour les tâches effectivement terminées avec le numéro de PR. Ne pas transformer une livraison technique en validation automatique d'un apprentissage ou d'un critère humain.

## Leçons observées dans Atelier bois

### Couverture et cas discriminants

**Observation :** dans l'exercice pédagogique, six tests passaient avant correction. Les cas avec des pièces non vides utilisaient un trait de scie nul : ils ne distinguaient pas un trait par pièce d'un trait par séparation.

**Ce qui a aidé :** ajouter des cas avec un trait non nul, dont une seule pièce. Quatre tests ont alors échoué ; corriger le comptage les a fait passer sans changer les attentes.

**Limite :** cet exercice ne démontre pas qu'un plan de découpe réel est correct. Il ignore volontairement la coupe finale et n'appartient pas au domaine de production.

### Contexte minimal et contexte riche

**Observation :** deux agents ont reçu le même code fautif, sans accès au dépôt ni à l'historique. Avec le seul symptôme, le premier a demandé la convention de coupe et proposé des corrections conditionnelles. Avec la convention et les résultats attendus, le second a proposé directement la correction correspondant à l'exercice.

**Ce qu'on en retient :** une clarification est un résultat utile. Pour un calcul métier, le contrat et les exemples apportent davantage qu'une demande générale de « corriger le bug ».

**Limite :** un seul essai pédagogique ne mesure pas une fiabilité générale. Les agents n'ont pas exécuté de tests ; leur proposition a été vérifiée séparément sur l'exercice.

### Vérifications locales et CI

**Observation :** la CI exécutait initialement l'audit des dépendances après npm run check, tandis que la commande locale l'omettait. La PR #2 a intégré cet audit à la commande commune et supprimé le doublon du workflow.

**Ce qu'on en retient :** aligner les commandes réduit les surprises entre local et CI, sans garantir que les environnements sont identiques. L'audit rend désormais la commande complète dépendante du réseau.

## Faire vivre ce mémo

Ajouter ou préciser une pratique lorsqu'une nouvelle leçon pertinente apparaît. Préférer enrichir une entrée existante à créer une répétition. Pour un retour d'expérience, indiquer l'observation, ce qui a aidé et ses limites ; ne pas attribuer à l'utilisateur une appréciation qu'il n'a pas exprimée.

Ce mémo n'est ni un journal exhaustif, ni une preuve que la roadmap est terminée, ni un remplacement de la revue humaine.