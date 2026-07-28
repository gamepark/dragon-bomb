import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { playerCapturedDragonLocator } from './PlayerCapturedDragonLocator'
import { playerHandLocator } from './PlayerHandLocator'
import {
  getPanelRowY,
  isSoloOpponent,
  OPPONENT_SCALE,
  OPPONENT_SELECTION_CAPTURED_GAP,
  SELECTION_Y_OFFSET,
  SOLO_OPPONENT_SELECTION_Y_OFFSET
} from './PlayerRowLayout'

class SelectionAreaLocator extends ListLocator {
  getGap(location: Location, context: MaterialContext): Partial<Coordinates> {
    return { x: 7 * this.getScale(location, context) }
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const hand = playerHandLocator.getCoordinates(location, context)
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const scale = this.getScale(location, context)
    const { x: gapX = 0 } = this.getGap(location, context)
    const count = this.countListItems(location, context)
    const centerOffset = (gapX * (count - 1)) / 2
    if (playerIndex === 0) {
      // Mine sits above my hand, both shifted left so it lines up under the dragon head.
      return { x: (hand.x ?? 0) - centerOffset, y: (hand.y ?? 0) - SELECTION_Y_OFFSET * scale }
    }
    if (isSoloOpponent(playerIndex, context)) {
      // The sole opponent's (2-player game) is the mirror of mine: below their full-size hand, which hangs from their panel at the top.
      return { x: (hand.x ?? 0) - centerOffset, y: (hand.y ?? 0) + SOLO_OPPONENT_SELECTION_Y_OFFSET }
    }
    // Sits left of the captured piles' leftmost edge, on the panel's own row (not the hand's, which peeks out
    // slightly above it). The offset follows the *largest* pile, so every opponent's selection lines up on the
    // same x, wherever their own pile currently ends.
    return { x: this.getCapturedLeftEdge(context) - OPPONENT_SELECTION_CAPTURED_GAP - centerOffset, y: getPanelRowY(playerIndex, context) }
  }

  /**
   * x of the leftmost captured card the selections have to clear: the last card of the biggest *opponent* pile (they
   * all fan out from the same x, under their own panel). The bottom row's own pile is left out, as no selection is
   * ever displayed next to it (mine sits on the other side of the table). Asked to the locator itself rather than
   * recomputed, since the fan stops growing past OPPONENT_CAPTURED_MAX_FAN cards.
   */
  private getCapturedLeftEdge(context: MaterialContext): number {
    const opponentPiles = context.rules.players
      .filter((player) => getRelativePlayerIndex(context, player) !== 0)
      .map((player) => ({ type: LocationType.PlayerCapturedDragon, player }))
    let fullestPile = opponentPiles[0]
    let cards = 0
    for (const pile of opponentPiles) {
      const count = playerCapturedDragonLocator.countListItems(pile, context)
      if (count > cards) {
        cards = count
        fullestPile = pile
      }
    }
    return playerCapturedDragonLocator.getLocationCoordinates(fullestPile, context, Math.max(0, cards - 1)).x
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? 1 : OPPONENT_SCALE
  }

  /** Position also depends on the biggest captured pile (opponents' selections all follow its leftmost edge) and player count (2-player layout). */
  getPositionDependencies(location: Location, context: MaterialContext) {
    return {
      own: this.countItems(location, context),
      captured: this.getCapturedLeftEdge(context),
      players: context.rules.players.length
    }
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const selectionAreaLocator = new SelectionAreaLocator()
