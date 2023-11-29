import { SECONDS_PER_DAY } from './time';

export function createSinusoidalRandomNumberGenerator(seed: number, cycleCount = 10) {
	const cycleWeights = Array.from({ length: cycleCount }, (_, index) => index);
	const cycleWeightsSum = cycleWeights.reduce((a, b) => a + b, 0);

	const cycles = cycleWeights.map((weight, index) => {
		const t = index / (cycleCount - 1);

		return {
			frequency: (2 * Math.PI) / mix(1, SECONDS_PER_DAY, t),
			phase: seed * ((2 * Math.PI) / 1000),
			weight: weight / cycleWeightsSum,
		};
	});

	return (date: Date) => {
		const time = date.getTime() / 1000;
		return cycles.reduce((sum, cycle) => {
			return sum + cycle.weight * Math.sin(cycle.phase + time * cycle.frequency);
		}, 0);
	};
}

export function map(fromMin: number, fromMax: number, toMin: number, toMax: number, value: number) {
	return mix(toMin, toMax, normalize(fromMin, fromMax, value));
}

export function mix(rangeMin: number, rangeMax: number, value: number) {
	return rangeMin + value * (rangeMax - rangeMin);
}

export function normalize(rangeMin: number, rangeMax: number, value: number) {
	return (value - rangeMin) / (rangeMax - rangeMin);
}

export function truncToFractionDigits(fractionDigits: number, value: number) {
	if (fractionDigits === 0) {
		return Math.trunc(value);
	}

	const m = 10 ** fractionDigits;
	return Math.trunc(value * m) / m;
}
