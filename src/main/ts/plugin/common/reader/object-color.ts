import {Color} from '../model/color';

/**
 * @hidden
 */
export function colorFromObject(value: unknown): Color {
	if (Color.isColorObject(value)) {
		return Color.fromObject(value);
	}
	return Color.black();
}
