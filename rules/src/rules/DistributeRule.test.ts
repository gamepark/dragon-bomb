import { isMoveItem, Location, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from '../material/DragonCard'
import { FirecrackerCard } from '../material/FirecrackerCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { DistributeRule } from './DistributeRule'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

function game(firecrackers: { id: FirecrackerCard; location: Location<number, LocationType> }[]): MaterialGame<number, MaterialType, LocationType, RuleId> {
  return {
    players: [1, 2, 3],
    memory: {},
    rule: { id: RuleId.Distribute, player: 1 },
    items: {
      // vitalité 11 : la case ne peut pas exploser avec le seul chapelet (puissance 1)
      [MaterialType.DragonCard]: [{ id: DragonCard.Body11a, location: { type: LocationType.DragonRow, x: 0 } }],
      [MaterialType.FirecrackerCard]: firecrackers
    }
  } as MaterialGame<number, MaterialType, LocationType, RuleId>
}

const chapelet = { id: FirecrackerCard.StringOfFirecrackers_1, location: { type: LocationType.BombingZone, parent: 0, x: 0 } }

describe('DistributeRule', () => {
  test('le bonus "Chapelet de pétards" attend la reconstitution de la pioche vide au lieu de la mélanger lui-même', () => {
    const rules = new DistributeRule(game([chapelet, { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.FirecrackerDiscard, x: 0 } }]))

    // La pioche est vide mais la défausse peut la reconstituer (voir DragonBombRules) : aucun coup
    // ici, surtout pas un mélange qui figerait des index périmés. La pioche reprendra sur le Shuffle.
    expect(rules.drawChapeletBonus(0)).toEqual([])
    expect(rules.remind(Memory.ChapeletDrawSlot)).toBe(0)
  })

  test('le bonus "Chapelet de pétards" pioche la carte dès que la pioche est reconstituée', () => {
    const rules = new DistributeRule(game([chapelet, { id: FirecrackerCard.Firecracker5_1, location: { type: LocationType.FirecrackerDeck, x: 0 } }]))

    const moves = rules.drawChapeletBonus(0)
    expect(moves).toHaveLength(1)
    expect(isMoveItem(moves[0])).toBe(true)
    if (isMoveItem(moves[0])) {
      expect(moves[0].itemIndex).toBe(1)
      expect(moves[0].location).toEqual({ type: LocationType.BombingZone, parent: 0, rotation: true })
    }
  })

  test('le bonus "Chapelet de pétards" sans aucune carte disponible résout la case directement', () => {
    const rules = new DistributeRule(game([chapelet]))

    const moves = rules.drawChapeletBonus(0)
    expect(moves).not.toHaveLength(0)
    expect(rules.remind(Memory.ChapeletDrawSlot)).toBeUndefined()
  })
})
