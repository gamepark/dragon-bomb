import { applyAutomaticMoves, isMoveItemsAtOnce, isShuffle, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { describe, test } from 'vitest'
import { DragonBombRules } from './DragonBombRules'
import { DragonBombSetup } from './DragonBombSetup'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

type Game = MaterialGame<number, MaterialType, LocationType, RuleId>

/** Deterministic PRNG so a failing fuzz case can be replayed from its seed */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Plays whole games with random legal moves ("monkeys"), and checks every Shuffle move on the way.
 * A Shuffle freezes the item indexes when it is *created*, but its consequences (and the whole
 * cascade they trigger) are played before the next move of the same list: a shuffle built alongside
 * the move that fills the deck can therefore target cards that already left it. The engine then
 * throws "You cannot shuffle items with different hiding strategies" as soon as the items no longer
 * share the same hiding strategy.
 */
function monkeyGame(playerCount: number, seed: number) {
  const rules = new DragonBombRules(new DragonBombSetup().setup({ players: playerCount }) as Game)
  const random = mulberry32(seed)

  const check = (move: MaterialMove) => {
    if (isShuffle(move)) {
      const locations = new Set(
        move.indexes.map((index) => {
          const { type, player, rotation } = rules.material(move.itemType).getItem(index)!.location
          return JSON.stringify({ type, player, rotation })
        })
      )
      if (locations.size > 1) {
        throw new Error(`Shuffle of mixed locations (seed ${seed}, ${playerCount} players): ${JSON.stringify([...locations])}`)
      }
    }
    // Refilling the deck must only ever take cards from the discard (the end of round reset is the
    // one legitimate exception: it puts every Firecracker card back into the deck)
    if (isMoveItemsAtOnce(move) && move.itemType === MaterialType.FirecrackerCard && move.location.type === LocationType.FirecrackerDeck) {
      if (rules.game.rule?.id !== RuleId.EndOfRound) {
        const origins = new Set(move.indexes.map((index) => rules.material(move.itemType).getItem(index)!.location.type))
        if (origins.size !== 1 || !origins.has(LocationType.FirecrackerDiscard)) {
          throw new Error(`Deck refilled from ${JSON.stringify([...origins])} (seed ${seed}, ${playerCount} players)`)
        }
      }
    }
  }

  for (let turn = 0; turn < 5000; turn++) {
    if (rules.isOver(rules.game.players)) return
    const activePlayers = rules.game.players.filter((player) => rules.isTurnToPlay(player))
    // Nobody can play and the game is not over: the automatic move chain stopped halfway
    if (!activePlayers.length) throw new Error(`Game stuck on rule ${JSON.stringify(rules.game.rule)} (seed ${seed}, ${playerCount} players)`)
    const player = activePlayers[Math.floor(random() * activePlayers.length)]
    const legalMoves = rules.getLegalMoves(player)
    if (!legalMoves.length) throw new Error(`No legal move for player ${player} (seed ${seed}), rule ${JSON.stringify(rules.game.rule)}`)
    applyAutomaticMoves(rules, [legalMoves[Math.floor(random() * legalMoves.length)]], check, { player })
  }
}

describe('Monkeys', () => {
  test.each([2, 3, 4, 5, 6].flatMap((playerCount) => Array.from({ length: 10 }, (_, seed) => [playerCount, seed] as const)))(
    'joue une partie complète à %i joueurs sans mélange incohérent (graine %i)',
    (playerCount, seed) => monkeyGame(playerCount, seed)
  )
})
