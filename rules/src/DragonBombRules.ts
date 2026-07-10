import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { dragonRowStrategy } from './material/DragonRowStrategy'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ChooseFirecrackerRule } from './rules/ChooseFirecrackerRule'
import { CompleteDragonRowRule } from './rules/CompleteDragonRowRule'
import { CompletePlayersHandsRule } from './rules/CompletePlayersHandsRule'
import { DistributeRule } from './rules/DistributeRule'
import { EndOfRoundRule } from './rules/EndOfRoundRule'
import { ExplosionRule } from './rules/ExplosionRule'
import { Memory } from './rules/Memory'
import { PlaceRocketRule } from './rules/PlaceRocketRule'
import { RuleId } from './rules/RuleId'

/**
 * Selected Firecracker cards stay hidden from other players until they are revealed in place
 * (rotation set to false, see {@link ChooseFirecrackerRule.getMovesAfterPlayersDone}), without moving
 * out of SelectionArea.
 */
function hideUnrevealedSelection(item: MaterialItem<number, LocationType>, player?: number): string[] {
  if (item.location.rotation === false) return []
  return hideItemIdToOthers(item, player)
}

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class DragonBombRules
  extends SecretMaterialRules<number, MaterialType, LocationType, RuleId>
  implements TimeLimit<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number> {
  rules = {
    [RuleId.ChooseFirecracker]: ChooseFirecrackerRule,
    [RuleId.Distribute]: DistributeRule,
    [RuleId.PlaceRocket]: PlaceRocketRule,
    [RuleId.Explosion]: ExplosionRule,
    [RuleId.CompleteDragonRow]: CompleteDragonRowRule,
    [RuleId.CompletePlayersHands]: CompletePlayersHandsRule,
    [RuleId.EndOfRound]: EndOfRoundRule
  }

  hidingStrategies = {
    [MaterialType.DragonCard]: {
      [LocationType.DragonDeck]: hideItemId
    },
    [MaterialType.FirecrackerCard]: {
      [LocationType.FirecrackerDeck]: hideItemId,
      [LocationType.PlayerHand]: hideItemIdToOthers,
      [LocationType.SelectionArea]: hideUnrevealedSelection,
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
      [LocationType.FirecrackerDiscard]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.SelectionArea]: new PositiveSequenceStrategy(),
      [LocationType.BombingZone]: new PositiveSequenceStrategy(),
      [LocationType.PlayerDoubleMarker]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: number): number {
    return this.remind<number>(Memory.Score, playerId) ?? 0
  }

  getTieBreaker(tieBreaker: number, playerId: number): number | undefined {
    if (tieBreaker > 1) return undefined
    return -this.material(MaterialType.DragonCard).location(LocationType.PlayerCapturedDragon).player(playerId).length
  }
}
