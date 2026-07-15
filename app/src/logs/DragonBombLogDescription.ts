import { LocationType } from '@gamepark/dragon-bomb/material/LocationType'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { RuleId } from '@gamepark/dragon-bomb/rules/RuleId'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ChapeletBonusLog } from './ChapeletBonusLog'
import { ExplosionLog } from './ExplosionLog'
import { PlaceFirecrackerLog } from './PlaceFirecrackerLog'
import { PlaceRocketLog } from './PlaceRocketLog'
import { RevealFirecrackerLog } from './RevealFirecrackerLog'

export class DragonBombLogDescription implements LogDescription<MaterialMove, number, MaterialGame> {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, number, MaterialGame>): MovePlayedLogDescription | undefined {
    const ruleId = context.game.rule?.id

    if (ruleId === RuleId.ChooseFirecracker) {
      if (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.SelectionArea && move.location.rotation === false) {
        return { player: move.location.player, Component: RevealFirecrackerLog }
      }
    }

    if (ruleId === RuleId.Distribute) {
      if (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.BombingZone) {
        if (move.location.rotation === true) {
          return { Component: ChapeletBonusLog, depth: 1 }
        }
        return { Component: PlaceFirecrackerLog, depth: 1 }
      }
    }

    if (ruleId === RuleId.PlaceRocket) {
      if (isMoveItemType(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.BombingZone) {
        return { player: context.game.rule?.player, Component: PlaceRocketLog }
      }
    }

    if (ruleId === RuleId.Explosion) {
      if (isMoveItemType(MaterialType.DragonCard)(move) && move.location.type === LocationType.PlayerCapturedDragon) {
        return { player: context.game.rule?.player, Component: ExplosionLog, depth: 1 }
      }
    }

    return undefined
  }
}
