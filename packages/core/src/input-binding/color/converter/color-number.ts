import {mapRange} from '../../../common/number/util.js';
import {removeAlphaComponent} from '../model/color-model.js';
import {IntColor} from '../model/int-color.js';

export function colorToRgbNumber(value: IntColor): number {
	return removeAlphaComponent(value.getComponents('rgb')).reduce(
		(result, comp) => {
			return (result << 8) | (Math.floor(comp) & 0xff);
		},
		0,
	);
}

export function colorToRgbaNumber(value: IntColor): number {
	return (
		value.getComponents('rgb').reduce((result, comp, index) => {
			const hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
			return (result << 8) | hex;
		}, 0) >>> 0
	);
}

export function numberToRgbColor(num: number): IntColor {
	return new IntColor(
		[(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff],
		'rgb',
	);
}

export function numberToRgbaColor(num: number): IntColor {
	return new IntColor(
		[
			(num >> 24) & 0xff,
			(num >> 16) & 0xff,
			(num >> 8) & 0xff,
			mapRange(num & 0xff, 0, 255, 0, 1),
		],
		'rgb',
	);
}

export function colorFromRgbNumber(value: unknown): IntColor {
	if (typeof value !== 'number') {
		return IntColor.black();
	}
	return numberToRgbColor(value);
}

export function colorFromRgbaNumber(value: unknown): IntColor {
	if (typeof value !== 'number') {
		return IntColor.black();
	}
	return numberToRgbaColor(value);
}
