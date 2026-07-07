import { getRelativePlayerIndex, ItemContext, MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'
import { CAPTURED_Y_OFFSET, OPPONENT_SCALE } from './PlayerRowLayout'

class PlayerCapturedDragonLocator extends PileLocator {
  radius = 3

  getCoordinates(location: Location, context: MaterialContext) {
    const hand = playerHandLocator.getCoordinates(location, context)
    const scale = this.getScale(location, context)
    return { x: hand.x, y: (hand.y ?? 0) - CAPTURED_Y_OFFSET * scale }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? 1 : OPPONENT_SCALE
  }

  getRadius(location: Location, context: MaterialContext) {
    return this.radius * this.getScale(location, context)
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const playerCapturedDragonLocator = new PlayerCapturedDragonLocator()
