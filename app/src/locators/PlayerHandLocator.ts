import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import {
  getMyHandX,
  getOpponentRowY,
  getPanelRowY,
  isSoloOpponent,
  MY_HAND_Y,
  OPPONENT_SCALE,
  PANEL_COLUMN_X,
  SOLO_OPPONENT_HAND_Y_OFFSET
} from './PlayerRowLayout'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    if (playerIndex === 0) {
      return { x: getMyHandX(context), y: MY_HAND_Y }
    }
    if (isSoloOpponent(playerIndex, context)) {
      return { x: PANEL_COLUMN_X, y: getPanelRowY(playerIndex, context) + SOLO_OPPONENT_HAND_Y_OFFSET }
    }
    return { x: PANEL_COLUMN_X, y: getOpponentRowY(playerIndex, context) - 1 }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? 1 : OPPONENT_SCALE
  }

  /** The sole opponent of a 2-player game holds their hand below their panel, at the top of the table: upside down, as if sitting across it. */
  getBaseAngle(location: Location, context: MaterialContext): number {
    return isSoloOpponent(getRelativePlayerIndex(context, location.player), context) ? 180 : 0
  }

  maxAngle = 9

  getGapMaxAngle(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 || isSoloOpponent(playerIndex, context) ? this.gapMaxAngle / 2 : 1
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }

  /** A hand sits against an edge of the table: move hovered cards inwards so the 2x zoom doesn't push them off screen. */
  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    const towardsTable = isSoloOpponent(getRelativePlayerIndex(context, item.location.player), context) ? 4 : -4
    return ['translateZ(10em)', `translateY(${towardsTable}em)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  /**
   * The fan spreads over the number of cards in the hand (HandLocator's default dependency): keep it, or the
   * cards already in hand would only re-spread once the animation of the card being dealt is over (react-game
   * animates the other items of a move only when their position dependencies change, see
   * ItemAnimations.computeSiblingAnimation). The viewer matters too, since the hand is placed relatively to them.
   */
  getPositionDependencies(location: Location, context: MaterialContext) {
    return { cards: this.countItems(location, context), viewer: context.player, players: context.rules.players.length }
  }
}

export const playerHandLocator = new PlayerHandLocator()
