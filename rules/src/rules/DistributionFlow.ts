import { MaterialMove, MaterialRulesPart, PlayerTurnRule } from '@gamepark/rules-api'
import { DragonCard, dragonVitality } from '../material/DragonCard'
import { FirecrackerCard, firecrackerPower } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

type Rules = MaterialRulesPart<number, MaterialType, LocationType, RuleId>

/**
 * Shared by ChooseFirecrackerRule, DistributeRule, ExplosionRule and PlaceRocketRule: move on to the
 * next non-Rocket placement turn, then Rocket placements (they are always placed last), then finally
 * CompleteDragonRow once every committed card has been placed.
 */
export function nextDistributionStep(rules: Rules): MaterialMove[] {
  const rank = rules.remind<number>(Memory.NextRank) ?? 0
  const nextPlayer = rules.remind<number[]>(Memory.PlacementPlayers)?.[rank]
  if (nextPlayer !== undefined) return [rules.startPlayerTurn(RuleId.Distribute, nextPlayer)]

  const rocketRank = rules.remind<number>(Memory.NextRocketRank) ?? 0
  const nextRocketPlayer = rules.remind<number[]>(Memory.RocketPlayers)?.[rocketRank]
  if (nextRocketPlayer !== undefined) return [rules.startPlayerTurn(RuleId.PlaceRocket, nextRocketPlayer)]

  return [rules.startRule(RuleId.CompleteDragonRow)]
}

/** Shared by DistributeRule and PlaceRocketRule: check a slot's total power against its Dragon card's vitality. */
export function resolveSlot(rules: PlayerTurnRule<number, MaterialType, LocationType, RuleId>, slotIndex: number): MaterialMove[] {
  const vitality = dragonVitality[rules.material(MaterialType.DragonCard).getItem(slotIndex)!.id as DragonCard] ?? 0
  const totalPower = rules
    .material(MaterialType.FirecrackerCard)
    .location(LocationType.BombingZone)
    .parent(slotIndex)
    .getItems()
    .reduce((sum, item) => sum + (firecrackerPower[item.id as FirecrackerCard] ?? 0), 0)

  if (totalPower < vitality) return nextDistributionStep(rules)

  rules.memorize(Memory.ExplodingSlot, slotIndex)
  return [rules.startPlayerTurn(RuleId.Explosion, rules.player)]
}
