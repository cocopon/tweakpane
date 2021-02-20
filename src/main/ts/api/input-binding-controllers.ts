import {isEmpty} from '../misc/type-util';
import {InputBindingController} from '../plugin/common/controller/input-binding';
import {Target} from '../plugin/common/model/target';
import {PaneError} from '../plugin/common/pane-error';
import {createController} from '../plugin/input-binding';
import {Plugins} from './plugins';
import {InputParams} from './types';

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<unknown, unknown> {
	const initialValue = target.read();

	if (isEmpty(initialValue)) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	const bc = Plugins.inputs.reduce(
		(result: InputBindingController<unknown, unknown> | null, plugin) =>
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
