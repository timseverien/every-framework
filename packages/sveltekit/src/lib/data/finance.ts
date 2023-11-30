import {
	addCurrencyToWatchlist,
	createClient,
	getCurrencies,
	getWatchlist,
	removeCurrencyFromWatchlist,
	type CurrencyWithPrice,
} from '@ef/api/client';
import type { Currency } from '@ef/api/data';
import { writable, type Readable } from 'svelte/store';

const client = createClient();

function createPriceStore(): Readable<CurrencyWithPrice[]> & {
	load(): Promise<void>;
} {
	const { subscribe, set } = writable<CurrencyWithPrice[]>([]);

	return {
		subscribe,

		async load() {
			const currencies = await getCurrencies(client);
			set(currencies);
		},
	};
}

export const currencyPrices = createPriceStore();

function createWatchlistStore(): Readable<Currency[]> & {
	add(currency: Currency): void;
	load(): Promise<void>;
	remove(currency: Currency): void;
} {
	const { subscribe, set, update } = writable<Currency[]>([]);

	return {
		subscribe,

		add(currency: Currency) {
			update((watchlist) => {
				if (watchlist.includes(currency)) {
					return watchlist;
				}

				watchlist.push(currency);
				addCurrencyToWatchlist(client, currency);

				return watchlist;
			});
		},

		async load() {
			const { watchlist } = await getWatchlist(client);
			set(watchlist);
		},

		remove(currency: Currency) {
			update((watchlist) => watchlist.filter((c) => c === currency));
			removeCurrencyFromWatchlist(client, currency);
		},
	};
}

export const watchlist = createWatchlistStore();
