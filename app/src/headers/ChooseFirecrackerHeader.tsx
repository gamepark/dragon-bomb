import { usePlayerId, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ChooseFirecrackerHeader = () => {
  const player = usePlayerId()
  const rules = useRules()!
  const isMyTurn = player !== undefined && rules.isTurnToPlay(player)
  return <Trans i18nKey={`header.choose-firecracker.${isMyTurn ? 'mine' : 'others'}`} />
}
