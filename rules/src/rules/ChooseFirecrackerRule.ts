import { isMoveItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { FirecrackerCard, firecrackerLanterns, firecrackerPower, isRocket } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { nextDistributionStep } from './DistributionFlow'
import { Memory } from './Memory'

/**
 * Step 1 - "Choix de cartes Pétard": every player secretly picks one Firecracker card from their
 * hand (2 cards in a 2-player game) and places it face down in front of them (SelectionArea).
 * Once every player has chosen, the cards are revealed and the placement order is fixed once and for
 * all: non-Rocket cards by ascending power (ties broken by fewest lanterns), Rockets set aside to be
 * placed last (in ascending lantern order), freely placed by their owner (see PlaceRocketRule).
 */
export class ChooseFirecrackerRule extends SimultaneousRule {
  get cardsToChoose(): number {
    return this.game.players.length === 2 ? 2 : 1
  }

  getActivePlayerLegalMoves(player: number): MaterialMove[] {
    return this.material(MaterialType.FirecrackerCard)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.SelectionArea, player })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.FirecrackerCard)(move) || move.location.type !== LocationType.SelectionArea) return []
    const player = move.location.player!
    if (this.isTurnToPlay(player)) {
      const chosen = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea).player(player).length
      return chosen >= this.cardsToChoose ? [this.endPlayerTurn(player)] : []
    }
    // Reveal phase (see getMovesAfterPlayersDone): the order can only be computed once the last card
    // is face up, see planDistribution.
    if (move.location.rotation !== false) return []
    const selection = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea)
    if (selection.getItems().some((item) => item.location.rotation !== false)) return []
    return this.planDistribution()
  }

  /** Reveal every committed card, in place (they stay in their owner's SelectionArea). */
  getMovesAfterPlayersDone(): MaterialMove[] {
    return this.material(MaterialType.FirecrackerCard)
      .location(LocationType.SelectionArea)
      .moveItems((item) => ({ ...item.location, rotation: false }))
  }

  /**
   * Fixes the placement order for the whole round.
   *
   * It *must* run once every committed card has been revealed, and never before: the order depends on
   * the cards' ids, and the players' clients replay the rules locally. As long as a card is face down,
   * its id is hidden from the other players, so their clients would compute a different order than the
   * server (wrong card auto-placed, then snapped back when the server's moves arrive, and players left
   * with no legal move).
   */
  planDistribution(): MaterialMove[] {
    const selection = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea)
    const isRocketCard = (index: number) => isRocket(this.material(MaterialType.FirecrackerCard).getItem(index)!.id as FirecrackerCard)

    const slotOrder = this.material(MaterialType.DragonCard)
      .location(LocationType.DragonRow)
      .sort((item) => item.location.x!)
      .getIndexes()

    const nonRocketSelection = selection.index((index) => !isRocketCard(index)).sort(
      (item) => firecrackerPower[item.id as FirecrackerCard],
      (item) => firecrackerLanterns[item.id as FirecrackerCard]
    )
    // Rockets all share the same power (2): they are resolved in ascending lantern order.
    const rocketSelection = selection.index(isRocketCard).sort((item) => firecrackerLanterns[item.id as FirecrackerCard])

    this.memorize(Memory.SlotOrder, slotOrder)
    this.memorize(Memory.PlacementOrder, nonRocketSelection.getIndexes())
    this.memorize(
      Memory.PlacementPlayers,
      nonRocketSelection.getItems().map((item) => item.location.player!)
    )
    this.memorize(Memory.NextRank, 0)
    this.memorize(Memory.RocketOrder, rocketSelection.getIndexes())
    this.memorize(
      Memory.RocketPlayers,
      rocketSelection.getItems().map((item) => item.location.player!)
    )
    this.memorize(Memory.NextRocketRank, 0)

    return nextDistributionStep(this)
  }
}
