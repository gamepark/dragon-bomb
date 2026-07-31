import { applyAutomaticMoves, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { describe, expect, test } from 'vitest'
import { DragonBombRules } from './DragonBombRules'
import { DragonBombSetup } from './DragonBombSetup'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

type Game = MaterialGame<number, MaterialType, LocationType, RuleId>

/** Deterministic PRNG so a failing case can be replayed from its seed */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

/**
 * Every player's client replays the rules locally on its own (partly hidden) view of the game, and the
 * memory is *not* sent by the server: it is recomputed by each client. So no rule may ever memorize
 * something derived from information a client cannot see yet, otherwise the clients silently diverge
 * from the server - cards animate to a slot then snap back, and players end up with no legal move.
 *
 * This plays whole random games while mirroring every server move to a client per player, exactly like
 * Game Park does, and checks that the memory stays identical everywhere.
 */
function checkClientsFollowServer(playerCount: number, seed: number) {
  const server = new DragonBombRules(new DragonBombSetup().setup({ players: playerCount }) as Game)
  const clients = server.game.players.map((player) => new DragonBombRules(clone(server.getView(player)) as Game, { player }))
  const random = mulberry32(seed)

  const mirror = (move: MaterialMove) => {
    clients.forEach((client, index) => {
      const player = server.game.players[index]
      client.play(clone(server.getMoveView(clone(move) as never, player)) as never, { player })
    })
  }

  for (let turn = 0; turn < 2000; turn++) {
    if (server.isOver(server.game.players)) return
    const activePlayers = server.game.players.filter((player) => server.isTurnToPlay(player))
    if (!activePlayers.length) throw new Error(`Game stuck on rule ${JSON.stringify(server.game.rule)} (seed ${seed}, ${playerCount} players)`)
    const player = activePlayers[Math.floor(random() * activePlayers.length)]
    const legalMoves = server.getLegalMoves(player)
    if (!legalMoves.length) throw new Error(`No legal move for player ${player} (seed ${seed}, ${playerCount} players)`)
    applyAutomaticMoves(server, [legalMoves[Math.floor(random() * legalMoves.length)]], mirror, { player })

    clients.forEach((client, index) => {
      expect(client.game.memory, `memory of player ${server.game.players[index]} (seed ${seed}, ${playerCount} players)`).toEqual(server.game.memory)
      expect(client.game.rule, `rule of player ${server.game.players[index]} (seed ${seed}, ${playerCount} players)`).toEqual(server.game.rule)
    })
  }
}

describe('Synchronisation client / serveur', () => {
  test.each([2, 3, 4, 5, 6].flatMap((playerCount) => Array.from({ length: 3 }, (_, seed) => [playerCount, seed] as const)))(
    'la mémoire des clients reste identique à celle du serveur, à %i joueurs (graine %i)',
    (playerCount, seed) => checkClientsFollowServer(playerCount, seed),
    60000
  )
})
