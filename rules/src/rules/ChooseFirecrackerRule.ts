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
 * placed last, freely chosen by their owner (see PlaceRocketRule).
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
    const chosen = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea).player(player).length
    return chosen >= this.cardsToChoose ? [this.endPlayerTurn(player)] : []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    const selection = this.material(MaterialType.FirecrackerCard).location(LocationType.SelectionArea)
    const revealMoves = selection.moveItems((item) => ({ ...item.location, rotation: false }))

    const isRocketCard = (index: number) => isRocket(this.material(MaterialType.FirecrackerCard).getItem(index)!.id as FirecrackerCard)

    const slotOrder = this.material(MaterialType.DragonCard)
      .location(LocationType.DragonRow)
      .sort((item) => item.location.x!)
      .getIndexes()

    const nonRocketSelection = selection.index((index) => !isRocketCard(index)).sort(
      (item) => firecrackerPower[item.id as FirecrackerCard],
      (item) => firecrackerLanterns[item.id as FirecrackerCard]
    )
    const rocketSelection = selection.index((index) => isRocketCard(index))

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

    return [...revealMoves, ...nextDistributionStep(this)]
  }
}
