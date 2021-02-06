import {InputBinding} from '../../binding/input';
import {ColorSwatchTextInputController} from '../../controller/input/color-swatch-text';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color, RgbaColorObject, RgbColorObject} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingPlugin} from './input-binding-plugin';

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject
> = {
	createBinding: (params) => {
		const initialValue = params.target.read();
		if (!Color.isColorObject(initialValue)) {
			return null;
		}

		const color = Color.fromObject(initialValue);
		const value = new InputValue(color);
		return new InputBinding({
			reader: ColorConverter.fromObject,
			target: params.target,
			value: value,
			writer: Color.toRgbaObject,
		});
	},
	createController: (params) => {
		const initialValue = params.binding.target.read();
		const supportsAlpha = Color.isRgbaColorObject(initialValue);
		const formatter = supportsAlpha
			? new ColorFormatter(ColorConverter.toHexRgbaString)
			: new ColorFormatter(ColorConverter.toHexRgbString);
		return new ColorSwatchTextInputController(params.document, {
			viewModel: new ViewModel(),
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: params.binding.value,
		});
	},
};
