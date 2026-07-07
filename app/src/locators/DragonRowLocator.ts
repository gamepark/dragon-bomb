import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowGap, dragonRowY, getDragonRowStartX, getRowSize } from './rowSize'

class DragonRowLocator extends ListLocator {
  gap = { x: dragonRowGap }

  getCoordinates(_location: Location, context: MaterialContext) {
    const rowSize = getRowSize(context.rules.players.length)
    return { x: getDragonRowStartX(rowSize), y: dragonRowY }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return context.rules.players.length
  }
}

export const dragonRowLocator = new DragonRowLocator()
