import { MaterialGame } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonBombRules } from '../DragonBombRules'
import { DragonCard } from '../material/DragonCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getHandLimit } from './HandLimit'
import { RuleId } from './RuleId'

function game(players: number[], dragonItems: MaterialGame<number, MaterialType, LocationType, RuleId>['items'][typeof MaterialType.DragonCard] = []) {
  return new DragonBombRules({ players, items: { [MaterialType.DragonCard]: dragonItems }, memory: {} } as unknown as MaterialGame<
    number,
    MaterialType,
    LocationType,
    RuleId
  >)
}

describe('getHandLimit', () => {
  test('limite de base à 3 cartes pour 3 joueurs ou plus', () => {
    expect(getHandLimit(game([1, 2, 3]), 1)).toBe(3)
  })

  test('limite de base à 4 cartes en partie à 2 joueurs', () => {
    expect(getHandLimit(game([1, 2]), 1)).toBe(4)
  })

  test('capturer la carte "13" augmente la limite de 1', () => {
    const rules = game([1, 2, 3], [{ id: DragonCard.Body13, location: { type: LocationType.PlayerCapturedDragon, player: 1 } }])
    expect(getHandLimit(rules, 1)).toBe(4)
  })

  test('le bonus ne profite qu\'au joueur qui a capturé la carte', () => {
    const rules = game([1, 2, 3], [{ id: DragonCard.Body13, location: { type: LocationType.PlayerCapturedDragon, player: 1 } }])
    expect(getHandLimit(rules, 2)).toBe(3)
  })
})
