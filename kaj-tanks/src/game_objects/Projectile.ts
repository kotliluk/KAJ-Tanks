import { euclideanDistance } from "../utils/math";
import GameObject from "./gameObject";

export interface ProjectileStats {
  radius: number;
  speed: number;
  explosionRadius: number;
  damage: number;
  mass: number;
}

/**
 * Representation of the fired projectile.
 */
export default class Projectile extends GameObject {
  private exploded: boolean = false;
  private t: number = 0;

  private readonly radius: number;
  private speed: number;
  private readonly explosionRadius: number;
  private readonly damage: number;
  private readonly mass: number;

  private xInit: number = 0;
  private yInit: number = 0;

  private angleCos: number = 0;
  private angleSin: number = 0;

  private windXDiff: number = 0;

  public constructor(
    private readonly originId: number,
    stats: ProjectileStats,
    private readonly angleErr: number = 0
  ) {
    super();
    this.radius = stats.radius;
    this.speed = stats.speed;
    this.explosionRadius = stats.explosionRadius;
    this.damage = stats.damage;
    this.mass = stats.mass;
    this.color = "black";
  }

  public getXPos(): number {
    return this.xPos + this.windXDiff;
  }

  public getOriginId(): number {
    return this.originId;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getExplosionRadius(): number {
    return this.explosionRadius;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getMass(): number {
    return this.mass;
  }

  public isExploded(): boolean {
    return this.exploded;
  }

  public explode(): void {
    this.exploded = true;
  }

  /**
   * Launches the projectile from given [x, y] point in given angle
   * (angle is expected with 0 value in vertical direction, -90 means
   * horizontal left direction, 90 means horizontal right direction).
   * The given speed is expected in range 0-100.
   */
  public launch(xInit: number, yInit: number, angle: number, speed: number) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.speed *= speed / 10;
    // applies angle error
    angle += this.angleErr;
    // moves angle to expected range
    if (angle < 0) {
      angle += 90;
      this.angleCos = -Math.cos((angle * Math.PI) / 180);
    } else {
      angle = 90 - angle;
      this.angleCos = Math.cos((angle * Math.PI) / 180);
    }
    this.angleSin = Math.sin((angle * Math.PI) / 180);
    this.xPos = xInit;
    this.yPos = xInit;
    this.windXDiff = 0;
  }

  /**
   * Updates projectile position and effect of the wind.
   */
  public move(wind: number) {
    ++this.t;
    const xPrev = this.xPos;
    const yPrev = this.yPos;

    this.xPos = this.xInit + this.speed * this.t * this.angleCos;
    this.yPos =
      this.yInit - this.speed * this.t * this.angleSin + this.t ** 2 / 20;

    const diff = euclideanDistance(xPrev, yPrev, this.xPos, this.yPos) + 10;
    this.windXDiff += (wind * Math.log(this.t)) / (diff * this.mass);
  }

  /**
   * Draws the projectile on given canvas with given size-ratio.
   */
  public show(ctx: CanvasRenderingContext2D, ratio: number): void {
    ctx.beginPath();
    ctx.arc(
      this.getXPos() * ratio,
      this.getYPos() * ratio,
      this.getRadius() * ratio,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  /**
   * Returns true, if the whole projectile is in the given rectangle.
   */
  public isInRange(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): boolean {
    return (
      this.getXPos() + this.getRadius() > minX &&
      this.getXPos() - this.getRadius() < maxX &&
      this.getYPos() + this.getRadius() > minY &&
      this.getYPos() - this.getRadius() < maxY
    );
  }

  /**
   * Returns true, if the projectile is in the given range or there is a chance
   * to return back in it (it is outside but the wind blows in).
   */
  public canReturnToRange(minX: number, maxX: number, maxY: number): boolean {
    if (this.yPos > maxY) {
      return false;
    }
    if (this.xPos < minX && this.windXDiff < 0) {
      return false;
    }
    if (this.xPos > maxX && this.windXDiff > 0) {
      return false;
    }
    return true;
  }
}
