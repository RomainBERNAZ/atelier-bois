# Feuille de route

> Référence : le document « Plan de formation : assistant projets bois, jusqu'à la production » (sur claude.ai). Ce fichier n'en est que la version à cocher, à garder dans le dépôt (`docs/ROADMAP.md`).
> Les dates supposent un départ le lundi 19 octobre 2026 et ne comptent aucune marge. Prévois une à deux semaines de plus autour des fêtes, et une semaine de rattrapage dès qu'un critère de réussite n'est pas atteint.

## Phase 0 : cadrage (14 octobre, fait)

- [x] Dépôt perso avec garde-fous, CI verte, instructions pour l'agent
- [x] Stack choisie : Node et TypeScript
- [x] ADR 0001 passé à « acceptée »
- [x] Branche `main` protégée (contrôle « check » obligatoire)

## Phase 1 : fondations LLM et agents

### Semaine 1 (19 au 25 octobre) : agent mode en conditions réelles

- [x] Session 1 : tests d'une fonction existante (PR #1 fusionnée)
- [x] Session 2 : refactoring local (exercice isolé réalisé dans `eval/length-exercise.ts`, PR #3 fusionnée)
- [x] Session 3 : correction d'un bug, contexte minimal puis riche (bug reproduit et corrigé, comparaison de deux agents réalisée ; PR #3 fusionnée)
- [x] Session 4 : script ou changement de CI ou d'infra (PR #2 fusionnée)
- [x] Session 5 : tâche multi-fichiers avec plan validé (PR #3 fusionnée ; validation humaine confirmée le 15 octobre 2026)
- [x] Bilan écrit ([bilan de semaine 1](journal/bilan-semaine-1.md), dix lignes au plus)

**Critère :** pour chaque type de tâche, tu sais dire si l'agent est fiable, quel contexte lui donner et ce que tu relis.

**Clôture :** semaine 1 clôturée avec l'accord de l'utilisateur le 15 octobre 2026 ; préparation de la semaine 2 autorisée. Rien ne lui semble flou à ce stade ; le recul sur la fiabilité des agents reste à construire, sans considérer le critère comme démontré pour chaque type de tâche.

**Supports réalisés :** [mémo des pratiques](MEMO-AGENTS.md) et [document de reprise](REPRISE.md). Ces supports ne remplacent pas le bilan ni la validation du critère d'apprentissage.

### Semaine 2 (26 octobre au 1er novembre) : le plus petit agent possible

- [x] Lire « Building effective agents » (Anthropic) et la documentation de tool use du fournisseur choisi
- [x] Boucle d'agent minimale : un modèle, deux outils simples, résultat renvoyé au modèle (mini-agent Copilot exécuté une fois ; branche locale prête à publier)
- [x] Arguments des outils du modèle validés par schéma (Zod) avant exécution (parsers et tests ; branche locale prête à publier)
- [ ] Mesure des tokens, de la fenêtre de contexte et du prompt caching
- [ ] Principe du MCP et un outil exposé par un serveur MCP minimal

**Coches anticipées :** ces deux tâches sont cochées avant fusion avec l'accord explicite de l'utilisateur ; elles ne signifient pas que la PR est ouverte ou fusionnée. La publication attend la résolution de l'authentification GitHub.

**Livrable :** une dizaine d'entrées de carnet (à rédiger) et le mini-agent dans `experiments/` (présent et couvert par lint et typecheck).
**Critère :** tu expliques la boucle d'un agent et pourquoi un calcul passe par un outil.

## Phase 2 : MVP liste de débit et découpe (2 au 22 novembre)

- [ ] Semaine 3 : domaine (pièce, planche, projet), gabarit d'étagère, outil `generate_cut_list`
- [ ] Semaine 4 : découpe 1D (First Fit Decreasing, trait de scie), tests de propriétés
- [ ] Semaine 5 : agent autour des outils, 10 premiers cas d'évaluation en CI

**Livrable :** une API ou un CLI qui produit une liste de débit optimisée.
**Critère :** tu construis réellement l'étagère à partir de la liste, sans erreur de coupe.
**Point de contrôle (fin semaine 5).**

## Phase 3 : catalogue, chiffrage et budgets (23 novembre au 13 décembre)

- [ ] Semaine 6 : schéma SQL, 50 à 100 références, `PriceProvider`, outil `quote_project`
- [ ] Semaine 7 : paliers éco, standard, premium, outil `fit_budget`
- [ ] Semaine 8 : multi-enseignes (deux au maximum), liste de courses, évaluation complétée

**Livrable :** chiffrage par palier, liste de courses par enseigne, une vingtaine de cas d'évaluation.
**Critère :** zéro prix inventé sur l'ensemble des cas.
**Point de contrôle (fin semaine 8).**

## Phase 4 : base d'atelier et RAG (14 au 27 décembre)

- [ ] Semaine 9 : tables d'atelier (outils, stock, chutes), outils `list_workshop_tools` et `find_offcuts`
- [ ] Semaine 10 : corpus sous licence libre, pgvector, citations obligatoires, mesure de la récupération

**Critère :** chaque conseil technique porte une source, et une question hors corpus reçoit « je ne sais pas ».

## Phase 5 : évaluation, observabilité, sécurité (28 décembre au 10 janvier)

- [ ] Semaine 11 : évaluation en deux familles, logs structurés, traces, tableau de bord, **modèle de menaces écrit**
- [ ] Semaine 12 : injection de prompt, moindre privilège, quotas, coupe-circuit, panne du fournisseur, cas d'attaque

**Critère :** une dégradation volontaire du prompt est détectée et bloquée par la CI.
**Point de contrôle (fin semaine 12).**

## Phase 6 : conteneurs, infra, mise en production (11 au 31 janvier)

- [ ] Semaine 13 : images Docker, `docker-compose`, front Angular
- [ ] Semaine 14 : Terraform, reverse proxy avec TLS, chaîne CI/CD, rollback
- [ ] Semaine 15 : sauvegardes testées, supervision, runbook, bêta fermée

**Critère :** un commit sur `main` arrive en production sans intervention, le rollback fonctionne, la restauration d'une sauvegarde a été testée.
**Point de contrôle (fin semaine 15).**

## Phase 7 : visibilité (1er au 7 février)

- [ ] README complet, démonstration, article, CV mis à jour, trois histoires d'entretien

## Porte d'ouverture à d'autres utilisateurs

Tant qu'une case reste vide, l'accès reste privé.

- [ ] Modèle de menaces écrit et relu
- [ ] Quotas, plafonds et coupe-circuit actifs
- [ ] Isolation des données testée entre deux comptes
- [ ] Cas d'attaque et scans de sécurité verts en CI
- [ ] Obligations RGPD et mentions légales vérifiées