import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  isMoveItemTypeAtOnce,
  ItemMove,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  PlayMoveContext,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { dragonRowStrategy } from './material/DragonRowStrategy'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ChooseFirecrackerRule } from './rules/ChooseFirecrackerRule'
import { CompleteDragonRowRule } from './rules/CompleteDragonRowRule'
import { CompletePlayersHandsRule } from './rules/CompletePlayersHandsRule'
import { DistributeRule } from './rules/DistributeRule'
import { EndOfRoundRule } from './rules/EndOfRoundRule'
import { ExplosionRule } from './rules/ExplosionRule'
import { Memory } from './rules/Memory'
import { PlaceRocketRule } from './rules/PlaceRocketRule'
import { RuleId } from './rules/RuleId'

/**
 * Selected Firecracker cards stay hidden from other players until they are revealed in place
 * (rotation set to false, see {@link ChooseFirecrackerRule.getMovesAfterPlayersDone}), without moving
 * out of SelectionArea.
 */
function hideUnrevealedSelection(item: MaterialItem<number, LocationType>, player?: number): string[] {
  if (item.location.rotation === false) return []
  return hideItemIdToOthers(item, player)
}

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class DragonBombRules
  extends SecretMaterialRules<number, MaterialType, LocationType, RuleId>
  implements TimeLimit<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType, RuleId>, MaterialMove<number, MaterialType, LocationType, RuleId>, number> {
  rules = {
    [RuleId.ChooseFirecracker]: ChooseFirecrackerRule,
    [RuleId.Distribute]: DistributeRule,
    [RuleId.PlaceRocket]: PlaceRocketRule,
    [RuleId.Explosion]: ExplosionRule,
    [RuleId.CompleteDragonRow]: CompleteDragonRowRule,
    [RuleId.CompletePlayersHands]: CompletePlayersHandsRule,
    [RuleId.EndOfRound]: EndOfRoundRule
  }

  hidingStrategies = {
    [MaterialType.DragonCard]: {
      [LocationType.DragonDeck]: hideItemId
    },
    [MaterialType.FirecrackerCard]: {
      [LocationType.FirecrackerDeck]: hideItemId,
      [LocationType.PlayerHand]: hideItemIdToOthers,
      [LocationType.SelectionArea]: hideUnrevealedSelection,
      [LocationType.PlayerDoubleMarker]: hideItemId
    }
  }

  locationsStrategies = {
    [MaterialType.DragonCard]: {
      [LocationType.DragonDeck]: new PositiveSequenceStrategy(),
      [LocationType.DragonRow]: dragonRowStrategy,
      [LocationType.PlayerCapturedDragon]: new PositiveSequenceStrategy()
    },
    [MaterialType.FirecrackerCard]: {
      [LocationType.FirecrackerDeck]: new PositiveSequenceStrategy(),
      [LocationType.FirecrackerDiscard]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.SelectionArea]: new PositiveSequenceStrategy(),
      [LocationType.BombingZone]: new PositiveSequenceStrategy(),
      [LocationType.PlayerDoubleMarker]: new PositiveSequenceStrategy()
    }
  }

  /**
   * "Si la pioche de pétards est vide, mélanger la défausse pour former une nouvelle pioche": handled
   * here, once for all the rules, so that no rule has to deal with an empty deck (see
   * {@link refillFirecrackerDeck}).
   */
  protected afterItemMove(move: ItemMove<number, MaterialType, LocationType>, context?: PlayMoveContext): MaterialMove[] {
    // The refill comes first: consequences are played depth-first (the whole cascade triggered by the
    // first move of the list plays before the second one), so putting it first guarantees the deck is
    // refilled immediately, before anything else can try to draw - and before a second refill could
    // ever be queued.
    return [...this.refillFirecrackerDeck(move), ...super.afterItemMove(move, context)]
  }

  /**
   * Keeps the invariant "the Firecracker deck is never empty while the discard isn't". The deck can
   * only empty out, or the discard only fill up, through a Firecracker card move, so watching those
   * is enough.
   *
   * The shuffle is issued separately, once the cards actually landed in the deck: a Shuffle freezes
   * its item indexes when it is created, so building it alongside the move that fills the deck would
   * make it target cards that may have left the deck by the time it is played (which throws "You
   * cannot shuffle items with different hiding strategies").
   *
   * Rules that need to draw only have to check {@link LocationType.FirecrackerDeck} for emptiness: an
   * empty deck means either the refill is on its way - it is the very next move, and they can resume
   * on the resulting Shuffle - or there is no Firecracker card left anywhere.
   */
  private refillFirecrackerDeck(move: ItemMove<number, MaterialType, LocationType>): MaterialMove[] {
    if (move.itemType !== MaterialType.FirecrackerCard) return []
    const deck = this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDeck)
    if (isMoveItemTypeAtOnce(MaterialType.FirecrackerCard)(move) && move.location.type === LocationType.FirecrackerDeck) {
      return deck.length > 1 ? [deck.shuffle()] : []
    }
    if (deck.length) return []
    const discard = this.material(MaterialType.FirecrackerCard).location(LocationType.FirecrackerDiscard)
    return discard.length ? [discard.moveItemsAtOnce({ type: LocationType.FirecrackerDeck })] : []
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: number): number {
    return this.remind<number>(Memory.Score, playerId) ?? 0
  }

  getTieBreaker(tieBreaker: number, playerId: number): number | undefined {
    if (tieBreaker > 1) return undefined
    return -this.material(MaterialType.DragonCard).location(LocationType.PlayerCapturedDragon).player(playerId).length
  }
}
