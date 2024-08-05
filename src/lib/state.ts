import { get, writable } from "svelte/store";

import { NewGame, step } from "./game";

export const GameState = writable(NewGame());

export function update(time: DOMHighResTimeStamp) {
	const currentState = get(GameState);
	const newState = step(currentState, time);
	GameState.set(newState);
}
