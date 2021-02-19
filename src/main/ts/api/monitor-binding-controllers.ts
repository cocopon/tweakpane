import {MonitorBindingController} from '../controller/monitor-binding';
import {PaneError} from '../misc/pane-error';
import {TypeUtil} from '../misc/type-util';
import {Target} from '../model/target';
import {createController} from '../plugin/monitor-binding';
import {Plugins} from './plugins';
import {MonitorParams} from './types';

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<unknown> {
	const initialValue = target.read();

	if (TypeUtil.isEmpty(initialValue)) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	const bc = Plugins.monitors.reduce(
		(result, plugin) =>
			result ||
			createController(plugin, {
				document: document,
				params: params,
				target: target,
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
