import * as React from "react";
import { PlayerStats } from "../player/playerStats";
import { PlayerStorage } from "../player/playerStorage";
import { GameArea } from "./game/gameArea";
import { HomePage } from "./screens/homePage";
import NewGamePage from "./screens/newGamePage";
import { ResultsPage } from "./screens/resultsPage";
import StatsPage from "./screens/statsPage";
import "./tankGame.css";
import {Logo} from "./logo";
import {AudioPlayer} from "../utils/audioPlayer";

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
  backgroundMusic: boolean;
}

/**
 * Main component which dispatches to each page sections.
 */
export class TankGame extends React.Component<TankGameProps, TankGameState> {
  constructor(props: TankGameProps) {
    super(props);
    this.state = {
      screen: ScreenType.HOME,
      currentPlayers: [],
      backgroundMusic: false
    };
  }

  private toggleBackgroundMusic = () => {
    const newState = !this.state.backgroundMusic;
    this.setState({backgroundMusic: newState});
    if (newState) {
      AudioPlayer.startBackgroundMusic();
    }
    else {
      AudioPlayer.pauseBackgroundMusic();
    }
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
        onSubmit={players => {
          AudioPlayer.pauseBackgroundMusic();
          this.setState({ screen: ScreenType.GAME, currentPlayers: players });
        }}
      />
    );
  };

  private renderGame = () => {
    return (
      <GameArea
        id={this.props.id}
        players={this.state.currentPlayers}
        onEnd={players => {
          if (this.state.backgroundMusic) {
            AudioPlayer.startBackgroundMusic();
          }
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
        {this.state.screen !== ScreenType.GAME && (
          <header>
            <Logo width={300}/>
            <button onClick={this.toggleBackgroundMusic} className="menu-button">
              {"Music " + (this.state.backgroundMusic ? "on" : "off")}
            </button>
          </header>
        )}
        {this.state.screen === ScreenType.HOME && this.renderHomePage()}
        {this.state.screen === ScreenType.STATS && this.renderStats()}
        {this.state.screen === ScreenType.NEW_GAME && this.renderNewGamePage()}
        {this.state.screen === ScreenType.GAME && this.renderGame()}
        {this.state.screen === ScreenType.RESULTS && this.renderResults()}
      </main>
    );
  }
}
