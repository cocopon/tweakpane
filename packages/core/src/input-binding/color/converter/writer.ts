import {BindingWriter} from '../../../common/binding/binding.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {writePrimitive} from '../../../common/primitive.js';
import {
	colorToRgbaNumber,
	colorToRgbNumber,
} from '../converter/color-number.js';
import {
	findColorStringifier,
	StringColorFormat,
} from '../converter/color-string.js';
import {Color} from '../model/color.js';
import {ColorType} from '../model/color-model.js';
import {mapColorType} from '../model/colors.js';
import {IntColor} from '../model/int-color.js';

export function createColorStringWriter(
	format: StringColorFormat,
): BindingWriter<Color> | null {
	const stringify = findColorStringifier(format);
	return stringify
		? (target, value) => {
				writePrimitive(target, stringify(value));
		  }
		: null;
}

export function createColorNumberWriter(
	supportsAlpha: boolean,
): BindingWriter<IntColor> {
	const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
	return (target, value) => {
		writePrimitive(target, colorToNumber(value));
	};
}

export function writeRgbaColorObject(
	target: BindingTarget,
	value: Color,
	type: ColorType,
) {
	const cc = mapColorType(value, type);
	const obj = cc.toRgbaObject();
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
	target.writeProperty('a', obj.a);
}

export function writeRgbColorObject(
	target: BindingTarget,
	value: Color,
	type: ColorType,
) {
	const cc = mapColorType(value, type);
	const obj = cc.toRgbaObject();
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
}

export function createColorObjectWriter(
	supportsAlpha: boolean,
	type: ColorType,
): BindingWriter<Color> {
	return (target, inValue) => {
		if (supportsAlpha) {
			writeRgbaColorObject(target, inValue, type);
		} else {
			writeRgbColorObject(target, inValue, type);
		}
	};
}
