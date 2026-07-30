import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { DragonCard, dragonVictoryPoints } from '../material/DragonCard'
import { FirecrackerCard, isDoubleFirecracker } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { nextDistributionStep } from './DistributionFlow'
import { Memory } from './Memory'

/**
 * The slot memorized in Memory.ExplodingSlot (see DistributeRule/PlaceRocketRule) just reached its
 * Dragon card's vitality. "Double pétard" only doubles the victory points when it is the card that
 * was just placed - the one with the highest x among the slot's cards, ignoring any drawn as a
 * Chapelet bonus (rotation:true, their effect never triggers) - not merely present on the slot from
 * an earlier, unsuccessful round. The player who placed the triggering card captures the Dragon
 * card, every Firecracker card of the slot (the Double pétard included) goes to the discard, then
 * play resumes at the next placement turn.
 */
export class ExplosionRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const slotIndex = this.remind<number>(Memory.ExplodingSlot)!
    const dragonCard = this.material(MaterialType.DragonCard).index(slotIndex)
    const dragonCardItem = dragonCard.getItem()!
    const bombingZoneCards = this.material(MaterialType.FirecrackerCard).location(LocationType.BombingZone).parent(slotIndex)

    const activeCards = bombingZoneCards.index((index) => this.material(MaterialType.FirecrackerCard).getItem(index)!.location.rotation !== true)
    const lastPlaced = activeCards.maxBy((item) => item.location.x ?? -1)
    const lastPlacedItem = lastPlaced.getItem()
    const doubled = lastPlacedItem !== undefined && isDoubleFirecracker(lastPlacedItem.id as FirecrackerCard)

    const points = dragonVictoryPoints[dragonCardItem.id as DragonCard] ?? 0
    this.memorize<number>(Memory.Score, (previousScore: number = 0) => previousScore + (doubled ? points * 2 : points), this.player)
    // The doubling is over as soon as the points are scored: only remember it so that a "x2" marker can be
    // displayed next to the captured card for the rest of the round (see Memory.DoubledCaptures).
    if (doubled) this.memorize<number[]>(Memory.DoubledCaptures, (captures: number[] = []) => [...captures, slotIndex])

    return [
      ...(bombingZoneCards.length ? [bombingZoneCards.moveItemsAtOnce({ type: LocationType.FirecrackerDiscard })] : []),
      ...dragonCard.moveItems({ type: LocationType.PlayerCapturedDragon, player: this.player }),
      ...nextDistributionStep(this)
    ]
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
