import {Color} from '../model/color';
import {Parser} from './parser';

/**
 * @hidden
 */
export const NumberColorParser: Parser<number, Color> = (
	num: number,
): Color | null => {
	return new Color([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
};
