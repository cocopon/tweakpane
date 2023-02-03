import {Formatter} from '../../common/converter/formatter';
import {TpError} from '../../common/tp-error';
import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
import {
	createColorStringParser,
	detectStringColorFormat,
	findColorStringifier,
	readIntColorString,
	StringColorFormat,
} from './converter/color-string';
import {createColorStringWriter} from './converter/writer';
import {Color, equalsColor} from './model/color';
import {IntColor} from './model/int-color';
import {
	ColorInputParams,
	extractColorType,
	parseColorInputParams,
} from './util';

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
> = {
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
};
