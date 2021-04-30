import * as React from "react";
import { Link } from "react-router-dom";
import "./homePage.css";

interface HomePageProps {}

interface HomePageStats {}

/**
 * Home page of the game with the main navigation.
 */
export class HomePage extends React.Component<HomePageProps, HomePageStats> {

  render() {
    return (
      <section className="home-page">
        <Link className="menu-button link" to="/play">New game</Link>
        <Link className="menu-button link" to="/stats">Statistics</Link>
      </section>
    );
  }
}
