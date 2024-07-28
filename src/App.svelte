<script lang="ts">
	import "./styles/reset.css";
	import "./styles/style.css";
	import Canvas from "./components/Canvas.svelte";
	import UserInterface from "./components/UserInterface.svelte";
</script>

<main>
	<Canvas />
	<UserInterface />
</main>

<style>
	main {
		height: 100%;
	}
</style>
