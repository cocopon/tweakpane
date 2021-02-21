import {Color} from '../model/color';
import {mapRange} from '../number-util';
import {Parser} from './parser';

/**
 * @hidden
 */
export const RgbParser: Parser<number, Color> = (num: number): Color | null => {
	return new Color([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
};

/**
 * @hidden
 */
const RgbaParser: Parser<number, Color> = (num: number): Color | null => {
	return new Color(
		[
			(num >> 24) & 0xff,
			(num >> 16) & 0xff,
			(num >> 8) & 0xff,
			mapRange(num & 0xff, 0, 255, 0, 1),
		],
		'rgb',
	);
};

/**
 * @hidden
 */
export function colorFromNumberToRgb(value: unknown): Color {
	if (typeof value === 'number') {
		const cv = RgbParser(value);
		if (cv) {
			return cv;
		}
	}
	return Color.black();
}

/**
 * @hidden
 */
export function colorFromNumberToRgba(value: unknown): Color {
	if (typeof value === 'number') {
		const cv = RgbaParser(value);
		if (cv) {
			return cv;
		}
	}
	return Color.black();
}
