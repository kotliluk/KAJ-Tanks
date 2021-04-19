import * as React from "react";
import {
  TANK_MOVEMENT_SPEED,
  BASE_CANVAS_HEIGHT,
  UPDATE_RATE,
  BASE_CANVAS_WIDTH,
  GUN_MOVEMENT_SPEED,
  BASE_TANK_WIDTH,
  OBSTACLE_PART_SIZE
} from "../../constants/constants";
import Explosion from "../../game_objects/explosion";
import { centerDistance } from "../../game_objects/gameUtils";
import { ObstacleFactory } from "../../game_objects/obstacleFactory";
import Projectile from "../../game_objects/Projectile";
import { SquaredObstacle } from "../../game_objects/squaredObstacle";
import Tank from "../../game_objects/Tank";
import { PlayerStats } from "../../player/playerStats";
import { floorToHundret } from "../../utils/math";
import "./gameArea.css";
import { TankStats } from "./tankStats";

/**
 * Init obstacle and tank positions for 2, 3 and 4 players (on 0, 1, 2 index).
 * o = false means player, o = true means obsatcle, i is the number of the
 * obstacle/tank.
 */
const initPositions: { o: boolean; i: number }[][] = [
  [
    { o: false, i: 0 },
    { o: true, i: 0 },
    { o: true, i: 1 },
    { o: false, i: 1 }
  ], // 2 tanks
  [
    { o: false, i: 0 },
    { o: true, i: 0 },
    { o: false, i: 1 },
    { o: true, i: 1 },
    { o: false, i: 2 }
  ], // 3 tanks
  [
    { o: false, i: 0 },
    { o: true, i: 0 },
    { o: false, i: 1 },
    { o: true, i: 1 },
    { o: false, i: 2 },
    { o: true, i: 2 },
    { o: false, i: 3 }
  ] // 4 tanks
];

interface GameAreaProps {
  /**
   * Id of the component.
   */
  id: string;
  /**
   * Array of players for the game.
   */
  players: PlayerStats[];
  /**
   *
   */
  onEnd: (playerResults: PlayerStats[]) => void;
}

// GameArea state is not maintained by React
interface GameAreaState {
  tanks: Tank[];
}

/**
 * GameArea contains canvas for graphical representation of the game.
 * The cnavas is maintained by plain TypeScript (by update loop), not by React.
 */
export class GameArea extends React.Component<GameAreaProps, GameAreaState> {
  // @ts-ignore - canvas element
  private canvas: HTMLCanvasElement;
  // @ts-ignore - canvas context
  private ctx: CanvasRenderingContext2D;
  // @ts-ignore - ratio of current canvas size and refertial size 800x320
  private sizeRatio: number;
  // @ts-ignore - GameArea footer
  private footer: HTMLElement;
  // @ts-ignore - player information
  private roundPlayerInfoDiv: HTMLDivElement;
  // @ts-ignore - wind information
  private windDiv: HTMLDivElement;
  // @ts-ignore - current loaded ammo short info span
  private ammoShortInfo: HTMLSpanElement;
  // @ts-ignore - current loaded ammo long info span
  private ammoLongInfo: HTMLSpanElement;
  // @ts-ignore - projectile launch speed input
  private launchSpeedInput: HTMLInputElement;

  // index of the current tank in the this.state.tanks array
  private curTankIdx: number = 0;
  // +1 for move right, -1 for move left, 0 for stay
  private movement: number = 0;
  // +1 for move right, -1 for move left, 0 for stay
  private gunMovement: number = 0;
  // whether the fire button was clicked in last update loop iteration
  private fireClicked: boolean = false;
  // array of active projectiles in the game
  private projectiles: Projectile[] = [];
  // obstacles in the game
  private obstacles: SquaredObstacle[] = [];
  // animated explosions
  private explosions: Explosion[] = [];

  // wind: positive values means wind to right, negative to left
  private wind: number = this.initWind();
  // number of the current round (increased after shot of all players)
  private round: number = 1;

  // @ts-ignore - update interval id
  private updateIntervalId:  NodeJS.Timeout;

  public constructor(props: GameAreaProps) {
    super(props);
    this.state = {
      tanks: this.props.players.map(p => new Tank(p))
    };
  }

