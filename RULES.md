# Revue de conformité — `rules/` vs `app/public/rules-fr.pdf`

Comparaison ligne à ligne du module `rules/src` avec les règles du PDF. Sauf mention contraire, chaque point de règle listé ci-dessous est **implémenté correctement**.

## ✅ Ce qui est conforme

- **Mise en place** (`DragonBombSetup.ts`) : paquets Dragon/Pétards mélangés, `rowSize` cartes Corps de Dragon placées (nombre de joueurs, ou 4 en partie à 2), 3 cartes Pétards distribuées à chaque joueur (4 en partie à 2).
- **Étape 1 — Choix de cartes Pétard** (`ChooseFirecrackerRule.ts`) : sélection simultanée face cachée, révélation simultanée, 1 carte par joueur (2 en partie à 2 via `cardsToChoose`).
- **Étape 2 — Répartition** (`ChooseFirecrackerRule` pour l'ordre, `DistributeRule.ts` pour la pose) : tri par puissance croissante puis par nombre de lanternes croissant en cas d'égalité ; pose de gauche à droite ; somme des puissances vérifiée dès qu'une carte est posée (`DistributionFlow.resolveSlot`) ; capture face visible + défausse des Pétards associés si le seuil de vitalité est atteint (`ExplosionRule.ts`).
- **Étape 3 — Compléter le corps du dragon** (`CompleteDragonRowRule.ts`, `DragonRowStrategy.ts`) : pioche des cartes manquantes, ré-ordonnancement croissant automatique. Si le paquet Dragon ne suffit pas à combler **tous** les emplacements vides, la manche s'arrête immédiatement (pas de remplissage partiel) et saute même l'étape 4, conformément au texte.
- **Étape 4 — Refaire sa main** (`CompletePlayersHandsRule.ts`) : pioche jusqu'à la limite de main, remélange de la défausse si le paquet est vide.
- **Fin de manche** (`EndOfRoundRule.ts`) : redistribution complète façon mise en place initiale (cartes Dragon et Pétards remises dans leurs paquets respectifs, remélangées, redistribuées) pour démarrer une nouvelle manche. Le score n'est plus « noté à la fin de la manche » comme au texte, mais accumulé en continu à chaque capture (`Memory.Score`, mis à jour dans `ExplosionRule`) — écart volontaire demandé en cours de route, fonctionnellement équivalent.
- **Fin de partie (seuil)** : `EndOfRoundRule` déclenche `endGame()` dès qu'un joueur atteint 50 points en fin de manche.
- **Départage des égalités en fin de partie** : `DragonBombRules.getTieBreaker()` départage par le moins de cartes Corps de Dragon capturées ; si toujours égal, `undefined` est renvoyé dès le niveau 2, laissant la plateforme déclarer tous les joueurs encore à égalité vainqueurs.
- **Règles à 2 joueurs** : `rowSize = 4`, limite de main = 4, `cardsToChoose = 2` — tous branchés sur `players.length === 2`.
- **Cartes Pétards spéciales** :
  - *Chapelet de pétards* (`DistributeRule.drawChapeletBonus`) : pioche une carte bonus sur le même emplacement, remélange la défausse si besoin, effet spécial de la carte piochée jamais activé (marquage `rotation: true`, exclu du calcul de doublement et de toute pioche en chaîne).
  - *Fusée* (`PlaceRocketRule.ts`) : mise à l'écart de l'ordre automatique, posée en dernier, choix libre du joueur parmi les emplacements Corps de Dragon encore présents.
  - *Double pétard* (`ExplosionRule.ts`) : double les points de victoire (négatifs compris) et va au marqueur face caché **uniquement** si c'est elle la carte qui vient de déclencher l'explosion (recherche du `x` le plus élevé parmi les cartes non « suppressed »), pas une carte laissée d'une manche précédente.
- **Cartes Corps de Dragon spéciales** : « 4 » retire 3 points (`dragonVictoryPoints`), « 13 » donne +1 limite de main tant qu'elle est en possession du joueur (`HandLimit.ts`, dérivé de `PlayerCapturedDragon`, se réinitialise naturellement à la manche suivante puisque la carte retourne au paquet avant la redistribution des mains).

## ⚠️ Angle mort théorique (à la marge des règles)

- **Repioche de main quand paquet *et* défausse sont vides en même temps** (`CompletePlayersHandsRule.dealNextCard`) : si le paquet Pétards est vide et qu'il n'y a rien à remélanger, la règle passe la main directement à l'étape suivante sans forcer tout le monde à atteindre sa limite. Le PDF ne couvre pas ce cas (il suppose implicitement qu'il y a toujours des cartes quelque part), et il est quasiment impossible à atteindre avec l'économie de 45 cartes du jeu, mais ce n'est pas rigoureusement garanti par le code.

## Non couvert par cette revue

Le rapport porte uniquement sur `rules/src`, à la demande initiale. Non vérifiés ici : fidélité exacte des valeurs `dragonVitality`/`dragonVictoryPoints`/`firecrackerPower` aux cartes physiques (données extraites visuellement lors de la mise en place du projet, pas détaillées dans le texte du PDF), et tout ce qui touche à l'affichage (`app/`).
