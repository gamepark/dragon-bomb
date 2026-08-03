import { ClotheType, EyebrowType, EyeType, TopType } from '@gamepark/avataaars'
import ClotheColorName from '@gamepark/avataaars/dist/avatar/clothes/ClotheColorName'
import SkinColor from '@gamepark/avataaars/dist/avatar/SkinColor'
import HairColorName from '@gamepark/avataaars/dist/avatar/top/HairColorName'
import { DragonCard } from '@gamepark/dragon-bomb/material/DragonCard'
import { FirecrackerCard } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType, isStartPlayerTurn, isStartRule, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { duGeWei, me, TutorialSetup, yuCin } from './TutorialSetup'

type Game = MaterialGame<number, MaterialType, LocationType>
type Move = MaterialMove<number, MaterialType, LocationType>

/** Pause point shared by every card placement, and by the Chapelet bonus draw (itself a Firecracker move into the same location). */
const isPlacement = (move: Move) => isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.BombingZone

export class Tutorial extends MaterialTutorial<number, MaterialType, LocationType> {
  version = 1
  options = { players: 3 }
  setup = new TutorialSetup()

  players = [
    { id: me },
    {
      id: duGeWei,
      name: 'DuGeWei',
      avatar: {
        topType: TopType.ShortHairShortFlat,
        hairColor: HairColorName.Black,
        clotheType: ClotheType.ShirtCrewNeck,
        clotheColor: ClotheColorName.PastelBlue,
        eyeType: EyeType.Default,
        eyebrowType: EyebrowType.Default,
        skinColor: SkinColor.Yellow
      }
    },
    {
      id: yuCin,
      name: 'Yu-Cin Huang',
      avatar: {
        topType: TopType.LongHairStraight,
        hairColor: HairColorName.Black,
        clotheType: ClotheType.CollarSweater,
        clotheColor: ClotheColorName.PastelRed,
        eyeType: EyeType.Happy,
        eyebrowType: EyebrowType.Default,
        skinColor: SkinColor.Yellow
      }
    }
  ]

  private chosenCard(game: Game, move: Move): FirecrackerCard | undefined {
    if (!isMoveItemType(MaterialType.FirecrackerCard)(move)) return undefined
    return this.material(game, MaterialType.FirecrackerCard).getItem(move.itemIndex)?.id as FirecrackerCard | undefined
  }

  private choose(id: FirecrackerCard) {
    return (move: Move, game: Game) =>
      isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.SelectionArea && this.chosenCard(game, move) === id
  }

  steps: TutorialStep<number, MaterialType, LocationType>[] = [
    {
      popup: { text: () => <Trans i18nKey="tuto.welcome" components={{ bold: <strong /> }} /> }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.goal" components={{ bold: <strong /> }} />, position: { x: -30, y: 15 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DragonCard).location(LocationType.DragonRow)]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.secret-choice" components={{ bold: <strong /> }} />, position: { y: 15 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).location(LocationType.PlayerHand).player(me)]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.choose-mine" /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.Firecracker10_1)],
        locations: [{ type: LocationType.SelectionArea, player: me }]
      }),
      move: { player: me, filter: this.choose(FirecrackerCard.Firecracker10_1) }
    },
    {
      move: { player: duGeWei, filter: this.choose(FirecrackerCard.Firecracker5_1) }
    },
    {
      move: { player: yuCin, filter: this.choose(FirecrackerCard.Firecracker7_1), interrupt: isStartPlayerTurn }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.reveal" />, position: { x: -10, y: -10 }  },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).location(LocationType.SelectionArea)]
      }),
      move: { interrupt: isPlacement }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.place-first" components={{ bold: <strong /> }} />, position: { x: -10, y: 10} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.Firecracker5_1), this.material(game, MaterialType.DragonCard).id(DragonCard.Body11a)]
      }),
      move: { interrupt: isPlacement }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.place-second" />, position: { x: 10, y: 0} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.Firecracker7_1), this.material(game, MaterialType.DragonCard).id(DragonCard.Body12a)]
      }),
      move: { interrupt: isPlacement }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.place-third" />, position: { x: 25, y: -10} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.Firecracker10_1), this.material(game, MaterialType.DragonCard).id(DragonCard.Body18a)]
      }),
      move: {}
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.round2" /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.StringOfFirecrackers_1)],
        locations: [{ type: LocationType.SelectionArea, player: me }]
      }),
      move: { player: me, filter: this.choose(FirecrackerCard.StringOfFirecrackers_1) }
    },
    {
      move: { player: duGeWei, filter: this.choose(FirecrackerCard.Firecracker5_2) }
    },
    {
      move: { player: yuCin, filter: this.choose(FirecrackerCard.Firecracker5_5), interrupt: isPlacement }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.place-lowest-first" />, position: { x: 0, y: -10} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.StringOfFirecrackers_1)]
      }),
      move: { interrupt: isPlacement }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.chapelet-effect" components={{ bold: <strong /> }} /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.FirecrackerCard).id(FirecrackerCard.StringOfFirecrackers_1),
          this.material(game, MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck)
        ]
      }),
      move: { interrupt: (move) => isStartRule(move) && move.id === RuleId.Explosion }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.vitality-points" components={{ bold: <strong /> }} /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DragonCard).id(DragonCard.Body11a)]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.explosion-rule" components={{ bold: <strong /> }} /> },
      move: { interrupt: isStartPlayerTurn }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.tie-break" components={{ bold: <strong /> }} />, position: { x: -10, y: 0} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id((id) => id === FirecrackerCard.Firecracker5_2 || id === FirecrackerCard.Firecracker5_5)]
      }),
      move: { interrupt: (move) => isStartRule(move) && move.id === RuleId.Explosion }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.dugewei-wins" /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.FirecrackerCard).id((id) => id === FirecrackerCard.Firecracker7_1 || id === FirecrackerCard.Firecracker5_2),
          this.material(game, MaterialType.DragonCard).id(DragonCard.Body12a)
        ]
      }),
      move: {}
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.special-firecrackers" components={{ bold: <strong /> }} /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.FirecrackerCard).id((id) => id === FirecrackerCard.Rocket_1 || id === FirecrackerCard.DoubleFirecracker_1)]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.special-dragons" />, position: { x: 10, y: 0} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DragonCard).id((id) => id === DragonCard.Body4a || id === DragonCard.Body13)]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.end-of-round" /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DragonCard).location(LocationType.DragonDeck),
          this.material(game, MaterialType.DragonCard).location(LocationType.DragonRow)
        ]
      })
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.end-of-game" /> }
    },
    {
      popup: { text: () => <Trans i18nKey="tuto.go" /> }
    }
  ]
}
