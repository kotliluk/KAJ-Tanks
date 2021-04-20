import * as React from "react";
import "./homePage.css";

interface HomePageProps {
  onNewGame: () => void;
  onStats: () => void;
}

interface HomePageStats {}

/**
 * Home page of the game with the main navigation.
 */
export class HomePage extends React.Component<HomePageProps, HomePageStats> {

  render() {
    return (
      <section className="home-page">
        <button onClick={this.props.onNewGame} className="menu-button">Play new game</button>
        <button onClick={this.props.onStats} className="menu-button">Statistics</button>
      </section>
    );
  }
}
