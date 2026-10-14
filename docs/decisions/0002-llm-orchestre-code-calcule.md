# 0002. Le LLM orchestre, le code calcule

- Statut : acceptée
- Date : 2026-10-14

## Contexte

Les LLM se trompent en calcul, en géométrie et sur les prix, et leurs erreurs sont plausibles donc difficiles à repérer.

## Décision

Le modèle ne produit jamais de dimension, de quantité, de prix ni de total. Il appelle des outils déterministes qui lisent les données et calculent. Un article absent du catalogue donne « prix inconnu », jamais une estimation.

## Raisons et alternatives écartées

Seule cette séparation rend les sorties vérifiables automatiquement (somme des lignes, pièces contenues dans les planches, prix présents au catalogue), donc évaluables en CI. Alternative écartée : laisser le modèle calculer puis vérifier après coup, ce qui masque les erreurs au lieu de les empêcher.

## Conséquences

Chaque capacité chiffrée est un outil avec son schéma d'entrée et ses tests. L'évaluation contrôle qu'aucun nombre de la réponse n'a une autre origine qu'un résultat d'outil.
