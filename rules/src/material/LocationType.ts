export enum LocationType {
  /** Draw pile of Dragon Body cards, shuffled */
  DragonDeck = 1,
  /** Fixed decorative Tail card, at the start of the row */
  DragonTailSlot,
  /** Fixed decorative Head card, at the end of the row */
  DragonHeadSlot,
  /** Dragon Body cards, kept sorted by vitality ascending (location.x = slot index) */
  DragonRow,
  /** Firecracker cards placed under a Dragon Body slot (location.parent = index of the DragonRow item) */
  BombingZone,
  /** Draw pile of Firecracker cards, shuffled */
  FirecrackerDeck,
  /** Discarded Firecracker cards, associated to slots that didn't explode this round or already collected */
  FirecrackerDiscard,
  /** A player's hand of Firecracker cards */
  PlayerHand,
  /** Face-down staging area where a player secretly commits their Firecracker card(s) for the turn */
  SelectionArea,
  /** Shared area where committed Firecracker cards are revealed simultaneously */
  RevealArea,
  /** Dragon Body cards captured by a player, kept face up in front of them */
  PlayerCapturedDragon,
  /** A Double Firecracker card kept face down in front of a player, marking a captured card's doubled victory points (location.parent = index of the captured DragonCard item) */
  PlayerDoubleMarker
}
