import {
	Color,
	createColorComponentsFromRgbObject,
	isColorObject,
} from '../model/color';
import {ColorType} from '../model/color-model';
import {mapColorType} from '../model/colors';
import {FloatColor} from '../model/float-color';
import {IntColor} from '../model/int-color';

/**
 * @hidden
 */
export function colorFromObject(value: unknown, type: 'int'): IntColor;
export function colorFromObject(value: unknown, type: 'float'): FloatColor;
export function colorFromObject(value: unknown, type: ColorType): Color;
export function colorFromObject(value: unknown, type: ColorType): Color {
	if (!isColorObject(value)) {
		return mapColorType(IntColor.black(), type);
	}
	if (type === 'int') {
		const comps = createColorComponentsFromRgbObject(value);
		return new IntColor(comps, 'rgb');
	}
	if (type === 'float') {
		const comps = createColorComponentsFromRgbObject(value);
		return new FloatColor(comps, 'rgb');
	}
	return mapColorType(IntColor.black(), 'int');
}
