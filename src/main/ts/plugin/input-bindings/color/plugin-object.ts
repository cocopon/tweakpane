import * as ColorConverter from '../../common/converter/color';
import {ColorFormatter} from '../../common/formatter/color';
import {Color, RgbaColorObject, RgbColorObject} from '../../common/model/color';
import {ViewModel} from '../../common/model/view-model';
import * as StringColorParser from '../../common/parser/string-color';
import {InputBindingPlugin} from '../../input-binding';
import {ColorSwatchTextController} from './controller/color-swatch-text';

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject
> = {
	id: 'input-color-object',
	model: {
		accept: (value, _params) => (Color.isColorObject(value) ? value : null),
		reader: (_args) => ColorConverter.fromObject,
		writer: (_args) => Color.toRgbaObject,
		equals: Color.equals,
	},
	controller: (args) => {
		const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
		const formatter = supportsAlpha
			? new ColorFormatter(ColorConverter.toHexRgbaString)
			: new ColorFormatter(ColorConverter.toHexRgbString);
		return new ColorSwatchTextController(args.document, {
			viewModel: new ViewModel(),
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: args.binding.value,
		});
	},
};
