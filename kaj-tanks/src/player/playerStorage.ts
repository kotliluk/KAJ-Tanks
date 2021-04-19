import { newEmptyPlayer, PlayerStats } from "./playerStats";

/**
 * Wrapper of accessing browser localStorage for storing player stats.
 */
export class PlayerStorage {
  private static storageSupported: boolean = typeof Storage !== "undefined";
  private static players: PlayerStats[] = PlayerStorage.initPlayers();
  private static maxId: number = PlayerStorage.players
    .map(p => p.id)
    .reduce((prev, cur) => {
      return Math.max(prev, cur);
    }, 0);

  /**
   * Loads players from the local storage.
   */
  private static initPlayers(): PlayerStats[] {
    if (PlayerStorage.storageSupported) {
      const saved = localStorage.getItem("players");
      if (saved === null) {
        return [];
      }
      return JSON.parse(saved);
    } else {
      console.warn("Local storage not supported.");
      return [];
    }
  }

  /**
   * Updates localStorage to current player stats.
   */
  private static persist(): void {
    localStorage.setItem("players", JSON.stringify(PlayerStorage.players));
  }

  /**
   * Retutns true if the localStorage is supported in the browser.
   */
  public static isSupported(): boolean {
    return PlayerStorage.storageSupported;
  }

  /**
   * Returns all stored player stats.
   */
  public static getStoredPlayers(): PlayerStats[] {
    if (PlayerStorage.storageSupported) {
      return [...PlayerStorage.players];
    }
    return [];
  }

  /**
   * Saves a new player with the given name to the localStorage.
   */
  public static saveNewPlayer(name: string): PlayerStats[] {
    if (PlayerStorage.storageSupported) {
      PlayerStorage.maxId += 1;
      PlayerStorage.players.push(newEmptyPlayer(PlayerStorage.maxId, name, ""));
      PlayerStorage.persist();
      return PlayerStorage.players;
    }
    return [];
  }

  /**
   * Removes a player with the given id.
   */
  public static removePlayer(id: number): PlayerStats[] {
    if (PlayerStorage.storageSupported) {
      PlayerStorage.players = PlayerStorage.players.filter(p => p.id !== id);
      PlayerStorage.persist();
      return PlayerStorage.players;
    }
    return [];
  }

  /**
   * Updates a player by the given values (given values are added to the stored ones).
   */
  public static updatePlayer(update: PlayerStats): void {
    for (let player of PlayerStorage.players) {
      if (player.id === update.id) {
        player.wins += update.wins;
        player.loses += update.loses;
        player.dmgDealt += update.dmgDealt;
        player.dmgReceived += update.dmgReceived;
        player.kills += update.kills;
        PlayerStorage.persist();
        break;
      }
    }
  }
}
