import { writable } from "svelte/store";

import { newGame } from "./game";

/**
 * This writable Svelte store holds the global game state. Both the
 * render/update functions AND the UI modify this state and changes
 * are reflected by any logic or component that references it.
 */
export const GameState = writable(newGame());
