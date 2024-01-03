<script>
	import "$lib/styles/reset.css";
	import "$lib/styles/style.css";
	import Canvas from "$lib/components/Canvas.svelte";
	import UserInterface from "$lib/components/UserInterface.svelte";
</script>

<div>
	<Canvas />
	<UserInterface />
</div>

<style>
	div {
		height: 100%;
	}
</style>
