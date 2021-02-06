import {PaneError} from '../misc/pane-error';
import {TypeUtil} from '../misc/type-util';
import {Target} from '../model/target';
import {
	createController,
	MonitorBindingPlugin,
} from '../plugin/monitor-binding';
import {BooleanMonitorPlugin} from '../plugin/monitor-bindings/boolean';
import {NumberMonitorPlugin} from '../plugin/monitor-bindings/number';
import {StringMonitorPlugin} from '../plugin/monitor-bindings/string';
import {MonitorParams} from './types';

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: MonitorParams,
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
		NumberMonitorPlugin,
		StringMonitorPlugin,
		BooleanMonitorPlugin,
	].reduce(
		(result, plugin: MonitorBindingPlugin<any, any>) =>
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
