import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'

class SelectionAreaLocator extends ListLocator {
  gap = { x: 4 }

  getCoordinates(location: Location, context: MaterialContext) {
    const hand = playerHandLocator.getCoordinates(location, context)
    const towardCenter = (value: number) => value + (value > 0 ? -12 : value < 0 ? 12 : 0)
    return { x: towardCenter(hand.x ?? 0), y: towardCenter(hand.y ?? 0) }
  }
}

export const selectionAreaLocator = new SelectionAreaLocator()
