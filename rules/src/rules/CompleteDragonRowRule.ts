import { MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Step 3 - "Compléter le corps du dragon": draw cards from the Dragon deck to fill the slots left
 * empty by captured Dragon cards. DragonRowStrategy keeps the row sorted by vitality automatically
 * as each card is dealt in, so no extra reordering is needed here.
 */
export class CompleteDragonRowRule extends SimultaneousRule {
  get rowSize(): number {
    return this.game.players.length === 2 ? 4 : this.game.players.length
  }

  onRuleStart(): MaterialMove[] {
    const missing = this.rowSize - this.material(MaterialType.DragonCard).location(LocationType.DragonRow).length
    if (missing === 0) return [this.startRule(RuleId.CompletePlayersHands)]

    // Not enough Dragon cards left to fill every empty slot: the round ends immediately (see EndOfRoundRule).
    if (this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).length < missing) {
      return [this.startSimultaneousRule(RuleId.EndOfRound)]
    }

    return [
      ...this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).deck().deal({ type: LocationType.DragonRow }, missing),
      this.startRule(RuleId.CompletePlayersHands)
    ]
  }

  getActivePlayerLegalMoves(): MaterialMove[] {
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return []
  }
}
