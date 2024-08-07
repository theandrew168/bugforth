/**
 * Fetch the contents of a remote text file.
 * @param path Path / URL of the remote file.
 */
export async function loadText(path: string): Promise<string> {
	const resp = await fetch(path);
	return resp.text();
}

/**
 * Fetch the contents of a remote image file.
 * @param path Path / URL of the remote file.
 */
export async function loadImage(path: string): Promise<ImageBitmap> {
	const resp = await fetch(path);
	const blob = await resp.blob();

	// Flip the image vertically since WebGL expects a "bottom to top" pixel ordering.
	const opts: ImageBitmapOptions = {
		imageOrientation: "flipY",
	};

	return createImageBitmap(blob, opts);
}

/**
 * Initialize WebGL on an HTML canvas element. Print basic debugging
 * information and configure global WebGL settings.
 * @param canvas HTML canvas element used for displaying WebGL graphics.
 */
export function initGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
	const gl = canvas.getContext("webgl2");
	if (!gl) {
		const msg = "Unable to initialize WebGL2. Your browser or machine may not support it.";
		alert(msg);
		throw new Error(msg);
	}

	console.log("WebGL Vendor:   %s\n", gl.getParameter(gl.VENDOR));
	console.log("WebGL Renderer: %s\n", gl.getParameter(gl.RENDERER));
	console.log("WebGL Version:  %s\n", gl.getParameter(gl.VERSION));
	console.log("GLSL Version:   %s\n", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Enable blending.
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Enable depth comparisons.
	// TODO: Why do we need this? For Z-axis rendering?
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// Enable back-face culling.
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	gl.frontFace(gl.CCW);

	return gl;
}

/**
 * Resize the WebGL viewport to the size of the canvas element.
 * @param gl The active WebGL rendering context.
 */
export function resizeGL(gl: WebGL2RenderingContext) {
	const canvas = gl.canvas as HTMLCanvasElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (gl.canvas.width != width || gl.canvas.height != height) {
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}
