# 0003. Longueurs en millimètres entiers

- Statut : acceptée
- Date : 2026-10-14

## Contexte

La découpe additionne et compare beaucoup de longueurs, avec un trait de scie. Les flottants produisent des écarts invisibles (0,1 + 0,2 ≠ 0,3) qui font échouer des tests ou perdre une pièce.

## Décision

Toute longueur est un entier positif ou nul en millimètres, représenté par le type `Millimetres` (`src/domain/length.ts`). Les conversions (cm, m, pouces) se font aux frontières, avec arrondi explicite. Les montants seront de même en centimes entiers.

## Raisons et alternatives écartées

Les entiers sont exacts, comparables et sérialisables sans surprise. Alternative écartée : flottants en mètres, plus lisibles mais source d'erreurs d'arrondi.

## Conséquences

Les entrées en cm ou en pouces sont converties et arrondies à l'entrée, et l'arrondi est documenté dans la spec de l'outil concerné.
