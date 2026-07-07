import { FirecrackerCard, firecrackerPower, isDoubleFirecracker, isRocket, isStringOfFirecrackers } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const FirecrackerCardHelp = ({ item }: MaterialHelpProps) => {
  const id = item.id as FirecrackerCard | undefined
  const power = id !== undefined ? firecrackerPower[id] : undefined

  return (
    <>
      <h2><Trans i18nKey="help.firecracker-card.title" /></h2>
      {power !== undefined && <p><Trans i18nKey="help.firecracker-card.power" values={{ power }} /></p>}
      {id !== undefined && isStringOfFirecrackers(id) && <p><Trans i18nKey="help.firecracker-card.string" /></p>}
      {id !== undefined && isRocket(id) && <p><Trans i18nKey="help.firecracker-card.rocket" /></p>}
      {id !== undefined && isDoubleFirecracker(id) && <p><Trans i18nKey="help.firecracker-card.double" /></p>}
    </>
  )
}
