import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { PlayerPanelDescription } from '../material/PlayerPanelDescription'
import { getPanelRowY, PANEL_COLUMN_X, PANEL_HEIGHT, PANEL_WIDTH, PANEL_Y_OFFSET } from './PlayerRowLayout'

class PlayerPanelLocator extends Locator {
  locationDescription = new PlayerPanelDescription({ width: PANEL_WIDTH, height: PANEL_HEIGHT })

  getLocations(context: MaterialContext) {
    return context.rules.players.map((player) => ({ player }))
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    // z lifted well above any card so the panel always renders on top of the hand/captured pile it hides.
    return { x: PANEL_COLUMN_X, y: getPanelRowY(playerIndex, context) + PANEL_Y_OFFSET, z: 20 }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerPanelLocator = new PlayerPanelLocator()
