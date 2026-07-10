import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { firecrackerDeckLocator } from './FirecrackerDeckLocator.ts'

class FirecrackerDiscardLocator extends DeckLocator {

  getCoordinates(_location: Location, context: MaterialContext): Partial<Coordinates> {
    const deck = firecrackerDeckLocator.getCoordinates(_location, context)
    return { x: (deck.x ?? 0) + 10, y: deck.y }
  }
}

export const firecrackerDiscardLocator = new FirecrackerDiscardLocator()
