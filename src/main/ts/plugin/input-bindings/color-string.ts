import {ColorSwatchTextController} from '../../controller/value/color-swatch-text';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingPlugin} from '../input-binding';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<Color, string> = {
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
		reader: (_args) => ColorConverter.fromString,
		writer: (args) => {
			const notation = StringColorParser.getNotation(args.initialValue);
			if (!notation) {
				throw PaneError.shouldNeverHappen();
			}
			return ColorConverter.getStringifier(notation);
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
			parser: StringColorParser.CompositeParser,
			supportsAlpha: StringColorParser.hasAlphaComponent(notation),
			value: args.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
