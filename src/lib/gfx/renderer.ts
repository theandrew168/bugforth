import { mat4 } from "gl-matrix";

import { resizeGL } from "./utils";
import { Shader } from "./shader";
import { Texture } from "./texture";
import type { Sprite } from "./sprite";

/**
 * Size (in bytes). of a floating-point number.
 */
const FLOAT_SIZE = 4;
/**
 * Number of floats per vertex (2 for position, 2 for texcoords).
 */
const FLOATS_PER_VERTEX = 4;
/**
 * Size (in bytes) of a single vertex.
 */
const VERTEX_SIZE = FLOAT_SIZE * FLOATS_PER_VERTEX;

/**
 * Maximum number of sprites able to be drawn per batch (for one frame).
 */
const MAX_SPRITE_COUNT = 1000;

/**
 * Number of vertices per sprite (4 corners).
 */
const VERTICES_PER_SPRITE = 4;
/**
 * Maximum number of vertices supported per batch (for one frame).
 */
const MAX_VERTEX_COUNT = MAX_SPRITE_COUNT * VERTICES_PER_SPRITE;

/**
 * Number of indices per sprite (2 triangles, 3 indices per triangle).
 */
const INDICES_PER_SPRITE = 6;
/**
 * Maximum number of indices supported per batch (for one frame).
 */
const MAX_INDEX_COUNT = MAX_SPRITE_COUNT * INDICES_PER_SPRITE;

/**
 * Vertex shader source for 2D sprite rendering.
 */
const VERTEX_SHADER = `
#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat4 uProjection;

void main() {
	vTexCoord = aTexCoord;
	gl_Position = uProjection * vec4(aPosition, 0, 1);
}
`;

/**
 * Fragment shader source for 2D sprite rendering.
 */
const FRAGMENT_SHADER = `
#version 300 es
precision highp float;

in vec2 vTexCoord;

out vec4 vFragColor;

uniform sampler2D uTexture;

void main() {
	vFragColor = texture(uTexture, vTexCoord);
}
`;

/**
 * Parameters for drawing a single sprite. Sprites are drawn with
 * their centers located at (x, y).
 */
export type DrawParams = {
	/**
	 * X position (in pixels) to draw the sprite.
	 */
	x: number;
	/**
	 * Y position (in pixels) to draw the sprite.
	 */
	y: number;
	/**
	 * X-axis scaling multiplier.
	 */
	sx?: number;
	/**
	 * Y-axis scaling multiplier.
	 */
	sy?: number;
	/**
	 * Sprite rotation in degrees (CCW).
	 */
	r?: number;
};

/**
 * An efficient, 2D batch renderer for drawing sprites from a spritesheet.
 */
export class Renderer2D {
	private canvas: HTMLCanvasElement;
	private gl: WebGL2RenderingContext;

	private shader: Shader;
	private vbo: WebGLBuffer;
	private ibo: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private count: number;
	private buffer: Float32Array;
	private texture: Texture;

	/**
	 * Initialze the renderer and it's shader, buffers, and vertex array.
	 * @param canvas HTML canvas element.
	 * @param gl Active WebGL context.
	 * @param spritesheet Image containing all of the game's sprites.
	 */
	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, spritesheet: ImageBitmap) {
		this.canvas = canvas;
		this.gl = gl;

		this.shader = new Shader(gl, VERTEX_SHADER.trim(), FRAGMENT_SHADER.trim());
		this.shader.bind();

		this.vao = gl.createVertexArray()!;
		gl.bindVertexArray(this.vao);

		this.vbo = gl.createBuffer()!;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, VERTEX_SIZE * MAX_VERTEX_COUNT, gl.DYNAMIC_DRAW);

		// px, py
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, VERTEX_SIZE, 0);

		// tx, ty
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, VERTEX_SIZE, 2 * FLOAT_SIZE);

		// pre-compute sprite indices
		let offset = 0;
		const indices = new Uint16Array(MAX_INDEX_COUNT);
		for (let i = 0; i < MAX_INDEX_COUNT; i += 6) {
			indices[i + 0] = 0 + offset;
			indices[i + 1] = 1 + offset;
			indices[i + 2] = 2 + offset;

			indices[i + 3] = 2 + offset;
			indices[i + 4] = 3 + offset;
			indices[i + 5] = 0 + offset;

			offset += 4;
		}

		this.ibo = gl.createBuffer()!;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		gl.bindVertexArray(null);

		this.count = 0;
		this.buffer = new Float32Array(MAX_VERTEX_COUNT);
		this.texture = new Texture(gl, spritesheet);
	}

	/**
	 * Submit a sprite for drawing as part of the current batch.
	 * @param sprite Sprite to be submitted for drawing.
	 * @param DrawParams Position, scaling, and rotation values.
	 */
	public draw(sprite: Sprite, { x, y, sx = 1, sy = 1, r = 0 }: DrawParams) {
		const halfWidth = sprite.width / 2.0;
		const halfHeight = sprite.height / 2.0;

		const radians = r * (Math.PI / 180.0);
		const sinRot = Math.sin(radians);
		const cosRot = Math.cos(radians);

		const index = this.count * FLOATS_PER_VERTEX * VERTICES_PER_SPRITE;

		// For each index, manually compute translation, scaling, and rotation.

		// bottom-left
		this.buffer[index + 0] = cosRot * -halfWidth * sx - sinRot * -halfHeight * sy + x;
		this.buffer[index + 1] = sinRot * -halfWidth * sx + cosRot * -halfHeight * sy + y;
		this.buffer[index + 2] = sprite.xMin;
		this.buffer[index + 3] = sprite.yMin;

		// bottom-right
		this.buffer[index + 4] = cosRot * halfWidth * sx - sinRot * -halfHeight * sy + x;
		this.buffer[index + 5] = sinRot * halfWidth * sx + cosRot * -halfHeight * sy + y;
		this.buffer[index + 6] = sprite.xMax;
		this.buffer[index + 7] = sprite.yMin;

		// top-right
		this.buffer[index + 8] = cosRot * halfWidth * sx - sinRot * halfHeight * sy + x;
		this.buffer[index + 9] = sinRot * halfWidth * sx + cosRot * halfHeight * sy + y;
		this.buffer[index + 10] = sprite.xMax;
		this.buffer[index + 11] = sprite.yMax;

		// top-left
		this.buffer[index + 12] = cosRot * -halfWidth * sx - sinRot * halfHeight * sy + x;
		this.buffer[index + 13] = sinRot * -halfWidth * sx + cosRot * halfHeight * sy + y;
		this.buffer[index + 14] = sprite.xMin;
		this.buffer[index + 15] = sprite.yMax;

		const halfCanvasWidth = this.canvas.width / 2.0;
		const halfCanvasHeight = this.canvas.height / 2.0;

		const projection = mat4.create();
		mat4.ortho(projection, -halfCanvasWidth, halfCanvasWidth, -halfCanvasHeight, halfCanvasHeight, -1.0, 1.0);
		this.shader.setUniformMat4("uProjection", projection);

		this.count += 1;
	}

	/**
	 * Flush the current batch of sprites, drawing them all to the screen
	 * at once in a single drawElements call.
	 */
	public flush() {
		resizeGL(this.gl);
		this.gl.clearColor(0.2, 0.3, 0.4, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.texture.bind();
		this.gl.bindVertexArray(this.vao);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.buffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.count * INDICES_PER_SPRITE, this.gl.UNSIGNED_SHORT, 0);

		this.count = 0;
		this.buffer = new Float32Array(MAX_VERTEX_COUNT);
	}
}
