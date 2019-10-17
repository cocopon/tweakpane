import PaneError from '../../misc/pane-error';
import Color from '../../model/color';
import Point2d, {Point2dObject} from '../../model/point-2d';
import Target from '../../model/target';
import {InputParams} from '../ui';
import * as BooleanInputBindingControllerCreators from './boolean-input';
import * as ColorInputBindingControllerCreators from './color-input';
import * as NumberInputBindingControllerCreators from './number-input';
import * as Point2dInputBindingControllerCreators from './point-2d-input';
import * as StringInputBindingControllerCreators from './string-input';

export type InputtableInType = boolean | number | string | Color | Point2d;
export type InputtableOutType = boolean | number | string | Point2dObject;

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
) {
	const initialValue = target.read();

	if (initialValue === null || initialValue === undefined) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	{
		const ibc = BooleanInputBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (ibc) {
			return ibc;
		}
	}
	{
		const ibc = NumberInputBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (ibc) {
			return ibc;
		}
	}
	{
		const ibc = ColorInputBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (ibc) {
			return ibc;
		}
	}
	{
		const ibc = StringInputBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (ibc) {
			return ibc;
		}
	}

	{
		const ibc = Point2dInputBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (ibc) {
			return ibc;
		}
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
