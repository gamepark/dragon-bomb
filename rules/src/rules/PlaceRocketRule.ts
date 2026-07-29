import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { nextDistributionStep, resolveSlot } from './DistributionFlow'
import { Memory } from './Memory'

/**
 * "Fusée": placed last, under any Dragon Body slot still present, freely chosen by the player who
 * committed it (see ChooseFirecrackerRule for how Rockets are set aside from the normal order).
 */
export class PlaceRocketRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const slots = this.material(MaterialType.DragonCard).location(LocationType.DragonRow)

    // No Dragon slot left to choose from this round: skip this Rocket rather than leave the player stuck.
    if (!slots.length) {
      this.memorize(Memory.NextRocketRank, (this.remind<number>(Memory.NextRocketRank) ?? 0) + 1)
      return nextDistributionStep(this)
    }

    // Only one Dragon slot left: no real choice, so place the Rocket there automatically.
    if (slots.length === 1) {
      const rank = this.remind<number>(Memory.NextRocketRank) ?? 0
      const cardIndex = this.remind<number[]>(Memory.RocketOrder)?.[rank]
      if (cardIndex !== undefined) {
        const slotIndex = slots.getIndex()
        return [this.material(MaterialType.FirecrackerCard).index(cardIndex).moveItem({ type: LocationType.BombingZone, parent: slotIndex })]
      }
    }

    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const rank = this.remind<number>(Memory.NextRocketRank) ?? 0
    const cardIndex = this.remind<number[]>(Memory.RocketOrder)?.[rank]
    if (cardIndex === undefined) return []
    const card = this.material(MaterialType.FirecrackerCard).index(cardIndex)
    return this.material(MaterialType.DragonCard)
      .location(LocationType.DragonRow)
      .getIndexes()
      .map((slotIndex) => card.moveItem({ type: LocationType.BombingZone, parent: slotIndex }))
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.FirecrackerCard)(move) || move.location.type !== LocationType.BombingZone) return []

    this.memorize(Memory.NextRocketRank, (this.remind<number>(Memory.NextRocketRank) ?? 0) + 1)

    return resolveSlot(this, move.location.parent!)
  }
}
