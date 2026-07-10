import { isMoveItemTypeAtOnce, isShuffleItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getHandLimit } from './HandLimit'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

/** A player reaching this many victory points at the end of a round ends the game. */
const WINNING_SCORE = 50

/**
 * "Fin de manche": there aren't enough Dragon cards left to complete the row. Memory.Score is
 * already up to date (accumulated as each Dragon card was captured, see DistributeRule). If that
 * brought anyone to 50 points or more, the game ends immediately. Otherwise, put the table back
 * together exactly like a fresh setup - decorative Tail/Head cards stay put, everything else (Dragon
 * body cards, Firecracker cards wherever they are) goes back to its deck, gets reshuffled, and is
 * dealt out again - before a new round begins.
 */
export class EndOfRoundRule extends SimultaneousRule {
  get rowSize(): number {
    return this.game.players.length === 2 ? 4 : this.game.players.length
  }

  onRuleStart(): MaterialMove[] {
    const gameOver = this.game.players.some((player) => (this.remind<number>(Memory.Score, player) ?? 0) >= WINNING_SCORE)
    if (gameOver) return [this.endGame()]

    return this.resetDragonCards()
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    // Cards must actually land in their deck (homogeneously hidden there) before being shuffled -
    // shuffling the pre-move selection would mix items from locations with different hiding
    // strategies (e.g. player hands vs. bombing zone), which the engine forbids.
    if (isMoveItemTypeAtOnce(MaterialType.DragonCard)(move) && move.location.type === LocationType.DragonDeck) {
      return [this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).shuffle()]
    }
    if (isShuffleItemType(MaterialType.DragonCard)(move)) return this.resetFirecrackerCards()
    if (isMoveItemTypeAtOnce(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.FirecrackerDeck) {
      return [this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck).shuffle()]
    }
    if (isShuffleItemType(MaterialType.FirecrackerCard)(move)) return this.dealNewRound()
    return []
  }

  resetDragonCards(): MaterialMove[] {
    const dragonCards = this.material(MaterialType.DragonCard).location(
      (location) => location.type !== LocationType.DragonTailSlot && location.type !== LocationType.DragonHeadSlot
    )
    return [dragonCards.moveItemsAtOnce({ type: LocationType.DragonDeck })]
  }

  resetFirecrackerCards(): MaterialMove[] {
    return [this.material(MaterialType.FirecrackerCard).moveItemsAtOnce({ type: LocationType.FirecrackerDeck })]
  }

  dealNewRound(): MaterialMove[] {
    const moves: MaterialMove[] = this.material(MaterialType.DragonCard)
      .location(LocationType.DragonDeck)
      .deck()
      .deal({ type: LocationType.DragonRow }, this.rowSize)

    const firecrackerDeck = this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck).deck()
    for (const player of this.game.players) {
      moves.push(...firecrackerDeck.deal({ type: LocationType.PlayerHand, player }, getHandLimit(this, player)))
    }

    moves.push(this.startSimultaneousRule(RuleId.ChooseFirecracker))
    return moves
  }

  getActivePlayerLegalMoves(): MaterialMove[] {
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return []
  }
}
