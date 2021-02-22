import {Color} from '../../common/model/color';
import {PaneError} from '../../common/pane-error';
import {
	colorFromString,
	CompositeColorParser,
	getColorNotation,
	hasAlphaComponent,
} from '../../common/reader/string-color';
import {ColorFormatter, getColorStringifier} from '../../common/writer/color';
import {InputBindingPlugin} from '../../input-binding';
import {ColorSwatchTextController} from './controller/color-swatch-text';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<Color, string> = {
	id: 'input-color-string',
	binding: {
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
		reader: (_args) => colorFromString,
		writer: (args) => {
			const notation = getColorNotation(args.initialValue);
			if (!notation) {
				throw PaneError.shouldNeverHappen();
			}
			return getColorStringifier(notation);
		},
		equals: Color.equals,
	},
	controller: (args) => {
		const notation = getColorNotation(args.initialValue);
		if (!notation) {
			throw PaneError.shouldNeverHappen();
		}

		return new ColorSwatchTextController(args.document, {
			formatter: new ColorFormatter(args.binding.writer),
			parser: CompositeColorParser,
			supportsAlpha: hasAlphaComponent(notation),
			value: args.binding.value,
		});
	},
};
