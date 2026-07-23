import { LocationStrategy, Material, MaterialItem, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { DragonCard, dragonVitality } from './DragonCard'
import { LocationType } from './LocationType'
import { MaterialType } from './MaterialType'

/**
 * Keeps the Dragon Row sorted by vitality ascending whenever a card is drawn into it, while moving
 * as few existing cards as possible: a card already in the row keeps its x (even next to a gap left
 * by a capture, see removeItem) unless the sorted order forces it to shift. This avoids pointless
 * back-and-forth animations when several cards are dealt in a row (e.g. [_, _, 23] + 11 gives
 * [11, _, 23], not [11, 23, _]). Capturing a card leaves the other slots untouched (no reordering)
 * so the row doesn't shift mid-round; cards only move when new ones are dealt in (CompleteDragonRowRule).
 */
export class DragonRowStrategy implements LocationStrategy<number, MaterialType, LocationType> {
  private sequence = new PositiveSequenceStrategy<number, MaterialType, LocationType>('x')

  addItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>) {
    const vitality = (id: DragonCard) => dragonVitality[id] ?? 0
    const existing = material.getItems<DragonCard>()
    const sorted = [...existing, item].sort(
      (a, b) => vitality(a.id) - vitality(b.id) || (a.location.x ?? Infinity) - (b.location.x ?? Infinity)
    )
    // The row spans slots 0..maxSlot: the rightmost slot ever occupied, or n-1 if there are more cards than that
    const maxSlot = Math.max(sorted.length - 1, ...existing.map((card) => card.location.x ?? 0))
    let previous = -1
    sorted.forEach((card, index) => {
      // Leave enough room on the right for the cards that must come after this one
      const upperBound = maxSlot - (sorted.length - 1 - index)
      const preferred = card.location.x ?? previous + 1 // existing cards try to keep their slot, the new card takes the first free one
      card.location.x = Math.min(Math.max(preferred, previous + 1), upperBound)
      previous = card.location.x
    })
  }

  moveItem(material: Material<number, MaterialType, LocationType>, item: MaterialItem<number, LocationType>, index: number) {
    this.sequence.moveItem(material, item, index)
  }

  /** Left as a no-op on purpose: a captured slot leaves a gap, the remaining slots keep their x. */
  removeItem(_material: Material<number, MaterialType, LocationType>, _item: MaterialItem<number, LocationType>) {}
}

export const dragonRowStrategy = new DragonRowStrategy()
