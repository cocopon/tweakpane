import {InputParams} from '../../api/types';
import {PaneError} from '../../misc/pane-error';
import {TypeUtil} from '../../misc/type-util';
import {Color, RgbColorObject} from '../../model/color';
import {Point2d, Point2dObject} from '../../model/point-2d';
import {Target} from '../../model/target';
import * as BooleanInputBindingControllerCreators from './boolean-input';
import * as ColorInputBindingControllerCreators from './color-input';
import * as NumberInputBindingControllerCreators from './number-input';
import * as Point2dInputBindingControllerCreators from './point-2d-input';
import * as StringInputBindingControllerCreators from './string-input';

export type InputtableInType = boolean | number | string | Color | Point2d;
export type InputtableOutType =
	| boolean
	| number
	| string
	| Point2dObject
	| RgbColorObject;

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
) {
	const initialValue = target.read();

	if (TypeUtil.isEmpty(initialValue)) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	const bc = [
		BooleanInputBindingControllerCreators.create,
		ColorInputBindingControllerCreators.createWithNumber,
		ColorInputBindingControllerCreators.createWithObject,
		ColorInputBindingControllerCreators.createWithString,
		NumberInputBindingControllerCreators.create,
		StringInputBindingControllerCreators.create,
		Point2dInputBindingControllerCreators.create,
	].reduce(
		(result, createBindingController) =>
			result || createBindingController(document, target, params),
		null,
	);
	if (bc) {
		return bc;
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
