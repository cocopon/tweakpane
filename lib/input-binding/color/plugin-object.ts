import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
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
		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		const formatter = supportsAlpha
			? colorToHexRgbaString
			: colorToHexRgbString;
		return new ColorController(args.document, {
			expanded: expanded ?? false,
			formatter: formatter,
			parser: CompositeColorParser,
			pickerLayout: picker ?? 'popup',
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
