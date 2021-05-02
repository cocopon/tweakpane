import {InputParams} from '../../blade/common/api/params';
import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
import {
	colorFromRgbaNumber,
	colorFromRgbNumber,
} from './converter/color-number';
import {
	colorToHexRgbaString,
	colorToHexRgbString,
	CompositeColorParser,
} from './converter/color-string';
import {createColorNumberWriter} from './converter/writer';
import {Color} from './model/color';

function shouldSupportAlpha(inputParams: InputParams): boolean {
	return 'input' in inputParams && inputParams.input === 'color.rgba';
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<Color, number> = {
	id: 'input-color-number',
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
	binding: {
		reader: (args) => {
			return shouldSupportAlpha(args.params)
				? colorFromRgbaNumber
				: colorFromRgbNumber;
		},
		equals: Color.equals,
		writer: (args) => {
			return createColorNumberWriter(shouldSupportAlpha(args.params));
		},
	},
	controller: (args) => {
		const supportsAlpha = shouldSupportAlpha(args.params);
		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		const formatter = supportsAlpha
			? colorToHexRgbaString
			: colorToHexRgbString;
		return new ColorController(args.document, {
			expanded: expanded ?? false,
			formatter: formatter,
			parser: CompositeColorParser,
			pickerLayout: picker ?? 'popup',
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
