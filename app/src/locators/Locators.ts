import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { PlayerColor } from '@gamepark/dragon-bomb/PlayerColor'
import { Locator } from '@gamepark/react-game'

export const Locators: Partial<Record<LocationType, Locator<PlayerColor, MaterialType, LocationType>>> = {}
