import * as React from "react";
import { PlayerStorage } from "../../player/playerStorage";
import { PlayerStats } from "../../player/playerStats";
import "./statsPage.css";

interface StatsPageProps {
  // returns to the previous page
  onBack: () => void;
}

interface StatsPageState {
  players: PlayerStats[];
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
      isShowingDialog: false
    };

    this.sectionRef = React.createRef<HTMLDivElement>();
  }

  /**
   * Deletes the player with the given id from the local storage.
   */
  private handleDeletePlayer = (id: number) => {
    this.setState({
      //players: PlayerStorage.removePlayer(id)
    });
  };

  private setShowingDialog = (isShowing: boolean) => {
    
  }

  render() {
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
        <button onClick={this.props.onBack} className="menu-button">Back</button>
      </div>
    );
  }
}
