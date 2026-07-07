import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'
import { OPPONENT_SCALE, SELECTION_Y_OFFSET } from './PlayerRowLayout'

class SelectionAreaLocator extends ListLocator {
  getGap(location: Location, context: MaterialContext): Partial<Coordinates> {
    return { x: 7 * this.getScale(location, context) }
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const hand = playerHandLocator.getCoordinates(location, context)
    const scale = this.getScale(location, context)
    const { x: gapX = 0 } = this.getGap(location, context)
    const count = this.countListItems(location, context)
    const centerOffset = (gapX * (count - 1)) / 2
    return { x: (hand.x ?? 0) - centerOffset, y: (hand.y ?? 0) - SELECTION_Y_OFFSET * scale }
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

export const selectionAreaLocator = new SelectionAreaLocator()
