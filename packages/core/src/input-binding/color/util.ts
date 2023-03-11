import {parseRecord} from '../../common/micro-parsers';
import {BaseInputParams, PickerLayout} from '../../common/params';
import {parsePickerLayout} from '../../common/picker-util';
import {ColorType} from './model/color-model';

export interface ColorInputParams extends BaseInputParams {
	color?: {
		alpha?: boolean;
		type?: ColorType;
	};
	expanded?: boolean;
	picker?: PickerLayout;
}

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
