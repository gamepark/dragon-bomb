import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import {
  getPanelRowY,
  OPPONENT_CAPTURED_FAN_DELTA_Z,
  OPPONENT_CAPTURED_FAN_GAP,
  OPPONENT_CAPTURED_MAX_FAN,
  OPPONENT_CAPTURED_X_OFFSET,
  OPPONENT_CAPTURED_Z,
  OPPONENT_SCALE,
  PANEL_COLUMN_X
} from './PlayerRowLayout'

/**
 * Every player's captured pile is hidden under their own panel, exactly the same way (mine included).
 * Stays at the panel row regardless of where the hand is shown (e.g. the sole opponent's full-size
 * hand, in a 2-player game, moves elsewhere - see PlayerHandLocator/isSoloOpponent).
 */
class PlayerCapturedDragonLocator extends ListLocator {
  limit = 20

  /** Past that many cards, the fan keeps its width and the cards squeeze together, instead of running off the panel. */
  maxCount = OPPONENT_CAPTURED_MAX_FAN

  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return { x: PANEL_COLUMN_X + OPPONENT_CAPTURED_X_OFFSET, y: getPanelRowY(playerIndex, context), z: OPPONENT_CAPTURED_Z }
  }

  /** Each new capture fans out further left (and slightly behind) the previous ones, instead of stacking invisibly on top. */
  getGap(): Partial<Coordinates> {
    return { x: OPPONENT_CAPTURED_FAN_GAP, y: 0, z: OPPONENT_CAPTURED_FAN_DELTA_Z }
  }

  getScale(): number {
    return OPPONENT_SCALE
  }

  /** Rotated so it tucks under the side panel, the card's top (with its number) poking out on the left. */
  getRotateZ(): number {
    return -90
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale()
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const playerCapturedDragonLocator = new PlayerCapturedDragonLocator()

/** How far left of its final spot a captured card lands before sliding into the pile (see GameAnimations). */
const CAPTURED_APPROACH_X = -8

/**
 * Animation-only locators (never registered in Locators.ts): they place the Dragon card being captured on the
 * trajectory waypoints of its flight to the pile (see GameAnimations). Waypoints are computed from the state
 * *before* the move, which does not hold the captured card yet, hence the +1: without it the fan would be
 * spread over one card too few and the card would jump on landing once the pile is past OPPONENT_CAPTURED_MAX_FAN.
 */
class CapturedDragonFlightLocator extends PlayerCapturedDragonLocator {
  constructor(private readonly xOffset = 0) {
    super()
  }

  countListItems(location: Location, context: MaterialContext): number {
    return super.countListItems(location, context) + 1
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = super.getCoordinates(location, context)
    return { ...coordinates, x: coordinates.x + this.xOffset }
  }
}

/** Where a captured card comes to a stop, aligned with its final spot but further out, before sliding in. */
export const capturedDragonApproachLocator = new CapturedDragonFlightLocator(CAPTURED_APPROACH_X)

/** Where a captured card finally lands: exactly where playerCapturedDragonLocator is about to render it. */
export const capturedDragonLandingLocator = new CapturedDragonFlightLocator()
