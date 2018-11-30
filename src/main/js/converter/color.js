// @flow

import ColorParser from '../parser/color';

import type {Color} from '../model/color';

export function fromMixed(value: mixed): Color {
	if (typeof value === 'string') {
		const cv = ColorParser(value);
		if (cv) {
			return cv;
		}
	}
	return {r: 0, g: 0, b: 0};
}

export function toString(value: Color): string {
	const hexes = [value.r, value.g, value.b]
		.map((comp) => {
			const hex = comp.toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		})
		.join('');
	return `#${hexes}`;
}
