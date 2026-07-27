import { MaterialGameSetup } from '@gamepark/rules-api'
import { DragonBombOptions } from './DragonBombOptions'
import { DragonBombRules } from './DragonBombRules'
import { DragonCard, dragonBodyCards } from './material/DragonCard'
import { firecrackerCards } from './material/FirecrackerCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class DragonBombSetup extends MaterialGameSetup<number, MaterialType, LocationType, DragonBombOptions, RuleId> {
  Rules = DragonBombRules

  get rowSize(): number {
    return this.players.length === 2 ? 4 : this.players.length
  }

  get handLimit(): number {
    return this.players.length === 2 ? 4 : 3
  }

  setupMaterial(_options: DragonBombOptions) {
    this.setupDragon()
    this.setupFirecrackers()
    //this.setupDebugPlayerAreas()
  }

  /**
   * DEBUG ONLY: gives every player 4 captured Dragon cards and 1 selected Firecracker card, so the
   * captured pile / selection area locators can be previewed without having to actually play a round.
   * Remove this call (and method) once the positions have been checked.
   */
  setupDebugPlayerAreas() {
    const selectionCount = this.players.length === 2 ? 2 : 1
    this.players.forEach((player, index) => {
      this.material(MaterialType.DragonCard).createItems(
        Array.from({ length: 4 }, (_, i) => ({
          id: dragonBodyCards[(index * 4 + i) % dragonBodyCards.length],
          location: { type: LocationType.PlayerCapturedDragon, player }
        }))
      )
      this.material(MaterialType.FirecrackerCard).createItems(
        Array.from({ length: selectionCount }, (_, i) => ({
          id: firecrackerCards[(index * selectionCount + i) % firecrackerCards.length],
          location: { type: LocationType.SelectionArea, player }
        }))
      )
    })
  }

  setupDragon() {
    this.material(MaterialType.DragonCard).createItem({ id: DragonCard.Tail, location: { type: LocationType.DragonTailSlot } })
    this.material(MaterialType.DragonCard).createItem({ id: DragonCard.Head, location: { type: LocationType.DragonHeadSlot } })
    this.material(MaterialType.DragonCard).createItems(dragonBodyCards.map((id) => ({ id, location: { type: LocationType.DragonDeck } })))
    this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).shuffle()
    this.material(MaterialType.DragonCard).location(LocationType.DragonDeck).deck().deal({ type: LocationType.DragonRow }, this.rowSize)
  }

  setupFirecrackers() {
    this.material(MaterialType.FirecrackerCard).createItems(firecrackerCards.map((id) => ({ id, location: { type: LocationType.FirecrackerDeck } })))
    this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck).shuffle()
    for (const player of this.players) {
      this.material(MaterialType.FirecrackerCard)
        .location(LocationType.FirecrackerDeck)
        .deck()
        .deal({ type: LocationType.PlayerHand, player }, this.handLimit)
    }
  }

  start() {
    this.startSimultaneousRule(RuleId.ChooseFirecracker)
  }
}
