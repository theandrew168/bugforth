<script>
	import { GameState } from "../lib/state";

	/**
	 * Toggle the game's running / paused state.
	 */
	function onStartStop() {
		$GameState.running = !$GameState.running;
	}
</script>

<!--
@component
This component holds the user interface layer which is drawn on top of the
main rendering canvas. UI elements are positioned with an absolute layout
and are generally anchored to the corners of the screen.
-->
<div class="overlay">
	<textarea bind:value={$GameState.bug.program.code} rows="10" cols="30"></textarea>
	<button on:click={() => console.log("Button 1")}>Compile</button>
	<button on:click={onStartStop}>{$GameState.running ? "Stop" : "Start"}</button>
</div>

<style>
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
	}
	button {
		border: 1px solid white;
		background-color: black;
		color: white;
		padding: 1rem;
		margin: 0.5rem;
		width: 6rem;
	}
	button:hover {
		cursor: pointer;
	}
	textarea {
		display: block;
		margin: 0.5rem;
	}
</style>
