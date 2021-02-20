export function mapRange(
	value: number,
	start1: number,
	end1: number,
	start2: number,
	end2: number,
): number {
	const p = (value - start1) / (end1 - start1);
	return start2 + p * (end2 - start2);
}

export function getDecimalDigits(value: number): number {
	const text = String(value.toFixed(10));
	const frac = text.split('.')[1];
	return frac.replace(/0+$/, '').length;
}

export function constrainRange(
	value: number,
	min: number,
	max: number,
): number {
	return Math.min(Math.max(value, min), max);
}

export function loopRange(value: number, max: number): number {
	return ((value % max) + max) % max;
}
