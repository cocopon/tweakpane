import {ColorInputParams} from '../../blade/common/api/params.js';
import {Formatter} from '../../common/converter/formatter.js';
import {TpError} from '../../common/tp-error.js';
import {createPlugin} from '../../plugin/plugin.js';
import {InputBindingPlugin} from '../plugin.js';
import {ColorController} from './controller/color.js';
import {
	createColorStringParser,
	detectStringColorFormat,
	findColorStringifier,
	readIntColorString,
	StringColorFormat,
} from './converter/color-string.js';
import {createColorStringWriter} from './converter/writer.js';
import {Color, equalsColor} from './model/color.js';
import {IntColor} from './model/int-color.js';
import {extractColorType, parseColorInputParams} from './util.js';

interface StringColorInputParams extends ColorInputParams {
	format: StringColorFormat;
	stringifier: Formatter<Color>;
}

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<
	IntColor,
	string,
	StringColorInputParams
> = createPlugin({
	id: 'input-color-string',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		if (params.view === 'text') {
			return null;
		}
		const format = detectStringColorFormat(value, extractColorType(params));
		if (!format) {
			return null;
		}
		const stringifier = findColorStringifier(format);
		if (!stringifier) {
			return null;
		}

		const result = parseColorInputParams(params);
		return result
			? {
					initialValue: value,
					params: {
						...result,
						format: format,
						stringifier: stringifier,
					},
			  }
			: null;
	},
	binding: {
		reader: () => readIntColorString,
		equals: equalsColor,
		writer: (args) => {
			const writer = createColorStringWriter(args.params.format);
			if (!writer) {
				throw TpError.notBindable();
			}
			return writer;
		},
	},
	controller: (args) => {
		return new ColorController(args.document, {
			colorType: args.params.format.type,
			expanded: args.params.expanded ?? false,
			formatter: args.params.stringifier,
			parser: createColorStringParser('int'),
			pickerLayout: args.params.picker ?? 'popup',
			supportsAlpha: args.params.format.alpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
