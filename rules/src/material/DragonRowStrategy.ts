import { LocationStrategy, Material, MaterialItem, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { DragonCard, dragonVitality } from './DragonCard'
import { LocationType } from './LocationType'
import { MaterialType } from './MaterialType'

/**
 * Keeps the Dragon Row sorted by vitality ascending whenever a card is drawn into it, fully
 * recomputing every x so it stays correct even if a previous capture left a gap (see removeItem).
 * Capturing a card leaves the other slots untouched (no reordering) so the row doesn't shift
 * mid-round; the row is only reordered when new cards are dealt in (CompleteDragonRowRule).
 */
export class DragonRowStrategy implements LocationStrategy<number, MaterialType, LocationType> {
  private sequence = new PositiveSequenceStrategy<number, MaterialType, LocationType>('x')

  addItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>) {
    const vitality = (id: DragonCard) => dragonVitality[id] ?? 0
    const sorted = [...material.getItems<DragonCard>(), item].sort((a, b) => vitality(a.id) - vitality(b.id))
    sorted.forEach((existing, index) => (existing.location.x = index))
  }

  moveItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>, index: number) {
    this.sequence.moveItem(material, item, index)
  }

  /** Left as a no-op on purpose: a captured slot leaves a gap, the remaining slots keep their x. */
  removeItem(_material: Material<number, MaterialType, LocationType>, _item: MaterialItem<number, LocationType>) {}
}

export const dragonRowStrategy = new DragonRowStrategy()
