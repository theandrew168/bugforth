<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import { Renderer2D } from "../lib/gfx/renderer";
	import { Sprite } from "../lib/gfx/sprite";
	import { initGL, loadImage } from "../lib/gfx/utils";
	import { step, type Tile } from "../lib/game";
	import { GameState } from "../lib/state";

	/**
	 * The HTMLCanvasElement used to display the WebGL2 graphics.
	 */
	let canvas: HTMLCanvasElement;
	/**
	 * The WebGL rendering context (needed to use the API and draw things).
	 */
	let gl: WebGL2RenderingContext;
	/**
	 * The 2D renderer used to draw all of the game's sprites.
	 */
	let renderer: Renderer2D;
	/**
	 * The most recently-requested animation frame.
	 */
	let frame: number;

	/**
	 * When the Canvas component mounts, initialize the WebGL context,
	 * load the game's spritesheet, initialize the 2D renderer, and
	 * start the animation frame loop.
	 */
	onMount(async () => {
		gl = initGL(canvas);

		const spritesheet = await loadImage("/img/hex.png");
		renderer = new Renderer2D(canvas, gl, spritesheet);
		renderer.flush();

		frame = requestAnimationFrame(loop);
	});

	/**
	 * When the Canvas component unmounts, cancel the upcoming animation frame.
	 */
	onDestroy(() => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
	});

	/**
	 * Advance the game logic by `time` milliseconds.
	 * @param time Current program time (in milliseconds).
	 */
	function update(time: DOMHighResTimeStamp) {
		$GameState = step($GameState, time);
	}

	/**
	 * Draw the game's current state. The `time` (milliseconds) are used
	 * to update non-logic timers for things like animations.
	 * @param time Current program time (in milliseconds).
	 */
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

		// Make tiles 4x larger.
		const tileScale = 4;

		const halfWorldWidth = ($GameState.world.width - 1) / 2;
		const halfWorldHeight = ($GameState.world.height - 1) / 2;
		for (let y = 0; y < $GameState.world.height; y++) {
			for (let x = 0; x < $GameState.world.width; x++) {
				// Use row-major indexing to get the tile at (x, y).
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

		// Make the bug 3x larger.
		const bugScale = 3;

		// Draw the bug.
		const bug = $GameState.bug;
		renderer.draw(bugSprite, {
			x: bug.position.x * bugSprite.width * 4,
			y: bug.position.y * bugSprite.height * 4,
			sx: bugScale,
			sy: bugScale,
		});

		renderer.flush();
	}

	/**
	 * Hook into the browser's animation frame loop and used the
	 * `time` value to update and render the game.
	 * @param time Current program time (in milliseconds).
	 */
	function loop(time: DOMHighResTimeStamp) {
		update(time);
		render(time);

		frame = requestAnimationFrame(loop);
	}
</script>

<!-- 
@component
This component holds the main WebGL rendering canvas. It runs the main game loop
via requestAnimationFrame(). Each frame, the current time is passed to the update()
and render() functions.
-->
<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
		display: block;
		background-color: black;
	}
</style>
