import * as React from "react";
import { PlayerStorage } from "../../player/playerStorage";
import { PlayerStats } from "../../player/playerStats";
import "./statsPage.css";
import {ChangeEvent} from "react";

interface StatsPageProps {
  // returns to the previous page
  onBack: () => void;
}

interface StatsPageState {
  players: PlayerStats[];
  newPlayerName: string;
  isShowingDialog: boolean;
}

/**
 * Shows stats of stored players.
 */
export default class StatsPage extends React.Component<
  StatsPageProps,
  StatsPageState
> {

  private readonly sectionRef: React.RefObject<HTMLDivElement>;

  constructor(props: StatsPageProps) {
    super(props);
    this.state = {
      players: PlayerStorage.getStoredPlayers(),
      newPlayerName: "",
      isShowingDialog: false
    };

    this.sectionRef = React.createRef<HTMLDivElement>();
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
      <div className="stats-page" ref={this.sectionRef}>
        {this.state.players.map(p => {
          return (
            <div key={p.id}>
              {`(${p.id}) ${p.name}: ${p.wins} wins, ${p.loses} loses`}
              <button onClick={() => this.handleDeletePlayer(p.id)} className="menu-button">
                Delete
              </button>
            </div>
          );
        })}
        <form>
          <label htmlFor={"new-player-input"}>New player:</label>
          <input
            type="text"
            id={"new-player-input"}
            value={this.state.newPlayerName}
            onChange={this.handleNewPlayerNameChange}
          />
          <button onClick={this.handleAddNewPlayer} disabled={disabled}>
            Add
          </button>
        </form>
        <button onClick={this.props.onBack} className="menu-button">Back</button>
      </div>
    );
  }
}
