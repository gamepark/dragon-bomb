import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseFirecrackerHeader } from './ChooseFirecrackerHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseFirecracker]: ChooseFirecrackerHeader
}
