export function pickRandom<T>(array: T[]): T {
	const index = Math.trunc(Math.random() * array.length);
	return array[index];
}
