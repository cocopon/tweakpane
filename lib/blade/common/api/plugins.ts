import {BindingTarget} from '../../../common/binding/target';
import {TpError} from '../../../common/tp-error';
import {View} from '../../../common/view/view';
import {
	createInputBindingController,
	InputBindingPlugin,
} from '../../../input-binding/plugin';
import {isEmpty} from '../../../misc/type-util';
import {
	createMonitorBindingController,
	MonitorBindingPlugin,
} from '../../../monitor-binding/plugin';
import {BasePlugin} from '../../../plugin';
import {InputBindingController} from '../../input-binding/controller/input-binding';
import {MonitorBindingController} from '../../monitor-binding/controller/monitor-binding';
import {BladePlugin, createApi} from '../../plugin';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';
import {InputParams, MonitorParams} from './types';

export const Plugins: {
	blades: BladePlugin<any>[];
	inputs: InputBindingPlugin<any, any>[];
	monitors: MonitorBindingPlugin<any>[];
} = {
	blades: [],
	inputs: [],
	monitors: [],
};

export function getAllPlugins(): BasePlugin[] {
	return [...Plugins.blades, ...Plugins.inputs, ...Plugins.monitors];
}

/**
 * @hidden
 */
export function createInput(
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
			createInputBindingController(plugin, {
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

/**
 * @hidden
 */
export function createMonitor(
	document: Document,
	target: BindingTarget,
	params: MonitorParams,
): MonitorBindingController<unknown> {
	const bc = Plugins.monitors.reduce(
		(result: MonitorBindingController<unknown> | null, plugin) =>
			result ||
			createMonitorBindingController(plugin, {
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

export function createBlade(
	document: Document,
	params: Record<string, unknown>,
): BladeApi<BladeController<View>> {
	const api = Plugins.blades.reduce(
		(result: BladeApi<BladeController<View>> | null, plugin) =>
			result ||
			createApi(plugin, {
				document: document,
				params: params,
			}),
		null,
	);
	if (!api) {
		throw new TpError({
			type: 'nomatchingview',
			context: {
				params: params,
			},
		});
	}
	return api;
}
