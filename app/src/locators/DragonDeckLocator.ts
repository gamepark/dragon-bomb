import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { dragonTailSlotLocator } from './DragonTailSlotLocator.ts'

class DragonDeckLocator extends DeckLocator {
  rotateZ = 90
  limit = 20

  getCoordinates(_location: Location, context: MaterialContext): Partial<Coordinates> {
    const tail = dragonTailSlotLocator.getCoordinates(_location, context)
    return { x: tail.x, y: tail.y - 10 }
  }
}

export const dragonDeckLocator = new DragonDeckLocator()
