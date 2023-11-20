import { sleep } from './async';

export async function* throttle<T, TReturn, TNext>(
	generator: Generator<T, TReturn, TNext>,
	duration: number,
): AsyncGenerator<T, TReturn, TNext> {
	while (true) {
		const { value, done } = generator.next();

		if (done) {
			return value;
		}

		yield value;
		await sleep(duration);
	}
}
