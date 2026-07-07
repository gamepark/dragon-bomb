import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getColumnCenterX, OPPONENT_SCALE, ROW_Y } from './PlayerRowLayout'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Coordinates {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const playerCount = context.rules.players.length
    return { x: getColumnCenterX(playerIndex, playerCount), y: ROW_Y }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? 1 : OPPONENT_SCALE
  }

  getBaseAngle(): number {
    return 0
  }

  getMaxAngle(_location: Location, _context: MaterialContext): number {
    return this.maxAngle / 2
  }

  getGapMaxAngle(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? this.gapMaxAngle / 2 : 1
  }

  getRadius(location: Location, context: MaterialContext): number {
    return this.radius * this.getScale(location, context)
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerHandLocator = new PlayerHandLocator()
