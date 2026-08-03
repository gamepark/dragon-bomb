import { css } from '@emotion/react'
import { DropAreaDescription } from '@gamepark/react-game'
import { colors } from '../theme/colors'

/** Empty placeholder drawn at a player's Selection Area, so it is clear where to drop a chosen Firecracker card. */
class SelectionAreaDescription extends DropAreaDescription {
  width = 6.3
  height = 8.8
  borderRadius = 0.3

  extraCss = css`
    border: 0.15em dashed ${colors.gold};
    background: rgba(255, 203, 71, 0.12);
  `
}

export const selectionAreaDescription = new SelectionAreaDescription()
