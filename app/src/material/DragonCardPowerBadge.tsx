import { css } from '@emotion/react'
import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { FirecrackerCard, firecrackerPower } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { useRules } from '@gamepark/react-game'
import { colors } from '../theme/colors'
import { fontDisplay } from '../theme/typography'

/** Total power of the Firecracker cards currently stacked in this Dragon card's Bombing Zone. */
export const DragonCardPowerBadge = ({ itemIndex }: { itemIndex?: number }) => {
  const rules = useRules<DragonBombRules>()
  if (!rules || itemIndex === undefined) return null
  const card = rules.material(MaterialType.DragonCard).getItem(itemIndex)
  if(card.location.type !== LocationType.DragonRow) return null
  const total = rules
    .material(MaterialType.FirecrackerCard)
    .location(LocationType.BombingZone)
    .parent(itemIndex)
    .getItems()
    .reduce((sum, item) => sum + (firecrackerPower[item.id as FirecrackerCard] ?? 0), 0)
  return <span css={badgeCss}>{total}</span>
}

const badgeCss = css`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.05em 0.5em;
  background: ${colors.dusk};
  border: 0.08em solid ${colors.gold};
  border-radius: 1em;
  font-size: 1.3em;
  font-family: ${fontDisplay};
  font-weight: bold;
  color: ${colors.ash};
  line-height: 1.4;
  white-space: nowrap;
`
