import { css } from '@emotion/react'
import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import lanterne from '../images/lanterne.png'
import { playerColors } from '../theme/playerColors'

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
          style={playerColorVars(player.id)}
          activeRing
          mainCounter={{ image: lanterne, value: rules.getScore(player.id) }}
        />
      ))}
    </>,
    root
  )
}

const playerColorVars = (playerId: number): CSSProperties => {
  const { accent, background } = playerColors[(playerId - 1) % playerColors.length]
  return { '--player-accent': accent, '--player-bg': background } as CSSProperties
}

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`
