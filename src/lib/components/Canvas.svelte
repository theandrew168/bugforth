<script lang="ts">
	import { initGL, resizeGL } from "$lib";
	import { onDestroy, onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let context: WebGL2RenderingContext;
	let handle: number;

	onMount(() => {
		context = initGL(canvas);
		handle = requestAnimationFrame(draw);
	});

	onDestroy(() => {
		if (handle) {
			cancelAnimationFrame(handle);
		}
	});

	function draw(time: DOMHighResTimeStamp) {
		resizeGL(context);
		handle = requestAnimationFrame(draw);
	}
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
		background-color: black;
	}
</style>
