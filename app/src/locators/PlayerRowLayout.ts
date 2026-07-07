/**
 * All 6 players sit on a single row at the bottom of the table. My own column
 * (relative index 0, see `getRelativePlayerIndex`) is always the biggest one;
 * opponents are smaller and ordered left to right by seat, ending right before
 * my column, so everyone fits on screen regardless of player count.
 */

const TABLE_WIDTH = 100

const BIG_WIDTH = 40

/** Scale applied to opponents' material (card size, hand radius), regardless of player count. */
export const OPPONENT_SCALE = 0.5

/** Left-to-right order of relative player indexes. Fixed for the whole game (no recentering). */
export function getSlotOrder(playerCount: number): number[] {
  const opponents = Array.from({ length: playerCount - 1 }, (_, i) => i + 1)
  return [0, ...opponents]
}

/** Column width shrinks as more opponents need to share the remaining space, capped at the size of my own column. */
export function getColumnWidth(relativeIndex: number, playerCount: number): number {
  if (relativeIndex === 0) return BIG_WIDTH
  return Math.min(BIG_WIDTH, (TABLE_WIDTH - BIG_WIDTH) / (playerCount - 1))
}

/** Center x of a player's column, using a "space-around" distribution over the (uneven) column widths. */
export function getColumnCenterX(relativeIndex: number, playerCount: number): number {
  const order = getSlotOrder(playerCount)
  const slot = order.indexOf(relativeIndex)
  const widths = order.map((idx) => getColumnWidth(idx, playerCount))
  const total = widths.reduce((sum, w) => sum + w, 0)
  const margin = (TABLE_WIDTH - total) / (2 * order.length)

  let x = -TABLE_WIDTH / 2 + margin
  for (let i = 0; i < slot; i++) {
    x += widths[i] + 2 * margin
  }
  return x + widths[slot] / 2
}

/** Common y of the row of hands, at the bottom of the table. */
export const ROW_Y = 25

/** y offset (from ROW_Y) of the selection area (card committed for the turn), just above the hand. */
export const SELECTION_Y_OFFSET = 12

/** y offset (from ROW_Y) of the captured dragons / double markers, pulled toward the table center. */
export const CAPTURED_Y_OFFSET = 12
