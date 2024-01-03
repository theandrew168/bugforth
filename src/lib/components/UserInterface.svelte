<div class="overlay">
	<button on:click={() => console.log("Button 1")}>Button</button>
	<button on:click={() => console.log("Button 2")}>Button</button>
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
		display: block;
		padding: 1rem;
		margin: 0.5rem;
	}
	button:hover {
		cursor: pointer;
	}
</style>
