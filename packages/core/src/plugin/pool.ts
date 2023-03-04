import {BindingApi} from '../blade/binding/api/binding';
import {InputBindingApi} from '../blade/binding/api/input-binding';
import {MonitorBindingApi} from '../blade/binding/api/monitor-binding';
import {
	BindingController,
	isBindingController,
} from '../blade/binding/controller/binding';
import {
	InputBindingController,
	isInputBindingController,
} from '../blade/binding/controller/input-binding';
import {
	isMonitorBindingController,
	MonitorBindingController,
} from '../blade/binding/controller/monitor-binding';
import {BladeApi} from '../blade/common/api/blade';
import {BindingParams} from '../blade/common/api/params';
import {BladeController} from '../blade/common/controller/blade';
import {BladePlugin, createBladeController} from '../blade/plugin';
import {BindingTarget} from '../common/binding/target';
import {TpBuffer} from '../common/model/buffered-value';
import {TpError} from '../common/tp-error';
import {isCompatible} from '../index';
import {
	createInputBindingController,
	InputBindingPlugin,
} from '../input-binding/plugin';
import {isEmpty} from '../misc/type-util';
import {
	createMonitorBindingController,
	MonitorBindingPlugin,
} from '../monitor-binding/plugin';
import {ApiCache} from './api-cache';
import {TpPlugin} from './plugins';

/**
 * @hidden
 */
export class PluginPool {
	private cache_: ApiCache;
	private readonly pluginsMap_: {
		blades: BladePlugin<any>[];
		inputs: InputBindingPlugin<any, any, any>[];
		monitors: MonitorBindingPlugin<any, any>[];
	} = {
		blades: [],
		inputs: [],
		monitors: [],
	};

	constructor() {
		this.cache_ = new ApiCache();
	}

	public getAll(): TpPlugin[] {
		return [
			...this.pluginsMap_.blades,
			...this.pluginsMap_.inputs,
			...this.pluginsMap_.monitors,
		];
	}

	public register(r: TpPlugin): void {
		if (!isCompatible(r.core)) {
			throw TpError.notCompatible(r.id);
		}

		if (r.type === 'blade') {
			this.pluginsMap_.blades.unshift(r);
		} else if (r.type === 'input') {
			this.pluginsMap_.inputs.unshift(r);
		} else if (r.type === 'monitor') {
			this.pluginsMap_.monitors.unshift(r);
		}
	}

	private createInput_(
		document: Document,
		target: BindingTarget,
		params: BindingParams,
	): InputBindingController | null {
		return this.pluginsMap_.inputs.reduce(
			(result: InputBindingController | null, plugin) =>
				result ??
				createInputBindingController(plugin, {
					document: document,
					target: target,
					params: params,
				}),
			null,
		);
	}

	private createMonitor_(
		document: Document,
		target: BindingTarget,
		params: BindingParams,
	): MonitorBindingController | null {
		return this.pluginsMap_.monitors.reduce(
			(result: MonitorBindingController | null, plugin) =>
				result ??
				createMonitorBindingController(plugin, {
					document: document,
					params: params,
					target: target,
				}),
			null,
		);
	}

	public createBinding(
		doc: Document,
		target: BindingTarget,
		params: BindingParams,
	): BindingController {
		const initialValue = target.read();
		if (isEmpty(initialValue)) {
			throw new TpError({
				context: {
					key: target.key,
				},
				type: 'nomatchingcontroller',
			});
		}

		const ic = this.createInput_(doc, target, params);
		if (ic) {
			return ic;
		}

		const mc = this.createMonitor_(doc, target, params);
		if (mc) {
			return mc as BindingController;
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
	): BladeController {
		const bc = this.pluginsMap_.blades.reduce(
			(result: BladeController | null, plugin) =>
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

	private createInputBindingApi_(bc: InputBindingController): InputBindingApi {
		const api = this.pluginsMap_.inputs.reduce(
			(result: InputBindingApi | null, plugin) => {
				if (result) {
					return result;
				}
				return (
					plugin.api?.({
						controller: bc as InputBindingController,
					}) ?? null
				);
			},
			null,
		);
		return this.cache_.add(bc, api ?? new BindingApi(bc)) as InputBindingApi;
	}

	private createMonitorBindingApi_(
		bc: MonitorBindingController,
	): MonitorBindingApi {
		const api = this.pluginsMap_.monitors.reduce(
			(result: MonitorBindingApi | null, plugin) => {
				if (result) {
					return result;
				}
				return (
					plugin.api?.({
						controller: bc as MonitorBindingController,
					}) ?? null
				);
			},
			null,
		);
		return this.cache_.add(
			bc,
			api ??
				new BindingApi<
					TpBuffer<unknown>,
					unknown,
					MonitorBindingController<unknown>
				>(bc),
		) as MonitorBindingApi;
	}

	public createBindingApi(bc: BindingController): BindingApi {
		if (this.cache_.has(bc)) {
			return this.cache_.get(bc) as BindingApi;
		}

		if (isInputBindingController(bc)) {
			return this.createInputBindingApi_(bc);
		}
		/* istanbul ignore else */
		if (isMonitorBindingController(bc)) {
			return this.createMonitorBindingApi_(bc) as BindingApi;
		}
		/* istanbul ignore next */
		throw TpError.shouldNeverHappen();
	}

	public createApi(bc: BladeController): BladeApi {
		if (this.cache_.has(bc)) {
			return this.cache_.get(bc) as BladeApi;
		}

		if (isBindingController(bc)) {
			return this.createBindingApi(bc);
		}

		const api = this.pluginsMap_.blades.reduce(
			(result: BladeApi | null, plugin) =>
				result ??
				plugin.api({
					controller: bc,
					pool: this,
				}),
			null,
		);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}
		return this.cache_.add(bc, api);
	}
}
