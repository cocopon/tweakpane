import {InputParams} from '../../api/types';
import {PaneError} from '../../misc/pane-error';
import {TypeUtil} from '../../misc/type-util';
import {Color, RgbaColorObject} from '../../model/color';
import {Point2d, Point2dObject} from '../../model/point-2d';
import {Target} from '../../model/target';
import {BooleanInputPlugin} from './boolean-input';
import {NumberColorInputPlugin} from './color-number-input';
import {ObjectColorInputPlugin} from './color-object-input';
import {StringColorInputPlugin} from './color-string-input';
import {createController, InputBindingPlugin} from './input-binding-plugin';
import {NumberInputPlugin} from './number-input';
import {Point2dInputPlugin} from './point-2d-input';
import {StringInputPlugin} from './string-input';

export type InputIn = boolean | number | string | Color | Point2d;
export type InputEx =
	| boolean
	| number
	| string
	| Point2dObject
	| RgbaColorObject;

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
		BooleanInputPlugin,
		NumberColorInputPlugin,
		ObjectColorInputPlugin,
		StringColorInputPlugin,
		NumberInputPlugin,
		StringInputPlugin,
		Point2dInputPlugin,
	].reduce(
		(result, plugin: InputBindingPlugin<any, any>) =>
			result ||
			createController(plugin, {
				document: document,
				target: target,
				inputParams: params,
			}),
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
