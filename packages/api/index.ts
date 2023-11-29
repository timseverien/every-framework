import currencyCodes from 'currency-codes';
import express from 'express';
import { SERVER_PORT } from './config';

const app = express();

app.get('/currency', (req, res, next) => {
	const currencies = currencyCodes.codes();

	res.json(currencies);
});

app.listen(SERVER_PORT);
