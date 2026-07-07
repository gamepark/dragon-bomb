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
