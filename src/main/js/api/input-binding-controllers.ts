import {PaneError} from '../misc/pane-error';
import {TypeUtil} from '../misc/type-util';
import {Color, RgbaColorObject} from '../model/color';
import {Point2d, Point2dObject} from '../model/point-2d';
import {Target} from '../model/target';
import {createController, InputBindingPlugin} from '../plugin/input-binding';
import {BooleanInputPlugin} from '../plugin/input-bindings/boolean';
import {NumberColorInputPlugin} from '../plugin/input-bindings/color-number';
import {ObjectColorInputPlugin} from '../plugin/input-bindings/color-object';
import {StringColorInputPlugin} from '../plugin/input-bindings/color-string';
import {NumberInputPlugin} from '../plugin/input-bindings/number';
import {Point2dInputPlugin} from '../plugin/input-bindings/point-2d';
import {StringInputPlugin} from '../plugin/input-bindings/string';
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
