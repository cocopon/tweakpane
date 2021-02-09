import {PaneError} from '../misc/pane-error';
import {TypeUtil} from '../misc/type-util';
import {Color, RgbaColorObject} from '../model/color';
import {Point2d, Point2dObject} from '../model/point-2d';
import {Target} from '../model/target';
import {createController} from '../plugin/input-binding';
import {Plugins} from './plugins';
import {InputParams} from './types';

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

	const bc = Plugins.inputs.reduce(
		(result, plugin) =>
			result ||
			createController(plugin, {
				document: document,
				target: target,
				params: params,
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
