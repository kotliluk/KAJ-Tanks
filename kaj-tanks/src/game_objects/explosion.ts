import GameObject from "./gameObject";

interface AnimationStep {
  r: number;
  color: string;
}

const animationSteps: AnimationStep[][] = [
  [{ r: 1, color: "yellow" }],
  [{ r: 2, color: "yellow" }],
  [{ r: 3, color: "orange" }, { r: 2, color: "yellow" }],
  [
    { r: 4, color: "red" },
    { r: 3.5, color: "orange" },
    { r: 2, color: "yellow" }
  ],
  [{ r: 1, color: "orange" }]
];

const animationLen: number = animationSteps.length;

/**
 * Game object representation of an explosion animation.
 */
export default class Explosion extends GameObject {
  private readonly radius: number;
  private t: number;

  /**
   * @param x x-center of explosion
   * @param y y-center of explosion
   * @param radius radius of explosion
   * @param animationRate 0.25 for slow animations, 0.5 for fast animations
   */
  constructor(x: number, y: number, radius: number, private animationRate: 0.25 | 0.5) {
    super();
    this.xPos = x;
    this.yPos = y;
    this.radius = radius / 5;
    this.t = 0;
  }

  /**
   * True, if the animation has not ended yet.
   */
  public isAnimationOn(): boolean {
    return this.t < animationLen;
  }

  /**
   * Draws next frame of the explosion on the given canvas.
   */
  public show(ctx: CanvasRenderingContext2D, ratio: number): void {
    const currentStep = animationSteps[Math.floor(this.t)];
    currentStep.forEach(c => this.drawCircle(ctx, ratio, c));
    this.t += this.animationRate;
  }

  /**
   * Draws a circle with explosion [x, y] center, given circle.r radius
   * and circle.color color.
   */
  private drawCircle(
    ctx: CanvasRenderingContext2D,
    ratio: number,
    circle: AnimationStep
  ): void {
    ctx.beginPath();
    ctx.arc(
      this.getXPos() * ratio,
      this.getYPos() * ratio,
      this.radius * circle.r * ratio,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = circle.color;
    ctx.fill();
  }
}
