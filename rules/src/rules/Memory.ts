export enum Memory {
  /** Cumulative victory points for a player, across rounds (see DistributeRule, DragonBombRules.getScore) */
  Score = 1,
  /** Dragon Row item indexes, sorted left to right, snapshotted once before Distribute starts (see ChooseFirecrackerRule) */
  SlotOrder,
  /** Firecracker item indexes committed this round (Rockets excluded), sorted by ascending power/lanterns (see ChooseFirecrackerRule) */
  PlacementOrder,
  /** Player owning each entry of PlacementOrder, same order (see ChooseFirecrackerRule) */
  PlacementPlayers,
  /** Index in PlacementOrder/PlacementPlayers of the next card to place (see DistributeRule) */
  NextRank,
  /** Rocket Firecracker item indexes committed this round, placed last (see ChooseFirecrackerRule, PlaceRocketRule) */
  RocketOrder,
  /** Player owning each entry of RocketOrder, same order (see ChooseFirecrackerRule) */
  RocketPlayers,
  /** Index in RocketOrder/RocketPlayers of the next Rocket to place (see PlaceRocketRule) */
  NextRocketRank,
  /** Dragon Row item index whose slot just reached its vitality, awaiting ExplosionRule to resolve it */
  ExplodingSlot,
  /** Slot awaiting a "Chapelet de pétards" bonus draw to land, see DistributeRule */
  ChapeletDrawSlot
}
