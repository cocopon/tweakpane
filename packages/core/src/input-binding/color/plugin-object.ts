import {BindingReader} from '../../common/binding/binding';
import {Formatter} from '../../common/converter/formatter';
import {InputBindingPlugin} from '../plugin';
import {ColorController} from './controller/color';
import {colorFromObject} from './converter/color-number';
import {
	colorToObjectRgbaString,
	colorToObjectRgbString,
	createColorStringParser,
} from './converter/color-string';
import {createColorObjectWriter} from './converter/writer';
import {Color, RgbaColorObject, RgbColorObject} from './model/color';
import {ColorType} from './model/color-model';
import {
	ColorInputParams,
	extractColorType,
	parseColorInputParams,
} from './util';

function shouldSupportAlpha(
	initialValue: RgbColorObject | RgbaColorObject,
): boolean {
	return Color.isRgbaColorObject(initialValue);
}

function createColorObjectReader(
	opt_type: ColorType | undefined,
): BindingReader<Color> {
	return (value: unknown): Color => {
		return colorFromObject(value, opt_type);
	};
}

function createColorObjectFormatter(
	supportsAlpha: boolean,
	type: ColorType,
): Formatter<Color> {
	return (value) => {
		if (supportsAlpha) {
			return colorToObjectRgbaString(value, type);
		}
		return colorToObjectRgbString(value, type);
	};
}

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject,
	ColorInputParams
> = {
	id: 'input-color-object',
	type: 'input',
	accept: (value, params) => {
		if (!Color.isColorObject(value)) {
			return null;
		}
		const result = parseColorInputParams(params);
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (args) => createColorObjectReader(extractColorType(args.params)),
		equals: Color.equals,
		writer: (args) =>
			createColorObjectWriter(
				shouldSupportAlpha(args.initialValue),
				extractColorType(args.params),
			),
	},
	controller: (args) => {
		const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		const type = extractColorType(args.params) ?? 'int';
		return new ColorController(args.document, {
			colorType: type,
			expanded: expanded ?? false,
			formatter: createColorObjectFormatter(supportsAlpha, type),
			parser: createColorStringParser(type),
			pickerLayout: picker ?? 'popup',
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
