import App from "./App.svelte";

// Lookup the element with ID "app" in the project's
// index.html and attach the Svelte App to it.
const target = document.getElementById("app")!;
const app = new App({ target });

export default app;