  /**
   * Returns current selected tank.
   */
  private curTank(): Tank {
    return this.state.tanks[this.curTankIdx];
  }

  /**
   * Update loop.
   */
  private update = (): void => {
    // clears the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // moves current tank
    this.moveTank();
    // moves current tank gun
    this.curTank().moveGun(this.gunMovement);
    // saves whether there were any projectiles
    const wereProjectiles: boolean = this.projectiles.length > 0;
    // moves all projectiles
    this.projectiles.forEach(p => p.move(this.wind));
    // colides projectiles
    this.projectiles.forEach(p => this.colide(p));
    // filters projectiles out of screen and exploded
    this.projectiles = this.projectiles.filter(
      p =>
        p.canReturnToRange(0, BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT) &&
        !p.isExploded()
    );
    // filters destoyed obstacles
    this.obstacles = this.obstacles.filter(o => o.getColumnsCount() > 0);
    // filters finished explosions
    this.explosions = this.explosions.filter(e => e.isAnimationOn());
    // moves destroyed tanks out of screen - does not remove them (they are needed for results)
    this.state.tanks.forEach(t => {
      if (t.getHealth() <= 0) {
        t.setXPos(2 * BASE_CANVAS_WIDTH);
        t.setYPos(2 * BASE_CANVAS_HEIGHT);
      }
    })
    // saves whether there was any animation on
    const wasAnimation: boolean =
      this.obstacles.some(o => o.isAnimationOn()) ||
      this.explosions.some(e => e.isAnimationOn());
    // shows all projectiles
    this.projectiles.forEach(p => p.show(this.ctx, this.sizeRatio));
    // shows all tanks
    this.state.tanks.forEach(t => t.show(this.ctx, this.sizeRatio));
    // shows all obstacles
    this.obstacles.forEach(o => o.show(this.ctx, this.sizeRatio));
    // shows all explosions
    this.explosions.forEach(e => e.show(this.ctx, this.sizeRatio));
    // saves whether there is any animation on now
    const isAnimation: boolean =
      this.obstacles.some(o => o.isAnimationOn()) ||
      this.explosions.some(e => e.isAnimationOn());
    // when fire button was pressed
    if (this.fireClicked) {
      this.fire();
    }
    // if there is only 0 or 1 alive tanks left, ends game
    else if (this.state.tanks.filter(t => t.isAlive()).length < 2) {
      this.endGame();
    }
    // when last active projective disapeared and there is no animation
    else if (this.projectiles.length === 0 && wereProjectiles && !isAnimation) {
      this.nextRound();
    }
    // when the all animations ended and there is no projectile
    else if (!isAnimation && wasAnimation && this.projectiles.length === 0) {
      this.nextRound();
    }
  };

  /**
   * Moves the current tank if the move is valid.
   */
  private moveTank(): void {
    const tank: Tank = this.curTank();
    if (this.movement !== 0) {
      // checks whether the move is valid
      const newLeft = tank.getXPos() + this.movement;
      const newRight = tank.getXPos() + BASE_TANK_WIDTH + this.movement;
      // true if no other tank is hit...
      const tanksOk = this.state.tanks
        .filter((_, i) => i !== this.curTankIdx)
        .every(t => {
          const tankLeft = t.getXPos();
          const tankRight = t.getXPos() + BASE_TANK_WIDTH;
          return newRight <= tankLeft || newLeft >= tankRight;
        });
      // true if no obstacle is hit...
      const obstaclesOk =
        tanksOk &&
        this.obstacles.every(o => {
          const obstacleLeft = o.getXPos();
          const obstacleRight =
            o.getXPos() + o.getColumnsCount() * OBSTACLE_PART_SIZE;
          return newRight <= obstacleLeft || newLeft >= obstacleRight;
        });
      const rangeOk = obstaclesOk && newLeft >= 0 && newRight < BASE_CANVAS_WIDTH;
      if (rangeOk) {
        this.curTank().diffXPos(this.movement);
      }
    }
  }

