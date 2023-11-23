import { pickRandom, shuffle } from './list';
import {
	GAME_WIN_MATRICES,
	TicTacToeCellCoordinate,
	TicTacToeGame,
	TicTacToePlayer,
	getCellCoordinatesByMatrix,
	getCellValueByCoordinate,
	getEmptyCells,
	getOtherPlayer,
} from './ticTacToe';

export enum TicTacToeBotLevel {
	easy = 'EASY',
	medium = 'MEDIUM',
	hard = 'HARD',
}

export interface TicTacToeBot {
	level: TicTacToeBotLevel;
}

type TicTacToeWinOption = {
	cells: TicTacToeCellCoordinate[];
	score: number;
};

const botLevelMoveGetterMap: {
	[key in TicTacToeBotLevel]: (game: TicTacToeGame) => TicTacToeCellCoordinate;
} = {
	// Selects a random cell
	[TicTacToeBotLevel.easy](game) {
		const options = getEmptyCells(game);
		return pickRandom(options);
	},

	// Selects a cell that optimizes win odds
	[TicTacToeBotLevel.medium](game) {
		const winOptions = getWinOptions(game, game.activePlayer).filter((o) => o.score >= 1);
		if (winOptions.length > 0) {
			const [winOption] = winOptions.sort((a, b) => b.score - a.score);
			const moveOptions = winOption.cells.filter(
				(coord) => getCellValueByCoordinate(game, coord) === 0,
			);
			return pickRandom(moveOptions);
		}

		return botLevelMoveGetterMap[TicTacToeBotLevel.easy](game);
	},

	// Select center cell, go for the win, block opponent, or pick move that increases win odds
	[TicTacToeBotLevel.hard](game) {
		// Always claim middle cell first
		if (getCellValueByCoordinate(game, [1, 1]) === 0) {
			return [1, 1];
		}

		// Search for single-move win options and finish them
		const winOptions = getWinOptions(game, game.activePlayer).filter((o) => o.score >= 2);
		if (winOptions.length > 0) {
			const [winOption] = winOptions.sort((a, b) => b.score - a.score);
			const moveOptions = winOption.cells.filter(
				(coord) => getCellValueByCoordinate(game, coord) === 0,
			);
			return pickRandom(moveOptions);
		}

		// Search for opponent's single-move win options and block those
		const opponent = getOtherPlayer(game.activePlayer);
		const loseOptions = getWinOptions(game, opponent).filter((o) => o.score >= 2);
		if (loseOptions.length > 0) {
			const winOption = pickRandom(loseOptions);
			const moveOptions = winOption.cells.filter(
				(coord) => getCellValueByCoordinate(game, coord) === 0,
			);
			return pickRandom(moveOptions);
		}

		return botLevelMoveGetterMap[TicTacToeBotLevel.medium](game);
	},
};

export function createBot(level: TicTacToeBotLevel): TicTacToeBot {
	return {
		level,
	};
}

export function getMove(game: TicTacToeGame, bot: TicTacToeBot): TicTacToeCellCoordinate {
	return botLevelMoveGetterMap[bot.level](game);
}

function getWinOptions(game: TicTacToeGame, player: TicTacToePlayer): TicTacToeWinOption[] {
	const opponent = getOtherPlayer(player);

	return shuffle(GAME_WIN_MATRICES).map((matrix) => {
		const cells = getCellCoordinatesByMatrix(matrix);
		const cellValues = cells.map((coord) => getCellValueByCoordinate(game, coord));

		return {
			score: cellValues.some((v) => v === opponent)
				? 0
				: cellValues.filter((v) => v === player).length,
			cells,
		};
	});
}
