import NumberUtil from '../misc/number-util';
import Color from '../model/color';
import StringColorParser from '../parser/string-color';

/**
 * @hidden
 */
export function fromMixed(value: unknown): Color {
	if (typeof value === 'string') {
		const cv = StringColorParser(value);
		if (cv) {
			return cv;
		}
	}
	return new Color([0, 0, 0], 'rgb');
}

/**
 * @hidden
 */
export function toString(value: Color): string {
	const hexes = value
		.getComponents('rgb')
		.map((comp) => {
			const hex = NumberUtil.constrain(Math.floor(comp), 0, 255).toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		})
		.join('');
	return `#${hexes}`;
}
