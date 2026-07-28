import { css } from '@emotion/react'
import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { StyledPlayerPanel, usePlayer, useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { CSSProperties } from 'react'
import lanterne from '../images/lanterne.png'
import { PANEL_WIDTH } from '../locators/PlayerRowLayout'
import { playerColors } from '../theme/playerColors'

export const PlayerPanelContent = ({ location }: { location: Location<number> }) => {
  const rules = useRules<DragonBombRules>()!
  const player = usePlayer<number>(location.player)
  if (!player) {
    return null
  }

  return (
    <StyledPlayerPanel
      player={player}
      css={panelStyle}
      style={playerColorVars(player.id)}
      activeRing
      mainCounter={{ image: lanterne, value: rules.getScore(player.id) }}
    />
  )
}

const playerColorVars = (playerId: number): CSSProperties => {
  const { accent, background } = playerColors[(playerId - 1) % playerColors.length]
  return { '--player-accent': accent, '--player-bg': background } as CSSProperties
}

/**
 * StyledPlayerPanel is authored in its own 28em-wide box: rescale that box down to PANEL_WIDTH table units. Its
 * height is driven by its content, and PANEL_HEIGHT only approximates it, so center it in its location rather than
 * letting it hang from the top: the captured cards it hides are centered on the row, and it must cover them.
 */
const panelStyle = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${PANEL_WIDTH / 28}em;
`
