import { colors } from './colors'

/** One distinct accent per seat (up to 6 players), each paired with that accent blended into the night background so panels stay readable. */
export const playerColors: { accent: string; background: string }[] = [
  { accent: colors.crimson, background: '#512851' },
  { accent: colors.gold, background: '#5D5350' },
  { accent: colors.jade, background: '#395055' },
  { accent: colors.amethyst, background: '#41386D' },
  { accent: colors.azure, background: '#303A78' },
  { accent: colors.flame, background: '#57394D' }
]
