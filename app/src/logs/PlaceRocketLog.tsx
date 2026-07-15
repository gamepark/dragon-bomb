import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { DragonCard, dragonVitality } from '@gamepark/dragon-bomb/material/DragonCard.ts'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { FirecrackerChip } from './FirecrackerChip'

export const PlaceRocketLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new DragonBombRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.FirecrackerCard).getItem(moveItem.itemIndex)
  const playerName = usePlayerName(context.game.rule?.player)
  const slotIndex = moveItem.location.parent
  const dragonId = slotIndex !== undefined ? (rules.material(MaterialType.DragonCard).getItem(slotIndex)?.id as DragonCard | undefined) : undefined
  const vitality = dragonId !== undefined ? dragonVitality[dragonId] : undefined

  return (
    <Trans
      i18nKey="log.place-rocket"
      values={{ player: playerName, vitality }}
      components={{ card: <FirecrackerChip item={item} /> }}
    />
  )
}
