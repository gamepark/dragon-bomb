import { MaterialRulesPart } from '@gamepark/rules-api'
import { DragonCard, dragonHandLimitBonus } from '../material/DragonCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

type Rules = MaterialRulesPart<number, MaterialType, LocationType, RuleId>

/**
 * Base hand limit (2-player games hold 4 cards, others 3), plus 1 per captured "13" Dragon card the
 * player currently holds ("jusqu'à la fin de la manche" - EndOfRoundRule resets everyone's captured
 * cards before dealing the new round's hands, so the bonus naturally clears then).
 */
export function getHandLimit(rules: Rules, player: number): number {
  const base = rules.game.players.length === 2 ? 4 : 3
  const bonus = rules
    .material(MaterialType.DragonCard)
    .location(LocationType.PlayerCapturedDragon)
    .player(player)
    .getItems()
    .reduce((sum, item) => sum + (dragonHandLimitBonus[item.id as DragonCard] ?? 0), 0)
  return base + bonus
}
