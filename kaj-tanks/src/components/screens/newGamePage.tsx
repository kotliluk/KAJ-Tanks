import * as React from "react";
import { Link } from "react-router-dom";
import { PlayerStorage } from "../../player/playerStorage";
import { newEmptyPlayer, PlayerStats } from "../../player/playerStats";
import { randomRGB } from "../../utils/color";
import AddPlayerMenu from "./addPlayerMenu";
import defaultAvatar from "../../assets/imgs/default_avatar.png";
import "./newGamePage.css";

interface NewGamePageProps {
  // accepts the array of players selected for the game
  onSubmit: (players: PlayerStats[]) => void;
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
export default class NewGamePage extends React.Component<NewGamePageProps, NewGamePageState> {
  constructor(props: NewGamePageProps) {
    super(props);
    this.state = {
      participants: [],
      availableStored: PlayerStorage.getStoredPlayers(),
      minUsedId: 0
    };
  }

  /**
   * Adds a new quick player in the menu.
   */
  private handleAddQuickPlayer = (): void => {
    const id = this.state.minUsedId - 1;
    this.state.participants.push(newEmptyPlayer(id, "", randomRGB(), defaultAvatar));
    this.setState({ minUsedId: id });
  };

  /**
   * Adds a new available stored player in the menu.
   */
  private handleAddStoredPlayer = (): void => {
    // @ts-ignore - the player is removed from the available array
    const player: PlayerStats = this.state.availableStored.shift();
    this.state.participants.push(newEmptyPlayer(player.id, player.name, randomRGB(), player.avatar));
    this.setState({});
  };

  /**
   * Removes the player from the menu.
   */
  private handleRemovePlayer = (index: number): void => {
    const deleted = this.state.participants.splice(index, 1);
    if (deleted[0].id > 0) {
      // the stored player is returned to the available array
      this.state.availableStored.push(deleted[0]);
    }
    this.setState({});
  };

  /**
   * Updates a player info at the given index.
   */
  private handlePlayerChange = (player: PlayerStats, index: number): void => {
    let available = this.state.availableStored;
    const previous = this.state.participants[index];
    // if the Stored player is updated...
    if (previous.id > 0) {
      // returns the previous player to the available array
      this.state.availableStored.push(previous);
      // removes the new player from the available array
      available = this.state.availableStored.filter(p => p.id !== player.id);
    }
    const participants = this.state.participants;
    participants[index] = player;
    this.setState({ availableStored: available, participants: participants });
  };

  private handleDragChange = (from: number, to: number) => {
    // dragging up
    if (from > to) {
      const before = this.state.participants.slice(0, to);
      const moved = this.state.participants.slice(to, from);
      const fromValue = this.state.participants[from];
      const after = this.state.participants.slice(from + 1);
      const newArray = [...before, fromValue, ...moved, ...after];
      this.setState({participants: newArray});
    }
    // dragging down
    else if (from < to) {
      const before = this.state.participants.slice(0, from);
      const fromValue = this.state.participants[from];
      const moved = this.state.participants.slice(from + 1, to + 1);
      const after = this.state.participants.slice(to + 1);
      const newArray = [...before, ...moved, fromValue, ...after];
      this.setState({participants: newArray});
    }
  }

  render() {
    const playersCountError = this.state.participants.length < minPlayers;
    const nameError = this.state.participants.some(p => p.name === "");
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
                // for the concrete menu, the selected player is available too
                p.id < 0 ? undefined : [p, ...this.state.availableStored]
              }
              onPlayerChange={player => this.handlePlayerChange(player, i)}
              onRemove={() => this.handleRemovePlayer(i)}
              onDragChange={this.handleDragChange}
            />
          );
        })}
        {// if the max player count was not reached, can add new quick players
        this.state.participants.length < maxPlayers ? (
          <button onClick={this.handleAddQuickPlayer} className="menu-button">Quick player</button>
        ) : null}
        {// if the max player count was not reached and there are available stored players, can add them
        this.state.participants.length < maxPlayers && this.state.availableStored.length > 0 ? (
            <button onClick={this.handleAddStoredPlayer} className="menu-button">Stored player</button>
          ) : null}
        <div>
          <Link className="menu-button link" to="/">Back</Link>
          <button
            onClick={() => this.props.onSubmit(this.state.participants)}
            disabled={playersCountError || nameError}
            className="menu-button">
            {!playersCountError && !nameError && <span>Play</span>}
            {playersCountError && <span>Please, add at least {minPlayers} players</span>}
            {nameError && !playersCountError && <span>Please, fill all names</span>}
          </button>
        </div>
      </section>
    );
  }
}
