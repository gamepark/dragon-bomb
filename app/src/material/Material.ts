import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { dragonCardDescription } from './DragonCardDescription'
import { firecrackerCardDescription } from './FirecrackerCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.DragonCard]: dragonCardDescription,
  [MaterialType.FirecrackerCard]: firecrackerCardDescription
}
