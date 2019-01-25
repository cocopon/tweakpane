import NumberParser from '../parser/number';

/**
 * @hidden
 */
export function fromMixed(value: unknown): number {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		const pv = NumberParser(value);
		if (pv !== null && pv !== undefined) {
			return pv;
		}
	}

	return 0;
}

/**
 * @hidden
 */
export function toString(value: number): string {
	return String(value);
}
