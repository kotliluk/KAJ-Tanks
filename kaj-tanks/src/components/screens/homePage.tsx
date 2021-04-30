import * as React from "react";
import { Link } from "react-router-dom";
import "./homePage.css";
import {playLink, statsLink} from "../tankGame";

interface HomePageProps {}

interface HomePageStats {}

/**
 * Home page of the game with the main navigation.
 */
export class HomePage extends React.Component<HomePageProps, HomePageStats> {

  render() {
    return (
      <section className="home-page">
        <Link className="menu-button link" to={playLink}>New game</Link>
        <Link className="menu-button link" to={statsLink}>Statistics</Link>
      </section>
    );
  }
}
