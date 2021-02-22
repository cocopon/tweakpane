import {isEmpty} from '../misc/type-util';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {Target} from '../plugin/common/model/target';
import {PaneError} from '../plugin/common/pane-error';
import {createController} from '../plugin/monitor-binding';
import {Plugins} from './plugins';
import {MonitorParams} from './types';

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function createMonitorBindingController(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<unknown> {
	const initialValue = target.read();

	if (isEmpty(initialValue)) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	const bc = Plugins.monitors.reduce(
		(result: MonitorBindingController<unknown> | null, plugin) =>
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
