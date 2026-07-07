import { ItemContext, MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerCapturedDragonLocator } from './PlayerCapturedDragonLocator'

class PlayerDoubleMarkerLocator extends PileLocator {
  radius = 1

  getCoordinates(location: Location, context: MaterialContext) {
    const base = playerCapturedDragonLocator.getCoordinates(location, context)
    const scale = playerCapturedDragonLocator.getScale(location, context)
    return { x: (base.x ?? 0) + 6 * scale, y: base.y }
  }

  getRadius(location: Location, context: MaterialContext) {
    return this.radius * playerCapturedDragonLocator.getScale(location, context)
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = playerCapturedDragonLocator.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const playerDoubleMarkerLocator = new PlayerDoubleMarkerLocator()
