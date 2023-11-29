import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import { SERVER_PORT } from './config';
import { CURRENCIES, Currency } from './data';

type FinanceHttpClient = AxiosInstance;

const currencySchema = z.enum(CURRENCIES);

const mutationResponseSchema = z.object({
	success: z.boolean(),
});

export function createClient(): FinanceHttpClient {
	return axios.create({
		baseURL: `http://localhost:${SERVER_PORT}/`,
		responseType: 'json',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

const getCurrenciesResponseSchema = z.array(
	z.object({
		currency: currencySchema,
		price: z.number(),
	}),
);
export async function getCurrencies(client: FinanceHttpClient) {
	const response = await client.get('/currency');
	return getCurrenciesResponseSchema.parse(response.data);
}

const watchlistMutationResponseSchema = mutationResponseSchema.extend({
	watchlist: currencySchema,
});
export async function addCurrencyToWatchlist(client: FinanceHttpClient, currency: Currency) {
	const response = await client.post('/watchlist/add', { currency });
	return watchlistMutationResponseSchema.parse(response.data);
}
export async function removeCurrencyToWatchlist(client: FinanceHttpClient, currency: Currency) {
	const response = await client.post('/watchlist/remove', { currency });
	return watchlistMutationResponseSchema.parse(response.data);
}
