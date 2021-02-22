import {Color, RgbaColorObject, RgbColorObject} from '../../common/model/color';
import {colorFromObject} from '../../common/reader/object-color';
import {CompositeColorParser} from '../../common/reader/string-color';
import {
	ColorFormatter,
	colorToHexRgbaString,
	colorToHexRgbString,
} from '../../common/writer/color';
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
		reader: (_args) => colorFromObject,
		writer: (_args) => Color.toRgbaObject,
		equals: Color.equals,
	},
	controller: (args) => {
		const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
		const formatter = supportsAlpha
			? new ColorFormatter(colorToHexRgbaString)
			: new ColorFormatter(colorToHexRgbString);
		return new ColorSwatchTextController(args.document, {
			formatter: formatter,
			parser: CompositeColorParser,
			supportsAlpha: supportsAlpha,
			value: args.binding.value,
		});
	},
};
