import { isMoveItemsAtOnce, isShuffle, Location, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonBombRules } from './DragonBombRules'
import { DragonCard } from './material/DragonCard'
import { FirecrackerCard } from './material/FirecrackerCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

/** CompleteDragonRow ne réagit à aucun déplacement de pétard : on y observe donc le comportement global seul */
function game(firecrackers: { id: FirecrackerCard; location: Location<number, LocationType> }[]): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players: [1, 2, 3],
    memory: {},
    rule: { id: RuleId.CompleteDragonRow, players: [1, 2, 3] },
    items: {
      [MaterialType.DragonCard]: [{ id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x: 0 } }],
      [MaterialType.FirecrackerCard]: firecrackers
    }
  } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('DragonBombRules', () => {
  test('reconstitue la pioche de pétards avec la défausse dès quelle est vide', () => {
    const rules = new DragonBombRules(
      game([
        { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.FirecrackerDeck, x: 0 } },
        { id: FirecrackerCard.Firecracker6_1, location: { type: LocationType.FirecrackerDiscard, x: 0 } },
        { id: FirecrackerCard.Firecracker7_1, location: { type: LocationType.FirecrackerDiscard, x: 1 } }
      ])
    )

    // La dernière carte de la pioche est distribuée : la défausse doit repartir dans la pioche
    const draw = rules.material(MaterialType.FirecrackerCard).index(0).moveItem({ type: LocationType.BombingZone, parent: 0 })
    const consequences = rules.play(draw)

    expect(consequences).toHaveLength(1)
    expect(isMoveItemsAtOnce(consequences[0])).toBe(true)
    if (isMoveItemsAtOnce(consequences[0])) {
      expect(consequences[0].indexes.sort()).toEqual([1, 2])
      expect(consequences[0].location.type).toBe(LocationType.FirecrackerDeck)
    }

    // Le mélange n'est créé qu'ensuite, sur les cartes réellement arrivées dans la pioche
    const shuffles = rules.play(consequences[0])
    expect(shuffles).toHaveLength(1)
    expect(isShuffle(shuffles[0])).toBe(true)
    if (isShuffle(shuffles[0])) {
      expect(shuffles[0].indexes.sort()).toEqual([1, 2])
    }
    expect(rules.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDiscard).length).toBe(0)
  })

  test('ne reconstitue rien tant que la pioche n est pas vide', () => {
    const rules = new DragonBombRules(
      game([
        { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.FirecrackerDeck, x: 0 } },
        { id: FirecrackerCard.Firecracker6_1, location: { type: LocationType.FirecrackerDeck, x: 1 } },
        { id: FirecrackerCard.Firecracker7_1, location: { type: LocationType.FirecrackerDiscard, x: 0 } }
      ])
    )

    const draw = rules.material(MaterialType.FirecrackerCard).index(0).moveItem({ type: LocationType.BombingZone, parent: 0 })
    expect(rules.play(draw)).toHaveLength(0)
  })

  test('ne reconstitue rien quand la défausse est vide elle aussi', () => {
    const rules = new DragonBombRules(game([{ id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.FirecrackerDeck, x: 0 } }]))

    const draw = rules.material(MaterialType.FirecrackerCard).index(0).moveItem({ type: LocationType.BombingZone, parent: 0 })
    expect(rules.play(draw)).toHaveLength(0)
  })
})
