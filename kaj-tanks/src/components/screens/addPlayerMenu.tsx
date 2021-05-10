import * as React from "react";
import { newEmptyPlayer, PlayerStats } from "../../player/playerStats";
import { randomRGB } from "../../utils/color";
import "./addPlayerMenu.css";

interface AddPlayerMenuProps {
  // index of the add player menu (used for menu ids)
  index: number;
  // player information to be displayed
  player: PlayerStats;
  // array of stored players to select from (or undefined, if menu shows quick player)
  availableStoredPlayers: PlayerStats[] | undefined;
  // handler of changing information about the displayed player
  onPlayerChange: (player: PlayerStats) => void;
  // handler of removing the menu
  onRemove: () => void;
  // handler of user's drag menu change
  onDragChange: (from: number, to: number) => void;
}

interface AddPlayerMenuState {}

/**
 * Menu for setting name and color of one player.
 * When availableStoredPlayers is undefined, it shows an input for a quick player name.
 * Otherwise, it shows a select from available stored players.
 */
export default class AddPlayerMenu extends React.Component<
  AddPlayerMenuProps,
  AddPlayerMenuState
> {
  private isQuick(): boolean {
    return this.props.availableStoredPlayers === undefined;
  }

  /**
   * Changes the players name.
   */
  private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.player.name = event.target.value;
    this.props.onPlayerChange(this.props.player);
  };

  /**
   * Changes the players color.
   */
  private handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.player.color = event.target.value;
    this.props.onPlayerChange(this.props.player);
  };

  /**
   * Changes the displayed player to the new selected stored one.
   */
  private handleStoredPlayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore - availableStoredPlayers must be defined in stored-player version
    const players: PlayerStats = this.props.availableStoredPlayers.filter(p => String(p.id) === event.target.value)[0];
    this.props.onPlayerChange(
      newEmptyPlayer(
        players.id,
        players.name,
        players.color === "" ? randomRGB() : players.color,
        players.avatar
      )
    );
  };

  // @ts-ignore
  private handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", this.props.index);
  }

  // @ts-ignore
  private handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  // @ts-ignore
  private handleDragDrop = (e: DragEvent<HTMLDivElement>) => {
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (!isNaN(from)) {
      this.props.onDragChange(from, this.props.index);
    }
  }

  render() {
    return (
      <div className="add-player-menu"
           draggable={true}
           onDragStart={this.handleDragStart}
           onDragOver={this.handleDragOver}
           onDrop={this.handleDragDrop}>
        <header>
          <img src={this.props.player.avatar} alt=":("/>
          <h4>
            {this.isQuick() ? "Quick" : "Stored"} player {this.props.index + 1}:
          </h4>
          <button onClick={this.props.onRemove}>&#10006;</button>
        </header>
        {this.isQuick() ? (
          // if it is a quick player, shows a name input field
          <div>
            <label htmlFor={"name-input-player-" + this.props.index}>
              Name:
            </label>
            <input
              type="text"
              id={"name-input-player-" + this.props.index}
              value={this.props.player.name}
              onChange={this.handleNameChange}
              placeholder="fill your name"
              spellCheck={false}
              autoComplete={"off"}
              autoFocus={true}
              maxLength={20}
            />
          </div>
        ) : (
          // if it is a stored player, shows a player select field
          <div>
            <label htmlFor={"select-player-" + this.props.index}>Player:</label>
            <select
              id={"select-player-" + this.props.index}
              value={this.props.player.id}
              onChange={this.handleStoredPlayerChange}
            >
              {this.props.availableStoredPlayers && this.props.availableStoredPlayers.map(player => {
                return <option key={player.id} value={player.id}>{player.name}</option>;
              })}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={"color-input-player-" + this.props.index}>
            Color:
          </label>
          <input
            type="color"
            id={"color-input-player-" + this.props.index}
            value={this.props.player.color}
            onChange={this.handleColorChange}
          />
        </div>
      </div>
    );
  }
}
