import * as React from "react";
import { PlayerStats } from "../../player/playerStats";

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
    return (
      <section>
        {this.props.players.map(p => {
          return (
            <p key={p.id}>
              {`${p.name}: ${p.wins === 1 ? "winner" : "loser"}
              Damage dealt: ${p.dmgDealt}
              Damage received: ${p.dmgReceived}`}
            </p>
          );
        })}
        <button onClick={this.props.onBack}>Back</button>
      </section>
    );
  }
}
