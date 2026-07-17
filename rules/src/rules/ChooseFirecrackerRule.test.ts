import { isEndPlayerTurn, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ChooseFirecrackerRule } from './ChooseFirecrackerRule'
import { RuleId } from './RuleId'

function game(players: number[], hand: FirecrackerCard[]): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players,
    items: { [MaterialType.FirecrackerCard]: hand.map((id) => ({ id, location: { type: LocationType.PlayerHand, player: 1 } })) },
    memory: {},
    rule: { id: RuleId.ChooseFirecracker, players }
  } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

function selectionMove(itemIndex: number): MoveItem {
  return { kind: 1, type: 1, itemType: MaterialType.FirecrackerCard, itemIndex, location: { type: LocationType.SelectionArea, player: 1 } } as MoveItem
}

describe('ChooseFirecrackerRule', () => {
  test('une seule carte à choisir à partir de 3 joueurs', () => {
    expect(new ChooseFirecrackerRule(game([1, 2, 3], [])).cardsToChoose).toBe(1)
  })

  test('deux cartes à choisir en partie à 2 joueurs', () => {
    expect(new ChooseFirecrackerRule(game([1, 2], [])).cardsToChoose).toBe(2)
  })

  test('propose de choisir chaque carte de la main du joueur', () => {
    const g = game([1, 2, 3], [FirecrackerCard.Firecracker5_1, FirecrackerCard.Firecracker6_1])
    const moves = new ChooseFirecrackerRule(g).getActivePlayerLegalMoves(1)
    expect(moves).toHaveLength(2)
    expect(moves.every((move) => 'location' in move && move.location.type === LocationType.SelectionArea)).toBe(true)
  })

  test('3 joueurs ou plus : le tour se termine dès la 1ère carte choisie', () => {
    const g = game([1, 2, 3], [FirecrackerCard.Firecracker5_1])
    const rules = new ChooseFirecrackerRule(g)
    g.items[MaterialType.FirecrackerCard]![0].location = { type: LocationType.SelectionArea, player: 1 }
    const consequences = rules.afterItemMove(selectionMove(0))
    expect(consequences.some((move) => isEndPlayerTurn(move) && move.player === 1)).toBe(true)
  })

  test('2 joueurs : le tour ne se termine pas après une seule carte choisie sur 2', () => {
    const g = game([1, 2], [FirecrackerCard.Firecracker5_1, FirecrackerCard.Firecracker6_1])
    const rules = new ChooseFirecrackerRule(g)
    g.items[MaterialType.FirecrackerCard]![0].location = { type: LocationType.SelectionArea, player: 1 }
    const consequences: MaterialMove[] = rules.afterItemMove(selectionMove(0))
    expect(consequences).toHaveLength(0)
  })

  test('2 joueurs : le tour se termine après les 2 cartes choisies', () => {
    const g = game([1, 2], [FirecrackerCard.Firecracker5_1, FirecrackerCard.Firecracker6_1])
    const rules = new ChooseFirecrackerRule(g)
    g.items[MaterialType.FirecrackerCard]![0].location = { type: LocationType.SelectionArea, player: 1 }
    g.items[MaterialType.FirecrackerCard]![1].location = { type: LocationType.SelectionArea, player: 1 }
    const consequences = rules.afterItemMove(selectionMove(1))
    expect(consequences.some((move) => isEndPlayerTurn(move) && move.player === 1)).toBe(true)
  })
})
