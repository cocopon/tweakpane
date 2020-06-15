import {NumberUtil} from '../misc/number-util';
import {Color} from '../model/color';
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
export const RgbaParser: Parser<number, Color> = (
	num: number,
): Color | null => {
	return new Color(
		[
			(num >> 24) & 0xff,
			(num >> 16) & 0xff,
			(num >> 8) & 0xff,
			NumberUtil.map(num & 0xff, 0, 255, 0, 1),
		],
		'rgb',
	);
};
