import { isMoveItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Step 1 - "Choix de cartes Pétard": every player secretly picks one Firecracker card from their
 * hand (2 cards in a 2-player game) and places it face down in front of them (SelectionArea).
 * Once every player has chosen, the game moves on to the Distribute step.
 */
export class ChooseFirecrackerRule extends SimultaneousRule {
  get cardsToChoose(): number {
    return this.game.players.length === 2 ? 2 : 1
  }

  getActivePlayerLegalMoves(player: number): MaterialMove[] {
    return this.material(MaterialType.FirecrackerCard)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.SelectionArea, player })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.FirecrackerCard)(move) || move.location.type !== LocationType.SelectionArea) return []
    const player = move.location.player!
    const chosen = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea).player(player).length
    return chosen >= this.cardsToChoose ? [this.endPlayerTurn(player)] : []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.startRule(RuleId.Distribute)]
  }
}
