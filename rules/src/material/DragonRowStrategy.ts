import { LocationStrategy, Material, MaterialItem, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { DragonCard, dragonVitality } from './DragonCard'
import { LocationType } from './LocationType'
import { MaterialType } from './MaterialType'

/**
 * Keeps the Dragon Row sorted by vitality ascending whenever a card is drawn into it.
 * Moving/removing items reuses the standard gapless x-sequence behavior.
 */
export class DragonRowStrategy implements LocationStrategy<number, MaterialType, LocationType> {
  private sequence = new PositiveSequenceStrategy<number, MaterialType, LocationType>('x')

  addItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>) {
    const vitality = dragonVitality[item.id as DragonCard] ?? 0
    const index = material.getItems<DragonCard>().filter((existing) => (dragonVitality[existing.id] ?? 0) < vitality).length
    item.location.x = index
    for (const existing of material.getItems()) {
      if (existing.location.x !== undefined && existing.location.x >= index) {
        existing.location.x++
      }
    }
  }

  moveItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>, index: number) {
    this.sequence.moveItem(material, item, index)
  }

  removeItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>) {
    this.sequence.removeItem(material, item)
  }
}

export const dragonRowStrategy = new DragonRowStrategy()
