import { PileLocator } from '@gamepark/react-game'

class FirecrackerDiscardLocator extends PileLocator {
  coordinates = { x: 20, y: -15 }
  radius = 1.5
}

export const firecrackerDiscardLocator = new FirecrackerDiscardLocator()
