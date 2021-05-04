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
import {InputBindingApi} from '../../input-binding/api/input-binding';
import {InputBindingController} from '../../input-binding/controller/input-binding';
import {MonitorBindingApi} from '../../monitor-binding/api/monitor-binding';
import {MonitorBindingController} from '../../monitor-binding/controller/monitor-binding';
import {BladePlugin, createBladeController} from '../../plugin';
import {RackApi} from '../../rack/api/rack';
import {RackController} from '../../rack/controller/rack';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';
import {
	BaseInputParams,
	BaseMonitorParams,
	InputParams,
	MonitorParams,
} from './params';

export const Plugins: {
	blades: BladePlugin<any>[];
	inputs: InputBindingPlugin<any, any, BaseInputParams>[];
	monitors: MonitorBindingPlugin<any, BaseMonitorParams>[];
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
): BladeController<View> {
	const bc = Plugins.blades.reduce(
		(result: BladeController<View> | null, plugin) =>
			result ||
			createBladeController(plugin, {
				document: document,
				params: params,
			}),
		null,
	);
	if (!bc) {
		throw new TpError({
			type: 'nomatchingview',
			context: {
				params: params,
			},
		});
	}
	return bc;
}

export function createBladeApi(
	bc: BladeController<View>,
): BladeApi<BladeController<View>> {
	if (bc instanceof InputBindingController) {
		return new InputBindingApi(bc);
	}
	if (bc instanceof MonitorBindingController) {
		return new MonitorBindingApi(bc);
	}
	if (bc instanceof RackController) {
		return new RackApi(bc);
	}

	const api = Plugins.blades.reduce(
		(result: BladeApi<BladeController<View>> | null, plugin) =>
			result || plugin.api(bc),
		null,
	);
	if (!api) {
		throw TpError.shouldNeverHappen();
	}
	return api;
}
