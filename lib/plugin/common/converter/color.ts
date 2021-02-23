import {Color} from '../model/color';
import {removeAlphaComponent} from '../model/color-model';
import {constrainRange, mapRange} from '../number-util';
import {StringColorNotation} from '../reader/string-color';
import {Formatter} from './formatter';
import {NumberFormatter} from './number';
import {PercentageFormatter} from './percentage';

/**
 * @hidden
 */
export function colorFromObject(value: unknown): Color {
	if (Color.isColorObject(value)) {
		return Color.fromObject(value);
	}
	return Color.black();
}

/**
 * @hidden
 */
export class ColorFormatter implements Formatter<Color> {
	private stringifier_: (color: Color) => string;

	constructor(stringifier: (color: Color) => string) {
		this.stringifier_ = stringifier;
	}

	public format(value: Color): string {
		return this.stringifier_(value);
	}
}

function zerofill(comp: number): string {
	const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * @hidden
 */
export function colorToHexRgbString(value: Color): string {
	const hexes = removeAlphaComponent(value.getComponents('rgb'))
		.map(zerofill)
		.join('');
	return `#${hexes}`;
}

/**
 * @hidden
 */
export function colorToHexRgbaString(value: Color): string {
	const rgbaComps = value.getComponents('rgb');
	const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
		.map(zerofill)
		.join('');
	return `#${hexes}`;
}

/**
 * @hidden
 */
export function colorToFunctionalRgbString(value: Color): string {
	const formatter = new NumberFormatter(0);
	const comps = removeAlphaComponent(value.getComponents('rgb')).map((comp) =>
		formatter.format(comp),
	);
	return `rgb(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function colorToFunctionalRgbaString(value: Color): string {
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
export function colorToFunctionalHslString(value: Color): string {
	const formatters = [
		new NumberFormatter(0),
		new PercentageFormatter(),
		new PercentageFormatter(),
	];
	const comps = removeAlphaComponent(
		value.getComponents('hsl'),
	).map((comp, index) => formatters[index].format(comp));
	return `hsl(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function colorToFunctionalHslaString(value: Color): string {
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
	'func.hsl': colorToFunctionalHslString,
	'func.hsla': colorToFunctionalHslaString,
	'func.rgb': colorToFunctionalRgbString,
	'func.rgba': colorToFunctionalRgbaString,
	'hex.rgb': colorToHexRgbString,
	'hex.rgba': colorToHexRgbaString,
};

export function getColorStringifier(
	notation: StringColorNotation,
): (value: Color) => string {
	return NOTATION_TO_STRINGIFIER_MAP[notation];
}

/**
 * @hidden
 */
export function colorToRgbNumber(value: Color): number {
	return removeAlphaComponent(value.getComponents('rgb')).reduce(
		(result, comp) => {
			return (result << 8) | (Math.floor(comp) & 0xff);
		},
		0,
	);
}

/**
 * @hidden
 */
export function colorToRgbaNumber(value: Color): number {
	return (
		value.getComponents('rgb').reduce((result, comp, index) => {
			const hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
			return (result << 8) | hex;
		}, 0) >>> 0
	);
}

/**
 * @hidden
 */
export function numberToRgbColor(num: number): Color {
	return new Color([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
}

/**
 * @hidden
 */
export function numberToRgbaColor(num: number): Color {
	return new Color(
		[
			(num >> 24) & 0xff,
			(num >> 16) & 0xff,
			(num >> 8) & 0xff,
			mapRange(num & 0xff, 0, 255, 0, 1),
		],
		'rgb',
	);
}

/**
 * @hidden
 */
export function colorFromRgbNumber(value: unknown): Color {
	if (typeof value !== 'number') {
		return Color.black();
	}
	return numberToRgbColor(value);
}

/**
 * @hidden
 */
export function colorFromRgbaNumber(value: unknown): Color {
	if (typeof value !== 'number') {
		return Color.black();
	}
	return numberToRgbaColor(value);
}
