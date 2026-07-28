import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations<number, MaterialType, LocationType, RuleId>()

/**
 * Revealing the selected Firecracker cards (see ChooseFirecrackerRule.getMovesAfterPlayersDone) only sets
 * rotation to false: the card does not move, it just becomes face up (react-game flips a card as soon as its
 * id is known, see FlatMaterialDescription.isFlipped). My own cards were already face up for me, so that
 * animation shows strictly nothing - skip it instead of freezing the table for a second per card.
 */
gameAnimations
  .configure(
    (move, context) =>
      isMoveItemType(MaterialType.FirecrackerCard)(move) &&
      move.location.type === LocationType.SelectionArea &&
      move.location.rotation === false &&
      move.location.player === context.player
  )
  .skip()
