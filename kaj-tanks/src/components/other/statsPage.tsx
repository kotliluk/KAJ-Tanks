import React, {ChangeEvent} from "react";
import { PlayerStorage } from "../../player/playerStorage";
import {PlayerStats, sortPlayers} from "../../player/playerStats";
import "./statsPage.css";
import {PlayerTable} from "./playerTable";
import {Logo} from "../logo";

interface StatsPageProps {
  // returns to the previous page
  onBack: () => void;
}

interface StatsPageState {
  players: PlayerStats[];
  newPlayerName: string;
}

/**
 * Shows stats of stored players.
 */
export default class StatsPage extends React.Component<
  StatsPageProps,
  StatsPageState
  > {
  constructor(props: StatsPageProps) {
    super(props);
    this.state = {
      players: sortPlayers(PlayerStorage.getStoredPlayers()),
      newPlayerName: ""
    };
  }

  /**
   * Updates name of the new player.
   */
  private handleNewPlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPlayerName: event.target.value });
  };

  /**
   * Creates a new player and saves it into the local storage.
   */
  private handleAddNewPlayer = () => {
    this.setState({
      players: PlayerStorage.saveNewPlayer(this.state.newPlayerName),
      newPlayerName: ""
    });
  };

  /**
   * Deletes the player with the given id from the local storage.
   */
  private handleDeletePlayer = (id: number) => {
    this.setState({
      players: PlayerStorage.removePlayer(id)
    });
  };

  render() {
    const disabled: boolean =
      this.state.newPlayerName === "" ||
      this.state.players.some(p => p.name === this.state.newPlayerName);
    return (
      <section className="stats-page">
        <Logo width={300}/>

        <PlayerTable
          players={this.state.players}
          showWins={true}
          showDelete={true}
          onDelete={this.handleDeletePlayer}
        />

        <form>
          <label htmlFor={"new-player-input"}>New player:</label>
          <input
            type="text"
            id={"new-player-input"}
            value={this.state.newPlayerName}
            placeholder="name"
            maxLength={20}
            spellCheck={false}
            onChange={this.handleNewPlayerNameChange}
          />
          <button onClick={this.handleAddNewPlayer} className="menu-button" disabled={disabled}>Create</button>
        </form>

        <button onClick={this.props.onBack} className="menu-button">Back</button>
      </section>
    );
  }
}