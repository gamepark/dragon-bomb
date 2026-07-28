import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getOpponentRowY, getPanelRowY, isSoloOpponent, MY_HAND_X, OPPONENT_SCALE, PANEL_COLUMN_X, SOLO_OPPONENT_HAND_Y_OFFSET } from './PlayerRowLayout'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    if (playerIndex === 0) {
      return { x: MY_HAND_X, y: getOpponentRowY(playerIndex) }
    }
    if (isSoloOpponent(playerIndex, context)) {
      return { x: PANEL_COLUMN_X, y: getPanelRowY(playerIndex, context) - SOLO_OPPONENT_HAND_Y_OFFSET }
    }
    return { x: PANEL_COLUMN_X, y: getOpponentRowY(playerIndex) }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? 1 : OPPONENT_SCALE
  }

  getBaseAngle(): number {
    return 0
  }

  getMaxAngle(_location: Location, _context: MaterialContext): number {
    return this.maxAngle / 2
  }

  getGapMaxAngle(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? this.gapMaxAngle / 2 : 1
  }

  getRadius(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const radius = this.radius * this.getScale(location, context)
    // Opponents' hand is hidden under their panel: keep the fan tight so it doesn't spill out past its edges.
    // (Except the sole opponent in a 2-player game, shown full-size above their panel instead.)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? radius : radius * 0.4
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }

  /** Hand sits at the bottom of the table: lift hovered cards up so the 2x zoom doesn't push them off screen. */
  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', 'translateY(-4em)', `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  /**
   * The fan spreads over the number of cards in the hand (HandLocator's default dependency): keep it, or the
   * cards already in hand would only re-spread once the animation of the card being dealt is over (react-game
   * animates the other items of a move only when their position dependencies change, see
   * ItemAnimations.computeSiblingAnimation). The viewer matters too, since the hand is placed relatively to them.
   */
  getPositionDependencies(location: Location, context: MaterialContext) {
    return { cards: this.countItems(location, context), viewer: context.player }
  }
}

export const playerHandLocator = new PlayerHandLocator()
