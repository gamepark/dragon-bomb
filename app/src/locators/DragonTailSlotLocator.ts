import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowY, getDragonTailX, getRowSize } from './rowSize'

class DragonTailSlotLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    const rowSize = getRowSize(context.rules.players.length)
    return { x: getDragonTailX(rowSize), y: dragonRowY }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return context.rules.players.length
  }
}

export const dragonTailSlotLocator = new DragonTailSlotLocator()
