import {NumberFormatter} from '../formatter/number';
import {PercentageFormatter} from '../formatter/percentage';
import {Color} from '../model/color';
import * as ColorModel from '../model/color-model';
import * as NumberUtil from '../number-util';
import * as NumberColorParser from '../parser/number-color';
import * as StringColorParser from '../parser/string-color';
import {StringColorNotation} from '../parser/string-color';

function createEmptyColor(): Color {
	return new Color([0, 0, 0], 'rgb');
}

/**
 * @hidden
 */
export function fromString(value: unknown): Color {
	if (typeof value === 'string') {
		const cv = StringColorParser.CompositeParser(value);
		if (cv) {
			return cv;
		}
	}
	return createEmptyColor();
}

/**
 * @hidden
 */
export function fromObject(value: unknown): Color {
	if (Color.isColorObject(value)) {
		return Color.fromObject(value);
	}
	return createEmptyColor();
}

/**
 * @hidden
 */
export function fromNumberToRgb(value: unknown): Color {
	if (typeof value === 'number') {
		const cv = NumberColorParser.RgbParser(value);
		if (cv) {
			return cv;
		}
	}
	return createEmptyColor();
}

/**
 * @hidden
 */
export function fromNumberToRgba(value: unknown): Color {
	if (typeof value === 'number') {
		const cv = NumberColorParser.RgbaParser(value);
		if (cv) {
			return cv;
		}
	}
	return createEmptyColor();
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
	const aFormatter = new NumberFormatter(2);
	const rgbFormatter = new NumberFormatter(0);
	const comps = value.getComponents('rgb').map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return formatter.format(comp);
	});
	return `rgba(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function toFunctionalHslString(value: Color): string {
	const formatters = [
		new NumberFormatter(0),
		new PercentageFormatter(),
		new PercentageFormatter(),
	];
	const comps = ColorModel.withoutAlpha(
		value.getComponents('hsl'),
	).map((comp, index) => formatters[index].format(comp));
	return `hsl(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function toFunctionalHslaString(value: Color): string {
	const formatters = [
		new NumberFormatter(0),
		new PercentageFormatter(),
		new PercentageFormatter(),
		new NumberFormatter(2),
	];
	const comps = value
		.getComponents('hsl')
		.map((comp, index) => formatters[index].format(comp));
	return `hsla(${comps.join(', ')})`;
}

const NOTATION_TO_STRINGIFIER_MAP: {
	[notation in StringColorNotation]: (value: Color) => string;
} = {
	'func.hsl': toFunctionalHslString,
	'func.hsla': toFunctionalHslaString,
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
export function toRgbNumber(value: Color): number {
	return ColorModel.withoutAlpha(value.getComponents('rgb')).reduce(
		(result, comp) => {
			return (result << 8) | (Math.floor(comp) & 0xff);
		},
		0,
	);
}

/**
 * @hidden
 */
export function toRgbaNumber(value: Color): number {
	return value.getComponents('rgb').reduce((result, comp, index) => {
		const hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
		return (result << 8) | hex;
	}, 0);
}
