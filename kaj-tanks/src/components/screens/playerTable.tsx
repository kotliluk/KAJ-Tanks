import React from "react";
import {PlayerStats, winRatio} from "../../player/playerStats";

interface PlayerTableProps {
  // players to be displayed
  players: PlayerStats[],
  // when true, shows Wins column with "ratio% (wins/games)"
  showWins: boolean,
  // when true, shows a column with delete buttons
  showDelete: boolean,
  // handler of deleting a player, receives his id
  onDelete?: (id: number) => void
}

/**
 * Displays player stats in a table.
 */
export class PlayerTable extends React.Component<PlayerTableProps, any> {
  render() {
    const handleDelete = this.props.onDelete ? this.props.onDelete : () => {};

    return (
      <table>
        <thead>
          <tr>
            <th/>
            <th>Name:</th>
            {this.props.showWins && <th>Wins:</th>}
            <th>Kills:</th>
            <th>Dmg dealt:</th>
            <th>Dmg received:</th>
            {this.props.showDelete && <th/>}
          </tr>
        </thead>
        <tbody>
        {this.props.players.map((p, i) => (
          <tr key={p.id}>
            <td>{i + 1}</td>
            <td>{p.name}</td>
            {this.props.showWins && <td>{Math.floor(winRatio(p) * 100)}% ({p.wins}/{p.wins + p.loses})</td>}
            <td>{p.kills}</td>
            <td>{p.dmgDealt}</td>
            <td>{p.dmgReceived}</td>
            {this.props.showDelete && <td><button onClick={() => handleDelete(p.id)} className="menu-button">Delete</button></td>}
          </tr>)
        )}
        </tbody>
      </table>
    );
  }
}