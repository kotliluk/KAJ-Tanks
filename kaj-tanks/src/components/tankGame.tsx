import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import StatsPage from "./screens/statsPage";
import "./tankGame.css";
import {Logo} from "./logo";
import {AudioPlayer} from "../utils/audioPlayer";
import {PlayWrapper} from "./screens/playWrapper";
import {HomePage} from "./screens/homePage";

interface TankGameProps {}

interface TankGameState {
  backgroundMusic: boolean;
  online: boolean;
}

/**
 * Main component which dispatches to each page sections.
 */
export class TankGame extends React.Component<TankGameProps, TankGameState> {
  constructor(props: TankGameProps) {
    super(props);
    this.state = {
      backgroundMusic: false,
      online: navigator.onLine
    };
    window.addEventListener("online", () => this.setState({online: true}));
    window.addEventListener("offline", () => this.setState({online: false}));
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

  private renderHeader = () => {
    const onlineString = this.state.online ? "online" : "offline";
    return (
      <header>
        <Logo width={300}/>
        <div>
          <button onClick={this.toggleBackgroundMusic} className="menu-button">
            {"Music " + (this.state.backgroundMusic ? "on" : "off")}
          </button>
          <div className={"online-point " + onlineString}>
            <span>{onlineString}</span>
          </div>
        </div>
      </header>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <main>
          {this.renderHeader()}
          <Switch>
            <Route path="/stats">
              <StatsPage />
            </Route>
            <Route path="/play">
              <PlayWrapper />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}
