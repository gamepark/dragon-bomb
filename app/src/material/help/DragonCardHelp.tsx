import { DragonCard, dragonHandLimitBonus, dragonVictoryPoints, dragonVitality } from '@gamepark/dragon-bomb/material/DragonCard'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const DragonCardHelp = ({ item }: MaterialHelpProps) => {
  const id = item.id as DragonCard | undefined
  if (id === DragonCard.Tail || id === DragonCard.Head) {
    return (
      <>
        <h2><Trans i18nKey="help.dragon-card.decoration.title" /></h2>
        <p><Trans i18nKey="help.dragon-card.decoration.desc" /></p>
      </>
    )
  }

  const vitality = id !== undefined ? dragonVitality[id] : undefined
  const points = id !== undefined ? dragonVictoryPoints[id] : undefined
  const handLimitBonus = id !== undefined ? dragonHandLimitBonus[id] : undefined

  return (
    <>
      <h2><Trans i18nKey="help.dragon-card.title" /></h2>
      {vitality !== undefined && <p><Trans i18nKey="help.dragon-card.vitality" values={{ vitality }} /></p>}
      {points !== undefined && <p><Trans i18nKey="help.dragon-card.points" values={{ points }} /></p>}
      {points !== undefined && points < 0 && <p><Trans i18nKey="help.dragon-card.malus" /></p>}
      {handLimitBonus !== undefined && <p><Trans i18nKey="help.dragon-card.hand-limit-bonus" /></p>}
    </>
  )
}
