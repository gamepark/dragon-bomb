import { isEndGame, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { EndOfRoundRule } from './EndOfRoundRule'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

function game(scores: Record<number, number>): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players: [1, 2],
    rule: { id: RuleId.EndOfRound, players: [1, 2] },
    items: {
      [MaterialType.DragonCard]: [{ id: DragonCard.Body3, location: { type: LocationType.PlayerCapturedDragon, player: 1, x: 0 } }]
    },
    memory: { [Memory.Score]: scores, [Memory.DoubledCaptures]: [0] }
  } as unknown as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('EndOfRoundRule', () => {
  test('les marqueurs x2 ne durent que la manche : oubliés quand la table est remise en place', () => {
    const rules = new EndOfRoundRule(game({ 1: 12, 2: 9 }))
    rules.onRuleStart()
    expect(rules.remind<number[]>(Memory.DoubledCaptures)).toBeUndefined()
  })

  test('les marqueurs x2 sont conservés quand la partie se termine, pour afficher les scores finaux', () => {
    const rules = new EndOfRoundRule(game({ 1: 50, 2: 9 }))
    expect(rules.onRuleStart().some(isEndGame)).toBe(true)
    expect(rules.remind<number[]>(Memory.DoubledCaptures)).toEqual([0])
  })
})
