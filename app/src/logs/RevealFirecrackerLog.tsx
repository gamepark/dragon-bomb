import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { FirecrackerCard } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { FirecrackerChip } from './FirecrackerChip'

export const RevealFirecrackerLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new DragonBombRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.FirecrackerCard).getItem(moveItem.itemIndex)
  const playerName = usePlayerName(item.location.player)

  return (
    <Trans
      i18nKey="log.reveal-firecracker"
      values={{ player: playerName }}
      components={{ card: <FirecrackerChip item={item} revealedId={moveItem.reveal?.id as FirecrackerCard | undefined} /> }}
    />
  )
}
