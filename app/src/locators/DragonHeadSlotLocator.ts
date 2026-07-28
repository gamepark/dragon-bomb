import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowY, getDragonHeadX } from './rowSize'

class DragonHeadSlotLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    return { x: getDragonHeadX(context.rules.players.length), y: dragonRowY }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return context.rules.players.length
  }
}

export const dragonHeadSlotLocator = new DragonHeadSlotLocator()
