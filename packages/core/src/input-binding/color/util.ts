import {ColorInputParams} from '../../blade/common/api/params.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {parsePickerLayout} from '../../common/picker-util.js';
import {ColorType} from './model/color-model.js';

function parseColorType(value: unknown): ColorType | undefined {
	return value === 'int' ? 'int' : value === 'float' ? 'float' : undefined;
}

export function parseColorInputParams(
	params: Record<string, unknown>,
): ColorInputParams | undefined {
	return parseRecord<ColorInputParams>(params, (p) => ({
		color: p.optional.object({
			alpha: p.optional.boolean,
			type: p.optional.custom(parseColorType),
		}),
		expanded: p.optional.boolean,
		picker: p.optional.custom(parsePickerLayout),
		readonly: p.optional.constant(false),
	}));
}

export function getKeyScaleForColor(forAlpha: boolean): number {
	return forAlpha ? 0.1 : 1;
}

export function extractColorType(
	params: ColorInputParams,
): ColorType | undefined {
	return params.color?.type;
}
