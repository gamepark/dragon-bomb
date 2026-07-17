import { describe, expect, test } from 'vitest'
import { DragonBombSetup } from './DragonBombSetup'
import { DragonCard } from './material/DragonCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

function setupGame(players: number) {
  return new DragonBombSetup().setup({ players })
}

describe('DragonBombSetup', () => {
  test.each([2, 3, 4, 5, 6])('met en place une partie à %i joueurs', (playerCount) => {
    const game = setupGame(playerCount)
    expect(game.players).toHaveLength(playerCount)

    const dragonItems = game.items[MaterialType.DragonCard]!
    const expectedRowSize = playerCount === 2 ? 4 : playerCount
    const dragonRow = dragonItems.filter((item) => item.location.type === LocationType.DragonRow)
    expect(dragonRow).toHaveLength(expectedRowSize)
    // Queue + Tête + 19 cartes Corps de Dragon
    expect(dragonItems).toHaveLength(21)
    expect(dragonItems.filter((item) => item.location.type === LocationType.DragonDeck)).toHaveLength(19 - expectedRowSize)
    expect(dragonItems.some((item) => item.id === DragonCard.Tail && item.location.type === LocationType.DragonTailSlot)).toBe(true)
    expect(dragonItems.some((item) => item.id === DragonCard.Head && item.location.type === LocationType.DragonHeadSlot)).toBe(true)

    const firecrackerItems = game.items[MaterialType.FirecrackerCard]!
    expect(firecrackerItems).toHaveLength(45)
    const expectedHandLimit = playerCount === 2 ? 4 : 3
    for (const player of game.players) {
      const hand = firecrackerItems.filter((item) => item.location.type === LocationType.PlayerHand && item.location.player === player)
      expect(hand).toHaveLength(expectedHandLimit)
    }
    expect(firecrackerItems.filter((item) => item.location.type === LocationType.FirecrackerDeck)).toHaveLength(45 - playerCount * expectedHandLimit)

    expect(game.rule?.id).toBe(RuleId.ChooseFirecracker)
  })

  test('la ligne du dragon est triée par vitalité croissante dès la mise en place', () => {
    const game = setupGame(4)
    const dragonRow = game.items[MaterialType.DragonCard]!.filter((item) => item.location.type === LocationType.DragonRow)
    const xs = dragonRow.map((item) => item.location.x).sort((a, b) => (a ?? 0) - (b ?? 0))
    expect(xs).toEqual([0, 1, 2, 3])
  })
})
