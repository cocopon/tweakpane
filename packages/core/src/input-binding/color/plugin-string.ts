import {TpError} from '../../common/tp-error';
import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
import {
	colorFromString,
	CompositeColorParser,
	getColorNotation,
	getColorStringifier,
	hasAlphaComponent,
} from './converter/color-string';
import {createColorStringWriter} from './converter/writer';
import {Color} from './model/color';
import {ColorInputParams, parseColorInputParams} from './util';

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
		const notation = getColorNotation(value);
		if (!notation) {
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
		reader: (_args) => colorFromString,
		equals: Color.equals,
		writer: (args) => {
			const notation = getColorNotation(args.initialValue);
			if (!notation) {
				throw TpError.shouldNeverHappen();
			}
			return createColorStringWriter(notation);
		},
	},
	controller: (args) => {
		const notation = getColorNotation(args.initialValue);
		if (!notation) {
			throw TpError.shouldNeverHappen();
		}

		const stringifier = getColorStringifier(notation);
		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		return new ColorController(args.document, {
			expanded: expanded ?? false,
			formatter: stringifier,
			parser: CompositeColorParser,
			pickerLayout: picker ?? 'popup',
			supportsAlpha: hasAlphaComponent(notation),
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
