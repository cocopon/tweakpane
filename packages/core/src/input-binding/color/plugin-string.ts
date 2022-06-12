import {TpError} from '../../common/tp-error';
import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
import {
	createColorStringBindingReader,
	createColorStringParser,
	detectStringColorFormat,
	findColorStringifier,
} from './converter/color-string';
import {createColorStringWriter} from './converter/writer';
import {Color} from './model/color';
import {
	ColorInputParams,
	extractColorType,
	parseColorInputParams,
} from './util';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<
	Color,
	string,
	ColorInputParams
> = {
	id: 'input-color-string',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		if ('view' in params && params.view === 'text') {
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
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (args) =>
			createColorStringBindingReader(extractColorType(args.params) ?? 'int'),
		equals: Color.equals,
		writer: (args) => {
			const format = detectStringColorFormat(
				args.initialValue,
				extractColorType(args.params),
			);
			if (!format) {
				throw TpError.shouldNeverHappen();
			}
			const writer = createColorStringWriter(format);
			if (!writer) {
				throw TpError.notBindable();
			}
			return writer;
		},
	},
	controller: (args) => {
		const format = detectStringColorFormat(
			args.initialValue,
			extractColorType(args.params),
		);
		if (!format) {
			throw TpError.shouldNeverHappen();
		}
		const stringifier = findColorStringifier(format);
		if (!stringifier) {
			throw TpError.shouldNeverHappen();
		}

		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		return new ColorController(args.document, {
			colorType: format.type,
			expanded: expanded ?? false,
			formatter: stringifier,
			parser: createColorStringParser(format.type),
			pickerLayout: picker ?? 'popup',
			supportsAlpha: format.alpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
