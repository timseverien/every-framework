import { createSinusoidalRandomNumberGenerator, truncToFractionDigits } from './math';

export function getCurrencyPriceGenerator(
	seed: number,
	fractionDigits: number,
	priceBase: number,
	priceVariance: number,
) {
	const getPrice = createSinusoidalRandomNumberGenerator(seed);
	return (date: Date) =>
		truncToFractionDigits(fractionDigits, priceBase + priceVariance * getPrice(date));
}
