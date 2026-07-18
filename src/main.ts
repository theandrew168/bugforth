import { mount } from "svelte";

import App from "./App.svelte";

// Lookup the element with ID "app" in the project's
// index.html and attach the Svelte App to it.
const target = document.getElementById("app")!;
const app = mount(App, { target });

export default app;
