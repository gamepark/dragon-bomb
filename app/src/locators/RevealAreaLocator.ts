import { ListLocator } from '@gamepark/react-game'

class RevealAreaLocator extends ListLocator {
  gap = { x: 8 }
  coordinates = { x: 0, y: 0 }
}

export const revealAreaLocator = new RevealAreaLocator()
