import { BASE_CANVAS_HEIGHT, OBSTACLE_PART_SIZE } from "../constants/constants";
import { euclideanDistance } from "../utils/math";
import { ColidingObject } from "./colidingObject";
import Projectile from "./Projectile";

/**
 * Helper class representing one column in SquaredObstacle.
 */
class SquaredObstacleColumn extends ColidingObject {
  private animationOn: boolean = false;
  // squares in the columns - true means existing square, false means exploded square (an empty place)
  private squares: string[];
  // middle of the column in x-axis
  private xCenter: number;
  // time from the last animation start
  private animationTime: number = 0;

  constructor(xPos: number, yPos: number, squares: string[]) {
    super();
    this.squares = squares;
    this.xPos = xPos;
    this.xCenter = xPos + OBSTACLE_PART_SIZE / 2;
    this.yPos = yPos;
  }

  /**
   * If the obstacle is not in consistent state and the animation is on.
   */
  public isAnimationOn(): boolean {
    return this.animationOn;
  }

  /**
   * Checks whether given square s on index i is in colision distance with projectile.
   */
  private isSquareColision(s: string, i: number, p: Projectile): boolean {
    // if the square exists, computes its distance from projectile
    if (s !== "") {
      const yCenter = this.yPos - (i + 0.5) * OBSTACLE_PART_SIZE;
      return (
        euclideanDistance(this.xCenter, yCenter, p.getXPos(), p.getYPos()) <
        p.getRadius() + OBSTACLE_PART_SIZE
      );
    }
    // if the square does not exist, cannot be collided
    return false;
  }

  /**
   * Changes squares in explosion radius to false.
   */
  private squareCollide(s: string, i: number, p: Projectile): void {
    // if the square exists, computes its distance from projectile
    if (s !== "") {
      const yCenter = this.yPos - (i + 0.5) * OBSTACLE_PART_SIZE;
      if (
        euclideanDistance(this.xCenter, yCenter, p.getXPos(), p.getYPos()) <
        p.getExplosionRadius() / 2 + OBSTACLE_PART_SIZE * 1.5
      ) {
        this.squares[i] = "";
        this.animationOn = true;
        this.animationTime = 0;
      }
    }
  }

  /**
   * Pops false squares from column top. Checks whether there are some false
   * squares in between true squares and updates this.animationOn (to true, if
   * there is any false under true, so the true has to fall down).
   */
  private checkConsistency(): void {
    // removes false (exploded) squares from top
    while (this.squares[this.squares.length - 1] === "") {
      this.squares.pop();
    }
    // if there is still some false, animation has not ended
    this.animationOn = this.squares.some(s => s === "");
  }

  /**
   * Moves the true squares above empty place down if it is animation time.
   */
  private animate(): void {
    if (this.isAnimationTime()) {
      let falseFound: boolean = false;
      for (let i = 0; i < this.squares.length; ++i) {
        if (this.squares[i] === "") {
          falseFound = true;
        }
        // if there is some square above empty place, moves it down
        if (this.squares[i] !== "" && falseFound) {
          this.squares[i - 1] = this.squares[i];
          this.squares[i] = "";
        }
      }
    }
    ++this.animationTime;
  }

  /**
   * Returns true if the animation should continue in this time step.
   */
  private isAnimationTime(): boolean {
    return (
      this.animationTime === 6 ||
      this.animationTime === 10 ||
      this.animationTime >= 12
    );
  }

  public isColision(p: Projectile): boolean {
    // if the projectile is outside x boundary, returns false
    if (
      p.getXPos() + p.getRadius() < this.getXPos() ||
      p.getXPos() - p.getRadius() > this.getXPos() + OBSTACLE_PART_SIZE
    ) {
      return false;
    }
    return this.squares.some((s, i) => this.isSquareColision(s, i, p));
  }

