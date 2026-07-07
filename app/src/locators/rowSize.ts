export function getRowSize(playerCount: number): number {
  return playerCount === 2 ? 4 : playerCount
}

// The whole dragon (Tail + body row + Head) is centered on (0, 0).
export const dragonRowY = -15
export const dragonRowGap = 8

/** x coordinate of the Tail card, centering the whole row (rowSize body slots + Tail + Head) on x=0 */
export function getDragonTailX(rowSize: number): number {
  const totalColumns = rowSize + 2
  const centerOffset = (totalColumns - 1) / 2
  return -centerOffset * dragonRowGap
}

/** x coordinate of the leftmost (x=0) body slot in the row */
export function getDragonRowStartX(rowSize: number): number {
  return getDragonTailX(rowSize) + dragonRowGap
}

/** x coordinate of the Head card */
export function getDragonHeadX(rowSize: number): number {
  return getDragonTailX(rowSize) + (rowSize + 1) * dragonRowGap
}
