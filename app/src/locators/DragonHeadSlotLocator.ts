import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowY, getDragonHeadX, getRowSize } from './rowSize'

class DragonHeadSlotLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    const rowSize = getRowSize(context.rules.players.length)
    return { x: getDragonHeadX(rowSize), y: dragonRowY }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return context.rules.players.length
  }
}

export const dragonHeadSlotLocator = new DragonHeadSlotLocator()
