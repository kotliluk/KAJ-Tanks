/**
 * Abstract predecessor of all game objects. Provides common properties
 * color, x and y position and their setters and getters.
 */
export default abstract class GameObject {
  protected color: string = "";
  protected xPos: number = 0;
  protected yPos: number = 0;

  public setColor(color: string) {
    this.color = color;
  }

  public getColor(): string {
    return this.color;
  }

  public setXPos(xPos: number) {
    this.xPos = xPos;
  }

  public diffXPos(xDif: number) {
    this.xPos += xDif;
  }

  public getXPos(): number {
    return this.xPos;
  }

  public setYPos(yPos: number) {
    this.yPos = yPos;
  }

  public diffYPos(yDif: number) {
    this.yPos += yDif;
  }

  public getYPos(): number {
    return this.yPos;
  }

  /**
   * Prints the game object at its current position.
   * - canvas: canvas to draw on
   * - ratio: ratio used for scaled drawing on resized canvas
   */
  public abstract show(ctx: CanvasRenderingContext2D, ratio: number): void;
}
