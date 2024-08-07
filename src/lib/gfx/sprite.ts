/**
 * A 2D sprite with convenient sub-slicing abilities for working with
 * spritesheets / texture atlases. Note that this class doesn't contain
 * or care about the image itself, it only cares about size and slicing.
 */
export class Sprite {
	/**
	 * Width of the sprite (in pixels).
	 */
	public width: number;
	/**
	 * Height of the sprite (in pixels).
	 */
	public height: number;
	/**
	 * Minimum X-axis texcoord (value between 0.0 and 1.0).
	 */
	public xMin: number;
	/**
	 * Maximum X-axis texcoord (value between 0.0 and 1.0).
	 */
	public xMax: number;
	/**
	 * Minimum Y-axis texcoord (value between 0.0 and 1.0).
	 */
	public yMin: number;
	/**
	 * Maximum Y-axis texcoord (value between 0.0 and 1.0).
	 */
	public yMax: number;

	/**
	 * Initialize a new Sprite with a width, height, and default viewing area.
	 * @param width Width of the sprite.
	 * @param height Height of the sprite.
	 */
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.xMin = 0.0;
		this.xMax = 1.0;
		this.yMin = 0.0;
		this.yMax = 1.0;
	}

	/**
	 * Slice a grid-based sub-sprite out of this sheet.
	 * @param width Width of each unit in the sheet.
	 * @param height Height of each unit in the sheet.
	 * @param x X coordinate of the desired sub-sprite in the sheet.
	 * @param y Y coordinate of the desired sub-sprite in the sheet.
	 * @returns A sliced-out sub-sprite from a given sheet / atlas.
	 */
	public slice(width: number, height: number, x: number, y: number): Sprite {
		// Calculate the number of rows and cols in the sheet.
		const cols = this.width / width;
		const rows = this.height / height;

		// Calculate the texcoord step size for each sub-sprite.
		const xStep = (this.xMax - this.xMin) / cols;
		const yStep = (this.yMax - this.yMin) / rows;

		// Create a new Sprite with the dimensions and texcoords
		// of a sub-sprite contained within the parent sheet.
		const sprite = new Sprite(width, height);
		sprite.xMin = xStep * x;
		sprite.xMax = xStep * (x + 1);
		sprite.yMin = this.yMax - yStep * (y + 1);
		sprite.yMax = this.yMax - yStep * y;

		return sprite;
	}
}
