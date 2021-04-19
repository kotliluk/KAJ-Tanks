import * as React from "react";
import { PlayerStats, newEmptyPlayer } from "../player/playerStats";
import { PlayerStorage } from "../player/playerStorage";
import { GameArea } from "./game/gameArea";
import { HomePage } from "./other/homePage";
import NewGamePage from "./other/newGamePage";
import { ResultsPage } from "./other/resultsPage";
import StatsPage from "./other/statsPage";
import "./tankGame.css";

/**
 * Current screen content.
 */
enum ScreenType {
  HOME,
  STATS,
  NEW_GAME,
  GAME,
  RESULTS
}

interface TankGameProps {
  id: string;
}

interface TankGameState {
  screen: ScreenType;
  currentPlayers: PlayerStats[];
}

/**
 * Main component which dispatches to each page sections.
 */
export class TankGame extends React.Component<TankGameProps, TankGameState> {
  constructor(props: TankGameProps) {
    super(props);
    this.state = {
      screen: ScreenType.STATS,
      currentPlayers: [
        /*newEmptyPlayer(-1, "Lukas", "#000000"),
        newEmptyPlayer(-2, "Pepa", "#ffffff"),
        newEmptyPlayer(-3, "CCC", "#000000"),
        newEmptyPlayer(-4, "DDDD", "#ffffff")*/
      ]
    };
  }

  private renderHomePage = () => {
    return (
      <HomePage
        onNewGame={() => this.setState({ screen: ScreenType.NEW_GAME })}
        onStats={() => this.setState({ screen: ScreenType.STATS })}
      />
    );
  };

  private renderStats = () => {
    return (
      <StatsPage onBack={() => this.setState({ screen: ScreenType.HOME })} />
    );
  };

  private renderNewGamePage = () => {
    return (
      <NewGamePage
        onBack={() => this.setState({ screen: ScreenType.HOME })}
        onSubmit={players =>
          this.setState({ screen: ScreenType.GAME, currentPlayers: players })
        }
      />
    );
  };

  private renderGame = () => {
    return (
      <GameArea
        id={this.props.id}
        players={this.state.currentPlayers}
        onEnd={players => {
          players.forEach(p => PlayerStorage.updatePlayer(p));
          this.setState({
            screen: ScreenType.RESULTS,
            currentPlayers: players
          });
        }}
      />
    );
  };

  private renderResults = () => {
    return (
      <ResultsPage
        players={this.state.currentPlayers}
        onBack={() => this.setState({ screen: ScreenType.HOME })}
      />
    );
  };

  render() {
    return (
      <main>
        {this.state.screen === ScreenType.HOME && this.renderHomePage()}
        {this.state.screen === ScreenType.STATS && this.renderStats()}
        {this.state.screen === ScreenType.NEW_GAME && this.renderNewGamePage()}
        {this.state.screen === ScreenType.GAME && this.renderGame()}
        {this.state.screen === ScreenType.RESULTS && this.renderResults()}
      </main>
    );
  }
}
