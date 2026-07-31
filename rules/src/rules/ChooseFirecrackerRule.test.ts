import { isEndPlayerTurn, isStartPlayerTurn, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ChooseFirecrackerRule } from './ChooseFirecrackerRule'
import { Memory } from './Memory'
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

/** Every player has committed one card and every card is already revealed in its owner's SelectionArea */
function revealedGame(cards: FirecrackerCard[], owners: number[]): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players: [...new Set(owners)],
    items: {
      [MaterialType.DragonCard]: owners.map((_, x) => ({ id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x } })),
      [MaterialType.FirecrackerCard]: cards.map((id, index) => ({
        id,
        location: { type: LocationType.SelectionArea, player: owners[index], x: 0, rotation: false }
      }))
    },
    memory: {},
    rule: { id: RuleId.ChooseFirecracker, players: [] }
  } as unknown as MaterialGame<number, MaterialType, LocationType, RuleId>
}

function revealMove(itemIndex: number, player: number): MoveItem {
  return {
    kind: 1,
    type: 1,
    itemType: MaterialType.FirecrackerCard,
    itemIndex,
    location: { type: LocationType.SelectionArea, player, x: 0, rotation: false }
  } as MoveItem
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

  test("ne redéclenche pas endPlayerTurn pour un joueur déjà inactif (moves de révélation)", () => {
    const g = game([1, 2, 3], [FirecrackerCard.Firecracker5_1])
    g.items[MaterialType.FirecrackerCard]![0].location = { type: LocationType.SelectionArea, player: 1 }
    g.rule!.players = [] // player 1 already ended their turn before reveal moves are played
    const rules = new ChooseFirecrackerRule(g)
    const consequences = rules.afterItemMove(selectionMove(0))
    expect(consequences).toHaveLength(0)
  })

  test('révèle toutes les cartes choisies sans les déplacer', () => {
    const g = revealedGame([FirecrackerCard.Rocket_3, FirecrackerCard.Firecracker7_1], [1, 2])
    g.items[MaterialType.FirecrackerCard]!.forEach((item) => delete item.location.rotation)
    g.rule!.players = []
    const moves = new ChooseFirecrackerRule(g).getMovesAfterPlayersDone()
    expect(moves).toHaveLength(2)
    expect(
      moves.every((move) => 'location' in move && move.location.type === LocationType.SelectionArea && move.location.rotation === false)
    ).toBe(true)
  })

  test("[régression] l'ordre de pose n'est calculé qu'une fois la dernière carte retournée", () => {
    const g = revealedGame([FirecrackerCard.Firecracker7_1, FirecrackerCard.Firecracker5_1], [1, 2])
    // Second card still face down: computing the order now would use an id the other players cannot
    // see yet, and their clients would memorize a different order than the server.
    delete g.items[MaterialType.FirecrackerCard]![1].location.rotation
    const consequences = new ChooseFirecrackerRule(g).afterItemMove(revealMove(0, 1))
    expect(consequences).toHaveLength(0)
    expect(g.memory[Memory.PlacementOrder]).toBeUndefined()
  })

  test('dernière carte retournée : fixe l\'ordre de pose et lance la distribution', () => {
    const g = revealedGame([FirecrackerCard.Firecracker7_1, FirecrackerCard.Firecracker5_1], [1, 2])
    const consequences = new ChooseFirecrackerRule(g).afterItemMove(revealMove(1, 2))
    expect(g.memory[Memory.PlacementOrder]).toEqual([1, 0]) // ordre croissant de puissance : 5 puis 7
    expect(g.memory[Memory.PlacementPlayers]).toEqual([2, 1])
    expect(consequences.some((move) => isStartPlayerTurn(move) && move.id === RuleId.Distribute && move.player === 2)).toBe(true)
  })

  test('les Fusées sont résolues dans l\'ordre croissant des lanternes', () => {
    const g = revealedGame([FirecrackerCard.Rocket_4, FirecrackerCard.Rocket_2, FirecrackerCard.Rocket_5], [1, 2, 3])
    new ChooseFirecrackerRule(g).afterItemMove(revealMove(2, 3))
    expect(g.memory[Memory.PlacementOrder]).toEqual([])
    expect(g.memory[Memory.RocketOrder]).toEqual([1, 0, 2]) // 2, 4 puis 5 lanternes
    expect(g.memory[Memory.RocketPlayers]).toEqual([2, 1, 3])
  })
})
