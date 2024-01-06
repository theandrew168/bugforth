<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import { Renderer2D } from "$lib/gfx/renderer";
	import { Sprite } from "$lib/gfx/sprite";
	import { initGL, loadImage } from "$lib/gfx/utils";

	let canvas: HTMLCanvasElement;
	let gl: WebGL2RenderingContext;
	let renderer: Renderer2D;
	let frame: number;

	onMount(async () => {
		gl = initGL(canvas);

		const spritesheet = await loadImage("/img/hex.png", true);
		renderer = new Renderer2D(canvas, gl, spritesheet);
		renderer.flush();

		frame = requestAnimationFrame(draw);
	});

	onDestroy(() => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
	});

	function draw(time: DOMHighResTimeStamp) {
		const hex = new Sprite(64, 64);
		const grass = hex.slice(16, 16, 0, 0);
		const sand = hex.slice(16, 16, 1, 0);
		const water = hex.slice(16, 16, 2, 0);
		const bug = hex.slice(16, 16, 3, 0);

		// top row
		renderer.draw(grass, { x: 0 * 16 * 4 - 32, y: 16 * 4 - 12, sx: 4, sy: 4 });
		renderer.draw(sand, { x: 1 * 16 * 4 - 32, y: 16 * 4 - 12, sx: 4, sy: 4 });

		// middle row
		renderer.draw(water, { x: -1 * 16 * 4, y: 0, sx: 4, sy: 4 });
		renderer.draw(grass, { x: 0 * 16 * 4, y: 0, sx: 4, sy: 4 });
		renderer.draw(sand, { x: 1 * 16 * 4, y: 0, sx: 4, sy: 4 });

		// bottom row
		renderer.draw(grass, { x: 0 * 16 * 4 - 32, y: -16 * 4 + 12, sx: 4, sy: 4 });
		renderer.draw(sand, { x: 1 * 16 * 4 - 32, y: -16 * 4 + 12, sx: 4, sy: 4 });

		// bug
		renderer.draw(bug, { x: 0 * 16 * 4, y: 0, sx: 2, sy: 2 });

		renderer.flush();

		frame = requestAnimationFrame(draw);
	}
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
		display: block;
		background-color: black;
	}
</style>
