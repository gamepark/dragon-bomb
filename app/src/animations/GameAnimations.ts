import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { capturedDragonApproachLocator, capturedDragonLandingLocator } from '../locators/PlayerCapturedDragonLocator'

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

/** Point of the flight where a captured Dragon card reaches its approach position and starts sliding in. */
const CAPTURED_SLIDE_START = 0.7

/**
 * Capturing a Dragon card (see ExplosionRule): the pile it joins fans out to the left, tucked under its owner's
 * panel, so flying straight to the final spot means crossing over the cards already captured. Instead, the card
 * flies to the same spot shifted 8em further out (capturedDragonApproachLocator), lands there, then slides
 * into the pile. The final waypoint restates the landing spot through a locator: without it, react-game builds
 * the last keyframe by interpolating translations only (see ItemAnimations.getTrajectoryKeyframes), which drops
 * the scale and the -90 degrees rotation the pile applies, and the card would snap into place at the very end.
 */
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.DragonCard)(move) && move.location.type === LocationType.PlayerCapturedDragon)
  .trajectory((context, move) => {
    if (!isMoveItemType(MaterialType.DragonCard)(move)) return {}
    const player = move.location.player
    // The card's rank in the fan: the pile does not hold it yet, so it is exactly the number of cards already captured.
    const x = context.rules.material(MaterialType.DragonCard).location(LocationType.PlayerCapturedDragon).player(player).length
    const location = { type: LocationType.PlayerCapturedDragon, player, x }
    return {
      // One continuous motion: the card accelerates all the way to its approach position, then eases into its slot.
      easing: 'ease-in',
      elevation: { landAt: CAPTURED_SLIDE_START },
      waypoints: [
        { at: CAPTURED_SLIDE_START, locator: capturedDragonApproachLocator, location, easing: 'ease-out' },
        { at: 1, locator: capturedDragonLandingLocator, location }
      ]
    }
  })
