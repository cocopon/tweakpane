import {InputParams} from '../../../api/types';
import {
	ColorFormatter,
	colorToHexRgbaString,
	colorToHexRgbString,
	colorToRgbaNumber,
	colorToRgbNumber,
} from '../../common/formatter/color';
import {Color} from '../../common/model/color';
import {ViewModel} from '../../common/model/view-model';
import {
	colorFromNumberToRgb,
	colorFromNumberToRgba,
} from '../../common/parser/number-color';
import * as StringColorParser from '../../common/parser/string-color';
import {InputBindingPlugin} from '../../input-binding';
import {ColorSwatchTextController} from './controller/color-swatch-text';

function shouldSupportAlpha(inputParams: InputParams): boolean {
	return 'input' in inputParams && inputParams.input === 'color.rgba';
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<Color, number> = {
	id: 'input-color-number',
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
				? colorFromNumberToRgba
				: colorFromNumberToRgb;
		},
		writer: (args) => {
			return shouldSupportAlpha(args.params)
				? colorToRgbaNumber
				: colorToRgbNumber;
		},
		equals: Color.equals,
	},
	controller: (args) => {
		const supportsAlpha = shouldSupportAlpha(args.params);
		const formatter = supportsAlpha
			? new ColorFormatter(colorToHexRgbaString)
			: new ColorFormatter(colorToHexRgbString);
		return new ColorSwatchTextController(args.document, {
			formatter: formatter,
			parser: StringColorParser.CompositeColorParser,
			supportsAlpha: supportsAlpha,
			value: args.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
