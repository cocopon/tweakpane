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
import {ColorInputParams, parseColorInputParams} from './util';

function shouldSupportAlpha(inputParams: ColorInputParams): boolean {
	return 'alpha' in inputParams && inputParams.alpha === true;
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<
	Color,
	number,
	ColorInputParams
> = {
	id: 'input-color-number',
	accept: (value, params) => {
		if (typeof value !== 'number') {
			return null;
		}
		if (!('view' in params)) {
			return null;
		}
		if (params.view !== 'color') {
			return null;
		}

		const result = parseColorInputParams(params);
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
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
