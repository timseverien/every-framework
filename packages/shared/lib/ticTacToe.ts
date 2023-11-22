export enum TicTacToePlayer {
	x = 1,
	o = 2,
}

type TicTacToeCellValue = 0 | 1 | 2;

export type TicTacToeGameState = [
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
	TicTacToeCellValue,
];

export interface TicTacToeGame {
	activePlayer: TicTacToePlayer;
	state: TicTacToeGameState;
}

export type TicTacToeCellCoordinate = [number, number];

export const GAME_STATE_GRID_SIZE = 3;
export const GAME_STATE_GRID_CELL_COUNT = GAME_STATE_GRID_SIZE ** 2;

export const GAME_WIN_MATRICES: TicTacToeGameState[] = [
	[1, 1, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1],
	[1, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 1, 0, 0, 1, 0, 0, 1, 0],
	[0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 1, 0, 1, 0, 1, 0, 0],
];

export function applyMove(game: TicTacToeGame, [x, y]: TicTacToeCellCoordinate): TicTacToeGame {
	const state: TicTacToeGameState = Array.from(game.state) as TicTacToeGameState;

	state[y * GAME_STATE_GRID_SIZE + x] = game.activePlayer;

	return {
		...game,
		activePlayer: getOtherPlayer(game.activePlayer),
		state,
	};
}

export function createGame(): TicTacToeGame {
	return {
		activePlayer: TicTacToePlayer.x,
		state: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	};
}

export function getCellCoordinateByIndex(index: number): TicTacToeCellCoordinate {
	const x = index % GAME_STATE_GRID_SIZE;
	const y = Math.trunc(index / GAME_STATE_GRID_SIZE);
	return [x, y];
}

export function getCellCoordinatesByMatrix(matrix: TicTacToeGameState): TicTacToeCellCoordinate[] {
	return matrix
		.map((value, index) => ({ index, value }))
		.filter(({ value }) => value === 1)
		.map(({ index }) => getCellCoordinateByIndex(index));
}

export function getCellIndexByCoordinate(coordinate: TicTacToeCellCoordinate): number {
	const [x, y] = coordinate;
	return y * GAME_STATE_GRID_SIZE + x;
}

export function getCellValueByCoordinate(
	game: TicTacToeGame,
	coordinate: TicTacToeCellCoordinate,
): TicTacToeCellValue {
	return game.state[getCellIndexByCoordinate(coordinate)];
}

export function getEmptyCells(game: TicTacToeGame): TicTacToeCellCoordinate[] {
	const emptyCellIndexes = Object.entries(game.state)
		.filter(([, value]) => value === 0)
		.map(([index]) => Number.parseInt(index));

	return emptyCellIndexes.map((index) => getCellCoordinateByIndex(index));
}

export function getOtherPlayer(player: TicTacToePlayer): TicTacToePlayer {
	if (player === TicTacToePlayer.o) {
		return TicTacToePlayer.x;
	}
	return TicTacToePlayer.o;
}

export function getGameResult(game: TicTacToeGame): {
	done: boolean;
	winner: TicTacToePlayer | null;
} {
	for (const matrix of GAME_WIN_MATRICES) {
		const cells = getCellCoordinatesByMatrix(matrix).map((coord) =>
			getCellValueByCoordinate(game, coord),
		);

		if (cells.filter((v) => v === TicTacToePlayer.o).length === GAME_STATE_GRID_SIZE) {
			return {
				done: true,
				winner: TicTacToePlayer.o,
			};
		}

		if (cells.filter((v) => v === TicTacToePlayer.x).length === GAME_STATE_GRID_SIZE) {
			return {
				done: true,
				winner: TicTacToePlayer.x,
			};
		}
	}

	return {
		done: game.state.every((v) => v !== 0),
		winner: null,
	};
}
