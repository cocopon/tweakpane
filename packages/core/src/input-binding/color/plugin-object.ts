import {ColorInputParams} from '../../blade/common/api/params.js';
import {BindingReader} from '../../common/binding/binding.js';
import {Formatter} from '../../common/converter/formatter.js';
import {createPlugin} from '../../plugin/plugin.js';
import {InputBindingPlugin} from '../plugin.js';
import {ColorController} from './controller/color.js';
import {colorFromObject} from './converter/color-object.js';
import {
	colorToObjectRgbaString,
	colorToObjectRgbString,
	createColorStringParser,
} from './converter/color-string.js';
import {createColorObjectWriter} from './converter/writer.js';
import {
	Color,
	equalsColor,
	isColorObject,
	isRgbaColorObject,
	RgbaColorObject,
	RgbColorObject,
} from './model/color.js';
import {ColorType} from './model/color-model.js';
import {mapColorType} from './model/colors.js';
import {IntColor} from './model/int-color.js';
import {extractColorType, parseColorInputParams} from './util.js';

function shouldSupportAlpha(
	initialValue: RgbColorObject | RgbaColorObject,
): boolean {
	return isRgbaColorObject(initialValue);
}

function createColorObjectBindingReader(
	type: ColorType,
): BindingReader<IntColor> {
	return (value) => {
		const c = colorFromObject(value, type);
		return mapColorType(c, 'int');
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

interface ObjectColorInputParams extends ColorInputParams {
	colorType: ColorType;
}

/**
 * @hidden
 */
export const ObjectColorInputPlugin: InputBindingPlugin<
	IntColor,
	RgbColorObject | RgbaColorObject,
	ObjectColorInputParams
> = createPlugin({
	id: 'input-color-object',
	type: 'input',
	accept: (value, params) => {
		if (!isColorObject(value)) {
			return null;
		}
		const result = parseColorInputParams(params);
		return result
			? {
					initialValue: value,
					params: {
						...result,
						colorType: extractColorType(params) ?? 'int',
					},
			  }
			: null;
	},
	binding: {
		reader: (args) => createColorObjectBindingReader(args.params.colorType),
		equals: equalsColor,
		writer: (args) =>
			createColorObjectWriter(
				shouldSupportAlpha(args.initialValue),
				args.params.colorType,
			),
	},
	controller: (args) => {
		const supportsAlpha = isRgbaColorObject(args.initialValue);
		return new ColorController(args.document, {
			colorType: args.params.colorType,
			expanded: args.params.expanded ?? false,
			formatter: createColorObjectFormatter(
				supportsAlpha,
				args.params.colorType,
			),
			parser: createColorStringParser('int'),
			pickerLayout: args.params.picker ?? 'popup',
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
