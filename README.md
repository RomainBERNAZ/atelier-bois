# Atelier bois

Assistant de projets bois : tu décris ce que tu veux construire, l'agent produit une liste de débit optimisée, un chiffrage par palier de budget et une liste de courses.

> **Avertissement :** cet outil n'est pas fiable pour le dimensionnement structurel (garde-corps, mezzanine, tout ce qui porte des personnes). Il ne remplace ni les règles de l'art ni un professionnel.

Statut : phase 0 (fondations). Ce README sera réécrit en phase 7.

## Démarrer

```bash
nvm use            # Node 22 (voir .nvmrc)
npm install
npm run check      # typecheck + lint + tests + couverture
```

## Méthode

- Architecture et couches : `ARCHITECTURE.md`
- Décisions : `docs/decisions/`
- Une spec avant chaque tâche : copier `docs/specs/_template.md`
- Instructions pour l'agent : `.github/copilot-instructions.md`
- Carnet de bord : `docs/journal/_template.md`

Règle de base : `npm run check` doit passer avant chaque commit, et la CI est bloquante.
