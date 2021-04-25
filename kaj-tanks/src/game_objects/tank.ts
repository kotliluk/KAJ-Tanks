import { BASE_TANK_GUN_WIDTH } from "../constants/constants";
import { BASE_TANK_GUN_LENGTH } from "../constants/constants";
import { BASE_TANK_HEIGHT } from "../constants/constants";
import { BASE_TANK_WIDTH } from "../constants/constants";
import { PlayerStats } from "../player/playerStats";
import { ColidingObject } from "./colidingObject";
import Magazine from "./magazine";
import Projectile from "./projectile";

/**
 * Tank for the GameArea.
 * It works with 2 postion/size scales:
 * - base scale for inner representation (saved position, collision computation)\
 * - ratio-scaled for printing on screen
 */
export default class Tank extends ColidingObject {
  private player: PlayerStats;
  private health: number = 20;

  private gunAngle: number = 0;
  private magazine: Magazine = new Magazine(3, 3);
  private lastLaunchSpeed: number = 50;

  public constructor(player: PlayerStats) {
    super();
    this.player = player;
    this.setColor(player.color);
  }

  public getPlayer(): PlayerStats {
    return this.player;
  }

  public getId(): number {
    return this.player.id;
  }

  public getName(): string {
    return this.player.name;
  }

  /**
   * Returns true, if the changed health is <= 0.
   */
  public receiveDamage(dmg: number): boolean {
    this.health -= dmg;
    this.player.dmgReceived += dmg;
    if (this.health <= 0) {
      this.health = 0;
      return true;
    }
    return false;
  }

  public getHealth(): number {
    return this.health;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Changes the dealt damage by given difference.
   */
  public changeDamageDealt(diff: number): void {
    this.player.dmgDealt += diff;
  }

  public getDamageDealt(): number {
    return this.player.dmgDealt;
  }

  public addKill(): void {
    this.player.kills += 1;
  }

  public getKills(): number {
    return this.player.kills;
  }

  public getLastLaunchSpeed(): number {
    return this.lastLaunchSpeed;
  }

  /**
   * Changes the gun angle by given difference. It does not go outside <-90, 90> range.
   */
  public moveGun(angleDif: number) {
    this.gunAngle += angleDif;
    if (this.gunAngle < -90) {
      this.gunAngle = -90;
    } else if (this.gunAngle > 90) {
      this.gunAngle = 90;
    }
  }

  /**
   * Fires current selected projectile. The starting position is the end of the gun.
   * The given speed is expected in range 0-100.
   * NOTE: The position of projectiles is not scaled by current game sizeRation.
   */
  public fire(speed: number): Projectile[] {
    this.lastLaunchSpeed = speed;
    // get current projectiles from the magazine
    const projectiles: Projectile[] = this.magazine.getProjectile(
      this.player.id
    );
    // sets their initial position
    projectiles.forEach(p =>
      p.launch(this.xGunEnd(), this.yGunEnd(), this.gunAngle, speed)
    );
    return projectiles;
  }

  /**
   * Loads next projectile type in the magazine.
   */
  public loadNextProjectile(): void {
    this.magazine.loadNext();
  }

  /**
   * Loads previous projectile type in the magazine.
   */
  public loadPrevProjectile(): void {
    this.magazine.loadPrev();
  }

  /**
   * Gets short information about current selected projectile.
   */
  public getCurrentProjectileShortStats(): string {
    return this.magazine.getCurrentProjectileShortStats();
  }

  /**
   * Gets long information about current selected projectile.
   */
  public getCurrentProjectileLongStats(): string {
    return this.magazine.getCurrentProjectileLongStats();
  }

  public isCollision(p: Projectile): boolean {
    return (
      // if they are in collision y-range
      p.getYPos() + p.getRadius() > this.getYPos() - BASE_TANK_HEIGHT &&
      p.getYPos() - p.getRadius() < this.getYPos() &&
      // and collision x-range
      p.getXPos() + p.getRadius() > this.getXPos() &&
      p.getXPos() - p.getRadius() < this.getXPos() + BASE_TANK_WIDTH
    );
  }

  public show(ctx: CanvasRenderingContext2D, ratio: number): void {
    // draws gun
    ctx.beginPath();
    ctx.lineWidth = BASE_TANK_GUN_WIDTH * ratio;
    ctx.save();
    ctx.translate(
      (this.xPos + BASE_TANK_WIDTH / 2) * ratio,
      (this.yPos - BASE_TANK_HEIGHT) * ratio
    );
    ctx.rotate((this.gunAngle * Math.PI) / 180);
    ctx.moveTo(0, 5);
    ctx.lineTo(0, -(BASE_TANK_GUN_LENGTH * ratio));
    ctx.stroke();
    ctx.rotate(-this.gunAngle);
    ctx.restore();
    // draws tank
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.xPos * ratio,
      (this.yPos - BASE_TANK_HEIGHT) * ratio,
      BASE_TANK_WIDTH * ratio,
      BASE_TANK_HEIGHT * ratio
    );
  }

  /*
   * Computes the not-scaled x-end of the gun.
   */
  private xGunEnd(): number {
    return (
      this.xPos +
      BASE_TANK_WIDTH / 2 +
      Math.sin((this.gunAngle * Math.PI) / 180) * BASE_TANK_GUN_LENGTH * 1.1
    );
  }

  /*
   * Computes the not-scaled y-end of the gun.
   */
  private yGunEnd(): number {
    return (
      this.yPos -
      BASE_TANK_HEIGHT -
      Math.cos((this.gunAngle * Math.PI) / 180) * BASE_TANK_GUN_LENGTH * 1.1
    );
  }
}
