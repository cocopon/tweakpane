import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import * as NumberColorParser from '../../parser/number-color';
import * as StringColorParser from '../../parser/string-color';
import {ColorSwatchTextInputController} from '../input/color-swatch-text';
import {InputBindingPlugin} from './input-binding-plugin';

function shouldSupportAlpha(inputParams: InputParams): boolean {
	return 'input' in inputParams && inputParams.input === 'color.rgba';
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<Color, number> = {
	createBinding: (params) => {
		const initialValue = params.target.read();
		if (typeof initialValue !== 'number') {
			return null;
		}
		if (!('input' in params.inputParams)) {
			return null;
		}
		if (
			params.inputParams.input !== 'color' &&
			params.inputParams.input !== 'color.rgb' &&
			params.inputParams.input !== 'color.rgba'
		) {
			return null;
		}
		const supportsAlpha = shouldSupportAlpha(params.inputParams);
		const parser = supportsAlpha
			? NumberColorParser.RgbaParser
			: NumberColorParser.RgbParser;

		const color = parser(initialValue);
		if (!color) {
			return null;
		}

		const reader = supportsAlpha
			? ColorConverter.fromNumberToRgba
			: ColorConverter.fromNumberToRgb;
		const writer = supportsAlpha
			? ColorConverter.toRgbaNumber
			: ColorConverter.toRgbNumber;
		const value = new InputValue(color);
		return new InputBinding({
			reader: reader,
			target: params.target,
			value: value,
			writer: writer,
		});
	},
	createController: (params) => {
		const supportsAlpha = shouldSupportAlpha(params.inputParams);
		const formatter = supportsAlpha
			? new ColorFormatter(ColorConverter.toHexRgbaString)
			: new ColorFormatter(ColorConverter.toHexRgbString);
		return new ColorSwatchTextInputController(params.document, {
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: params.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
