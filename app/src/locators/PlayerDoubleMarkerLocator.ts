import { DeckLocator, getRelativePlayerIndex, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getPanelRowY, OPPONENT_CAPTURED_X_OFFSET, OPPONENT_SCALE, PANEL_COLUMN_X } from './PlayerRowLayout.ts'

/** Matches PlayerCapturedDragonLocator (the marker sits on top of a captured card, hidden under the panel with it). */
class PlayerDoubleMarkerLocator extends DeckLocator {
  limit = 20

  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return { x: PANEL_COLUMN_X + OPPONENT_CAPTURED_X_OFFSET, y: getPanelRowY(playerIndex, context), z: -1 }
  }

  /** Matches the captured pile's fan (see PlayerCapturedDragonLocator) so the marker fans out with the card it belongs to. */
  getGap(): Partial<Coordinates> {
    return { x: -1, y: 0, z: -0.1 }
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
