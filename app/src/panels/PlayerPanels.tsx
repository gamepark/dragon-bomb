import { css } from '@emotion/react'
import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import lanterne from '../images/lanterne.png'

export const PlayerPanels = () => {
  const rules = useRules<DragonBombRules>()!
  const players = usePlayers<number>({ sortFromMe: true })
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => (
        <StyledPlayerPanel
          key={player.id}
          player={player}
          css={panelPosition(index)}
          activeRing
          mainCounter={{ image: lanterne, value: rules.getScore(player.id) }}
        />
      ))}
    </>,
    root
  )
}

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`
