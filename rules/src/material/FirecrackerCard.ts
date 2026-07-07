export enum FirecrackerCard {
  Firecracker5_1 = 1,
  Firecracker5_2,
  Firecracker5_3,
  Firecracker5_4,
  Firecracker5_5,
  Firecracker6_1,
  Firecracker6_2,
  Firecracker6_3,
  Firecracker6_4,
  Firecracker6_5,
  Firecracker7_1,
  Firecracker7_2,
  Firecracker7_3,
  Firecracker7_4,
  Firecracker7_5,
  Firecracker8_1,
  Firecracker8_2,
  Firecracker8_3,
  Firecracker8_4,
  Firecracker8_5,
  Firecracker9_1,
  Firecracker9_2,
  Firecracker9_3,
  Firecracker9_4,
  Firecracker9_5,
  Firecracker10_1,
  Firecracker10_2,
  Firecracker10_3,
  Firecracker10_4,
  Firecracker10_5,
  StringOfFirecrackers_1,
  StringOfFirecrackers_2,
  StringOfFirecrackers_3,
  StringOfFirecrackers_4,
  StringOfFirecrackers_5,
  Rocket_1,
  Rocket_2,
  Rocket_3,
  Rocket_4,
  Rocket_5,
  DoubleFirecracker_1,
  DoubleFirecracker_2,
  DoubleFirecracker_3,
  DoubleFirecracker_4,
  DoubleFirecracker_5
}

/** Each power tier lists its 5 lantern variants (1 to 5, in order) */
const powerTiers: { power: number; ids: FirecrackerCard[] }[] = [
  { power: 5, ids: [FirecrackerCard.Firecracker5_1, FirecrackerCard.Firecracker5_2, FirecrackerCard.Firecracker5_3, FirecrackerCard.Firecracker5_4, FirecrackerCard.Firecracker5_5] },
  { power: 6, ids: [FirecrackerCard.Firecracker6_1, FirecrackerCard.Firecracker6_2, FirecrackerCard.Firecracker6_3, FirecrackerCard.Firecracker6_4, FirecrackerCard.Firecracker6_5] },
  { power: 7, ids: [FirecrackerCard.Firecracker7_1, FirecrackerCard.Firecracker7_2, FirecrackerCard.Firecracker7_3, FirecrackerCard.Firecracker7_4, FirecrackerCard.Firecracker7_5] },
  { power: 8, ids: [FirecrackerCard.Firecracker8_1, FirecrackerCard.Firecracker8_2, FirecrackerCard.Firecracker8_3, FirecrackerCard.Firecracker8_4, FirecrackerCard.Firecracker8_5] },
  { power: 9, ids: [FirecrackerCard.Firecracker9_1, FirecrackerCard.Firecracker9_2, FirecrackerCard.Firecracker9_3, FirecrackerCard.Firecracker9_4, FirecrackerCard.Firecracker9_5] },
  { power: 10, ids: [FirecrackerCard.Firecracker10_1, FirecrackerCard.Firecracker10_2, FirecrackerCard.Firecracker10_3, FirecrackerCard.Firecracker10_4, FirecrackerCard.Firecracker10_5] },
  { power: 1, ids: [FirecrackerCard.StringOfFirecrackers_1, FirecrackerCard.StringOfFirecrackers_2, FirecrackerCard.StringOfFirecrackers_3, FirecrackerCard.StringOfFirecrackers_4, FirecrackerCard.StringOfFirecrackers_5] },
  { power: 2, ids: [FirecrackerCard.Rocket_1, FirecrackerCard.Rocket_2, FirecrackerCard.Rocket_3, FirecrackerCard.Rocket_4, FirecrackerCard.Rocket_5] },
  { power: 3, ids: [FirecrackerCard.DoubleFirecracker_1, FirecrackerCard.DoubleFirecracker_2, FirecrackerCard.DoubleFirecracker_3, FirecrackerCard.DoubleFirecracker_4, FirecrackerCard.DoubleFirecracker_5] }
]

export const firecrackerPower: Record<FirecrackerCard, number> = {} as Record<FirecrackerCard, number>
export const firecrackerLanterns: Record<FirecrackerCard, number> = {} as Record<FirecrackerCard, number>

for (const { power, ids } of powerTiers) {
  ids.forEach((id, index) => {
    firecrackerPower[id] = power
    firecrackerLanterns[id] = index + 1
  })
}

/** All 45 unique Firecracker cards, used to build the draw pile */
export const firecrackerCards: FirecrackerCard[] = powerTiers.flatMap(({ ids }) => ids)

export function isStringOfFirecrackers(id: FirecrackerCard): boolean {
  return id >= FirecrackerCard.StringOfFirecrackers_1 && id <= FirecrackerCard.StringOfFirecrackers_5
}

export function isRocket(id: FirecrackerCard): boolean {
  return id >= FirecrackerCard.Rocket_1 && id <= FirecrackerCard.Rocket_5
}

export function isDoubleFirecracker(id: FirecrackerCard): boolean {
  return id >= FirecrackerCard.DoubleFirecracker_1 && id <= FirecrackerCard.DoubleFirecracker_5
}
