import { Material, MaterialItem } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonCard } from './DragonCard'
import { dragonRowStrategy } from './DragonRowStrategy'
import { LocationType } from './LocationType'
import { MaterialType } from './MaterialType'

function rowItem(id: DragonCard, x?: number): MaterialItem<number, LocationType> {
  return { id, location: { type: LocationType.DragonRow, x } }
}

function rowMaterial(items: MaterialItem<number, LocationType>[]): Material<number, MaterialType, LocationType> {
  return { getItems: () => items } as unknown as Material<number, MaterialType, LocationType>
}

/** Adds each card in order and returns the row as [x → id] after all adds */
function addAll(existing: MaterialItem<number, LocationType>[], ...drawn: DragonCard[]): (DragonCard | undefined)[] {
  const items = [...existing]
  for (const id of drawn) {
    const item = rowItem(id)
    dragonRowStrategy.addItem(rowMaterial(items), item)
    items.push(item)
  }
  const row: (DragonCard | undefined)[] = []
  for (const item of items) row[item.location.x!] = item.id
  return row
}

describe('DragonRowStrategy.addItem', () => {
  test('remplit une rangée vide en triant par vitalité', () => {
    expect(addAll([], DragonCard.Body23, DragonCard.Body5, DragonCard.Body11a)).toEqual([DragonCard.Body5, DragonCard.Body11a, DragonCard.Body23])
  })

  test('[_, _, 23] + 11 : le 23 reste en place, pas d\'aller-retour', () => {
    const existing = [rowItem(DragonCard.Body23, 2)]
    const item = rowItem(DragonCard.Body11a)
    dragonRowStrategy.addItem(rowMaterial(existing), item)
    expect(item.location.x).toBe(0)
    expect(existing[0].location.x).toBe(2) // le 23 ne bouge pas
  })

  test('[_, _, 23] + 11 puis 12 : chaque carte va directement à sa place finale', () => {
    expect(addAll([rowItem(DragonCard.Body23, 2)], DragonCard.Body11a, DragonCard.Body12a)).toEqual([
      DragonCard.Body11a,
      DragonCard.Body12a,
      DragonCard.Body23
    ])
  })

  test('une carte existante ne se décale que si l\'ordre trié l\'exige', () => {
    // [_, _, 5] + 11 : le 5 doit laisser la dernière place au 11
    expect(addAll([rowItem(DragonCard.Body5, 2)], DragonCard.Body11a)).toEqual([undefined, DragonCard.Body5, DragonCard.Body11a])
  })

  test('[3, _, 23] + 12 : le nouveau prend le trou du milieu', () => {
    expect(addAll([rowItem(DragonCard.Body3, 0), rowItem(DragonCard.Body23, 2)], DragonCard.Body12a)).toEqual([
      DragonCard.Body3,
      DragonCard.Body12a,
      DragonCard.Body23
    ])
  })

  test('ordre de pioche défavorable : la rangée finale est quand même triée et compacte', () => {
    // [_, _, 23] + 25 : le 23 doit céder sa place, puis + 3 comble le trou restant
    expect(addAll([rowItem(DragonCard.Body23, 2)], DragonCard.Body25, DragonCard.Body3)).toEqual([
      DragonCard.Body3,
      DragonCard.Body23,
      DragonCard.Body25
    ])
  })

  test('vitalités égales : la carte déjà en place garde son slot, la nouvelle vient après', () => {
    const existing = [rowItem(DragonCard.Body4a, 0)]
    const item = rowItem(DragonCard.Body4b)
    dragonRowStrategy.addItem(rowMaterial(existing), item)
    expect(existing[0].location.x).toBe(0)
    expect(item.location.x).toBe(1)
  })
})
