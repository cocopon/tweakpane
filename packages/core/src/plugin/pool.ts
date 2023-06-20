import {BindingApi} from '../blade/binding/api/binding.js';
import {InputBindingApi} from '../blade/binding/api/input-binding.js';
import {MonitorBindingApi} from '../blade/binding/api/monitor-binding.js';
import {
	BindingController,
	isBindingController,
} from '../blade/binding/controller/binding.js';
import {
	InputBindingController,
	isInputBindingController,
} from '../blade/binding/controller/input-binding.js';
import {
	isMonitorBindingController,
	MonitorBindingController,
} from '../blade/binding/controller/monitor-binding.js';
import {BladeApi} from '../blade/common/api/blade.js';
import {BindingParams} from '../blade/common/api/params.js';
import {BladeController} from '../blade/common/controller/blade.js';
import {BladePlugin, createBladeController} from '../blade/plugin.js';
import {BindingTarget} from '../common/binding/target.js';
import {isCompatible} from '../common/compat.js';
import {TpBuffer} from '../common/model/buffered-value.js';
import {TpError} from '../common/tp-error.js';
import {
	createInputBindingController,
	InputBindingPlugin,
} from '../input-binding/plugin.js';
import {isEmpty} from '../misc/type-util.js';
import {
	createMonitorBindingController,
	MonitorBindingPlugin,
} from '../monitor-binding/plugin.js';
import {BladeApiCache} from './blade-api-cache.js';
import {TpPlugin} from './plugins.js';

/**
 * @hidden
 */
export class PluginPool {
	private readonly apiCache_: BladeApiCache;
	private readonly pluginsMap_: {
		blades: BladePlugin<any>[];
		inputs: InputBindingPlugin<any, any, any>[];
		monitors: MonitorBindingPlugin<any, any>[];
	} = {
		blades: [],
		inputs: [],
		monitors: [],
	};

	constructor(apiCache: BladeApiCache) {
		this.apiCache_ = apiCache;
	}

	public getAll(): TpPlugin[] {
		return [
			...this.pluginsMap_.blades,
			...this.pluginsMap_.inputs,
			...this.pluginsMap_.monitors,
		];
	}

	public register(bundleId: string, r: TpPlugin): void {
		if (!isCompatible(r.core)) {
			throw TpError.notCompatible(bundleId, r.id);
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
		return this.apiCache_.add(bc, api ?? new BindingApi(bc)) as InputBindingApi;
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
		return this.apiCache_.add(
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
		if (this.apiCache_.has(bc)) {
			return this.apiCache_.get(bc) as BindingApi;
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
		if (this.apiCache_.has(bc)) {
			return this.apiCache_.get(bc) as BladeApi;
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
		return this.apiCache_.add(bc, api);
	}
}
