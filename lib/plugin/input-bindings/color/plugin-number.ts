import {InputParams} from '../../../api/types';
import {Color} from '../../common/model/color';
import {InputBindingPlugin} from '../../input-binding';
import {ColorSwatchTextController} from './controller/color-swatch-text';
import {
	colorFromRgbaNumber,
	colorFromRgbNumber,
} from './converter/color-number';
import {
	colorToHexRgbaString,
	colorToHexRgbString,
	CompositeColorParser,
} from './converter/color-string';
import {createColorNumberWriter} from './writer/color';

function shouldSupportAlpha(inputParams: InputParams): boolean {
	return 'input' in inputParams && inputParams.input === 'color.rgba';
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<Color, number> = {
	id: 'input-color-number',
	binding: {
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
				? colorFromRgbaNumber
				: colorFromRgbNumber;
		},
		writer: (args) => {
			return createColorNumberWriter(shouldSupportAlpha(args.params));
		},
		equals: Color.equals,
	},
	controller: (args) => {
		const supportsAlpha = shouldSupportAlpha(args.params);
		const formatter = supportsAlpha
			? colorToHexRgbaString
			: colorToHexRgbString;
		return new ColorSwatchTextController(args.document, {
			formatter: formatter,
			parser: CompositeColorParser,
			supportsAlpha: supportsAlpha,
			value: args.binding.value,
		});
	},
};
