import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color, RgbColorObject} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {Target} from '../../model/target';
import {NumberColorParser} from '../../parser/number-color';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingController} from '../input-binding';
import {ColorSwatchTextInputController} from '../input/color-swatch-text';

/**
 * @hidden
 */
export function createWithString(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, string> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'string') {
		return null;
	}
	const notation = StringColorParser.getNotation(initialValue);
	if (!notation) {
		return null;
	}

	const converter = ColorConverter.fromMixed;
	const color = converter(initialValue);
	const disposable = new Disposable();
	const value = new InputValue(color);
	const writer = ColorConverter.getStringifier(notation);
	return new InputBindingController(document, {
		disposable: disposable,
		binding: new InputBinding({
			reader: converter,
			target: target,
			value: value,
			writer: writer,
		}),
		controller: new ColorSwatchTextInputController(document, {
			disposable: disposable,
			formatter: new ColorFormatter(writer),
			parser: StringColorParser.CompositeParser,
			value: value,
		}),
		label: params.label || target.key,
	});
}

/**
 * @hidden
 */
export function createWithNumber(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, number> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'number') {
		return null;
	}
	if (!('input' in params)) {
		return null;
	}
	if (params.input !== 'color' && params.input !== 'color.rgb') {
		return null;
	}
	const color = NumberColorParser(initialValue);
	if (!color) {
		return null;
	}

	const value = new InputValue(color);
	const disposable = new Disposable();
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromMixed,
			target: target,
			value: value,
			writer: ColorConverter.toNumber,
		}),
		controller: new ColorSwatchTextInputController(document, {
			disposable: disposable,
			formatter: new ColorFormatter(ColorConverter.toHexRgbString),
			parser: StringColorParser.CompositeParser,
			value: value,
		}),
		disposable: disposable,
		label: params.label || target.key,
	});
}

/**
 * @hidden
 */
export function createWithObject(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, RgbColorObject> | null {
	const initialValue = target.read();
	if (!Color.isRgbColorObject(initialValue)) {
		return null;
	}

	const color = Color.fromRgbObject(initialValue);
	const disposable = new Disposable();
	const value = new InputValue(color);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromMixed,
			target: target,
			value: value,
			writer: Color.toRgbObject,
		}),
		controller: new ColorSwatchTextInputController(document, {
			disposable: disposable,
			formatter: new ColorFormatter(ColorConverter.toHexRgbString),
			parser: StringColorParser.CompositeParser,
			value: value,
		}),
		disposable: disposable,
		label: params.label || target.key,
	});
}
