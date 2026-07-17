import { isMoveItem, isMoveItemsAtOnce, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ExplosionRule } from './ExplosionRule'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

function game(overrides: Partial<MaterialGame<number, MaterialType, LocationType, RuleId>>): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players: [1, 2, 3],
    items: {},
    memory: { [Memory.ExplodingSlot]: 0 },
    ...overrides
  } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

describe('ExplosionRule', () => {
  test('capture la carte dragon, marque le score du joueur, et défausse les autres cartes en un seul coup groupé', () => {
    const g = game({
      rule: { id: RuleId.Explosion, player: 1 },
      items: {
        [MaterialType.DragonCard]: [{ id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x: 0 } }], // vitalité 11, 3 points
        [MaterialType.FirecrackerCard]: [
          { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } }, // puissance 5
          { id: FirecrackerCard.Firecracker6_1, location: { type: LocationType.BombingZone, parent: 0, x: 1 } } // puissance 6, dernière posée, total 11
        ]
      }
    })
    const rules = new ExplosionRule(g)
    const moves = rules.onRuleStart()

    const discard = moves.find((move) => isMoveItemsAtOnce(move) && move.itemType === MaterialType.FirecrackerCard)
    expect(discard).toBeDefined()
    if (isMoveItemsAtOnce(discard!)) {
      expect(discard.indexes.sort()).toEqual([0, 1])
      expect(discard.location.type).toBe(LocationType.FirecrackerDiscard)
    }

    const capture = moves.find((move) => isMoveItem(move) && move.itemType === MaterialType.DragonCard)
    expect(capture).toBeDefined()
    if (isMoveItem(capture!)) {
      expect(capture.location).toEqual({ type: LocationType.PlayerCapturedDragon, player: 1 })
    }

    expect(rules.remind<number>(Memory.Score, 1)).toBe(3)
  })

  test('carte "4" (malus) : le score du joueur devient négatif', () => {
    const g = game({
      rule: { id: RuleId.Explosion, player: 1 },
      items: {
        [MaterialType.DragonCard]: [{ id: DragonCard.Body4a, location: { type: LocationType.DragonRow, x: 0 } }], // vitalité 4, -3 points
        [MaterialType.FirecrackerCard]: [{ id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } }]
      }
    })
    const rules = new ExplosionRule(g)
    rules.onRuleStart()
    expect(rules.remind<number>(Memory.Score, 1)).toBe(-3)
  })

  test('Double Pétard déclenchant : double les points, crée un marqueur, aucune carte à défausser en trop', () => {
    const g = game({
      rule: { id: RuleId.Explosion, player: 2 },
      items: {
        [MaterialType.DragonCard]: [{ id: DragonCard.Body3, location: { type: LocationType.DragonRow, x: 0 } }], // vitalité 3, 3 points
        [MaterialType.FirecrackerCard]: [
          { id: FirecrackerCard.DoubleFirecracker_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } } // puissance 3, seule carte posée
        ]
      }
    })
    const rules = new ExplosionRule(g)
    const moves = rules.onRuleStart()

    // La seule carte posée est la carte déclenchante elle-même : rien d'autre à défausser.
    expect(moves.some((move) => isMoveItemsAtOnce(move) && move.itemType === MaterialType.FirecrackerCard)).toBe(false)

    const marker = moves.find((move) => isMoveItem(move) && move.location.type === LocationType.PlayerDoubleMarker)
    expect(marker).toBeDefined()
    if (isMoveItem(marker!)) {
      expect(marker.location).toEqual({ type: LocationType.PlayerDoubleMarker, player: 2, parent: 0 })
    }

    expect(rules.remind<number>(Memory.Score, 2)).toBe(6)
  })
})
