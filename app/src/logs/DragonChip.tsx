/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DragonCard } from '@gamepark/dragon-bomb/material/DragonCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { PlayMoveButton } from '@gamepark/react-game'
import { MaterialItem, MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'
import { dragonCardDescription } from '../material/DragonCardDescription'

type DragonChipProps = {
  item: MaterialItem
}

export const DragonChip: FC<DragonChipProps> = ({ item }) => {
  const id = item.id as DragonCard | undefined
  const image = id !== undefined ? dragonCardDescription.images[id] : undefined

  if (id === undefined || !image) return null

  return (
    <PlayMoveButton
      move={MaterialMoveBuilder.displayMaterialHelp(MaterialType.DragonCard, item)}
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
