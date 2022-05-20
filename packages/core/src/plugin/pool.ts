import {BladeApi} from '../blade/common/api/blade';
import {InputParams, MonitorParams} from '../blade/common/api/params';
import {BladeController} from '../blade/common/controller/blade';
import {InputBindingApi} from '../blade/input-binding/api/input-binding';
import {InputBindingController} from '../blade/input-binding/controller/input-binding';
import {MonitorBindingApi} from '../blade/monitor-binding/api/monitor-binding';
import {MonitorBindingController} from '../blade/monitor-binding/controller/monitor-binding';
import {BladePlugin, createBladeController} from '../blade/plugin';
import {RackApi} from '../blade/rack/api/rack';
import {RackController} from '../blade/rack/controller/rack';
import {BindingTarget} from '../common/binding/target';
import {TpError} from '../common/tp-error';
import {View} from '../common/view/view';
import {
	createInputBindingController,
	InputBindingPlugin,
} from '../input-binding/plugin';
import {isEmpty} from '../misc/type-util';
import {
	createMonitorBindingController,
	MonitorBindingPlugin,
} from '../monitor-binding/plugin';
import {TpPlugin} from './plugins';

/**
 * @hidden
 */
export class PluginPool {
	private readonly pluginsMap_: {
		blades: BladePlugin<any>[];
		inputs: InputBindingPlugin<any, any, any>[];
		monitors: MonitorBindingPlugin<any, any>[];
	} = {
		blades: [],
		inputs: [],
		monitors: [],
	};

	public getAll(): TpPlugin[] {
		return [
			...this.pluginsMap_.blades,
			...this.pluginsMap_.inputs,
			...this.pluginsMap_.monitors,
		];
	}

	public register(r: TpPlugin): void {
		if (r.type === 'blade') {
			this.pluginsMap_.blades.unshift(r);
		} else if (r.type === 'input') {
			this.pluginsMap_.inputs.unshift(r);
		} else if (r.type === 'monitor') {
			this.pluginsMap_.monitors.unshift(r);
		}
	}

	public createInput(
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

		const bc = this.pluginsMap_.inputs.reduce(
			(result: InputBindingController<unknown> | null, plugin) =>
				result ??
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

	public createMonitor(
		document: Document,
		target: BindingTarget,
		params: MonitorParams,
	): MonitorBindingController<unknown> {
		const bc = this.pluginsMap_.monitors.reduce(
			(result: MonitorBindingController<unknown> | null, plugin) =>
				result ??
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

	public createBlade(
		document: Document,
		params: Record<string, unknown>,
	): BladeController<View> {
		const bc = this.pluginsMap_.blades.reduce(
			(result: BladeController<View> | null, plugin) =>
				result ??
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

	public createBladeApi(
		bc: BladeController<View>,
	): BladeApi<BladeController<View>> {
		if (bc instanceof InputBindingController) {
			return new InputBindingApi(bc);
		}
		if (bc instanceof MonitorBindingController) {
			return new MonitorBindingApi(bc);
		}
		if (bc instanceof RackController) {
			return new RackApi(bc, this);
		}

		const api = this.pluginsMap_.blades.reduce(
			(result: BladeApi<BladeController<View>> | null, plugin) =>
				result ??
				plugin.api({
					controller: bc,
					pool: this,
				}),
			null,
		);
		if (!api) {
			throw TpError.shouldNeverHappen();
		}
		return api;
	}
}
