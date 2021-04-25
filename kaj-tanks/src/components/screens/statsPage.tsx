import React, {ChangeEvent} from "react";
import { PlayerStorage } from "../../player/playerStorage";
import {PlayerStats, sortPlayers} from "../../player/playerStats";
import {PlayerTable} from "./playerTable";
import "./statsPage.css";
import defaultAvatar from "../../assets/imgs/default_avatar.png";
import {FileDialog} from "../../utils/fileDialog";

interface StatsPageProps {
  // returns to the previous page
  onBack: () => void;
}

interface StatsPageState {
  players: PlayerStats[];
  newPlayerName: string;
  avatar: any;
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
      newPlayerName: "",
      avatar: defaultAvatar
    };
  }

  /**
   * Updates name of the new player.
   */
  private handleNewPlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPlayerName: event.target.value });
  }

  /**
   * Creates a new player and saves it into the local storage.
   */
  private handleAddNewPlayer = () => {
    this.setState({
      players: PlayerStorage.saveNewPlayer(this.state.newPlayerName),
      newPlayerName: ""
    });
  }

  /**
   * Deletes the player with the given id from the local storage.
   */
  private handleDeletePlayer = (id: number) => {
    this.setState({
      players: PlayerStorage.removePlayer(id)
    });
  }

  private changeAvatar = () => {
    FileDialog.openPNG().then(img => this.setState({avatar: img}));//TODO message box, ulozeni obrazku
  }

  render() {
    const disabled: boolean =
      this.state.newPlayerName === "" ||
      this.state.players.some(p => p.name === this.state.newPlayerName);
    return (
      <section className="stats-page">

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
            placeholder="fill your name"
            maxLength={20}
            spellCheck={false}
            autoComplete={"off"}
            onChange={this.handleNewPlayerNameChange}
          />
          <button onClick={this.handleAddNewPlayer} className="menu-button" disabled={disabled}>Create</button>
          <div onClick={this.changeAvatar}>
            <img src={this.state.avatar} alt="avatar"/>
            <span>Load your avatar (max 2kb, 24x24 PNG)</span>
          </div>
        </form>

        <button onClick={this.props.onBack} className="menu-button">Back</button>
      </section>
    );
  }
}