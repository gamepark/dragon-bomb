import { MaterialGameSetup } from '@gamepark/rules-api'
import { DragonBombOptions } from './DragonBombOptions'
import { DragonBombRules } from './DragonBombRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class DragonBombSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, DragonBombOptions> {
  Rules = DragonBombRules

  setupMaterial(_options: DragonBombOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
