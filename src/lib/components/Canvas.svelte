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

		const spritesheet = await loadImage("/img/countryside.png", true);
		renderer = new Renderer2D(canvas, gl, spritesheet);

		frame = requestAnimationFrame(draw);
	});

	onDestroy(() => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
	});

	function draw(time: DOMHighResTimeStamp) {
		const countryside = new Sprite(64, 64);
		const grass = countryside.slice(32, 32, 0, 0);
		const flower = countryside.slice(32, 32, 0, 1);
		const boxFront = countryside.slice(32, 32, 1, 0);
		const boxTop = countryside.slice(32, 32, 1, 1);

		renderer.draw(countryside, { x: 0, y: 0, r: time / 10 });
		renderer.draw(countryside, { x: 64, y: 0 });
		renderer.draw(countryside, { x: -64, y: 0 });
		renderer.draw(countryside, { x: 0, y: 64 });
		renderer.draw(countryside, { x: 0, y: -64 });
		renderer.draw(countryside, { x: 128, y: 128, sx: 3, sy: 3 });
		renderer.draw(countryside, { x: -96, y: -96, sx: 2, sy: 2 });
		renderer.draw(countryside, { x: 0, y: -192, sx: Math.abs(Math.sin(time / 1000)) * 5 });
		renderer.draw(countryside, { x: Math.sin(time / 500) * 256, y: Math.cos(time / 500) * 256 });
		renderer.draw(countryside, { x: 192, y: 0, r: time / 10 });
		renderer.draw(grass, { x: -128, y: 0, sx: 2, sy: 2 });
		renderer.draw(flower, { x: -192, y: 0, sx: 2, sy: 2 });
		renderer.draw(boxFront, { x: -256, y: 0, sx: 2, sy: 2 });
		renderer.draw(boxTop, { x: -256, y: 64, sx: 2, sy: 2 });
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
