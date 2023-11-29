import { getCurrencyPriceGenerator } from './lib/currency';

export const CURRENCIES = [
	'USD',
	'EUR',
	'JPY',
	'GBP',
	'CNY',
	'AUD',
	'CAD',
	'CHF',
	'HKD',
	'SGD',
] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_GENERATOR_MAP: {
	[key in Currency]: ReturnType<typeof getCurrencyPriceGenerator>;
} = {
	USD: () => 1,
	EUR: getCurrencyPriceGenerator(1, 4, 0.9, 0.5),
	JPY: getCurrencyPriceGenerator(2, 4, 147, 10),
	GBP: getCurrencyPriceGenerator(3, 4, 0.8, 0.5),
	CNY: getCurrencyPriceGenerator(4, 4, 7.1, 2),
	AUD: getCurrencyPriceGenerator(5, 4, 1.5, 0.5),
	CAD: getCurrencyPriceGenerator(6, 4, 1.35, 0.5),
	CHF: getCurrencyPriceGenerator(7, 4, 0.9, 0.1),
	HKD: getCurrencyPriceGenerator(8, 4, 7.8, 2),
	SGD: getCurrencyPriceGenerator(9, 4, 1.3, 0.5),
};

export function createUserStore() {
	const watchlist: Set<Currency> = new Set(['EUR']);

	return {
		watchlist: {
			add: (currency: Currency) => watchlist.add(currency),
			get: () => Array.from(watchlist),
			remove: (currency: Currency) => watchlist.delete(currency),
		},
	};
}
