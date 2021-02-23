import {BindingWriter} from '../../../common/binding/input';
import {BindingTarget} from '../../../common/binding/target';
import {
	colorToRgbaNumber,
	colorToRgbNumber,
	getColorStringifier,
} from '../../../common/converter/color';
import {Color} from '../../../common/model/color';
import {StringColorNotation} from '../../../common/reader/string-color';
import {writePrimitive} from '../../../common/writer/primitive';

export function createColorStringWriter(
	notation: StringColorNotation,
): BindingWriter<Color> {
	const stringify = getColorStringifier(notation);
	return (target, value) => {
		writePrimitive(target, stringify(value));
	};
}

export function createColorNumberWriter(
	supportsAlpha: boolean,
): BindingWriter<Color> {
	const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
	return (target, value) => {
		writePrimitive(target, colorToNumber(value));
	};
}

export function writeRgbaColorObject(target: BindingTarget, value: Color) {
	const obj = value.toRgbaObject();
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
	target.writeProperty('a', obj.a);
}

export function writeRgbColorObject(target: BindingTarget, value: Color) {
	const obj = value.toRgbaObject();
	target.writeProperty('r', obj.r);
	target.writeProperty('g', obj.g);
	target.writeProperty('b', obj.b);
}

export function createColorObjectWriter(
	supportsAlpha: boolean,
): BindingWriter<Color> {
	return supportsAlpha ? writeRgbaColorObject : writeRgbColorObject;
}
