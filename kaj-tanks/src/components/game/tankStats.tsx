import * as React from "react";
import Tank from "../../game_objects/tank";
import "./tankStats.css"

interface TankStatsProps {
  // tank to display information about
  tank: Tank;
}

interface TankStatsState {}

/**
 * Information about a single tank (player) during the game.
 */
export class TankStats extends React.Component<TankStatsProps, TankStatsState> {
  render() {
    const health = this.props.tank.getHealth();
    const nameStyle = health <= 0 ? {color: "grey"} : {};
    const hpStyle = health < 20 ? {color: "red"} : {};
    return (
      <div className="tank-stats">
        <div>
          <span style={nameStyle}>{this.props.tank.getName()}</span><span style={hpStyle}>{`${health} HP`}</span>
        </div>
        <div>
          <span>{`${this.props.tank.getDamageDealt()} damage`}</span><span>{`${this.props.tank.getKills()} kills`}</span>
        </div>
      </div>
    );
  }
}
