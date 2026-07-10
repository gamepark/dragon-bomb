import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class BombingZoneLocator extends ListLocator {
  parentItemType = MaterialType.DragonCard
  positionOnParent = { x: 50, y: 120 }
  gap = { y: 1.5 }
  coordinates = { y: 3 }

  getPositionDependencies(location: Location, context: MaterialContext) {
    const parentX = location.parent !== undefined ? context.rules.material(MaterialType.DragonCard).getItem(location.parent)?.location.x : undefined
    return [this.countItems(location, context), parentX]
  }
}

export const bombingZoneLocator = new BombingZoneLocator()
