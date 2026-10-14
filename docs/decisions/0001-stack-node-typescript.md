# 0001. API en Node et TypeScript

- Statut : acceptée
- Date : 2026-10-14

## Contexte

Le projet est une API qui fait tourner une boucle d'agent autour d'un fournisseur de LLM, avec des outils déterministes et une base PostgreSQL. Le front sera en Angular.

## Décision

API en Node.js (22 ou plus) et TypeScript strict, tests avec Vitest.

## Raisons et alternatives écartées

- Les SDK des fournisseurs de LLM, la validation par schéma (Zod) et l'outillage d'évaluation sont très bien servis en TypeScript, et l'itération est rapide.
- Un seul langage entre l'API et le front Angular.
- Java reste une alternative sérieuse si tu veux valoriser ton profil Java en entretien : le coût est un outillage LLM un peu moins direct. Si tu choisis Java, ce kit doit être refait côté configuration (Maven ou Gradle, Checkstyle, ArchUnit pour les frontières de couches), mais la méthode et `ARCHITECTURE.md` restent valables.

## Conséquences

Le typage strict et les schémas aux frontières remplacent une partie de la sécurité qu'offre un langage plus verbeux. Les frontières de couches sont vérifiées par ESLint.
