import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseFirecrackerHeader } from './ChooseFirecrackerHeader'
import { CompleteDragonRowHeader } from './CompleteDragonRowHeader'
import { CompletePlayersHandsHeader } from './CompletePlayersHandsHeader'
import { DistributeHeader } from './DistributeHeader'
import { EndOfRoundHeader } from './EndOfRoundHeader'
import { ExplosionHeader } from './ExplosionHeader'
import { PlaceRocketHeader } from './PlaceRocketHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseFirecracker]: ChooseFirecrackerHeader,
  [RuleId.Distribute]: DistributeHeader,
  [RuleId.PlaceRocket]: PlaceRocketHeader,
  [RuleId.Explosion]: ExplosionHeader,
  [RuleId.CompleteDragonRow]: CompleteDragonRowHeader,
  [RuleId.CompletePlayersHands]: CompletePlayersHandsHeader,
  [RuleId.EndOfRound]: EndOfRoundHeader
}
