import {mapRange} from '../../../common/number-util';
import {Color} from '../model/color';
import {ColorType, removeAlphaComponent} from '../model/color-model';

// TODO: Make type required in the next major version
/**
 * @hidden
 */
export function colorFromObject(value: unknown, opt_type?: ColorType): Color {
	if (Color.isColorObject(value)) {
		return Color.fromObject(value, opt_type);
	}
	return Color.black(opt_type);
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
