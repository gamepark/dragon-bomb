/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FirecrackerCard } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { PlayMoveButton } from '@gamepark/react-game'
import { MaterialItem, MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'
import { firecrackerCardDescription } from '../material/FirecrackerCardDescription'
import { colors } from '../theme/colors'

type FirecrackerChipProps = {
  item: MaterialItem
  revealedId?: FirecrackerCard
}

export const FirecrackerChip: FC<FirecrackerChipProps> = ({ item, revealedId }) => {
  const id = (item.id ?? revealedId) as FirecrackerCard | undefined
  const image = id !== undefined ? firecrackerCardDescription.images[id] : undefined

  if (id === undefined || !image) {
    return <span css={[wrapperCss, hiddenCss]}>?</span>
  }

  return (
    <PlayMoveButton
      move={MaterialMoveBuilder.displayMaterialHelp(MaterialType.FirecrackerCard, item)}
      transient
      css={[wrapperCss, buttonResetCss]}
    >
      <img src={image} alt="" css={imgCss} />
    </PlayMoveButton>
  )
}

const wrapperCss = css`
  display: inline-block;
  width: 2em;
  height: 2em;
  border-radius: 0.25em;
  margin: 0 0.15em;
  vertical-align: -0.5em;
  box-shadow: 0 0.05em 0.2em rgba(0, 0, 0, 0.5);
  overflow: hidden;
`

const buttonResetCss = css`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:hover, &:focus, &:active {
    background: transparent !important;
    opacity: 1 !important;
    transform: scale(1.05);
  }
`

const imgCss = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`

const hiddenCss = css`
  background: ${colors.azure};
  color: ${colors.ash};
  display: inline-grid;
  place-items: center;
  font-weight: 700;
  opacity: 0.7;
`
