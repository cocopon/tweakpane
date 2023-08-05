import {ColorInputParams} from '../../blade/common/api/params.js';
import {Formatter} from '../../common/converter/formatter.js';
import {createPlugin} from '../../plugin/plugin.js';
import {InputBindingPlugin} from '../plugin.js';
import {ColorController} from './controller/color.js';
import {
	colorFromRgbaNumber,
	colorFromRgbNumber,
} from './converter/color-number.js';
import {
	colorToHexRgbaString,
	colorToHexRgbString,
	createColorStringParser,
} from './converter/color-string.js';
import {createColorNumberWriter} from './converter/writer.js';
import {equalsColor} from './model/color.js';
import {IntColor} from './model/int-color.js';
import {parseColorInputParams} from './util.js';

function shouldSupportAlpha(inputParams: ColorInputParams): boolean {
	if (inputParams?.color?.alpha) {
		return true;
	}
	return false;
}

function createFormatter(supportsAlpha: boolean): Formatter<IntColor> {
	return supportsAlpha
		? (v: IntColor) => colorToHexRgbaString(v, '0x')
		: (v: IntColor) => colorToHexRgbString(v, '0x');
}

function isForColor(params: Record<string, unknown>): boolean {
	if ('color' in params) {
		return true;
	}
	if (params.view === 'color') {
		return true;
	}
	return false;
}

interface NumberColorInputParams extends ColorInputParams {
	supportsAlpha: boolean;
}

/**
 * @hidden
 */
export const NumberColorInputPlugin: InputBindingPlugin<
	IntColor,
	number,
	NumberColorInputParams
> = createPlugin({
	id: 'input-color-number',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'number') {
			return null;
		}
		if (!isForColor(params)) {
			return null;
		}

		const result = parseColorInputParams(params);
		return result
			? {
					initialValue: value,
					params: {
						...result,
						supportsAlpha: shouldSupportAlpha(params),
					},
			  }
			: null;
	},
	binding: {
		reader: (args) => {
			return args.params.supportsAlpha
				? colorFromRgbaNumber
				: colorFromRgbNumber;
		},
		equals: equalsColor,
		writer: (args) => {
			return createColorNumberWriter(args.params.supportsAlpha);
		},
	},
	controller: (args) => {
		return new ColorController(args.document, {
			colorType: 'int',
			expanded: args.params.expanded ?? false,
			formatter: createFormatter(args.params.supportsAlpha),
			parser: createColorStringParser('int'),
			pickerLayout: args.params.picker ?? 'popup',
			supportsAlpha: args.params.supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
