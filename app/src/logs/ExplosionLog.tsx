import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { DragonCard, dragonVictoryPoints } from '@gamepark/dragon-bomb/material/DragonCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { Memory } from '@gamepark/dragon-bomb/rules/Memory'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { DragonChip } from './DragonChip'

export const ExplosionLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new DragonBombRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.DragonCard).getItem(moveItem.itemIndex)
  // "Double pétard": ExplosionRule memorizes the doubling before playing the capture, so it is already known
  // here (see Memory.DoubledCaptures) - the Firecracker cards of the slot went to the discard first, so the
  // triggering card cannot be looked up anymore.
  const doubled = (rules.remind<number[]>(Memory.DoubledCaptures) ?? []).includes(moveItem.itemIndex)
  const points = (dragonVictoryPoints[item.id as DragonCard] ?? 0) * (doubled ? 2 : 1)
  const playerName = usePlayerName(context.game.rule?.player)

  return (
    <Trans
      i18nKey={doubled ? 'log.explosion-double' : 'log.explosion'}
      values={{ player: playerName, points }}
      components={{ card: <DragonChip item={item} /> }}
    />
  )
}
