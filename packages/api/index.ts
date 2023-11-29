import express from 'express';
import { z } from 'zod';
import { SERVER_PORT } from './config';
import { CURRENCIES, CURRENCY_GENERATOR_MAP, createUserStore } from './data';

const userStore = createUserStore();

const app = express();

app.get('/currency', (req, res) => {
	const now = new Date();
	res.json(
		Object.entries(CURRENCY_GENERATOR_MAP).map(([currencyCode, getPrice]) => ({
			currency: currencyCode,
			price: getPrice(now),
		})),
	);
});

const watchlistMutateSchema = z.object({
	currency: z.enum(CURRENCIES),
});

app.get('/watchlist', express.json(), (req, res) => {
	res.json({
		success: true,
		watchlist: userStore.watchlist.get(),
	});
});

app.post('/watchlist/add', express.json(), (req, res) => {
	const { currency } = watchlistMutateSchema.parse(req.body);
	userStore.watchlist.add(currency);

	res.json({
		success: true,
		watchlist: userStore.watchlist.get(),
	});
});

app.post('/watchlist/remove', express.json(), (req, res) => {
	const { currency } = watchlistMutateSchema.parse(req.body);
	userStore.watchlist.remove(currency);

	res.json({
		success: true,
		watchlist: userStore.watchlist.get(),
	});
});

app.listen(SERVER_PORT);

console.log(`API listening to http://localhost:${SERVER_PORT}`);
