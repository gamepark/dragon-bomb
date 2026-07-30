import { isMoveItemType, isStartRule, isStartSimultaneousRule, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CompleteDragonRowRule } from './CompleteDragonRowRule'
import { RuleId } from './RuleId'

function game(rowSize: number, deckSize: number): MaterialGame<number, MaterialType, LocationType, RuleId> {
  const row = Array.from({ length: rowSize }, (_, x) => ({ id: DragonCard.Body3, location: { type: LocationType.DragonRow, x } }))
  const deck = Array.from({ length: deckSize }, (_, x) => ({ id: DragonCard.Body5, location: { type: LocationType.DragonDeck, x } }))
  return {
    players: [1, 2, 3],
    items: { [MaterialType.DragonCard]: [...row, ...deck] },
    memory: {},
    rule: { id: RuleId.CompleteDragonRow, players: [1, 2, 3] }
  } as unknown as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('CompleteDragonRowRule', () => {
  test('rangée complète : rien à distribuer, on passe à la reconstitution des mains', () => {
    const moves = new CompleteDragonRowRule(game(3, 5)).onRuleStart()
    expect(moves).toHaveLength(1)
    expect(isStartRule(moves[0]) && moves[0].id === RuleId.CompletePlayersHands).toBe(true)
  })

  test('assez de cartes : la rangée est complétée puis on reconstitue les mains', () => {
    const moves = new CompleteDragonRowRule(game(1, 5)).onRuleStart()
    expect(moves.filter(isMoveItemType(MaterialType.DragonCard))).toHaveLength(2)
    expect(isStartRule(moves[2]) && moves[2].id === RuleId.CompletePlayersHands).toBe(true)
  })

  test('pas assez de cartes : les dernières cartes de la pioche sont quand même distribuées avant la fin de manche', () => {
    const moves = new CompleteDragonRowRule(game(0, 2)).onRuleStart()
    const deals = moves.filter(isMoveItemType(MaterialType.DragonCard))
    expect(deals).toHaveLength(2)
    expect(deals.every((move) => move.location.type === LocationType.DragonRow)).toBe(true)
    expect(isStartSimultaneousRule(moves[2]) && moves[2].id === RuleId.EndOfRound).toBe(true)
  })

  test('pioche vide : fin de manche sans distribution', () => {
    const moves = new CompleteDragonRowRule(game(1, 0)).onRuleStart()
    expect(moves).toHaveLength(1)
    expect(isStartSimultaneousRule(moves[0]) && moves[0].id === RuleId.EndOfRound).toBe(true)
  })
})
