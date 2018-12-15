// @flow

import * as ColorConverter from '../../converter/color';
import InputBinding from '../../binding/input';
import ColorFormatter from '../../formatter/color';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import ColorParser from '../../parser/color';
import ColorSwatchTextInputController from '../input/color-swatch-text';
import InputBindingController from '../input-binding';

type Params = {
	label?: string,
};

export function create(
	document: Document,
	target: Target,
	initialValue: Color,
	params: Params,
): InputBindingController<Color, *> {
	const value = new InputValue(initialValue);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromMixed,
			target: target,
			value: value,
			writer: ColorConverter.toString,
		}),
		controller: new ColorSwatchTextInputController(document, {
			formatter: new ColorFormatter(),
			parser: ColorParser,
			value: value,
		}),
		label: params.label || target.key,
	});
}
