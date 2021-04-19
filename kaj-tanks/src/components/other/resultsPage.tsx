import * as React from "react";
import {PlayerStats, sortPlayers} from "../../player/playerStats";
import {PlayerTable} from "./playerTable";
import "./resultPage.css"

interface ResultsPageProps {
  // array of player results from the game.
  players: PlayerStats[];
  // returns to the previous page
  onBack: () => void;
}

interface ResultsPageState {}

/**
 * Shows game results for given players.
 */
export class ResultsPage extends React.Component<
  ResultsPageProps,
  ResultsPageState
> {
  render() {
    const players = sortPlayers(this.props.players);
    return (
      <section className="result-page">
        <PlayerTable
          players={players}
          showWins={false}
          showDelete={false}
        />
        <button onClick={this.props.onBack} className="menu-button">Back</button>
      </section>
    );
  }
}
