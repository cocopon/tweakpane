import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {Target} from '../../model/target';
import {NumberColorParser} from '../../parser/number-color';
import {StringColorParser} from '../../parser/string-color';
import {InputBindingController} from '../input-binding';
import {ColorSwatchTextInputController} from '../input/color-swatch-text';

/**
 * @hidden
 */
export function createString(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, string> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'string') {
		return null;
	}
	const color = StringColorParser(initialValue);
	if (!color) {
		return null;
	}

	const value = new InputValue(color);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromMixed,
			target: target,
			value: value,
			writer: ColorConverter.toString,
		}),
		controller: new ColorSwatchTextInputController(document, {
			formatter: new ColorFormatter(),
			parser: StringColorParser,
			value: value,
		}),
		label: params.label || target.key,
	});
}

/**
 * @hidden
 */
export function createNumber(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, number> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'number') {
		return null;
	}
	if (!('input' in params) || params.input !== 'rgb') {
		return null;
	}
	const color = NumberColorParser(initialValue);
	if (!color) {
		return null;
	}

	const value = new InputValue(color);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromMixed,
			target: target,
			value: value,
			writer: ColorConverter.toNumber,
		}),
		controller: new ColorSwatchTextInputController(document, {
			formatter: new ColorFormatter(),
			parser: StringColorParser,
			value: value,
		}),
		label: params.label || target.key,
	});
}
