import { css } from '@emotion/react'
import { LocationDescription } from '@gamepark/react-game'
import { colors } from '../theme/colors'
import { fontDisplay } from '../theme/typography'

/**
 * Small "x2" chip pinned to a Dragon card that was captured with a "Double pétard": its victory points were
 * already doubled when it was captured (see ExplosionRule), the chip is only there to show it for the rest of
 * the round. Placed by {@link playerDoubleMarkerLocator}, which also gives it its size.
 */
export class DoubleMarkerDescription extends LocationDescription {
  content = () => <span css={labelCss}>×2</span>

  extraCss = chipCss
}

/**
 * The chip itself. Its font-size must stay untouched: this is the element the locator places, and its
 * transform is expressed in em - shrinking the font here would shrink every coordinate with it.
 */
const chipCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.crimsonDeep};
  border: 0.08em solid ${colors.gold};
  border-radius: 50%;
  box-shadow: 0 0 0.2em rgba(0, 0, 0, 0.6);
`

const labelCss = css`
  font-family: ${fontDisplay};
  font-size: 0.8em;
  font-weight: bold;
  line-height: 1;
  color: ${colors.gold};
`
