import { isStartPlayerTurn, isStartRule, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ChooseFirecrackerRule } from './ChooseFirecrackerRule'
import { DistributeRule } from './DistributeRule'
import { nextDistributionStep, resolveSlot } from './DistributionFlow'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

function game(overrides: Partial<MaterialGame<number, MaterialType, LocationType, RuleId>>): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return { players: [1, 2, 3], items: {}, memory: {}, ...overrides } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('resolveSlot', () => {
  test('puissance insuffisante : ne fait pas exploser le dragon, passe au coup suivant', () => {
    const g = game({
      items: {
        [MaterialType.DragonCard]: [{ id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x: 0 } }],
        [MaterialType.FirecrackerCard]: [{ id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } }]
      },
      rule: { id: RuleId.Distribute, player: 1 }
    })
    const moves = resolveSlot(new DistributeRule(g), 0)
    expect(moves).toHaveLength(1)
    expect(isStartRule(moves[0]) && moves[0].id === RuleId.CompleteDragonRow).toBe(true)
    expect(g.memory[Memory.ExplodingSlot]).toBeUndefined()
  })

  test('puissance suffisante : mémorise le slot et démarre Explosion via startRule, jamais startPlayerTurn', () => {
    const g = game({
      items: {
        [MaterialType.DragonCard]: [{ id: DragonCard.Body5, location: { type: LocationType.DragonRow, x: 0 } }],
        [MaterialType.FirecrackerCard]: [{ id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } }]
      },
      rule: { id: RuleId.Distribute, player: 1 }
    })
    const moves = resolveSlot(new DistributeRule(g), 0)
    expect(moves).toHaveLength(1)
    expect(isStartRule(moves[0]) && moves[0].id === RuleId.Explosion).toBe(true)
    expect(isStartPlayerTurn(moves[0])).toBe(false)
    expect(g.memory[Memory.ExplodingSlot]).toBe(0)
  })
})

describe('nextDistributionStep', () => {
  test('joueur suivant différent du joueur actif : startPlayerTurn', () => {
    const g = game({
      rule: { id: RuleId.Distribute, player: 1 },
      memory: { [Memory.NextRank]: 1, [Memory.PlacementPlayers]: [1, 2] }
    })
    const moves = nextDistributionStep(new DistributeRule(g))
    expect(moves).toHaveLength(1)
    expect(isStartPlayerTurn(moves[0]) && moves[0].id === RuleId.Distribute && moves[0].player === 2).toBe(true)
  })

  test('[régression] joueur suivant identique au joueur actif : startRule, pas startPlayerTurn (sinon undo cassé)', () => {
    // Cas d'une partie à 2 joueurs où les 2 cartes commises par le même joueur se retrouvent
    // consécutives dans l'ordre de pose trié par puissance.
    const g = game({
      rule: { id: RuleId.Distribute, player: 1 },
      memory: { [Memory.NextRank]: 1, [Memory.PlacementPlayers]: [1, 1] }
    })
    const moves = nextDistributionStep(new DistributeRule(g))
    expect(moves).toHaveLength(1)
    expect(isStartRule(moves[0]) && moves[0].id === RuleId.Distribute).toBe(true)
    expect(isStartPlayerTurn(moves[0])).toBe(false)
  })

  test('appelé depuis une SimultaneousRule (aucun joueur actif unique) : toujours startPlayerTurn', () => {
    const g = game({
      rule: { id: RuleId.ChooseFirecracker, players: [1, 2, 3] },
      memory: { [Memory.NextRank]: 0, [Memory.PlacementPlayers]: [2] }
    })
    const moves = nextDistributionStep(new ChooseFirecrackerRule(g))
    expect(isStartPlayerTurn(moves[0]) && moves[0].id === RuleId.Distribute && moves[0].player === 2).toBe(true)
  })

  test('plus de placement ni de fusée en attente : passe à CompleteDragonRow', () => {
    const g = game({ rule: { id: RuleId.Distribute, player: 1 }, memory: {} })
    const moves = nextDistributionStep(new DistributeRule(g))
    expect(isStartRule(moves[0]) && moves[0].id === RuleId.CompleteDragonRow).toBe(true)
  })
})
