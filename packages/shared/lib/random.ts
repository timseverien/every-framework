export function* getRandomNumberGenerator(): Generator<number, never, void> {
	while (true) {
		yield Math.random();
	}
}
