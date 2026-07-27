import { css } from '@emotion/react'
import { DevToolsHub, GameTable, usePlayers } from '@gamepark/react-game'
import { getTableXMin } from './locators/rowSize'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const players = usePlayers()
  const xMin = getTableXMin(players.length)
  return (
    <>
      <GameTable xMin={xMin} xMax={55} yMin={-25} yMax={25} margin={margin} zoom={false} css={process.env.NODE_ENV === 'development' && tableBorder}>
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(5em)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
