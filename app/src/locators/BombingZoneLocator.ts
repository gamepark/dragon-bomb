import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { ListLocator } from '@gamepark/react-game'

class BombingZoneLocator extends ListLocator {
  parentItemType = MaterialType.DragonCard
  positionOnParent = { x: 50, y: 100 }
  gap = { y: 1.5 }
  coordinates = { y: 3 }
}

export const bombingZoneLocator = new BombingZoneLocator()
