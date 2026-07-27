export function getRowSize(playerCount: number): number {
  return playerCount === 2 ? 4 : playerCount
}

// The whole dragon (Tail + body row + Head) is centered on (0, 0), then shifted left to clear the
// opponents' panel column on the right (see PlayerRowLayout.ts). With fewer than 6 players the row
// is shorter, so it's shifted back right (and the table shrunk, see getTableXMin) to keep the table compact.
export const dragonRowY = -10
export const dragonRowGap = 8
const DRAGON_ROW_X_OFFSET = -20
const MAX_ROW_SIZE = 6
const ROW_SIZE_X_STEP = 5

/** How far right (from the 6-player baseline) the row shifts for a given (smaller) row size. */
function getDragonRowXOffset(rowSize: number): number {
  return DRAGON_ROW_X_OFFSET + ROW_SIZE_X_STEP * (MAX_ROW_SIZE - rowSize)
}

/** x coordinate of the Tail card, centering the whole row (rowSize body slots + Tail + Head) on x=0 */
export function getDragonTailX(rowSize: number): number {
  const totalColumns = rowSize + 2
  const centerOffset = (totalColumns - 1) / 2
  return -centerOffset * dragonRowGap + getDragonRowXOffset(rowSize)
}

/** x coordinate of the leftmost (x=0) body slot in the row */
export function getDragonRowStartX(rowSize: number): number {
  return getDragonTailX(rowSize) + dragonRowGap
}

/** x coordinate of the Head card */
export function getDragonHeadX(rowSize: number): number {
  return getDragonTailX(rowSize) + (rowSize + 1) * dragonRowGap
}

const TABLE_XMIN_BASE = -55
// Matches how fast getDragonTailX moves right as the row shrinks, so the table's left edge keeps
// the same clearance from the Tail card at every player count.
const TABLE_XMIN_STEP = dragonRowGap / 2 + ROW_SIZE_X_STEP

/** Left bound of the table: shrunk (increased) as the row gets shorter, to avoid empty space on the left. */
export function getTableXMin(playerCount: number): number {
  const rowSize = getRowSize(playerCount)
  return TABLE_XMIN_BASE + TABLE_XMIN_STEP * (MAX_ROW_SIZE - rowSize)
}
