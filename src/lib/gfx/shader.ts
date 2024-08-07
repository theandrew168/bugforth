import type { mat4, vec3 } from "gl-matrix";

import { ATTRIB_LOCATIONS } from "./attrib";

/**
 * A WebGL shader program with binding and uniform utilities.
 */
export class Shader {
	/**
	 * The active WebGL rendering context.
	 */
	private gl: WebGL2RenderingContext;
	/**
	 * This WebGL shader program.
	 */
	private program: WebGLProgram;

	/**
	 * Compile and link a new shader program from vertex and fragment sources.
	 * @param gl The active WebGL rendering context.
	 * @param vertSource The vertex shader source code.
	 * @param fragSource The fragment shader source code.
	 */
	constructor(gl: WebGL2RenderingContext, vertSource: string, fragSource: string) {
		this.gl = gl;

		const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER)!;
		this.compileShader(vertShader, vertSource);

		const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
		this.compileShader(fragShader, fragSource);

		this.program = this.gl.createProgram()!;
		Object.values(ATTRIB_LOCATIONS).forEach((value) => {
			this.gl.bindAttribLocation(this.program, value.location, value.attrib);
		});

		this.linkProgram(this.program, vertShader, fragShader);

		this.gl.deleteShader(vertShader);
		this.gl.deleteShader(fragShader);
	}

	/**
	 * Bind this shader program.
	 */
	public bind() {
		this.gl.useProgram(this.program);
	}

	/**
	 * Unbind this shader program.
	 */
	public unbind() {
		this.gl.useProgram(null);
	}

	/**
	 * Destroy this shader program.
	 */
	public destroy() {
		this.gl.deleteProgram(this.program);
	}

	/**
	 * Set a single uniform integer.
	 * @param name Name of the uniform.
	 * @param value Value of the uniform.
	 */
	public setUniformInt(name: string, value: number) {
		const location = this.getUniformLocation(name);
		this.gl.uniform1i(location, value);
	}

	/**
	 * Set a single uniform float.
	 * @param name Name of the uniform.
	 * @param value Value of the uniform.
	 */
	public setUniformFloat(name: string, value: number) {
		const location = this.getUniformLocation(name);
		this.gl.uniform1f(location, value);
	}

	/**
	 * Set a uniform vec3 (3x1 vector of floats).
	 * @param name Name of the uniform.
	 * @param value Value of the uniform.
	 */
	public setUniformVec3(name: string, value: vec3) {
		const location = this.getUniformLocation(name);
		this.gl.uniform3fv(location, value);
	}

	/**
	 * Set a uniform mat4 (4x4 matrix of floats).
	 * @param name Name of the uniform.
	 * @param value Value of the uniform.
	 */
	public setUniformMat4(name: string, value: mat4) {
		const location = this.getUniformLocation(name);
		this.gl.uniformMatrix4fv(location, false, value);
	}

	/**
	 * Get the location of a uniform by name.
	 * @param name Name of the uniform.
	 * @returns Location of the uniform.
	 */
	private getUniformLocation(name: string): WebGLUniformLocation {
		// TODO: cache this?
		const location = this.gl.getUniformLocation(this.program, name);
		if (!location) {
			throw new Error(`invalid uniform location: ${name}`);
		}

		return location;
	}

	/**
	 * Compile source code for a shader.
	 * @param shader Shader being compiled.
	 * @param source Shader source code.
	 */
	private compileShader(shader: WebGLShader, source: string) {
		this.gl.shaderSource(shader, source);

		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw this.gl.getShaderInfoLog(shader);
		}
	}

	/**
	 * Attach and link shaders into a shader program.
	 * @param program Shader program being linked.
	 * @param vertShader Compiled vertex shader.
	 * @param fragShader Compiled fragment shader.
	 */
	private linkProgram(program: WebGLProgram, vertShader: WebGLShader, fragShader: WebGLShader) {
		this.gl.attachShader(program, vertShader);
		this.gl.attachShader(program, fragShader);

		this.gl.linkProgram(program);
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw this.gl.getProgramInfoLog(program);
		}

		this.gl.detachShader(program, vertShader);
		this.gl.detachShader(program, fragShader);
	}
}
