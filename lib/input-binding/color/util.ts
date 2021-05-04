import {BaseInputParams, PickerLayout} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {parsePickerLayout} from '../../common/util';

export interface ColorInputParams extends BaseInputParams {
	alpha?: boolean;
	expanded?: boolean;
	picker?: PickerLayout;
}

export function parseColorInputParams(
	params: Record<string, unknown>,
): ColorInputParams | undefined {
	const p = ParamsParsers;
	return parseParams<ColorInputParams>(params, {
		alpha: p.optional.boolean,
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
