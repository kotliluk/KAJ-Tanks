import * as React from "react";
import { PlayerStorage } from "../../player/playerStorage";
import { newEmptyPlayer, PlayerStats } from "../../player/playerStats";
import { randomRGB } from "../../utils/color";
import AddPlayerMenu from "./addPlayerMenu";
import "./newGamePage.css";

interface NewGamePageProps {
  // accepts the array of players selected for the game
  onSubmit: (players: PlayerStats[]) => void;
  // returns to the previous page
  onBack: () => void;
}

interface NewGamePageState {
  // selected players for this game
  participants: PlayerStats[];
  // stored players which are not selected for this game yet
  availableStored: PlayerStats[];
  // ids of players which are not saved in local storage - they are negative
  minUsedId: number;
}

const minPlayers: number = 2;
const maxPlayers: number = 4;

/**
 * Page with selection of current players for the game.
 * 2, 3, or 4 players must be added for the game to begin.
 * Quick or stored players can be added.
 */
export default class NewGamePage extends React.Component<
  NewGamePageProps,
  NewGamePageState
> {
  constructor(props: NewGamePageProps) {
    super(props);
    this.state = {
      participants: [],
      availableStored: [...PlayerStorage.getStoredPlayers()],
      minUsedId: 0
    };
  }

  /**
   * Adds a new quick player in the menu.
   */
  private handleAddQuickPlayer = (): void => {
    this.setState(state => {
      const id = state.minUsedId - 1;
      state.participants.push(newEmptyPlayer(id, "Player", randomRGB()));
      return { minUsedId: id };
    });
  };

  /**
   * Adds a new available stored player in the menu.
   */
  private handleAddStoredPlayer = (): void => {
    this.setState(state => {
      // @ts-ignore - the player is removed from the available array
      const player: PlayerStats = this.state.availableStored.shift();
      state.participants.push(
        newEmptyPlayer(player.id, player.name, randomRGB())
      );
      return {};
    });
  };

  /**
   * Removes the player from the menu.
   */
  private handleRemovePlayer = (index: number): void => {
    this.setState(state => {
      const deleted = state.participants.splice(index, 1);
      if (deleted[0].id > 0) {
        // the player is returned to the available array
        state.availableStored.push(deleted[0]);
      }
      return {};
    });
  };

  /**
   * Updates a player info at the given index.
   */
  private handlePlayerChange = (player: PlayerStats, index: number): void => {
    this.setState(state => {
      let avaiable = state.availableStored;
      const previous = state.participants[index];
      // if the Stored player is updated...
      if (previous.id > 0) {
        // returns the previous player to the available array
        state.availableStored.push(previous);
        // removes the new player from the available array
        avaiable = state.availableStored.filter(p => p.id !== player.id);
      }
      state.participants[index] = player;
      return { availableStored: avaiable };
    });
  };

  render() {
    return (
      <section className="new-game-page">
        <h3>New Game</h3>
        {this.state.participants.map((p, i) => {
          return (
            <AddPlayerMenu
              key={i}
              index={i}
              player={p}
              availableStoredPlayers={
                // for the single menu, the selected player is available too
                p.id < 0 ? undefined : [p, ...this.state.availableStored]
              }
              onPlayerChange={player => this.handlePlayerChange(player, i)}
              onRemove={() => this.handleRemovePlayer(i)}
            />
          );
        })}
        {// if the max player count was not reached, can add new quick players
        this.state.participants.length < maxPlayers && (
          <button onClick={this.handleAddQuickPlayer}
          className="menu-button">Quick player</button>
        )}
        {// if the max player count was not reached and there are available stored players, can add them
        this.state.participants.length < maxPlayers &&
          this.state.availableStored.length > 0 && (
            <button onClick={this.handleAddStoredPlayer}
            className="menu-button">Stored player</button>
          )}
        <div>
          <button onClick={this.props.onBack}
          className="menu-button">Back</button>
          <button
            onClick={() => this.props.onSubmit(this.state.participants)}
            disabled={this.state.participants.length < minPlayers}
            className="menu-button">
            Play
          </button>
        </div>
      </section>
    );
  }
}
