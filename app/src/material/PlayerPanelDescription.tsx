import { LocationDescription } from '@gamepark/react-game'
import { PlayerPanelContent } from '../panels/PlayerPanelContent'

export class PlayerPanelDescription extends LocationDescription {
  content = PlayerPanelContent

  getImages(): string[] {
    return []
  }
}
