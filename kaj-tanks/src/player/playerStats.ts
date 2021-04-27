/**
 * Stats about a player. It can be used for storing in local storage
 * as well as for partial results from one game.
 */
export interface PlayerStats {
  id: number;
  name: string;
  color: string;
  avatar: string;
  wins: number;
  loses: number;
  dmgDealt: number;
  dmgReceived: number;
  kills: number;
}

/**
 * Creates a new PlayerStats with all values set to 0 except the given ones.
 */
export function newEmptyPlayer(
  id: number,
  name: string,
  color: string = "",
  avatar: string = ""
): PlayerStats {
  return {
    id: id,
    name: name,
    color: color,
    avatar: avatar,
    wins: 0,
    loses: 0,
    dmgDealt: 0,
    dmgReceived: 0,
    kills: 0
  };
}

/**
 * Return player win ratio as number from <0, 1>.
 */
export function winRatio(player: PlayerStats): number {
  const games = player.wins + player.loses;
  return games === 0 ? 0 : player.wins / games;
}

/**
 * Sort players according to their stats.
 */
export function sortPlayers(players: PlayerStats[]): PlayerStats[] {
  players.sort((a, b) => {
    const aRatio = winRatio(a);
    const bRatio = winRatio(b);
    if (aRatio > bRatio) {
      return -1;
    }
    if (aRatio < bRatio) {
      return 1;
    }
    return (b.kills * 10 + b.dmgDealt - b.dmgReceived) - (a.kills * 10 + a.dmgDealt - a.dmgReceived);
  });
  return players;
}
