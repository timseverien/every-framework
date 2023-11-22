<script lang="ts">
	import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
	import {
		TicTacToePlayer,
		applyMove,
		createGame,
		getCellCoordinateByIndex,
		getGameResult,
		getOtherPlayer,
		type TicTacToeCellCoordinate,
		type TicTacToeGame,
	} from '@ef/shared/lib/ticTacToe';
	import {
		TicTacToeBotLevel,
		createBot,
		getMove,
		type TicTacToeBot,
	} from '@ef/shared/lib/ticTacToeBot';
	import { Circle, X } from 'lucide-svelte';

	let game: TicTacToeGame = createGame();
	let loseCount: number = 0;
	let winCount: number = 0;
	let tieCount: number = 0;

	let bot: TicTacToeBot = createBot(TicTacToeBotLevel.hard);
	let player: TicTacToePlayer = TicTacToePlayer.x;

	$: state = game.state.map((value, index) => ({
		coordinate: getCellCoordinateByIndex(index),
		value,
	}));

	function doMove(coordinate: TicTacToeCellCoordinate) {
		const opponent = getOtherPlayer(player);

		game = applyMove(game, coordinate);

		const result = getGameResult(game);
		if (result.done) {
			if (result.winner === player) {
				winCount++;
			} else if (result.winner === opponent) {
				loseCount++;
			} else {
				tieCount++;
			}

			setTimeout(() => {
				resetGame(bot.level);
			}, 1000);

			return;
		}

		if (game.activePlayer !== player) {
			setTimeout(() => {
				const botMove = getMove(game, bot);
				doMove(botMove);
			}, 1000);
		}
	}

	function resetGame(botLevel: TicTacToeBotLevel) {
		player = getOtherPlayer(player ?? TicTacToePlayer.o);
		game = createGame();
		bot = createBot(botLevel);

		if (game.activePlayer !== player) {
			const botMove = getMove(game, bot);
			doMove(botMove);
		}
	}
</script>

<main>
	<VisuallyHidden as="h1">Tic-tac-toe</VisuallyHidden>

	<div>
		<button on:click={() => resetGame(TicTacToeBotLevel.easy)}>Easy</button>
		<button on:click={() => resetGame(TicTacToeBotLevel.medium)}>Medium</button>
		<button on:click={() => resetGame(TicTacToeBotLevel.hard)}>Hard</button>
	</div>

	<dl aria-live="polite">
		<dt>Current player:</dt>
		<dd>
			{#if game.activePlayer === TicTacToePlayer.x}
				<X size={16} />
			{:else}
				<Circle size={16} />
			{/if}
			{#if game.activePlayer === player}
				(you)
			{:else}
				(bot)
			{/if}
		</dd>

		<dt>Wins</dt>
		<dd>{winCount}</dd>

		<dt>Losses</dt>
		<dd>{loseCount}</dd>

		<dt>Ties</dt>
		<dd>{tieCount}</dd>
	</dl>

	<div class="state">
		{#each state as cell}
			{#if cell.value === 0}
				{#if player === game.activePlayer}
					<button class="cell" on:click={() => doMove(cell.coordinate)}>
						<VisuallyHidden>Select cell {cell.coordinate.join(',')}</VisuallyHidden>
					</button>
				{:else}
					<div class="cell">&nbsp;</div>
				{/if}
			{/if}
			{#if cell.value === TicTacToePlayer.x}
				<div class="cell">
					<X />
				</div>
			{/if}
			{#if cell.value === TicTacToePlayer.o}
				<div class="cell">
					<Circle />
				</div>
			{/if}
		{/each}
	</div>
</main>

<style>
	.state {
		display: grid;
		grid-template-columns: repeat(3, 1fr);

		width: 16em;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;

		border: 1px solid #ccc;
		background-color: transparent;
	}
</style>
