<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import { Renderer2D } from "../lib/gfx/renderer";
	import { Sprite } from "../lib/gfx/sprite";
	import { initGL, loadImage } from "../lib/gfx/utils";
	import type { Tile } from "../lib/game";
	import { GameState, update } from "../lib/state";

	let canvas: HTMLCanvasElement;
	let gl: WebGL2RenderingContext;
	let renderer: Renderer2D;
	let frame: number;

	onMount(async () => {
		gl = initGL(canvas);

		const spritesheet = await loadImage("/img/hex.png", true);
		renderer = new Renderer2D(canvas, gl, spritesheet);
		renderer.flush();

		frame = requestAnimationFrame(loop);
	});

	onDestroy(() => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
	});

	function render(time: DOMHighResTimeStamp) {
		const spritesheet = new Sprite(64, 64);
		const grassSprite = spritesheet.slice(16, 16, 0, 1);
		const sandSprite = spritesheet.slice(16, 16, 1, 1);
		const waterSprite = spritesheet.slice(16, 16, 2, 1);
		const bugSprite = spritesheet.slice(16, 16, 3, 0);

		const tileSprites: Record<Tile, Sprite> = {
			grass: grassSprite,
			sand: sandSprite,
			water: waterSprite,
		};

		// make tiles 4x larger
		const tileScale = 4;

		const halfWorldWidth = ($GameState.world.width - 1) / 2;
		const halfWorldHeight = ($GameState.world.height - 1) / 2;
		for (let y = 0; y < $GameState.world.height; y++) {
			for (let x = 0; x < $GameState.world.width; x++) {
				// row-major indexing
				const tileIndex = y * $GameState.world.width + x;
				const tile = $GameState.world.tiles[tileIndex]!;
				const tileSprite = tileSprites[tile];
				renderer.draw(tileSprite, {
					x: (x - halfWorldWidth) * tileSprite.width * tileScale,
					y: (y - halfWorldHeight) * tileSprite.height * tileScale,
					sx: tileScale,
					sy: tileScale,
				});
			}
		}

		// make the bug 3x larger
		const bugScale = 3;

		// bug
		const bug = $GameState.bug;
		renderer.draw(bugSprite, {
			x: bug.position.x * bugSprite.width * 4,
			y: bug.position.y * bugSprite.height * 4,
			sx: bugScale,
			sy: bugScale,
		});

		renderer.flush();
	}

	function loop(time: DOMHighResTimeStamp) {
		update(time);
		render(time);

		frame = requestAnimationFrame(loop);
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
