import {BindingTarget} from '../../../common/binding/target';
import {TpError} from '../../../common/tp-error';
import {createController} from '../../../monitor-binding/plugin';
import {MonitorBindingController} from '../controller/monitor-binding';
import {Plugins} from './plugins';
import {MonitorParams} from './types';

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function createMonitorBindingController(
	document: Document,
	target: BindingTarget,
	params: MonitorParams,
): MonitorBindingController<unknown> {
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

	throw new TpError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
