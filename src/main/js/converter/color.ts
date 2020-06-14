import {NumberFormatter} from '../formatter/number';
import * as ColorModel from '../misc/color-model';
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

function zerofill(comp: number): string {
	const hex = NumberUtil.constrain(Math.floor(comp), 0, 255).toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * @hidden
 */
export function toHexRgbString(value: Color): string {
	const hexes = ColorModel.withoutAlpha(value.getComponents('rgb'))
		.map(zerofill)
		.join('');
	return `#${hexes}`;
}

/**
 * @hidden
 */
export function toHexRgbaString(value: Color): string {
	const rgbaComps = value.getComponents('rgb');
	const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
		.map(zerofill)
		.join('');
	return `#${hexes}`;
}

/**
 * @hidden
 */
export function toFunctionalRgbString(value: Color): string {
	const formatter = new NumberFormatter(0);
	const comps = ColorModel.withoutAlpha(
		value.getComponents('rgb'),
	).map((comp) => formatter.format(comp));
	return `rgb(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function toFunctionalRgbaString(value: Color): string {
	const alphaFormatter = new NumberFormatter(2);
	const nonAlphaFormatter = new NumberFormatter(0);
	const comps = value.getComponents('rgb').map((comp, index) => {
		const formatter = index === 3 ? alphaFormatter : nonAlphaFormatter;
		return formatter.format(comp);
	});
	return `rgba(${comps.join(', ')})`;
}

const NOTATION_TO_STRINGIFIER_MAP: {
	[notation in StringColorNotation]: (value: Color) => string;
} = {
	'func.rgb': toFunctionalRgbString,
	'func.rgba': toFunctionalRgbaString,
	'hex.rgb': toHexRgbString,
	'hex.rgba': toHexRgbaString,
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
	return ColorModel.withoutAlpha(value.getComponents('rgb')).reduce(
		(result, comp) => {
			return (result << 8) | (Math.floor(comp) & 0xff);
		},
		0,
	);
}
