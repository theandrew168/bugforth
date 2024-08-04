import { writable } from "svelte/store";

import { NewGame } from "./game";

export const GameState = writable(NewGame());
