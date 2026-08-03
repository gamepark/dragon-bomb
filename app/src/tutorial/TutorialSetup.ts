import { DragonBombSetup } from '@gamepark/dragon-bomb/DragonBombSetup'
import { DragonCard, dragonBodyCards } from '@gamepark/dragon-bomb/material/DragonCard'
import { FirecrackerCard, firecrackerCards } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'

export const me = 1
export const duGeWei = 2
export const yuCin = 3

/**
 * Scripted 3-player opening (see dragon-bomb-tuto-script.txt at the repository root):
 * - Dragon row starts at 11 / 12 / 18, the next 2 cards drawn are 4 and 13.
 * - Hands: me 10/1/2, DuGeWei 5/5/6, Yu-Cin Huang 5/7/8 (the script's DuGeWei "4" does not exist as a
 *   Firecracker power - the game only has powers 5-10 plus the 1/2/3 specials - so it is replaced by a
 *   second "5": it still is the round 1 low card, and it sits under a different slot than the round 2
 *   explosion, so nothing else in the scenario depends on its exact value).
 * - The Firecracker deck's next 2 draws (after the round 1 hand refills) are engineered to land a "9" on
 *   my Chapelet bonus draw, then a "3" (Double pétard) on my round 2 hand refill.
 */
export class TutorialSetup extends DragonBombSetup {
  setupDragon() {
    this.material(MaterialType.DragonCard).createItem({ id: DragonCard.Tail, location: { type: LocationType.DragonTailSlot } })
    this.material(MaterialType.DragonCard).createItem({ id: DragonCard.Head, location: { type: LocationType.DragonHeadSlot } })

    const startingRow = [DragonCard.Body11a, DragonCard.Body12a, DragonCard.Body18a]
    const nextDraws = [DragonCard.Body4a, DragonCard.Body13]
    const scripted = [...startingRow, ...nextDraws]
    const rest = dragonBodyCards.filter((id) => !scripted.includes(id))

    this.material(MaterialType.DragonCard).createItems(rest.map((id) => ({ id, location: { type: LocationType.DragonDeck } })))
    this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).shuffle()
    // Appended last-drawn first: nextDraws first (bottom of the scripted block), then startingRow reversed
    // (drawn immediately from the deck() default order, which deals the highest x first).
    const appendOrder = [...nextDraws, DragonCard.Body18a, DragonCard.Body12a, DragonCard.Body11a]
    this.material(MaterialType.DragonCard).createItems(appendOrder.map((id) => ({ id, location: { type: LocationType.DragonDeck } })))

    this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).deck().deal({ type: LocationType.DragonRow }, this.rowSize)
  }

  setupFirecrackers() {
    const hands: { id: FirecrackerCard; location: { type: LocationType; player: number } }[] = [
      { id: FirecrackerCard.Firecracker10_1, location: { type: LocationType.PlayerHand, player: me } },
      { id: FirecrackerCard.StringOfFirecrackers_1, location: { type: LocationType.PlayerHand, player: me } },
      { id: FirecrackerCard.Rocket_1, location: { type: LocationType.PlayerHand, player: me } },
      { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.PlayerHand, player: duGeWei } },
      { id: FirecrackerCard.Firecracker5_2, location: { type: LocationType.PlayerHand, player: duGeWei } },
      { id: FirecrackerCard.Firecracker6_1, location: { type: LocationType.PlayerHand, player: duGeWei } },
      { id: FirecrackerCard.Firecracker7_1, location: { type: LocationType.PlayerHand, player: yuCin } },
      { id: FirecrackerCard.Firecracker5_5, location: { type: LocationType.PlayerHand, player: yuCin } },
      { id: FirecrackerCard.Firecracker8_1, location: { type: LocationType.PlayerHand, player: yuCin } }
    ]

    // Drawn in this order once the hand refills start: 3 wildcards, then the Chapelet bonus draw ("9"),
    // then my round 2 hand refill ("3", a Double pétard) - see ChapeletDrawSlot / CompletePlayersHandsRule.
    const drawOrder = [
      FirecrackerCard.Firecracker6_2,
      FirecrackerCard.Firecracker6_3,
      FirecrackerCard.Firecracker6_4,
      FirecrackerCard.Firecracker9_1,
      FirecrackerCard.DoubleFirecracker_1,
      FirecrackerCard.Firecracker6_5,
      FirecrackerCard.Firecracker7_2
    ]

    const used = new Set([...hands.map((h) => h.id), ...drawOrder])
    const rest = firecrackerCards.filter((id) => !used.has(id))

    this.material(MaterialType.FirecrackerCard).createItems(hands)
    this.material(MaterialType.FirecrackerCard).createItems(rest.map((id) => ({ id, location: { type: LocationType.FirecrackerDeck } })))
    this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck).shuffle()
    // deck() deals the highest x first: appending in reverse draw order puts the first-needed card on top.
    this.material(MaterialType.FirecrackerCard).createItems(
      [...drawOrder].reverse().map((id) => ({ id, location: { type: LocationType.FirecrackerDeck } }))
    )
  }
}
