<script>
	import { step } from "../lib/game";
	import { GameState } from "../lib/state";

	function onStep() {
		$GameState = step($GameState);
	}
</script>

<div class="overlay">
	<textarea bind:value={$GameState.bug.program.code} rows="10" cols="30"></textarea>
	<button on:click={() => console.log("Button 1")}>Compile</button>
	<button on:click={onStep}>Step</button>
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
