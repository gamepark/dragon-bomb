import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  MaterialGame,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { dragonRowStrategy } from './material/DragonRowStrategy'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ChooseFirecrackerRule } from './rules/ChooseFirecrackerRule'
import { DistributeRule } from './rules/DistributeRule'
import { RuleId } from './rules/RuleId'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class DragonBombRules
  extends SecretMaterialRules<number, MaterialType, LocationType, RuleId>
  implements
    TimeLimit<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number>
{
  rules = {
    [RuleId.ChooseFirecracker]: ChooseFirecrackerRule,
    [RuleId.Distribute]: DistributeRule
  }

  hidingStrategies = {
    [MaterialType.DragonCard]: {
      [LocationType.DragonDeck]: hideItemId
    },
    [MaterialType.FirecrackerCard]: {
      [LocationType.FirecrackerDeck]: hideItemId,
      [LocationType.PlayerHand]: hideItemIdToOthers,
      [LocationType.SelectionArea]: hideItemIdToOthers,
      [LocationType.PlayerDoubleMarker]: hideItemId
    }
  }

  locationsStrategies = {
    [MaterialType.DragonCard]: {
      [LocationType.DragonDeck]: new PositiveSequenceStrategy(),
      [LocationType.DragonRow]: dragonRowStrategy,
      [LocationType.PlayerCapturedDragon]: new PositiveSequenceStrategy()
    },
    [MaterialType.FirecrackerCard]: {
      [LocationType.FirecrackerDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.SelectionArea]: new PositiveSequenceStrategy(),
      [LocationType.RevealArea]: new PositiveSequenceStrategy(),
      [LocationType.PlayerDoubleMarker]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: number): number {
    return playerId
  }
}
