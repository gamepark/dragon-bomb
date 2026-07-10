import { isMoveItemType, isMoveItemTypeAtOnce, isShuffleItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { FirecrackerCard, isStringOfFirecrackers } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { resolveSlot } from './DistributionFlow'
import { Memory } from './Memory'

/**
 * Step 2 - "Répartition des cartes Pétards sous le corps du dragon": the placement order (see
 * ChooseFirecrackerRule) is fixed, so each Firecracker card is placed automatically, one at a time,
 * as the turn of the player who committed it - there is nothing for that player to click, it's just
 * a "turn" so the placement gets its own move/notification instead of being buried in one giant
 * automatic cascade. If the card is a "Chapelet de pétards", a bonus card is drawn onto the same
 * slot (reshuffling the discard into the deck first if needed) - its own special effect, if any,
 * never triggers (see continueChapeletDraw). Once the slot's power is final, resolveSlot checks it
 * against the Dragon card's vitality.
 */
export class DistributeRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const rank = this.remind<number>(Memory.NextRank) ?? 0
    const cardIndex = this.remind<number[]>(Memory.PlacementOrder)?.[rank]
    const slotIndex = this.remind<number[]>(Memory.SlotOrder)?.[rank]
    if (cardIndex === undefined || slotIndex === undefined) return []
    return [this.material(MaterialType.FirecrackerCard).index(cardIndex).moveItem({ type: LocationType.BombingZone, parent: slotIndex })]
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    const pendingSlot = this.remind<number>(Memory.ChapeletDrawSlot)
    if (pendingSlot !== undefined) return this.continueChapeletDraw(move, pendingSlot)

    if (!isMoveItemType(MaterialType.FirecrackerCard)(move) || move.location.type !== LocationType.BombingZone) return []

    const slotIndex = move.location.parent!
    this.memorize(Memory.NextRank, (this.remind<number>(Memory.NextRank) ?? 0) + 1)

    const placedCard = this.material(MaterialType.FirecrackerCard).getItem(move.itemIndex)!
    if (isStringOfFirecrackers(placedCard.id as FirecrackerCard)) {
      return this.drawChapeletBonus(slotIndex)
    }

    return resolveSlot(this, slotIndex)
  }

  continueChapeletDraw(move: ItemMove, slotIndex: number): MaterialMove[] {
    if (isMoveItemTypeAtOnce(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.FirecrackerDeck) {
      return [this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck).shuffle()]
    }
    if (isShuffleItemType(MaterialType.FirecrackerCard)(move)) {
      return this.drawChapeletBonus(slotIndex)
    }
    if (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.BombingZone) {
      this.forget(Memory.ChapeletDrawSlot)
      return resolveSlot(this, slotIndex)
    }
    return []
  }

  /**
   * "Chapelet de pétards": draw one card onto the slot. Marked with rotation:true so its own special
   * effect, if any, never triggers - and so ExplosionRule's "last card placed" lookup (highest x)
   * skips it when checking for "Double pétard".
   */
  drawChapeletBonus(slotIndex: number): MaterialMove[] {
    this.memorize(Memory.ChapeletDrawSlot, slotIndex)
    const deck = this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck)
    if (deck.length === 0) {
      const discard = this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDiscard)
      if (!discard.length) {
        this.forget(Memory.ChapeletDrawSlot)
        return resolveSlot(this, slotIndex)
      }
      return [discard.moveItemsAtOnce({ type: LocationType.FirecrackerDeck }), discard.shuffle()]
    }
    return [deck.deck().dealOne(() => ({ type: LocationType.BombingZone, parent: slotIndex, rotation: true }))]
  }
}
