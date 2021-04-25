import { OBSTACLE_PART_SIZE } from "../constants/constants";
import { SquaredObstacle } from "./squaredObstacle";

/**
 * Factory for generating game obstacles.
 */
export class ObstacleFactory {
  /**
   * Returns random obstacle.
   */
  public random(xLeft: number, yBottom: number): SquaredObstacle {
    const methods = Object.getOwnPropertyNames(ObstacleFactory.prototype)
      .filter(m => m !== "random" && m !== "constructor");
    const index = Math.floor(Math.random() * methods.length);
    // @ts-ignore
    return this[methods[index]](xLeft, yBottom);
  }

  /**
   * 22x17 house.
   */
  public house(xLeft: number, yBottom: number): SquaredObstacle {
    const walls = ["#222222", "#333333", "#444444", "#555555"];
    const w = walls[Math.floor(Math.random() * walls.length)]; // walls
    const doors = ["#8e350b", "#ac552f"];
    const d = doors[Math.floor(Math.random() * doors.length)]; // door
    const g = "lightblue"; // glass
    const roofs = ["#981f1f", "#ff0000"];
    const r = roofs[Math.floor(Math.random() * roofs.length)]; // roof
    const squares = [
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r],
      [w, d, d, d, d, d, w, w, w, g, g, g, w, w, r, r, r],
      [w, d, d, d, d, d, w, w, w, g, g, g, w, w, r, r, r],
      [w, d, d, d, d, d, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, g, g, g, w, w, w, g, g, g, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r]
    ];
    return new SquaredObstacle(
      xLeft - (squares.length * OBSTACLE_PART_SIZE) / 2,
      yBottom,
      squares
    );
  }

  /**
   * 39x17 factory with 2 3x29-chimneys
   */
  public factory(xLeft: number, yBottom: number): SquaredObstacle {
    const walls = ["#222222", "#333333", "#444444", "#555555"];
    const w = walls[Math.floor(Math.random() * walls.length)]; // walls
    const doors = ["#8e350b", "#ac552f", "#000000"];
    const d = doors[Math.floor(Math.random() * doors.length)]; // door
    const g = "lightblue"; // glass
    const roofs = ["#981f1f", "#ff0000"];
    const r = roofs[Math.floor(Math.random() * roofs.length)]; // roof
    const s = "black"; // details
    const squares = [
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [
        w,
        w,
        w,
        w,
        s,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [
        w,
        w,
        w,
        w,
        s,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [
        w,
        w,
        w,
        w,
        s,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [
        w,
        w,
        w,
        w,
        s,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [
        w,
        w,
        w,
        w,
        s,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [
        w,
        w,
        w,
        w,
        s,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        g,
        w,
        w,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s,
        s
      ],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, s, w, w, w, w, w, w, w, w, w, w, s, s, s],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w, s, s, s],
      [w, w, w, w, s, g, g, g, g, g, g, g, g, w, w],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r],
      [d, d, d, d, d, w, w, w, w, w, g, g, w, w, r, r],
      [d, d, d, d, d, d, w, w, w, w, g, g, w, w, r, r, r],
      [d, d, d, d, d, d, d, w, w, w, w, w, w, w, r, r, r],
      [d, d, d, d, d, d, d, w, w, w, g, g, w, w, r, r, r],
      [d, d, d, d, d, d, d, w, w, w, g, g, w, w, r, r, r],
      [d, d, d, d, d, d, w, w, w, w, w, w, w, w, r, r, r],
      [d, d, d, d, d, w, w, w, w, w, g, g, w, w, r, r, r],
      [w, w, w, w, w, w, w, w, w, w, g, g, w, w, r, r, r],
      [d, d, d, d, d, w, w, w, w, w, w, w, w, w, r, r, r],
      [d, d, d, d, d, w, w, w, w, w, g, g, w, w, r, r, r],
      [d, d, d, d, d, w, w, w, w, w, g, g, w, w, r, r],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, r]
    ];
    return new SquaredObstacle(
      xLeft - (squares.length * OBSTACLE_PART_SIZE) / 2,
      yBottom,
      squares
    );
  }
}
