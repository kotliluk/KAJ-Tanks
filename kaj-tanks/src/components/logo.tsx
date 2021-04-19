import React from "react";

interface LogoProps {
  // default width is 150px
  width?: number,
  // default height is "width / 3"
  height?: number
}

interface LogoState {
  timeouts: (NodeJS.Timeout | undefined)[];
}

/**
 * Animated application logo. When the user clicks on a grenade in the logo, fire sound plays and the grenade disappears
 * for 5 seconds.
 */
export class Logo extends React.Component<LogoProps, LogoState> {

  constructor(props: LogoProps) {
    super(props);
    this.state = {
      timeouts: [undefined, undefined, undefined, undefined]
    }
  }

  componentWillUnmount() {
    this.state.timeouts.forEach(t => {
      if (t !== undefined) {
        clearInterval(t);
      }
    })
  }

  private shootGrenade = (i: number) => {
    if (this.state.timeouts[i] === undefined) {
      const timeouts = this.state.timeouts;
      timeouts[i] = setTimeout(() => this.returnGrenade(i), 5000);

      const a = new Audio();
      a.src = "tank_fire.mp3";
      a.play();

      this.setState({timeouts: timeouts });
    }
  }

  private returnGrenade = (i: number) => {
    const timeouts = this.state.timeouts;
    timeouts[i] = undefined;
    this.setState({timeouts: timeouts });
  }

  public render() {
    const w = this.props.width ? this.props.width : 150;
    const h = this.props.height ? this.props.height : w / 3;

    const visibilities = this.state.timeouts.map(t => t === undefined ? "visible" : "hidden");

    return (
      <svg width={`${w}px`} height={`${h}px`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 50" cursor="default">
          {/* T - TOP GRENADE - first grenade in array */}
          <g id="t_top_grenade" onClick={() => this.shootGrenade(0)}>
            <ellipse visibility={visibilities[0]} stroke="#bfbf00" ry="1.97183" rx="12.25349" id="svg_7" cy="10.8451" cx="16.61985" opacity="undefined" strokeDasharray="null" strokeWidth="null" fill="#bfbf00"/>
            <rect stroke="#a3a32a" strokeOpacity="0" id="svg_1" height="5.63379" width="18.8732" y="8.02821" x="18.45083" opacity="undefined" fill="#d1661f"/>
          </g>

          {/* T - BOTTOM GRENADE - second grenade in array */}
          <g transform="rotate(90 22,26) " id="t_bottom_grenade" onClick={() => this.shootGrenade(1)}>
            <ellipse visibility={visibilities[1]} stroke="#bfbf00" ry="1.97183" rx="12.25349" id="svg_9" cy="25.6338" cx="15.2114" opacity="undefined" strokeDasharray="null" strokeWidth="null" fill="#bfbf00"/>
            <rect strokeOpacity="0" id="svg_10" height="5.63379" width="23.66192" y="22.81691" x="17.04238" opacity="undefined" stroke="#a3a32a" fill="#d1661f"/>
          </g>

          {/* TANKS */}
          <text id="tanks_text" fontStyle="normal" fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="sans-serif" fontSize="35" y="43.80278" x="26.47898" opacity="undefined" strokeOpacity="0" strokeDasharray="null" strokeWidth="0" stroke="#a3a32a" fill="#3f7f00">anks</text>

          {/* II - FIRST GRENADE - third grenade in array */}
          <g transform="rotate(90 110,26)" id="ii_first_grenade" onClick={() => this.shootGrenade(2)}>
            <ellipse visibility={visibilities[2]} stroke="#bfbf00" ry="1.97183" rx="12.25349" id="svg_13" cy="25.6338" cx="103.38023" opacity="undefined" strokeDasharray="null" strokeWidth="null" fill="#bfbf00"/>
            <rect strokeOpacity="0" id="svg_14" height="5.63379" width="23.66192" y="22.81691" x="105.21121" opacity="undefined" stroke="#a3a32a" fill="#d1661f"/>
          </g>

          {/* II - SECOND GRENADE - fourth grenade in array */}
          <g transform="rotate(90 118,26) " id="ii_second_grenade" onClick={() => this.shootGrenade(3)}>
            <ellipse visibility={visibilities[3]} stroke="#bfbf00" ry="1.97183" rx="12.25349" id="svg_16" cy="25.35211" cx="111.12669" opacity="undefined" strokeDasharray="null" strokeWidth="null" fill="#bfbf00"/>
            <rect strokeOpacity="0" id="svg_17" height="5.63379" width="23.66192" y="22.53522" x="112.95767" opacity="undefined" stroke="#a3a32a" fill="#d1661f"/>
          </g>

          {/* D */}
          <text id="d_text" fontStyle="normal" fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="sans-serif" fontSize="35" y="44.36616" x="120.98582" opacity="undefined" fillOpacity="null" strokeOpacity="0" strokeDasharray="null" strokeWidth="null" stroke="#a3a32a" fill="#d1661f">D</text>
      </svg>
    )
  }
}