/**
 * A WebGL texture with binding utilities.
 */
export class Texture {
	/**
	 * The active WebGL rendering context.
	 */
	private gl: WebGL2RenderingContext;
	/**
	 * This WebGL texture.
	 */
	private texture: WebGLTexture;
	/**
	 * The texture's width.
	 */
	public width;
	/**
	 * The texture's height.
	 */
	public height;

	/**
	 * Upload a new WebGL texture from an existing image.
	 * @param gl The active WebGL rendering context.
	 * @param image The image data for the texture.
	 */
	constructor(gl: WebGL2RenderingContext, image: ImageBitmap) {
		this.gl = gl;
		this.width = image.width;
		this.height = image.height;

		// Create and bind the texture.
		this.texture = this.gl.createTexture()!;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		// Configure the texture's filtering (choose NEAREST for crisp pixel art).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		// Buffer the image's pixel data into the texture.
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			image.width,
			image.height,
			0,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			image,
		);

		// Generate a mipmap for the texture.
		this.gl.generateMipmap(this.gl.TEXTURE_2D);

		// Unbind the texture.
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	/**
	 * Bind this texture.
	 */
	public bind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	}

	/**
	 * Unbind this texture.
	 */
	public unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	/**
	 * Destroy this texture.
	 */
	public destroy() {
		this.gl.deleteTexture(this.texture);
	}
}
