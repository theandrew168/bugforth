export class Texture {
	private gl: WebGL2RenderingContext;
	private texture: WebGLTexture;
	public width;
	public height;

	constructor(gl: WebGL2RenderingContext, image: ImageBitmap) {
		this.gl = gl;

		this.texture = this.gl.createTexture()!;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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
		this.gl.generateMipmap(this.gl.TEXTURE_2D);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);

		this.width = image.width;
		this.height = image.height;
	}

	public bind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	}

	public unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	public destroy() {
		this.gl.deleteTexture(this.texture);
	}
}
