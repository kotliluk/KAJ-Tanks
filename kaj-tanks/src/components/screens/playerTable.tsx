import React from "react";
import {PlayerStats, winRatio} from "../../player/playerStats";
import "./playerTable.css";

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
      <div className="player-table-container">
        <table className="player-table">
          <thead>
          <tr>
            <th data-column="number"/>
            <th data-column="avatar" className="img-th"/>
            <th data-column="name">Name:</th>
            {this.props.showWins && <th data-column="wins">Wins:</th>}
            <th data-column="kills">Kills:</th>
            <th data-column="dmg-dealt">Dmg dealt:</th>
            <th data-column="dmg-received">Dmg received:</th>
            {this.props.showDelete && <th data-column="delete"/>}
          </tr>
          </thead>
          <tbody>
          {this.props.players.map((p, i) => (
            <tr key={p.id}>
              <td data-column="number">{i + 1}</td>
              <td data-column="avatar" className="img-td"><img src={p.avatar} width={30} height={30} alt=":("/></td>
              <td data-column="name">{p.name}</td>
              {this.props.showWins && <td data-column="wins">
                {Math.floor(winRatio(p) * 100)}% {p.wins}/{p.wins + p.loses}
              </td>}
              <td data-column="kills">{p.kills}</td>
              <td data-column="dmg-dealt">{p.dmgDealt}</td>
              <td data-column="dmg-received">{p.dmgReceived}</td>
              {this.props.showDelete && <td data-column="delete">
                <button onClick={() => handleDelete(p.id)} className="menu-button">Delete</button>
              </td>}
            </tr>)
          )}
          </tbody>
        </table>
      </div>
    );
  }
}