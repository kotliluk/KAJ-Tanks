import GameObject from "./gameObject";
import Projectile from "./Projectile";

/**
 * Abstract predecessor of objects which can be hit by a projectile.
 */
export abstract class ColidingObject extends GameObject {
  /**
   * Returns true if the object was hit by the given projectile.
   */
  public abstract isColision(p: Projectile): boolean;
}
