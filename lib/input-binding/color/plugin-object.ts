import {InputBindingPlugin} from '../plugin';
import {ColorSwatchTextController} from './controller/color-swatch-text';
import {colorFromObject} from './converter/color-number';
import {
	colorToHexRgbaString,
	colorToHexRgbString,
	CompositeColorParser,
} from './converter/color-string';
import {createColorObjectWriter} from './converter/writer';
import {Color, RgbaColorObject, RgbColorObject} from './model/color';

function shouldSupportAlpha(
	initialValue: RgbColorObject | RgbaColorObject,
): boolean {
	return Color.isRgbaColorObject(initialValue);
}

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject
> = {
	id: 'input-color-object',
	accept: (value, _params) => (Color.isColorObject(value) ? value : null),
	binding: {
		reader: (_args) => colorFromObject,
		equals: Color.equals,
		writer: (args) =>
			createColorObjectWriter(shouldSupportAlpha(args.initialValue)),
	},
	controller: (args) => {
		const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
		const formatter = supportsAlpha
			? colorToHexRgbaString
			: colorToHexRgbString;
		return new ColorSwatchTextController(args.document, {
			formatter: formatter,
			parser: CompositeColorParser,
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
