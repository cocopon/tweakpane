import {BindingTarget} from '../../../common/binding/target';
import {TpError} from '../../../common/tp-error';
import {createController} from '../../../input-binding/plugin';
import {isEmpty} from '../../../misc/type-util';
import {InputBindingController} from '../controller/input-binding';
import {Plugins} from './plugins';
import {InputParams} from './types';

/**
 * @hidden
 */
export function createInputBindingController(
	document: Document,
	target: BindingTarget,
	params: InputParams,
): InputBindingController<unknown> {
	const initialValue = target.read();

	if (isEmpty(initialValue)) {
		throw new TpError({
			context: {
				key: target.key,
			},
			type: 'nomatchingcontroller',
		});
	}

	const bc = Plugins.inputs.reduce(
		(result: InputBindingController<unknown> | null, plugin) =>
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

	throw new TpError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
