import { css } from '@emotion/react'
import { defaultTheme, GameTheme } from '@gamepark/react-game'
import { colors } from './colors'
import { fontBody, fontDisplay } from './typography'

const dialogContainer = css`
  box-shadow:
    0 0 0 0.1em rgba(255, 203, 71, 0.4),
    0 0.6em 1.5em rgba(0, 0, 0, 0.6);
`

const buttonBase = css`
  background: ${colors.crimson} !important;
  color: ${colors.ash} !important;
  border: 0.15em solid ${colors.gold} !important;
  border-radius: 0.3em !important;
  padding: 0.4em 1em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 246, 230, 0.12);
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease, transform 120ms ease;
  outline: none !important;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.nightDeep} !important;
    border-color: ${colors.goldDeep} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.crimson} !important;
    color: ${colors.ash} !important;
    border-color: ${colors.jade} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.crimsonDeep} !important;
    color: ${colors.ash} !important;
    border-color: ${colors.goldDeep} !important;
    transform: translateY(0.05em);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const headerBar = css`
  background: rgba(30, 36, 84, 0.93);
  border-bottom: 0.15em solid ${colors.gold};
  color: ${colors.ash};
  font-family: ${fontDisplay};
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.6);

  h1 {
    color: ${colors.ash};
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  b, strong {
    color: ${colors.gold};
  }
`

const headerButtons = css`
  background: transparent !important;
  color: ${colors.ash} !important;
  border: 0.08em solid rgba(255, 246, 230, 0.5) !important;
  border-radius: 0.3em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  padding: 0 0.45em !important;
  box-shadow: none !important;
  outline: none !important;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.ash} !important;
    color: ${colors.nightDeep} !important;
    border-color: ${colors.ash} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: transparent !important;
    color: ${colors.ash} !important;
    border-color: ${colors.jade} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.nightDeep} !important;
    border-color: ${colors.gold} !important;
  }
`

const menuPanel = css`
  background: ${colors.nightDeep};
  color: ${colors.ash};
  border: 0.05em solid ${colors.night};
  box-shadow:
    0 0 0 0.1em rgba(255, 203, 71, 0.4),
    0 0.6em 1.5em rgba(0, 0, 0, 0.6);
  font-family: ${fontDisplay};

  h2 {
    color: ${colors.ash};
    border-bottom: 0.15em solid ${colors.gold};
    padding-bottom: 0.3em;
    letter-spacing: 0.02em;
  }
`

const menuMainButton = css`
  background: ${colors.gold} !important;
  color: ${colors.nightDeep} !important;
  border: 0.15em solid ${colors.goldDeep} !important;
  outline: none !important;

  &:hover:not(:disabled) {
    background: ${colors.goldDeep} !important;
    color: ${colors.ash} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.nightDeep} !important;
  }
`

const playerPanelPanel = css`
  background: var(--player-bg, ${colors.nightDeep});
  border: 0.08em solid var(--player-accent, ${colors.night});
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.5);
`

const playerPanelDataBadge = css`
  background: ${colors.dusk} !important;
  color: ${colors.ash} !important;
  border: 0.08em solid ${colors.gold} !important;
  font-family: ${fontDisplay};
`

export const theme: GameTheme = {
  ...defaultTheme,
  root: {
    ...defaultTheme.root,
    fontFamily: fontBody
  },
  palette: {
    primary: colors.crimson,
    primaryHover: colors.crimsonLight,
    primaryActive: colors.crimsonDeep,
    primaryLight: colors.ash,
    primaryLighter: colors.ashSoft,
    surface: colors.nightDeep,
    onSurface: colors.ash,
    onSurfaceFocus: '#2C3568',
    onSurfaceActive: '#333C74',
    danger: '#D9542A',
    dangerHover: '#C24521',
    dangerActive: '#9A3517',
    disabled: '#6B6B6B'
  },
  buttons: buttonBase,
  dialog: {
    ...defaultTheme.dialog,
    backgroundColor: colors.nightDeep,
    color: colors.ash,
    container: dialogContainer,
    buttons: buttonBase
  },
  header: {
    bar: headerBar,
    buttons: headerButtons
  },
  menu: {
    panel: menuPanel,
    mainButton: menuMainButton
  },
  playerPanel: {
    activeRingColors: [colors.gold, colors.crimson],
    panel: playerPanelPanel,
    dataBadge: playerPanelDataBadge
  }
}
