// @flow

import NumberParser from '../parser/number';

export function fromMixed(value: mixed): number {
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

export function toString(value: number): string {
	return String(value);
}
