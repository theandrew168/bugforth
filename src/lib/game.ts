/**
 * A specific direction / orientation.
 */
export type Direction = "n" | "e" | "s" | "w";

/**
 * A position in 2D space.
 */
export type Position = {
	x: number;
	y: number;
};

/**
 * A program with code and a program counter (pc) that points to
 * what instruction the execution is going to run next (wraps around).
 */
export type Program = {
	pc: number;
	code: string;
};

/**
 * A bug in the world: complete with a direction, position, and program.
 */
export type Bug = {
	direction: Direction;
	position: Position;
	program: Program;
};

/**
 * A type of ground tile.
 */
export type Tile = "grass" | "sand" | "water";

/**
 * A world / map with a width, height, and array of tiles.
 *
 * The tiles use row-major indexing:
 * `get(x, y) => (y * width) + x`
 */
export type World = {
	width: number;
	height: number;
	// row-major indexing
	tiles: Tile[];
};

/**
 * The top-level game state. Everything the game cares about should be represented
 * here so the state can be shared across logic and components.
 */
export type Game = {
	running: boolean;
	prev: DOMHighResTimeStamp;
	time: DOMHighResTimeStamp;
	world: World;
	bug: Bug;
};

/**
 * Get a random integer between zero (inclusive) and `max` (exclusive).
 */
function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

/**
 * Generate and initialize a new Game object.
 */
export function newGame(): Game {
	const tileOptions: Tile[] = ["grass", "sand", "water"];
	const tiles: Tile[] = [];
	for (let i = 0; i < 81; i++) {
		const tile = tileOptions[getRandomInt(tileOptions.length)]!;
		tiles.push(tile);
	}

	const now = performance.now();
	const game: Game = {
		running: false,
		prev: now,
		time: now,
		world: {
			width: 9,
			height: 9,
			tiles: tiles,
		},
		bug: {
			direction: "n",
			position: {
				x: 0,
				y: 0,
			},
			program: {
				pc: 0,
				code: "up right down left",
			},
		},
	};
	return game;
}

/**
 * Advance the current game state by `time` milliseconds. This function
 * is pure and treats the game state as raw data: copying and returning
 * a new version of it with each step.
 */
export function step(game: Game, time: DOMHighResTimeStamp): Game {
	// Clone the game state for updating
	const newGame = structuredClone(game);
	newGame.time = time;
	if (!newGame.running) {
		return newGame;
	}

	// Only update the bug's code every 100ms.
	const dt = newGame.time - newGame.prev;
	if (dt < 100) {
		return newGame;
	}

	newGame.prev = newGame.time;

	const program = game.bug.program;
	const words = program.code.split(/\s+/);
	const word = words[program.pc];

	// Handle the current word
	switch (word) {
		case "up":
			newGame.bug.position.y += 1;
			break;
		case "down":
			newGame.bug.position.y -= 1;
			break;
		case "left":
			newGame.bug.position.x -= 1;
			break;
		case "right":
			newGame.bug.position.x += 1;
			break;
	}

	// Increment the program counter (with wrap-around)
	newGame.bug.program.pc = (program.pc + 1) % words.length;

	return newGame;
}
