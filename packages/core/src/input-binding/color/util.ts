import {BaseInputParams, PickerLayout} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {parsePickerLayout} from '../../common/util';
import {ColorType} from './model/color-model';

export interface ColorInputParams extends BaseInputParams {
	/**
	 * @deprecated Use color.alpha instead.
	 */
	alpha?: boolean;
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
	const p = ParamsParsers;
	return parseParams<ColorInputParams>(params, {
		alpha: p.optional.boolean,
		color: p.optional.object({
			alpha: p.optional.boolean,
			type: p.optional.custom(parseColorType),
		}),
		expanded: p.optional.boolean,
		picker: p.optional.custom(parsePickerLayout),
	});
}

/**
 * @hidden
 */
export function getBaseStepForColor(forAlpha: boolean): number {
	return forAlpha ? 0.1 : 1;
}

/**
 * @hidden
 */
export function extractColorType(
	params: ColorInputParams,
): ColorType | undefined {
	return params.color?.type;
}
