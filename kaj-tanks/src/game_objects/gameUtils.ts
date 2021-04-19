import { BASE_TANK_WIDTH } from "../constants/constants";
import { BASE_TANK_HEIGHT } from "../constants/constants";
import { euclideanDistance } from "../utils/math";
import Projectile from "./Projectile";
import Tank from "./Tank";

/**
 * Computes the distance of the tank and projectile centers.
 */
export function centerDistance(tank: Tank, p: Projectile): number {
  return euclideanDistance(
    tank.getXPos() + BASE_TANK_WIDTH / 2,
    tank.getYPos() - BASE_TANK_HEIGHT / 2,
    p.getXPos(),
    p.getYPos()
  );
}
