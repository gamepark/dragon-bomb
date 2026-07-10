import { isMoveItemType, isShuffleItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { getHandLimit } from './HandLimit'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Step 4 - "Refaire sa main": every player draws Firecracker cards up to the hand limit (raised by 1
 * for a player currently holding the "13" Dragon card, see HandLimit.ts).
 *
 * Moves only change the game state once the engine actually plays them, so "move the discard into
 * the deck, then deal from it" cannot be a plain JS loop within one function - the deal has to wait
 * for the reshuffle to really happen first. Dealing one card at a time and letting afterItemMove
 * chain to the next step (reshuffling first if the deck is empty) is how every other Game Park game
 * handles this same situation (see zenith/RefillRule.ts, chateau-combo/DealCardsHelper.ts).
 */
export class CompletePlayersHandsRule extends SimultaneousRule {
  onRuleStart(): MaterialMove[] {
    return this.dealNextCard()
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isShuffleItemType(MaterialType.FirecrackerCard)(move) || (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.PlayerHand)) {
      return this.dealNextCard()
    }
    return []
  }

  dealNextCard(): MaterialMove[] {
    const player = this.game.players.find((player) => this.hand(player).length < getHandLimit(this, player))
    if (player === undefined) return [this.startSimultaneousRule(RuleId.ChooseFirecracker)]
    if (this.deck.length === 0) return this.reshuffleDiscard()
    return [this.deck.deck().dealOne({ type: LocationType.PlayerHand, player })]
  }

  reshuffleDiscard(): MaterialMove[] {
    // "discard" is captured before it moves: a Shuffle move targets stable item indexes, so it
    // correctly randomizes those same cards once they land in the deck right after this move plays.
    const discard = this.discard
    return [discard.moveItemsAtOnce({ type: LocationType.FirecrackerDeck }), discard.shuffle()]
  }

  hand(player: number) {
    return this.material(MaterialType.FirecrackerCard).location(LocationType.PlayerHand).player(player)
  }

  get deck() {
    return this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck)
  }

  get discard() {
    return this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDiscard)
  }

  getActivePlayerLegalMoves(): MaterialMove[] {
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return []
  }
}
