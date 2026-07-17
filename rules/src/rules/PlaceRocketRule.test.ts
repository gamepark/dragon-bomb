import { isStartRule, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { PlaceRocketRule } from './PlaceRocketRule'
import { RuleId } from './RuleId'

function game(overrides: Partial<MaterialGame<number, MaterialType, LocationType, RuleId>>): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return { players: [1, 2, 3], items: {}, memory: {}, ...overrides } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('PlaceRocketRule', () => {
  test('propose un coup par corps de dragon encore présent', () => {
    const g = game({
      rule: { id: RuleId.PlaceRocket, player: 1 },
      items: {
        [MaterialType.DragonCard]: [
          { id: DragonCard.Body5, location: { type: LocationType.DragonRow, x: 0 } },
          { id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x: 1 } }
        ],
        [MaterialType.FirecrackerCard]: [{ id: FirecrackerCard.Rocket_1, location: { type: LocationType.SelectionArea, player: 1, rotation: false } }]
      },
      memory: { [Memory.NextRocketRank]: 0, [Memory.RocketOrder]: [0] }
    })
    const moves = new PlaceRocketRule(g).getPlayerMoves()
    expect(moves).toHaveLength(2)
    expect(moves.every((move) => 'itemIndex' in move && move.itemIndex === 0)).toBe(true)
    expect(moves.map((move) => 'location' in move && move.location.parent).sort()).toEqual([0, 1])
  })

  test('corps du dragon vide : passe la Fusée plutôt que de bloquer le joueur', () => {
    const g = game({
      rule: { id: RuleId.PlaceRocket, player: 1 },
      items: { [MaterialType.DragonCard]: [], [MaterialType.FirecrackerCard]: [] },
      memory: { [Memory.NextRocketRank]: 0, [Memory.RocketOrder]: [0], [Memory.RocketPlayers]: [1] }
    })
    const rules = new PlaceRocketRule(g)
    const moves = rules.onRuleStart()
    expect(g.memory[Memory.NextRocketRank]).toBe(1)
    expect(moves.some((move) => isStartRule(move) && move.id === RuleId.CompleteDragonRow)).toBe(true)
  })
})
