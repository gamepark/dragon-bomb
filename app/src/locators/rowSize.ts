export function getRowSize(playerCount: number): number {
  return playerCount === 2 ? 4 : playerCount
}

export const dragonRowY = -10
export const dragonRowGap = 8
const MAX_ROW_SIZE = 6

const TABLE_XMIN_BASE = -53
/** How much narrower the table gets per body slot removed: the slot itself, plus a bit as the row drifts right. */
const TABLE_XMIN_STEP = dragonRowGap + 1

/**
 * Extra width given, per player count, to the tables with the fewest players: their dragon row is short, so the
 * table ends up narrow and everything is drawn bigger. This gives them back some room between the row and the
 * (fixed width) panel column.
 */
const EXTRA_WIDTH: Record<number, number> = { 2: 5, 3: 5, 4: 2 }

/** Left bound of the table: shrunk (increased) as the row gets shorter, to avoid empty space on the left. */
export function getTableXMin(playerCount: number): number {
  const rowSize = getRowSize(playerCount)
  return TABLE_XMIN_BASE + TABLE_XMIN_STEP * (MAX_ROW_SIZE - rowSize) - (EXTRA_WIDTH[playerCount] ?? 0)
}

/**
 * Clearance kept between the table's left edge and the Tail card. The whole dragon (Tail + body row + Head) hangs
 * from that edge, and so does everything placed relatively to it: the decks, the bombing zones and my own hand
 * (see PlayerRowLayout). The opposite edge, xMax, anchors the other half of the material: the panel column.
 */
const DRAGON_ROW_X_MARGIN = 5

/** x coordinate of the Tail card */
export function getDragonTailX(playerCount: number): number {
  return getTableXMin(playerCount) + DRAGON_ROW_X_MARGIN
}

/** x coordinate of the leftmost (x=0) body slot in the row */
export function getDragonRowStartX(playerCount: number): number {
  return getDragonTailX(playerCount) + dragonRowGap
}

/** x coordinate of the Head card */
export function getDragonHeadX(playerCount: number): number {
  return getDragonTailX(playerCount) + (getRowSize(playerCount) + 1) * dragonRowGap
}
