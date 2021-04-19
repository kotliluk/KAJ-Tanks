/**
 * Stats about a player. It can be used for storing in local storage
 * as well as for partial results from one game.
 */
export interface PlayerStats {
  id: number;
  name: string;
  color: string;
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
  color: string
): PlayerStats {
  return {
    id: id,
    name: name,
    color: color,
    wins: 0,
    loses: 0,
    dmgDealt: 0,
    dmgReceived: 0,
    kills: 0
  };
}