  public show(ctx: CanvasRenderingContext2D, ratio: number): void {
    this.animate();
    this.squares.forEach((s, i) => {
      if (s !== "") {
        ctx.fillStyle = s;
        ctx.fillRect(
          Math.ceil(this.xPos * ratio),
          Math.ceil((this.yPos - (i + 1) * OBSTACLE_PART_SIZE) * ratio),
          Math.ceil(OBSTACLE_PART_SIZE * ratio),
          Math.ceil(OBSTACLE_PART_SIZE * ratio)
        );
      }
    });
    this.checkConsistency();
  }

  public collide(p: Projectile): void {
    // if the projectile is outside x boundary, cannot collide
    if (
      p.getXPos() + p.getExplosionRadius() < this.getXPos() ||
      p.getXPos() - p.getExplosionRadius() > this.getXPos() + OBSTACLE_PART_SIZE
    ) {
      return;
    }
    this.squares.forEach((s, i) => this.squareCollide(s, i, p));
    this.checkConsistency();
  }

  public isEmpty(): boolean {
    return this.squares.length === 0;
  }
}

/**
 * Obstacle created from square parts. Squares are animated to fall down after colision.
 */
export class SquaredObstacle extends ColidingObject {
  private animationOn: boolean = false;
  private columns: SquaredObstacleColumn[];
  private columnsCount: number;
  private highest: number;

  public constructor(xPos: number, yPos: number, squares: string[][]) {
    super();
    this.columns = squares.map(
      (s, i) =>
        new SquaredObstacleColumn(xPos + i * OBSTACLE_PART_SIZE, yPos, s)
    );
    this.columnsCount = this.columns.length;
    this.xPos = xPos;
    this.yPos = yPos;
    this.highest = Math.max(...squares.map(s => s.length));
  }

  /**
   * If margin columns are empty, removes them from the array and updates position/width.
   */
  private filterMarginColumns(): void {
    while (this.columns.length > 0 && this.columns[0].isEmpty()) {
      this.columns.shift();
      this.xPos += OBSTACLE_PART_SIZE;
      this.columnsCount -= 1;
    }
    while (
      this.columns.length > 0 &&
      this.columns[this.columns.length - 1].isEmpty()
    ) {
      this.columns.pop();
      this.columnsCount -= 1;
    }
  }

  /**
   * If the obstacle is not in consistent state and the animation is on.
   */
  public isAnimationOn(): boolean {
    return this.animationOn;
  }

  /**
   * Returns number of columns of the obstacle (counting inner empty columns).
   * When returns 0, it means that the obstacle is destroyed.
   */
  public getColumnsCount(): number {
    return this.columnsCount;
  }

  public isColision(p: Projectile): boolean {
    // if the projectile is outside boundary rectangle, returns false
    if (
      p.getXPos() + p.getRadius() < this.xPos ||
      p.getXPos() - p.getRadius() >
        this.xPos + this.columnsCount * OBSTACLE_PART_SIZE ||
      p.getYPos() + p.getRadius() <
        BASE_CANVAS_HEIGHT - this.highest * OBSTACLE_PART_SIZE
    ) {
      return false;
    }
    // if any obstacle column was hit, returns true
    return this.columns.some(c => c.isColision(p));
  }

  public show(ctx: CanvasRenderingContext2D, ratio: number): void {
    this.columns.forEach(c => c.show(ctx, ratio));
    if (this.animationOn) {
      this.animationOn = this.columns.some(col => col.isAnimationOn());
    }
    this.filterMarginColumns();
  }

  public collide(p: Projectile): void {
    // if the projectile is outside boundary rectangle, colision cannot happen
    if (
      p.getXPos() + p.getExplosionRadius() < this.getXPos() ||
      p.getXPos() - p.getExplosionRadius() >
        this.getXPos() + this.getColumnsCount() * OBSTACLE_PART_SIZE ||
      p.getYPos() + p.getExplosionRadius() <
        BASE_CANVAS_HEIGHT - this.highest * OBSTACLE_PART_SIZE
    ) {
      return;
    }
    // otherwise tries hit columns
    this.columns.forEach(c => c.collide(p));
    this.animationOn = this.columns.some(col => col.isAnimationOn());
  }
}
