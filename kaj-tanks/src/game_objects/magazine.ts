import { getRandomSubarray } from "../utils/array";
import { mod } from "../utils/math";
import Projectile, { ProjectileStats } from "./Projectile";

enum ProjIndex {
  STANDARD,
  BIG,
  MULTI,

  TOTAL_COUNT
}

type ProjInfo = ProjectileStats & {
  name: string;
  description: string;
};

const PROJ_INFOS: ProjInfo[] = [
  {
    name: "Standard",
    description: "Standard ammo",
    radius: 2,
    speed: 1,
    explosionRadius: 25,
    damage: 11,
    mass: 5
  },
  {
    name: "Big",
    description: "Short range, big dmg",
    radius: 3,
    speed: 0.5,
    explosionRadius: 35,
    damage: 23,
    mass: 15
  },
  {
    name: "Multi",
    description: "5 shots at once",
    radius: 1,
    speed: 0.8,
    explosionRadius: 23,
    damage: 5,
    mass: 5
  }
];
const PROJ_DESCRIPTIONS: string[] = PROJ_INFOS.map(info => {
  return (
    info.description +
    "\nDamage: " +
    info.damage +
    "\nSpeed coefficient: " +
    info.speed +
    "\nExplosion: " +
    info.explosionRadius
  );
});

const MULTI_COUNT: number = 5;
const MULTI_ANGLE_ERRORS: number[] = [-11, -9, -7, -5, -3, 0, 3, 5, 7, 9, 11];
export const LARGEST_PROJ_DMG = Math.max(...PROJ_INFOS.map(i => i.damage));

/**
 * Tank magazine with projectiles. Provides projectile management.
 */
export default class Magazine {
  private projectiles: number[];
  private curIndex: number;

  public constructor(big: number, multi: number) {
    this.projectiles = [Infinity, big, multi];
    this.curIndex = 0;
  }

  /**
   * Returns new instance of current selected projectile type.
   */
  public getProjectile(playerId: number): Projectile[] {
    if (this.curIndex === ProjIndex.BIG) {
      if (--this.projectiles[this.curIndex] === 0) {
        this.loadNext();
      }
      return [new Projectile(playerId, PROJ_INFOS[ProjIndex.BIG])];
    } else if (this.curIndex === ProjIndex.MULTI) {
      if (--this.projectiles[this.curIndex] === 0) {
        this.loadNext();
      }
      return getRandomSubarray(MULTI_ANGLE_ERRORS, MULTI_COUNT).map(ae => {
        return new Projectile(playerId, PROJ_INFOS[ProjIndex.MULTI], ae);
      });
    } else {
      return [new Projectile(playerId, PROJ_INFOS[ProjIndex.STANDARD])];
    }
  }

  /**
   * Returns short string description of the current selected projectile type.
   */
  public getCurrentProjectileShortStats(): string {
    if (this.curIndex === ProjIndex.STANDARD) {
      return PROJ_INFOS[this.curIndex].name;
    }
    return `${PROJ_INFOS[this.curIndex].name} (${
      this.projectiles[this.curIndex]
    })`;
  }

  /**
   * Returns long string description of the current selected projectile type.
   */
  public getCurrentProjectileLongStats(): string {
    return PROJ_DESCRIPTIONS[this.curIndex];
  }

  /**
   * Changes current selected type to the next one. Skips types with zero
   * available projectiles.
   */
  public loadNext(): void {
    this.curIndex = mod(this.curIndex + 1, ProjIndex.TOTAL_COUNT);
    // does not show zero counts
    if (this.projectiles[this.curIndex] === 0) {
      this.loadNext();
    }
  }

  /**
   * Changes current selected type to the previous one. Skips types with zero
   * available projectiles.
   */
  public loadPrev(): void {
    this.curIndex = mod(this.curIndex - 1, ProjIndex.TOTAL_COUNT);
    // does not show zero counts
    if (this.projectiles[this.curIndex] === 0) {
      this.loadPrev();
    }
  }
}
