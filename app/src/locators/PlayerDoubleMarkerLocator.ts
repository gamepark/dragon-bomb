import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { Memory } from '@gamepark/dragon-bomb/rules/Memory'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { DoubleMarkerDescription } from '../material/DoubleMarkerDescription'
import { dragonCardDescription } from '../material/DragonCardDescription'
import { playerCapturedDragonLocator } from './PlayerCapturedDragonLocator'
import { OPPONENT_CAPTURED_FAN_GAP, OPPONENT_DOUBLE_MARKER_Z, OPPONENT_SCALE } from './PlayerRowLayout'

/** Diameter of the chip: a bit more than the sliver of card it hangs from, small enough for two markers not to touch. */
const MARKER_SIZE = 1.7

/** How much the chip overlaps the card it belongs to, so it reads as pinned on it rather than floating next to it. */
const MARKER_OVERLAP = 0.2

/**
 * x offset (from a captured card's center) of its marker: centered on the sliver of that card left visible by the
 * one fanned over it, i.e. half a fan gap in from its outer edge (captured cards are rotated, so their *height*
 * is what spans x, see PlayerCapturedDragonLocator).
 */
const MARKER_X_OFFSET = -(dragonCardDescription.height * OPPONENT_SCALE) / 2 - OPPONENT_CAPTURED_FAN_GAP / 2

/** y offset: just above the card's outer corner, so the chip never covers the lantern icons in the middle of the sliver. */
const MARKER_Y_OFFSET = -((dragonCardDescription.width * OPPONENT_SCALE) / 2 + MARKER_SIZE / 2 - MARKER_OVERLAP)

/**
 * "x2" markers: no item is ever placed in {@link LocationType.PlayerDoubleMarker}. The markers are locations
 * generated from {@link Memory.DoubledCaptures} - the Dragon cards captured with a "Double pétard" this round,
 * whose victory points were doubled when they were captured (see ExplosionRule) - each pinned on the captured
 * card it belongs to.
 */
class PlayerDoubleMarkerLocator extends Locator {
  locationDescription = new DoubleMarkerDescription({ width: MARKER_SIZE, height: MARKER_SIZE })

  getLocations(context: MaterialContext): Location[] {
    const doubledCaptures = context.rules.remind<number[]>(Memory.DoubledCaptures) ?? []
    return doubledCaptures.flatMap((index) => {
      const item = context.rules.material(MaterialType.DragonCard).getItem(index)
      // A captured card only leaves the pile at the end of the round, when the memory is dropped: until then,
      // rather than placing a marker on a card that is flying back to the deck, skip it.
      if (item?.location.type !== LocationType.PlayerCapturedDragon) return []
      return [{ type: LocationType.PlayerDoubleMarker, player: item.location.player, x: item.location.x }]
    })
  }

  /** Placed relatively to the captured card of the same rank, so a marker follows the pile's fan exactly. */
  getCoordinates(location: Location, context: MaterialContext) {
    const card = playerCapturedDragonLocator.getLocationCoordinates(
      { type: LocationType.PlayerCapturedDragon, player: location.player },
      context,
      location.x
    )
    return { x: (card.x ?? 0) + MARKER_X_OFFSET, y: (card.y ?? 0) + MARKER_Y_OFFSET, z: OPPONENT_DOUBLE_MARKER_Z }
  }

  /** The pile fans out (then squeezes, past OPPONENT_CAPTURED_MAX_FAN) as it grows, and it is placed relatively to the viewer. */
  getPositionDependencies(location: Location, context: MaterialContext) {
    return {
      captured: playerCapturedDragonLocator.countListItems({ type: LocationType.PlayerCapturedDragon, player: location.player }, context),
      viewer: context.player,
      players: context.rules.players.length
    }
  }
}

export const playerDoubleMarkerLocator = new PlayerDoubleMarkerLocator()
