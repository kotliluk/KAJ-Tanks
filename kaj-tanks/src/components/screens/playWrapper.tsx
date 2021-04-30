import React from "react";
import NewGamePage from "./newGamePage";
import {GameArea} from "../game/gameArea";
import {PlayerStorage} from "../../player/playerStorage";
import {ResultsPage} from "./resultsPage";
import {PlayerStats} from "../../player/playerStats";

enum PlayingPhase {
  NEW_GAME,
  GAME,
  RESULTS
}

interface PlayWrapperProps {}

interface PlayWrapperState {
  phase: PlayingPhase;
  currentPlayers: PlayerStats[];
}

/**
 * Wrapper of game-playing parts that should be under one common link.
 */
export class PlayWrapper extends React.Component<PlayWrapperProps, PlayWrapperState> {
  constructor(props: PlayWrapperProps) {
    super(props);
    this.state = {
      phase: PlayingPhase.NEW_GAME,
      currentPlayers: []
    }
  }

  private renderNewGamePage = () => {
    return (
      <NewGamePage
        onSubmit={players => this.setState({ phase: PlayingPhase.GAME, currentPlayers: players })}
      />
    );
  };

  private renderGame = () => {
    return (
      <GameArea
        players={this.state.currentPlayers}
        onEnd={players => {
          players.forEach(p => PlayerStorage.updatePlayer(p));
          this.setState({
            phase: PlayingPhase.RESULTS,
            currentPlayers: players
          });
        }}
      />
    );
  };

  private renderResults = () => {
    return <ResultsPage players={this.state.currentPlayers} />;
  };

  render() {
    return (<>
      {this.state.phase === PlayingPhase.NEW_GAME && this.renderNewGamePage()}
      {this.state.phase === PlayingPhase.GAME && this.renderGame()}
      {this.state.phase === PlayingPhase.RESULTS && this.renderResults()}
    </>);
  }
}