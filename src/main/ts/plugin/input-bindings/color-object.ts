import {ColorSwatchTextController} from '../../controller/value/color-swatch-text';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color, RgbaColorObject, RgbColorObject} from '../../model/color';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingPlugin} from '../input-binding';

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject
> = {
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
