import { MaterialContext } from '@gamepark/react-game'
import { getDragonHeadX } from './rowSize'

/**
 * Every player's hand/captured pile/selection sits next to their own panel, in a column near the
 * table's right edge (one row per player, see PlayerPanelLocator). Mine (relative index 0, see
 * `getRelativePlayerIndex`) stays full size and to the left of my panel instead of hidden under it.
 */

/**
 * Scale applied to opponents' material (card size, hand radius), regardless of player count. Kept small enough
 * for the rotated captured card (6.6 wide) to still fit within the panel's height.
 */
export const OPPONENT_SCALE = 0.7

/** Bounds of the table (its left edge depends on the player count, see getTableXMin). Everything below hangs from one of them. */
export const TABLE_X_MAX = 48
const TABLE_Y_MIN = -25
export const TABLE_Y_MAX = 19

/** How far left each captured card fans out from the previous one: keeps the same sliver of card visible whatever OPPONENT_SCALE is. */
export const OPPONENT_CAPTURED_FAN_GAP = -2 * OPPONENT_SCALE

/** Most captured cards the fan spreads over: past that, they squeeze together rather than run further left, off the panel. */
export const OPPONENT_CAPTURED_MAX_FAN = 10

/** Each captured card slides slightly behind the previous one, so its own left edge stays visible. */
export const OPPONENT_CAPTURED_FAN_DELTA_Z = -0.1

/** z of a captured pile: the deepest card of a full fan lands exactly on 0, since negative z are not allowed. */
export const OPPONENT_CAPTURED_Z = -OPPONENT_CAPTURED_FAN_DELTA_Z * (OPPONENT_CAPTURED_MAX_FAN - 1)

/** z of the "x2" markers: above the whole fan, so a marker never ends up behind the card fanned over the one it belongs to. */
export const OPPONENT_DOUBLE_MARKER_Z = OPPONENT_CAPTURED_Z + 1

/** x offset (from the dragon head card) of my own hand: just right of it, under the end of the row. */
const MY_HAND_X_OFFSET = 4

/**
 * x of my own hand (and, above it, my selection area). Like the rest of the left half of the table (the dragon row
 * and the decks), it hangs from the row rather than from an absolute x, so it follows the table's left edge.
 */
export function getMyHandX(context: MaterialContext): number {
  return getDragonHeadX(context.rules.players.length) + MY_HAND_X_OFFSET
}

/** Blank space kept below my own hand: half a card, plus a little. */
const MY_HAND_BOTTOM_MARGIN = 6

/**
 * y of my own hand: full size, it needs more room above the table's bottom edge than a panel does, so it hangs
 * from that edge on its own. It sits left of my panel (not under it, unlike the opponents'), so it is free not
 * to line up with my panel's row.
 */
export const MY_HAND_Y = TABLE_Y_MAX - MY_HAND_BOTTOM_MARGIN

/** y offset (from my hand) of my own selection area (card committed for the turn), just above the hand. */
export const SELECTION_Y_OFFSET = 11

/**
 * Panels (see PlayerPanelLocator/PlayerPanelContent) are placed as part of the table itself (a Location,
 * not a screen-space overlay), in a column near the table's right edge, one row per player. Opponents' hand
 * and captured pile (hidden entirely under their panel) are placed using these same coordinates, so both
 * always line up exactly, regardless of screen size or aspect ratio.
 */
export const PANEL_WIDTH = 16

/** Blank space kept between the panel column and the table's right edge (the panel casts a shadow of 0.5em at its own scale). */
const PANEL_RIGHT_MARGIN = 1

/** x of the panel column: right against the table's right edge. */
export const PANEL_COLUMN_X = TABLE_X_MAX - PANEL_RIGHT_MARGIN - PANEL_WIDTH / 2

/**
 * StyledPlayerPanel is authored in a 28em-wide box, rescaled to PANEL_WIDTH (see PlayerPanelContent). Its height is
 * not fixed but driven by its content (name, then timer + counter row), and its location does not stretch it: this
 * is the height it actually renders at, tuned by eye. Anything else and the row no longer lines up with the panel.
 */
export const PANEL_HEIGHT = 5.5

/** Blank space kept above every panel, where the hand tucked underneath peeks out (see PlayerHandLocator). */
const PANEL_TOP_MARGIN = 2

/** Blank space kept below the lowest panel, for the shadow it casts (0.5em at panel scale) to stay inside the table. */
const PANEL_BOTTOM_MARGIN = (PANEL_WIDTH * 0.5) / 28

/** Lowest a row may sit: its panel's bottom edge, plus the margin below it, stays inside the table. */
const PANEL_BOTTOM_ROW_Y = TABLE_Y_MAX - PANEL_BOTTOM_MARGIN - PANEL_HEIGHT / 2

/** Highest a row may sit: its panel's top edge, plus the margin above it, stays inside the table. */
const PANEL_TOP_ROW_Y = TABLE_Y_MIN + PANEL_TOP_MARGIN + PANEL_HEIGHT / 2

/** Spacing between two rows: the column is spread evenly over the table's whole height. */
function getPanelRowSpacing(context: MaterialContext): number {
  const opponents = context.rules.players.length - 1
  if (opponents < 1) return 0
  return (PANEL_BOTTOM_ROW_Y - PANEL_TOP_ROW_Y) / opponents
}

/**
 * y of a player's row, i.e. the center of their panel, which the hand / captured pile / markers hidden underneath
 * all share: mine (relative index 0) is at the bottom (against the table's bottom edge), each opponent one
 * panel-slot above the previous.
 */
export function getOpponentRowY(relativeIndex: number, context: MaterialContext): number {
  return PANEL_BOTTOM_ROW_Y - relativeIndex * getPanelRowSpacing(context)
}

/** y of a player's panel row. */
export function getPanelRowY(playerIndex: number, context: MaterialContext): number {
  return getOpponentRowY(playerIndex, context)
}

/** x offset (from an opponent's hand) of their captured pile: nudged right, just enough for the rotated card's top edge (its point icons, not its printed value) to peek out past the panel's left edge. */
export const OPPONENT_CAPTURED_X_OFFSET = -6

/** Extra x gap kept between an opponent's selection area and the current leftmost edge of their (fanning) captured pile, so the two never overlap. */
export const OPPONENT_SELECTION_CAPTURED_GAP = 7

/**
 * With only 2 players, there is a single opponent, whose panel sits at the top of the table: rather than
 * hiding their hand and selection (scaled down) under it, show them full size below it, the way a player
 * sitting across the table would hold them - upside down, see PlayerHandLocator.
 */
export function isSoloOpponent(playerIndex: number, context: MaterialContext): boolean {
  return playerIndex !== 0 && context.rules.players.length === 2
}

/** y offset (below their panel row) of the sole opponent's full-size hand, in a 2-player game: a clear gap under the panel. */
export const SOLO_OPPONENT_HAND_Y_OFFSET = 9

/** y offset (below the sole opponent's hand) of their selection area: most of the card peeks out clearly below the hand fan. */
export const SOLO_OPPONENT_SELECTION_Y_OFFSET = 11
