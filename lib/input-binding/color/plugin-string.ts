import {TpError} from '../../common/tp-error';
import {InputBindingPlugin} from '../plugin';
import {ColorSwatchTextController} from './controller/color-swatch-text';
import {
	colorFromString,
	CompositeColorParser,
	getColorNotation,
	getColorStringifier,
	hasAlphaComponent,
} from './converter/color-string';
import {createColorStringWriter} from './converter/writer';
import {Color} from './model/color';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<Color, string> = {
	id: 'input-color-string',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		if ('input' in params && params.input === 'string') {
			return null;
		}
		const notation = getColorNotation(value);
		if (!notation) {
			return null;
		}
		return value;
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
		return new ColorSwatchTextController(args.document, {
			formatter: stringifier,
			parser: CompositeColorParser,
			supportsAlpha: hasAlphaComponent(notation),
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
