import {BindingWriter} from '../../../common/binding/writable';
import {BindingTarget} from '../../../common/binding/target';
import {writePrimitive} from '../../../common/primitive';
import {colorToRgbaNumber, colorToRgbNumber} from '../converter/color-number';
import {
	findColorStringifier,
	StringColorFormat,
} from '../converter/color-string';
import {Color} from '../model/color';
import {ColorType} from '../model/color-model';
import {mapColorType} from '../model/colors';
import {IntColor} from '../model/int-color';

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
