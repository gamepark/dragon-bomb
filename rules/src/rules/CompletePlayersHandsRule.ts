import { isMoveItemType, isShuffleItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { getHandLimit } from './HandLimit'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Step 4 - "Refaire sa main": every player draws Firecracker cards up to the hand limit (raised by 1
 * for a player currently holding the "13" Dragon card, see HandLimit.ts).
 *
 * Moves only change the game state once the engine actually plays them, so dealing cannot be a plain
 * JS loop within one function: cards are dealt one at a time, each deal chaining to the next one
 * through afterItemMove. Refilling the deck from the discard is not this rule's business, see
 * {@link DragonBombRules.refillFirecrackerDeck}.
 */
export class CompletePlayersHandsRule extends SimultaneousRule {
  onRuleStart(): MaterialMove[] {
    return this.dealNextCard()
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.PlayerHand) {
      return this.dealNextCard()
    }
    // The deck just got refilled from the discard: resume the deal that was waiting for cards. If
    // nobody is waiting anymore, the end of the phase is already queued - do not start it twice.
    if (isShuffleItemType(MaterialType.FirecrackerCard)(move)) {
      return this.nextPlayerToServe === undefined ? [] : this.dealNextCard()
    }
    return []
  }

  dealNextCard(): MaterialMove[] {
    const player = this.nextPlayerToServe
    if (player === undefined) return [this.startSimultaneousRule(RuleId.ChooseFirecracker)]
    if (this.deck.length === 0) {
      // Empty deck: either DragonBombRules is about to refill it from the discard (the deal resumes
      // on the resulting shuffle), or there is no Firecracker card left anywhere and hands stay short.
      return this.discard.length ? [] : [this.startSimultaneousRule(RuleId.ChooseFirecracker)]
    }
    return [this.deck.deck().dealOne({ type: LocationType.PlayerHand, player })]
  }

  get nextPlayerToServe(): number | undefined {
    return this.game.players.find((player) => this.hand(player).length < getHandLimit(this, player))
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
