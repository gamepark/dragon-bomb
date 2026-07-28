import { css } from '@emotion/react'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemButtonProps, ItemMenuButton } from '@gamepark/react-game'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { colors } from '../theme/colors'

/**
 * Overlay button shown above a Firecracker card sitting in the player's hand: plays it (chooses
 * it face down for the round). Keeping this action off the card's short click lets a single
 * click always open the card's help instead, so checking what a "1", "2" or "3" does no longer
 * accidentally commits it - see FirecrackerCardDescription.
 */
export const PlayFirecrackerButton: FC<ItemButtonProps> = (props) => {
  const { t } = useTranslation()
  const label = t('button.choose-firecracker')
  return (
    <ItemMenuButton {...props} css={buttonCss} aria-label={label} title={label}>
      <FontAwesomeIcon icon={faArrowUp} css={iconCss} />
    </ItemMenuButton>
  )
}

const buttonCss = css`
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  background: ${colors.dusk};
  border: 0.12em solid ${colors.gold};
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.45);
  transition: filter 0.15s ease, box-shadow 0.15s ease;

  &:not(:disabled):hover {
    filter: brightness(1.15);
    box-shadow: 0 0.15em 0.4em rgba(0, 0, 0, 0.55);
  }

  &:not(:disabled):active {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const iconCss = css`
  color: ${colors.ash};
  font-size: 1.15em;
`