  /**
   * Fires the current tank. Adds new projectiles to the projectile array.
   * Updates displayed ammo count. Disables buttons.
   */
  private fire = () => {
    this.projectiles.push(...this.curTank().fire(Number(this.launchSpeedInput.value)));
    this.updateAmmoInfo();
    this.fireClicked = false;
    this.disableButtons(true);

    /*const a = new Audio();
    console.log(a.canPlayType("audio/mpeg"));
    a.src = "tank_fire.mp3";
    a.play();*/
  };

  /**
   * Updates displayed player stats and wind. Enables buttons.
   * Expects at least one player alive.
   */
  private nextRound = () => {
    this.disableButtons(false);
    const beforeIdx = this.curTankIdx;
    this.curTankIdx = (this.curTankIdx + 1) % this.state.tanks.length;
    while (!this.curTank().isAlive()) {
      this.curTankIdx = (this.curTankIdx + 1) % this.state.tanks.length;
    }
    if (this.curTankIdx < beforeIdx) {
      ++this.round;
    }
    // @ts-ignore - updates current player name
    this.roundPlayerInfoDiv.innerText = `Round: ${this.round} - Player: ${this.curTank().getName()}`;
    // updates current selected ammo
    this.updateAmmoInfo();
    this.launchSpeedInput.value = String(this.curTank().getLastLaunchSpeed());
    // updates current wind value
    this.wind += Math.random() * 4 - 2;
    // @ts-ignore
    this.windDiv.innerText = this.formatWind();
  };

  /**
   * Sets given disable status in all buttons in GameArea footer.
   */
  private disableButtons = (disable: boolean) => {
    // @ts-ignore
    [...this.footer.getElementsByTagName("button")].forEach(b => {
      b.disabled = disable;
    });
  };

  /**
   * Checks whether the given projectile hits anything in the GameArea.
   * If so, explodes it.
   */
  private colide = (p: Projectile) => {
    if (
      // if the ground is hit
      p.getYPos() + p.getRadius() > BASE_CANVAS_HEIGHT ||
      // or some tank is hit
      this.state.tanks.some(t => t.isColision(p)) ||
      // or some obstacle is hit
      this.obstacles.some(o => o.isColision(p))
    ) {
      this.explode(p);
    }
  };

  /**
   * Explodes the given projectile. Checks whether which tanks should take damage.
   */
  private explode = (proj: Projectile) => {
    proj.explode();
    // @ts-ignore
    const originTank: Tank = this.state.tanks.find(t => t.getId() === proj.getOriginId());
    this.state.tanks.forEach(tank => {
      if (
        tank.isAlive() &&
        centerDistance(tank, proj) < proj.getExplosionRadius()
      ) {
        // adds kill if the targer was destroyed and it is not itself
        if (
          tank.receiveDamage(proj.getDamage()) &&
          originTank.getId() !== tank.getId()
        ) {
          originTank.addKill();
        }
        // updates dealt damage if not hit itself
        if (originTank.getId() !== tank.getId()) {
          originTank.changeDamageDealt(proj.getDamage());
        }
        this.setState({}); // forces update
      }
    });
    this.obstacles.forEach(o => o.colide(proj));
    this.explosions.push(
      new Explosion(proj.getXPos(), proj.getYPos(), proj.getExplosionRadius())
    );
  };

  /**
   * Clears game update interval, finds winners and losers and passes
   * player stats to parent.
   */
  private endGame = () => {
    clearInterval(this.updateIntervalId);
    const players = this.state.tanks.map(t => t.getPlayer());
    const winner = this.state.tanks.find(t => t.isAlive());
    let winnerId = NaN;
    if (winner !== undefined) {
      winnerId = winner.getId();
    }
    players.forEach(p => {
      if (p.id !== winnerId) {
        p.loses = 1;
      } else {
        p.wins = 1;
      }
    });
    this.props.onEnd(players);
  };

  /**
   * Creates initial wind value from uniform distribution on interval (-50, 50).
   */
  private initWind(): number {
    return Math.random() * 100 - 50;
  }

  /**
   * Returns formated string description of current wind direction and power.
   */
  private formatWind(): string {
    let strWind: string = String(Math.abs(Math.round(this.wind)));
    if (this.wind < -30) {
      strWind = "<<< " + strWind;
    } else if (this.wind < -15) {
      strWind = "<< " + strWind;
    } else if (this.wind < 0) {
      strWind = "< " + strWind;
    } else if (this.wind > 30) {
      strWind = strWind + " >>>";
    } else if (this.wind > 15) {
      strWind = strWind + " >>";
    } else if (this.wind > 0) {
      strWind = strWind + " >";
    }
    return "Wind: " + strWind;
  }

