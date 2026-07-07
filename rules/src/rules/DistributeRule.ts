import { MaterialMove, SimultaneousRule } from '@gamepark/rules-api'

/**
 * Step 2 - "Répartition des cartes Pétards sous le corps du dragon". Not implemented yet.
 */
export class DistributeRule extends SimultaneousRule {
  getActivePlayerLegalMoves(): MaterialMove[] {
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return []
  }
}
