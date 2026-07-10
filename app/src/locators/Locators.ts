import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { bombingZoneLocator } from './BombingZoneLocator'
import { dragonDeckLocator } from './DragonDeckLocator'
import { dragonHeadSlotLocator } from './DragonHeadSlotLocator'
import { dragonRowLocator } from './DragonRowLocator'
import { dragonTailSlotLocator } from './DragonTailSlotLocator'
import { firecrackerDeckLocator } from './FirecrackerDeckLocator'
import { firecrackerDiscardLocator } from './FirecrackerDiscardLocator'
import { playerCapturedDragonLocator } from './PlayerCapturedDragonLocator'
import { playerDoubleMarkerLocator } from './PlayerDoubleMarkerLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { selectionAreaLocator } from './SelectionAreaLocator'

export const Locators: Partial<Record<LocationType, Locator<number, MaterialType, LocationType>>> = {
  [LocationType.DragonDeck]: dragonDeckLocator,
  [LocationType.DragonTailSlot]: dragonTailSlotLocator,
  [LocationType.DragonHeadSlot]: dragonHeadSlotLocator,
  [LocationType.DragonRow]: dragonRowLocator,
  [LocationType.BombingZone]: bombingZoneLocator,
  [LocationType.FirecrackerDeck]: firecrackerDeckLocator,
  [LocationType.FirecrackerDiscard]: firecrackerDiscardLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.SelectionArea]: selectionAreaLocator,
  [LocationType.PlayerCapturedDragon]: playerCapturedDragonLocator,
  [LocationType.PlayerDoubleMarker]: playerDoubleMarkerLocator
}
