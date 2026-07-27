import { MaterialContext } from '@gamepark/react-game'

/**
 * Every player's hand/captured pile/selection sits next to their own panel, in a column near the
 * table's right edge (one row per player, see PlayerPanelLocator). Mine (relative index 0, see
 * `getRelativePlayerIndex`) stays full size and to the left of my panel instead of hidden under it.
 */

/** Scale applied to opponents' material (card size, hand radius), regardless of player count. */
export const OPPONENT_SCALE = 0.5

/** x of my own hand: shifted left so it (and the selection area above it) sits under the dragon head card. */
export const MY_HAND_X = 12

/** y offset (from my hand) of my own selection area (card committed for the turn), just above the hand. */
export const SELECTION_Y_OFFSET = 12

/**
 * Panels (see PlayerPanelLocator/PlayerPanelContent) are placed as part of the table itself (a Location,
 * not a screen-space overlay), in a column near the table's right edge, one row per player. Opponents' hand
 * and captured pile (hidden entirely under their panel) are placed using these same coordinates, so both
 * always line up exactly, regardless of screen size or aspect ratio.
 */
export const PANEL_COLUMN_X = 46
export const PANEL_WIDTH = 16
export const PANEL_HEIGHT = 4
const PANEL_ROW_Y = 19
const PANEL_ROW_SPACING = 8

/** Small upward nudge applied only to the panel itself (not the hand/captured cards it hides), so it fully covers the taller hand card underneath. */
export const PANEL_Y_OFFSET = -0.5

/** y of a player's row: mine (relative index 0) is at the bottom, each opponent one panel-slot above the previous. */
export function getOpponentRowY(relativeIndex: number): number {
  return PANEL_ROW_Y - relativeIndex * PANEL_ROW_SPACING
}

/**
 * y of the sole opponent's panel row, in a 2-player game: pulled closer to mine (a smaller spacing,
 * still with a clear gap between the two panels) to free up more room between it and the dragon row
 * for their full-size hand and selection (see isSoloOpponent).
 */
const SOLO_OPPONENT_PANEL_ROW_SPACING = 7

/** y of a player's panel row: same as getOpponentRowY, except for the sole opponent in a 2-player game. */
export function getPanelRowY(playerIndex: number, context: MaterialContext): number {
  if (isSoloOpponent(playerIndex, context)) {
    return PANEL_ROW_Y - SOLO_OPPONENT_PANEL_ROW_SPACING
  }
  return getOpponentRowY(playerIndex)
}

/** x offset (from an opponent's hand) of their captured pile: nudged right, just enough for the rotated card's top edge (its point icons, not its printed value) to peek out past the panel's left edge. */
export const OPPONENT_CAPTURED_X_OFFSET = -6.5

/** Extra x gap kept between an opponent's selection area and the current leftmost edge of their (fanning) captured pile, so the two never overlap. */
export const OPPONENT_SELECTION_CAPTURED_GAP = 7

/**
 * With only 2 players, there's a single opponent and no panel column to stack under: show their hand
 * and selection full-size above their panel instead of hidden (scaled down) underneath it.
 */
export function isSoloOpponent(playerIndex: number, context: MaterialContext): boolean {
  return playerIndex !== 0 && context.rules.players.length === 2
}

/**
 * y offset (above its, closer-in, panel row) of the sole opponent's full-size hand, in a 2-player
 * game: centers it with a clear gap from both the panel and the dragon row.
 */
export const SOLO_OPPONENT_HAND_Y_OFFSET = 9

/**
 * y offset (from the sole opponent's hand) of their selection area: most of the card peeks out
 * clearly above the hand fan, with still a clear gap left above it to the dragon row.
 */
export const SOLO_OPPONENT_SELECTION_Y_OFFSET = 11
