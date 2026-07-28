import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { dragonRowGap, dragonRowY, getDragonRowStartX, getRowSize } from './rowSize'

/**
 * Do NOT override getPositionDependencies here: ListLocator's default (the number of cards in the row)
 * is exactly what we need. DragonRowStrategy shifts the x of the cards already in the row when a new one
 * is dealt in, and react-game only animates those "siblings" when the position dependencies differ between
 * the current state and the state simulated after the move (see ItemAnimations.computeSiblingAnimation).
 * The dependencies are computed from the item's *current* location, so an x changed by a location strategy
 * is invisible there: without the card count, the existing cards would only jump to their new slot once the
 * new card's animation is over. The row start x depends on the player count, but that is fixed for the whole
 * game, so it does not have to be declared.
 */
class DragonRowLocator extends ListLocator {
  gap = { x: dragonRowGap }

  getCoordinates(_location: Location, context: MaterialContext) {
    const rowSize = getRowSize(context.rules.players.length)
    return { x: getDragonRowStartX(rowSize), y: dragonRowY }
  }
}

export const dragonRowLocator = new DragonRowLocator()
