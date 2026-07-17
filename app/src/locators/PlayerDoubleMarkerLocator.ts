import { DeckLocator, getRelativePlayerIndex, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator.ts'
import { CAPTURED_X_OFFSET, OPPONENT_SCALE } from './PlayerRowLayout.ts'

class PlayerDoubleMarkerLocator extends DeckLocator {
  limit = 20

  getCoordinates(location: Location, context: MaterialContext) {
    const hand = playerHandLocator.getCoordinates(location, context)
    const scale = this.getScale(location, context)
    return { y: hand.y, x: (hand.x ?? 0) - CAPTURED_X_OFFSET * scale }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? 1 : OPPONENT_SCALE
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const playerDoubleMarkerLocator = new PlayerDoubleMarkerLocator()
