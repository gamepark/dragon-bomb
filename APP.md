# Revue de conformité — `app/` vs `rules-fr.pdf` + doc Game Park

Revue statique de `app/src` (locators, descriptions, headers, traductions) en la comparant aux règles du PDF et aux conventions documentées sur [gamepark.github.io](https://gamepark.github.io).

**Statut : tous les points relevés ont été corrigés** (voir « Correctifs appliqués » ci-dessous). Les points « non vérifié visuellement » restent à confirmer dans le navigateur.

## Correctifs appliqués

### 1. Deux vraies erreurs de compilation (jamais détectées jusqu'ici)

La commande utilisée jusque-là pour vérifier `app/` (`tsc --noEmit -p .`) ne vérifiait en réalité rien : le `tsconfig.json` racine d'`app/` a `"files": []` et ne fait que référencer `tsconfig.app.json`/`tsconfig.node.json` via `references` — sans le flag `-b`, ces références ne sont jamais suivies. La vraie commande de build est `tsc -b` (celle utilisée par `yarn build`), qui révélait :

- `Locators.ts` importait un `PlayerColor` inexistant dans `rules/src` (reliquat de template) → remplacé par `number` dans `Locator<number, MaterialType, LocationType>`.
- `PlayerHandLocator.getCoordinates` était annoté en retour `: Coordinates` (complet) au lieu de `Partial<Coordinates>` (comme la classe de base) alors que le corps ne renvoie que `{x, y}` → annotation corrigée.

`tsc -b --force` passe maintenant sans erreur.

### 2. Emplacement `RevealArea` mort

Supprimé des deux côtés : `LocationType.RevealArea` (rules), sa stratégie dans `DragonBombRules.locationsStrategies` (rules), `RevealAreaLocator.ts` (app, fichier supprimé) et sa référence dans `Locators.ts` (app). Le mécanisme de révélation en place (`rotation: false` sur `SelectionArea`) n'en avait plus besoin depuis plusieurs itérations.

### 3. Traductions du formulaire de sélection des joueurs manquantes

Clés `player.id`, `player.1` … `player.6` ré-ajoutées dans `fr.json` (« Couleur », « Bleu », « Rouge », « Vert », « Jaune », « Violet », « Orange »).

### 4. Convention des headers : migration vers `.you`/`.player`/`.players`

Les 4 headers liés à un tour de joueur (`ChooseFirecrackerHeader`, `DistributeHeader`, `PlaceRocketHeader`, `ExplosionHeader`) utilisent maintenant le composant standard `HeaderText` du framework au lieu d'une logique `.mine`/`.others` maison. Traductions renommées/complétées en conséquence dans `fr.json` (chaque header a maintenant ses 3 clés `.you`/`.player`/`.players`, y compris le cas « nommer l'unique adversaire actif » qui manquait avant).

Les 3 headers des règles entièrement automatiques (`CompleteDragonRowHeader`, `CompletePlayersHandsHeader`, `EndOfRoundHeader`) sont **restés inchangés** (texte statique simple) : ces règles démarrent via `startRule`/`startSimultaneousRule` sans qu'aucun joueur précis ne soit « actif » à proprement parler (rien à cliquer), et `HeaderText` s'appuie sur `rules.activePlayers` — y basculer aurait fait disparaître le header pour `CompleteDragonRow`/`CompletePlayersHands` (démarrées via `startRule`, donc `activePlayers` vide).

## ⚠️ Non vérifié visuellement (nécessite un test dans le navigateur)

- Le drag & drop pour choisir l'emplacement d'une Fusée (`PlaceRocketRule`).
- Le rendu des 4 headers migrés vers `HeaderText` (texte, interpolation `{player}`, cas `.player` avec un seul adversaire nommé).
- Le rendu du marqueur Double Pétard et de la pile de cartes capturées (`DeckLocator`).
- Toute animation (placement automatique, explosion, redistribution de manche).

## Non couvert par cette revue

Assets graphiques, sons, Tutoriel/IA (`Tutorial`/`GameAI`, non implémentés — probablement hors scope à ce stade du développement).
