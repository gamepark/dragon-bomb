import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { playerCapturedDragonLocator } from './PlayerCapturedDragonLocator'
import { playerHandLocator } from './PlayerHandLocator'
import {
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
      // The sole opponent's (2-player game) sits above their full-size hand too, just tighter (less room there than below mine).
      return { x: (hand.x ?? 0) - centerOffset, y: (hand.y ?? 0) - SOLO_OPPONENT_SELECTION_Y_OFFSET }
    }
    // Sits left of the captured pile's current (fanning) leftmost edge, following it as it grows, so the two never overlap.
    const capturedLocation = { ...location, type: LocationType.PlayerCapturedDragon }
    const captured = playerCapturedDragonLocator.getCoordinates(capturedLocation, context)
    const capturedCount = playerCapturedDragonLocator.countListItems(capturedLocation, context)
    const { x: capturedGapX = 0 } = playerCapturedDragonLocator.getGap()
    const capturedLeftEdge = (captured.x ?? 0) + capturedGapX * Math.max(0, capturedCount - 1)
    return { x: capturedLeftEdge - OPPONENT_SELECTION_CAPTURED_GAP - centerOffset, y: hand.y }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? 1 : OPPONENT_SCALE
  }

  /** Position also depends on the captured pile's size (it follows the pile's leftmost edge for opponents) and player count (2-player layout). */
  getPositionDependencies(location: Location, context: MaterialContext) {
    const capturedLocation = { ...location, type: LocationType.PlayerCapturedDragon }
    return {
      own: this.countItems(location, context),
      captured: playerCapturedDragonLocator.countItems(capturedLocation, context),
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
