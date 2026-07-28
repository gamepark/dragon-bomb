import { css } from '@emotion/react'
import { DevToolsHub, GameTable, usePlayers } from '@gamepark/react-game'
import { TABLE_X_MAX, TABLE_Y_MAX } from './locators/PlayerRowLayout'
import { getTableXMin } from './locators/rowSize'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const players = usePlayers()
  const xMin = getTableXMin(players.length)
  return (
    <>
      <GameTable
        xMin={xMin}
        xMax={TABLE_X_MAX}
        yMin={-25}
        yMax={TABLE_Y_MAX}
        margin={margin}
        zoom={false}
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(5em)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
