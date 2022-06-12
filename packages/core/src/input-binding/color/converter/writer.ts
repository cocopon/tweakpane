import {BindingWriter} from '../../../common/binding/binding';
import {BindingTarget} from '../../../common/binding/target';
import {writePrimitive} from '../../../common/primitive';
import {colorToRgbaNumber, colorToRgbNumber} from '../converter/color-number';
import {
	findColorStringifier,
	StringColorFormat,
} from '../converter/color-string';
import {Color} from '../model/color';
import {ColorType} from '../model/color-model';

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
): BindingWriter<Color> {
	const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
	return (target, value) => {
		writePrimitive(target, colorToNumber(value));
	};
}

// TODO: Make type required in the next version
export function writeRgbaColorObject(
	target: BindingTarget,
	value: Color,
	opt_type?: ColorType,
) {
	const obj = value.toRgbaObject(opt_type);
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
	target.writeProperty('a', obj.a);
}

// TODO: Make type required in the next version
export function writeRgbColorObject(
	target: BindingTarget,
	value: Color,
	opt_type?: ColorType,
) {
	const obj = value.toRgbaObject(opt_type);
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
}

// TODO: Make type required in the next version
export function createColorObjectWriter(
	supportsAlpha: boolean,
	opt_type?: ColorType,
): BindingWriter<Color> {
	return (target, inValue) => {
		if (supportsAlpha) {
			writeRgbaColorObject(target, inValue, opt_type);
		} else {
			writeRgbColorObject(target, inValue, opt_type);
		}
	};
}
