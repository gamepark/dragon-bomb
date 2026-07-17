import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { dragonHeadSlotLocator } from './DragonHeadSlotLocator.ts'

class FirecrackerDeckLocator extends DeckLocator {
  rotateZ = 90
  limit = 20

  getCoordinates(_location: Location, context: MaterialContext): Partial<Coordinates> {
    const head = dragonHeadSlotLocator.getCoordinates(_location, context)
    return { x: head.x, y: head.y - 10 }
  }
}

export const firecrackerDeckLocator = new FirecrackerDeckLocator()
