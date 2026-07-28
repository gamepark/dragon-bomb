import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import {
  getPanelRowY,
  OPPONENT_CAPTURED_FAN_DELTA_Z,
  OPPONENT_CAPTURED_FAN_GAP,
  OPPONENT_CAPTURED_MAX_FAN,
  OPPONENT_CAPTURED_X_OFFSET,
  OPPONENT_DOUBLE_MARKER_Z,
  OPPONENT_SCALE,
  PANEL_COLUMN_X
} from './PlayerRowLayout.ts'

/** Matches PlayerCapturedDragonLocator (the marker sits on top of a captured card, hidden under the panel with it). */
class PlayerDoubleMarkerLocator extends ListLocator {
  limit = 20

  maxCount = OPPONENT_CAPTURED_MAX_FAN

  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return { x: PANEL_COLUMN_X + OPPONENT_CAPTURED_X_OFFSET, y: getPanelRowY(playerIndex, context), z: OPPONENT_DOUBLE_MARKER_Z }
  }

  /** Matches the captured pile's fan (see PlayerCapturedDragonLocator) so the marker fans out with the card it belongs to. */
  getGap(): Partial<Coordinates> {
    return { x: OPPONENT_CAPTURED_FAN_GAP, y: 0, z: OPPONENT_CAPTURED_FAN_DELTA_Z }
  }

  getScale(): number {
    return OPPONENT_SCALE
  }

  /** Matches the captured pile's rotation so the marker doesn't sit askew on top of it. */
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

export const playerDoubleMarkerLocator = new PlayerDoubleMarkerLocator()
