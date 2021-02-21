import {
	ColorFormatter,
	getColorStringifier,
} from '../../common/formatter/color';
import {Color} from '../../common/model/color';
import {ViewModel} from '../../common/model/view-model';
import {PaneError} from '../../common/pane-error';
import * as StringColorParser from '../../common/parser/string-color';
import {colorFromString} from '../../common/parser/string-color';
import {InputBindingPlugin} from '../../input-binding';
import {ColorSwatchTextController} from './controller/color-swatch-text';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<Color, string> = {
	id: 'input-color-string',
	model: {
		accept: (value, params) => {
			if (typeof value !== 'string') {
				return null;
			}
			if ('input' in params && params.input === 'string') {
				return null;
			}
			const notation = StringColorParser.getNotation(value);
			if (!notation) {
				return null;
			}
			return value;
		},
		reader: (_args) => colorFromString,
		writer: (args) => {
			const notation = StringColorParser.getNotation(args.initialValue);
			if (!notation) {
				throw PaneError.shouldNeverHappen();
			}
			return getColorStringifier(notation);
		},
		equals: Color.equals,
	},
	controller: (args) => {
		const notation = StringColorParser.getNotation(args.initialValue);
		if (!notation) {
			throw PaneError.shouldNeverHappen();
		}

		return new ColorSwatchTextController(args.document, {
			formatter: new ColorFormatter(args.binding.writer),
			parser: StringColorParser.CompositeColorParser,
			supportsAlpha: StringColorParser.hasAlphaComponent(notation),
			value: args.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
