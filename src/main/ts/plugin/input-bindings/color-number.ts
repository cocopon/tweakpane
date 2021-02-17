import {InputParams} from '../../api/types';
import {ColorSwatchTextController} from '../../controller/input/color-swatch-text';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color} from '../../model/color';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingPlugin} from '../input-binding';

function shouldSupportAlpha(inputParams: InputParams): boolean {
	return 'input' in inputParams && inputParams.input === 'color.rgba';
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<Color, number> = {
	model: {
		accept: (value, params) => {
			if (typeof value !== 'number') {
				return null;
			}

			if (!('input' in params)) {
				return null;
			}
			if (
				params.input !== 'color' &&
				params.input !== 'color.rgb' &&
				params.input !== 'color.rgba'
			) {
				return null;
			}

			return value;
		},
		reader: (args) => {
			return shouldSupportAlpha(args.params)
				? ColorConverter.fromNumberToRgba
				: ColorConverter.fromNumberToRgb;
		},
		writer: (args) => {
			return shouldSupportAlpha(args.params)
				? ColorConverter.toRgbaNumber
				: ColorConverter.toRgbNumber;
		},
		equals: Color.equals,
	},
	controller: (args) => {
		const supportsAlpha = shouldSupportAlpha(args.params);
		const formatter = supportsAlpha
			? new ColorFormatter(ColorConverter.toHexRgbaString)
			: new ColorFormatter(ColorConverter.toHexRgbString);
		return new ColorSwatchTextController(args.document, {
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: args.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
