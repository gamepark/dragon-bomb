export enum DragonCard {
  Tail = 1,
  Head,
  Body3,
  Body4a,
  Body4b,
  Body5,
  Body11a,
  Body11b,
  Body12a,
  Body12b,
  Body13,
  Body15a,
  Body15b,
  Body16a,
  Body16b,
  Body17a,
  Body17b,
  Body18a,
  Body18b,
  Body23,
  Body25
}

/** The 19 Dragon Body cards that make up the draw pile (everything except Tail & Head) */
export const dragonBodyCards: DragonCard[] = [
  DragonCard.Body3,
  DragonCard.Body4a,
  DragonCard.Body4b,
  DragonCard.Body5,
  DragonCard.Body11a,
  DragonCard.Body11b,
  DragonCard.Body12a,
  DragonCard.Body12b,
  DragonCard.Body13,
  DragonCard.Body15a,
  DragonCard.Body15b,
  DragonCard.Body16a,
  DragonCard.Body16b,
  DragonCard.Body17a,
  DragonCard.Body17b,
  DragonCard.Body18a,
  DragonCard.Body18b,
  DragonCard.Body23,
  DragonCard.Body25
]

/** Vitality points: total power needed on a slot to capture the card */
export const dragonVitality: Partial<Record<DragonCard, number>> = {
  [DragonCard.Body3]: 3,
  [DragonCard.Body4a]: 4,
  [DragonCard.Body4b]: 4,
  [DragonCard.Body5]: 5,
  [DragonCard.Body11a]: 11,
  [DragonCard.Body11b]: 11,
  [DragonCard.Body12a]: 12,
  [DragonCard.Body12b]: 12,
  [DragonCard.Body13]: 13,
  [DragonCard.Body15a]: 15,
  [DragonCard.Body15b]: 15,
  [DragonCard.Body16a]: 16,
  [DragonCard.Body16b]: 16,
  [DragonCard.Body17a]: 17,
  [DragonCard.Body17b]: 17,
  [DragonCard.Body18a]: 18,
  [DragonCard.Body18b]: 18,
  [DragonCard.Body23]: 23,
  [DragonCard.Body25]: 25
}

/** Victory points earned when capturing the card ("4" cards make you lose 3 points) */
export const dragonVictoryPoints: Partial<Record<DragonCard, number>> = {
  [DragonCard.Body3]: 3,
  [DragonCard.Body4a]: -3,
  [DragonCard.Body4b]: -3,
  [DragonCard.Body5]: 3,
  [DragonCard.Body11a]: 3,
  [DragonCard.Body11b]: 3,
  [DragonCard.Body12a]: 3,
  [DragonCard.Body12b]: 3,
  [DragonCard.Body13]: 3,
  [DragonCard.Body15a]: 4,
  [DragonCard.Body15b]: 4,
  [DragonCard.Body16a]: 4,
  [DragonCard.Body16b]: 4,
  [DragonCard.Body17a]: 5,
  [DragonCard.Body17b]: 5,
  [DragonCard.Body18a]: 5,
  [DragonCard.Body18b]: 5,
  [DragonCard.Body23]: 7,
  [DragonCard.Body25]: 8
}

/** "13" grants +1 hand limit (until end of round) to the player who captures it */
export const dragonHandLimitBonus: Partial<Record<DragonCard, number>> = {
  [DragonCard.Body13]: 1
}