  /**
   * Updates displayed short and long ammo info.
   */
  private updateAmmoInfo = () => {
    this.ammoShortInfo.innerText = this.curTank().getCurrentProjectileShortStats();
    this.ammoLongInfo.innerText = this.curTank().getCurrentProjectileLongStats();
  }

  /**
   * Creates an HTMLButtonElement with given text. Given onTrigger function
   * is set as onmousedown listener. Given onReset function is set as onmouseup
   * and onmouseleave listeners.
   */
  private createButton(
    text: string,
    onTrigger: (e: Event) => void,
    onReset: (e: Event) => void = () => {}
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.onmousedown = onTrigger;
    button.onmouseup = onReset;
    button.onmouseleave = onReset;
    button.ontouchstart = onTrigger;
    button.ontouchend = onReset;
    button.ontouchcancel = onReset;
    return button;
  }

  /**
   * Creates HTMLSpanElement with given text.
   */
  private createSpan(text: string): HTMLSpanElement {
    const span = document.createElement("span");
    span.innerText = text;
    return span;
  }

  /**
   * Creates HTMLDIvElement with player and wind info.
   */
  private createInfoDiv(): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("info-div");
    // current player name
    this.roundPlayerInfoDiv = document.createElement("div");
    this.roundPlayerInfoDiv.innerText = `Round: ${this.round} - Player: ${this.curTank().getName()}`;
    div.appendChild(this.roundPlayerInfoDiv);
    return div;
  }

  /**
   * Creates HTMLDIvElement with movement and gun movement buttons.
   */
  private createMoveGunDiv(): HTMLDivElement {
    const moveGunDiv: HTMLDivElement = document.createElement("div");
    moveGunDiv.classList.add("move-gun-div");
    // current wind
    this.windDiv = document.createElement("div");
    this.windDiv.innerText = this.formatWind();
    moveGunDiv.appendChild(this.windDiv);
    // movement buttons
    const movementDiv: HTMLDivElement = document.createElement("div");
    movementDiv.classList.add("move-div");
    movementDiv.appendChild(
      this.createButton(
        "◀",
        () => (this.movement = -TANK_MOVEMENT_SPEED),
        () => (this.movement = 0)
      )
    );
    movementDiv.appendChild(this.createSpan(" MOVE "));
    movementDiv.appendChild(
      this.createButton(
        "►",
        () => (this.movement = TANK_MOVEMENT_SPEED),
        () => (this.movement = 0)
      )
    );
    moveGunDiv.appendChild(movementDiv);
    // gun movement buttons
    const gunDiv: HTMLDivElement = document.createElement("div");
    gunDiv.classList.add("gun-div");
    gunDiv.appendChild(
      this.createButton(
        "◀",
        () => (this.gunMovement = -GUN_MOVEMENT_SPEED),
        () => (this.gunMovement = 0)
      )
    );
    gunDiv.appendChild(this.createSpan(" GUN "));
    gunDiv.appendChild(
      this.createButton(
        "►",
        () => (this.gunMovement = GUN_MOVEMENT_SPEED),
        () => (this.gunMovement = 0)
      )
    );
    moveGunDiv.appendChild(gunDiv);
    return moveGunDiv;
  }

  /**
   * Creates HTMLDIvElement with ammo changing and fire buttons.
   */
  private createAmmoFireDiv(): HTMLDivElement {
    const ammoFire: HTMLDivElement = document.createElement("div");
    ammoFire.classList.add("ammo-fire-div");
    // ammo change buttons
    const ammoDiv: HTMLDivElement = document.createElement("div");
    ammoDiv.classList.add("ammo-div");
    ammoDiv.appendChild(
      this.createButton("◀", () => {
        this.curTank().loadPrevProjectile();
        this.updateAmmoInfo();
      })
    );
    const ammoInfoDiv = document.createElement("div");
    ammoInfoDiv.classList.add("ammo-info-div");
    this.ammoShortInfo = this.createSpan(this.curTank().getCurrentProjectileShortStats());
    this.ammoShortInfo.classList.add("short-info-span");
    this.ammoLongInfo = this.createSpan(this.curTank().getCurrentProjectileLongStats());
    this.ammoLongInfo.classList.add("long-info-span");
    ammoInfoDiv.appendChild(this.ammoShortInfo);
    ammoInfoDiv.appendChild(this.ammoLongInfo);
    ammoDiv.appendChild(ammoInfoDiv);
    ammoDiv.appendChild(
      this.createButton("►", () => {
        this.curTank().loadNextProjectile();
        this.updateAmmoInfo();
      })
    );
    ammoFire.appendChild(ammoDiv);
    // fire power slider
    this.launchSpeedInput = document.createElement("input");
    this.launchSpeedInput.type = "range";
    this.launchSpeedInput.min = "10";
    this.launchSpeedInput.max = "100";
    this.launchSpeedInput.value = "50";
    ammoFire.appendChild(this.launchSpeedInput);
    // fire div
    const fireDiv: HTMLDivElement = document.createElement("div");
    fireDiv.classList.add("fire-div");
    fireDiv.appendChild(
      this.createButton("Fire!", () => (this.fireClicked = true))
    );
    ammoFire.appendChild(fireDiv);
    return ammoFire;
  }

  /**
   * Computes the size of the canvas and ratio to the reference size 800x320.
   * Sets initial positions of tanks.
   */
  private computeSize(): void {
    // gets rounded window width
    let windowWidth: number = floorToHundret(window.innerWidth * 0.9);
    // asserts too wide windows
    windowWidth = windowWidth > 1400 ? 1400 : windowWidth;
    this.sizeRatio = windowWidth / BASE_CANVAS_WIDTH;
    console.log("ratio: " + this.sizeRatio);
    this.canvas.width = windowWidth;
    this.canvas.height = windowWidth / 2.5;
  }

  /**
   * Sets init position of tanks and obsatcles.
   */
  private initPositions(): void {
    const positions = initPositions[this.state.tanks.length - 2];
    const distance: number = BASE_CANVAS_WIDTH / positions.length;
    const obstacleFactory = new ObstacleFactory();
    positions.forEach((pos, i) => {
      // adding obstacle
      if (pos.o) {
        this.obstacles.push(
          // TODO
          obstacleFactory.house(distance * (i + 0.5), BASE_CANVAS_HEIGHT)
        );
      }
      // setting tank position
      else {
        this.state.tanks[pos.i].setXPos(
          distance * (i + 0.5) - BASE_TANK_WIDTH / 2
        );
        this.state.tanks[pos.i].setYPos(BASE_CANVAS_HEIGHT);
      }
    });
  }

  /**
   * Sets inner structure of the component not maintained by React.
   */
  componentDidMount() {
    // @ts-ignore - gets parent section
    const gameArea: HTMLElement = document.getElementById(this.props.id);
    window.addEventListener("resize", () => this.computeSize());
    // create canvas for graphics
    this.canvas = document.createElement("canvas");
    // @ts-ignore
    this.ctx = this.canvas.getContext("2d");
    const canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvas-container");
    canvasContainer.appendChild(this.canvas)

    // computes size of the canvas
    this.computeSize();
    // sets init positions of tanks and obstacles
    this.initPositions();

    // create footer
    this.footer = document.createElement("footer");
    // info about player and wind
    this.footer.appendChild(this.createInfoDiv());
    // div with movement and gun movement
    this.footer.appendChild(this.createMoveGunDiv());
    // div with ammo and fire
    this.footer.appendChild(this.createAmmoFireDiv());

    // appends childs
    gameArea.insertAdjacentElement("afterbegin", this.footer);
    gameArea.insertAdjacentElement("afterbegin", canvasContainer);

    // set update interval
    this.updateIntervalId = setInterval(this.update, UPDATE_RATE);
  }

  /**
   * Renders parent component. Main tasks are not maintained by React.
   */
  render() {
    return (
      <section id={this.props.id} className="game-area">
        <div className="tank-stats-container">
          {this.state.tanks.map((tank, i) => {
            return <TankStats tank={tank} key={i} />;
          })}
        </div>
      </section>
    );
  }
}
