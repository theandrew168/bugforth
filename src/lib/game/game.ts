export type Direction = "n" | "e" | "s" | "w";
export type Position = {
	x: number;
	y: number;
};

export type Word = "forward" | "right" | "left";
export type Program = {
	pc: number;
	words: Word[];
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
		const tile = tileOptions[getRandomInt(tileOptions.length)];
		tiles.push(tile);
	}

	const game: Game = {
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
				words: ["forward", "right", "forward", "right", "forward", "right", "forward", "right"],
			},
		},
	};
	return game;
}
