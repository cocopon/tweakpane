import {NumberFormatter} from '../formatter/number';
import {NumberUtil} from '../misc/number-util';
import {Color} from '../model/color';
import {NumberColorParser} from '../parser/number-color';
import * as StringColorParser from '../parser/string-color';
import {StringColorNotation} from '../parser/string-color';

/**
 * @hidden
 */
export function fromMixed(value: unknown): Color {
	if (typeof value === 'string') {
		const cv = StringColorParser.CompositeParser(value);
		if (cv) {
			return cv;
		}
	}
	if (typeof value === 'number') {
		const cv = NumberColorParser(value);
		if (cv) {
			return cv;
		}
	}
	if (Color.isRgbColorObject(value)) {
		return Color.fromRgbObject(value);
	}
	return new Color([0, 0, 0], 'rgb');
}

/**
 * @hidden
 */
export function toHexRgbString(value: Color): string {
	const hexes = value
		.getComponents('rgb')
		.map((comp) => {
			const hex = NumberUtil.constrain(Math.floor(comp), 0, 255).toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		})
		.join('');
	return `#${hexes}`;
}

/**
 * @hidden
 */
export function toFunctionalRgbString(value: Color): string {
	const formatter = new NumberFormatter(0);
	const comps = value
		.getComponents('rgb')
		.map((comp) => formatter.format(comp));
	return `rgb(${comps.join(', ')})`;
}

const NOTATION_TO_STRINGIFIER_MAP: {
	[notation in StringColorNotation]: (value: Color) => string;
} = {
	'func.rgb': toFunctionalRgbString,
	'hex.rgb': toHexRgbString,
};

export function getStringifier(
	notation: StringColorNotation,
): (value: Color) => string {
	return NOTATION_TO_STRINGIFIER_MAP[notation];
}

/**
 * @hidden
 */
export function toNumber(value: Color): number {
	return value.getComponents('rgb').reduce((result, comp) => {
		return (result << 8) | (Math.floor(comp) & 0xff);
	}, 0);
}
