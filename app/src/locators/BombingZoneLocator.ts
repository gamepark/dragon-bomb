import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { DropAreaDescription, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonCardDescription } from '../material/DragonCardDescription'

class BombingZoneLocator extends ListLocator {
  parentItemType = MaterialType.DragonCard

  /**
   * The zone stands *below* the Dragon card, not on it, so its drop area stands there too - hence a plain
   * {@link DropAreaDescription} declared here. Left to itself the framework would draw a
   * {@link ParentDropAreaDescription}, centred on the Dragon card: the right answer for a location that is
   * its parent item, the wrong one for a zone laid out beside it, which is what positionOnParent says below.
   */
  locationDescription = new DropAreaDescription(dragonCardDescription)

  positionOnParent = { x: 50, y: 120 }
  gap = { y: 2 }
  coordinates = { y: 3 }

  getPositionDependencies(location: Location, context: MaterialContext) {
    const parentX = location.parent !== undefined ? context.rules.material(MaterialType.DragonCard).getItem(location.parent)?.location.x : undefined
    return [this.countItems(location, context), parentX]
  }
}

export const bombingZoneLocator = new BombingZoneLocator()
