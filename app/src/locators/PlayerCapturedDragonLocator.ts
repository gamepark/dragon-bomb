import { DeckLocator, getRelativePlayerIndex, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getPanelRowY, OPPONENT_CAPTURED_X_OFFSET, OPPONENT_SCALE, PANEL_COLUMN_X } from './PlayerRowLayout'

/**
 * Every player's captured pile is hidden under their own panel, exactly the same way (mine included).
 * Stays at the panel row regardless of where the hand is shown (e.g. the sole opponent's full-size
 * hand, in a 2-player game, moves elsewhere - see PlayerHandLocator/isSoloOpponent).
 */
class PlayerCapturedDragonLocator extends DeckLocator {
  limit = 20

  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return { x: PANEL_COLUMN_X + OPPONENT_CAPTURED_X_OFFSET, y: getPanelRowY(playerIndex, context) }
  }

  /** Each new capture fans out further left (and slightly behind) the previous ones, instead of stacking invisibly on top. */
  getGap(): Partial<Coordinates> {
    return { x: -1, y: 0, z: -0.1 }
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
