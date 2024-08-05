export type Direction = "n" | "e" | "s" | "w";
export type Position = {
	x: number;
	y: number;
};

export type Program = {
	pc: number;
	code: string;
};

export type Bug = {
	direction: Direction;
	position: Position;
	program: Program;
};

export type Tile = "grass" | "sand" | "water";
export type World = {
	width: number;
	height: number;
	// row-major indexing
	tiles: Tile[];
};

export type Game = {
	running: boolean;
	prev: DOMHighResTimeStamp;
	time: DOMHighResTimeStamp;
	world: World;
	bug: Bug;
};

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export function NewGame(): Game {
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
