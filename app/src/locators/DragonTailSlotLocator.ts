import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowY, getDragonTailX } from './rowSize'

class DragonTailSlotLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    return { x: getDragonTailX(context.rules.players.length), y: dragonRowY }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return context.rules.players.length
  }
}

export const dragonTailSlotLocator = new DragonTailSlotLocator()
