import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { DragonCard, dragonVictoryPoints } from '../material/DragonCard'
import { FirecrackerCard, isDoubleFirecracker } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { nextDistributionStep } from './DistributionFlow'
import { Memory } from './Memory'

/**
 * The slot memorized in Memory.ExplodingSlot (see DistributeRule/PlaceRocketRule) just reached its
 * Dragon card's vitality. "Double pétard" only doubles the victory points (and is kept face down as
 * a marker instead of going to the discard) when it is the card that was just placed - the one with
 * the highest x among the slot's cards, ignoring any drawn as a Chapelet bonus (rotation:true, their
 * effect never triggers) - not merely present on the slot from an earlier, unsuccessful round. The
 * player who placed the triggering card captures the Dragon card, then play resumes at the next
 * placement turn.
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

    const doubleCard = doubled ? this.material(MaterialType.FirecrackerCard).index(lastPlaced.getIndex()) : undefined
    const triggeringIndex = doubled ? lastPlaced.getIndex() : undefined
    const otherCards = triggeringIndex !== undefined ? bombingZoneCards.index((index) => index !== triggeringIndex) : bombingZoneCards

    const points = dragonVictoryPoints[dragonCardItem.id as DragonCard] ?? 0
    this.memorize<number>(Memory.Score, (previousScore: number = 0) => previousScore + (doubled ? points * 2 : points), this.player)

    return [
      ...(otherCards.length ? [otherCards.moveItemsAtOnce({ type: LocationType.FirecrackerDiscard })] : []),
      ...(doubleCard?.moveItems({ type: LocationType.PlayerDoubleMarker, player: this.player, parent: slotIndex }) ?? []),
      ...dragonCard.moveItems({ type: LocationType.PlayerCapturedDragon, player: this.player }),
      ...nextDistributionStep(this)
    ]
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
