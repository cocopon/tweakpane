import {InputBinding} from '../../binding/input';
import {ColorSwatchTextInputController} from '../../controller/input/color-swatch-text';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingPlugin} from '../input-binding';

/**
 * @hidden
 */
export const StringColorInputPlugin: InputBindingPlugin<Color, string> = {
	createBinding: (params) => {
		const initialValue = params.target.read();
		if (typeof initialValue !== 'string') {
			return null;
		}
		if (
			'input' in params.inputParams &&
			params.inputParams.input === 'string'
		) {
			return null;
		}
		const notation = StringColorParser.getNotation(initialValue);
		if (!notation) {
			return null;
		}

		const converter = ColorConverter.fromString;
		const color = converter(initialValue);
		const value = new InputValue(color);
		const writer = ColorConverter.getStringifier(notation);
		return new InputBinding({
			reader: converter,
			target: params.target,
			value: value,
			writer: writer,
		});
	},
	createController: (params) => {
		const initialValue = params.binding.target.read();
		const notation =
			typeof initialValue === 'string'
				? StringColorParser.getNotation(initialValue)
				: null;
		if (!notation) {
			throw PaneError.shouldNeverHappen();
		}

		return new ColorSwatchTextInputController(params.document, {
			formatter: new ColorFormatter(params.binding.writer),
			parser: StringColorParser.CompositeParser,
			supportsAlpha: StringColorParser.hasAlphaComponent(notation),
			value: params.binding.value,
			viewModel: new ViewModel(),
		});
	},
};
