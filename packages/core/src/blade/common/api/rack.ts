import {Bindable, BindingTarget} from '../../../common/binding/target';
import {isBindingValue} from '../../../common/binding/value/binding';
import {Emitter} from '../../../common/model/emitter';
import {BaseBladeParams} from '../../../common/params';
import {TpError} from '../../../common/tp-error';
import {PluginPool} from '../../../plugin/pool';
import {InputBindingApi} from '../../binding/api/input-binding';
import {MonitorBindingApi} from '../../binding/api/monitor-binding';
import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {BladeController} from '../controller/blade';
import {RackController} from '../controller/rack';
import {NestedOrderedSet} from '../model/nested-ordered-set';
import {RackEvents} from '../model/rack';
import {BladeApi} from './blade';
import {
	addButtonAsBlade,
	addFolderAsBlade,
	addSeparatorAsBlade,
	addTabAsBlade,
	ContainerApi,
} from './container';
import {isContainerBladeApi} from './container-blade';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
	TabParams,
} from './params';
import {TpChangeEvent} from './tp-event';

export interface RackApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
}

function findSubBladeApiSet(api: BladeApi): NestedOrderedSet<BladeApi> | null {
	return isContainerBladeApi(api) ? api['rackApi_']['apiSet_'] : null;
}

function getApiByController(
	apiSet: NestedOrderedSet<BladeApi>,
	controller: BladeController,
): BladeApi {
	const api = apiSet.find((api) => api['controller_'] === controller);
	/* istanbul ignore next */
	if (!api) {
		throw TpError.shouldNeverHappen();
	}
	return api;
}

function createBindingTarget<O extends Bindable, Key extends keyof O>(
	obj: O,
	key: Key,
): BindingTarget {
	if (!BindingTarget.isBindable(obj)) {
		throw TpError.notBindable();
	}
	return new BindingTarget(obj, key as string);
}

export class RackApi implements ContainerApi {
	private readonly controller_: RackController;
	private readonly emitter_: Emitter<RackApiEvents>;
	private readonly apiSet_: NestedOrderedSet<BladeApi>;
	private readonly pool_: PluginPool;

	/**
	 * @hidden
	 */
	constructor(controller: RackController, pool: PluginPool) {
		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);
		this.onRackValueChange_ = this.onRackValueChange_.bind(this);

		this.controller_ = controller;
		this.emitter_ = new Emitter();
		this.apiSet_ = new NestedOrderedSet(findSubBladeApiSet);
		this.pool_ = pool;

		const rack = this.controller_.rack;
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('remove', this.onRackRemove_);
		rack.emitter.on('valuechange', this.onRackValueChange_);
		rack.children.forEach((bc) => {
			this.setUpApi_(bc);
		});
	}

	get children(): BladeApi[] {
		return this.controller_.rack.children.map((bc) =>
			getApiByController(this.apiSet_, bc),
		);
	}

	public addInput<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		const params = opt_params ?? {};
		const doc = this.controller_.element.ownerDocument;
		const bc = this.pool_.createInput(
			doc,
			createBindingTarget(object, key),
			params,
		);
		const api = this.pool_.createInputBindingApi(bc);
		return this.add(api, params.index);
	}

	public addMonitor<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]> {
		const params = opt_params ?? {};
		const doc = this.controller_.element.ownerDocument;
		const bc = this.pool_.createMonitor(
			doc,
			createBindingTarget(object, key),
			params,
		);
		const api = this.pool_.createMonitorBindingApi(bc) as MonitorBindingApi<
			O[Key]
		>;
		return this.add(api, params.index);
	}

	public addFolder(params: FolderParams): FolderApi {
		return addFolderAsBlade(this, params);
	}

	public addButton(params: ButtonParams): ButtonApi {
		return addButtonAsBlade(this, params);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		return addSeparatorAsBlade(this, opt_params);
	}

	public addTab(params: TabParams): TabApi {
		return addTabAsBlade(this, params);
	}

	public add<A extends BladeApi>(api: A, opt_index?: number): A {
		this.controller_.rack.add(api['controller_'], opt_index);

		// Replace generated API with specified one
		const gapi = this.apiSet_.find(
			(a) => a['controller_'] === api['controller_'],
		);
		if (gapi) {
			this.apiSet_.remove(gapi);
		}
		this.apiSet_.add(api);

		return api;
	}

	public remove(api: BladeApi): void {
		this.controller_.rack.remove(api['controller_']);
	}

	public addBlade(params: BaseBladeParams): BladeApi {
		const doc = this.controller_.element.ownerDocument;
		const bc = this.pool_.createBlade(doc, params);
		const api = this.pool_.createBladeApi(bc);
		return this.add(api, params.index);
	}

	public on<EventName extends keyof RackApiEvents>(
		eventName: EventName,
		handler: (ev: RackApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	/**
	 * Sets up an API for the controller if not exists.
	 * Used, for example, when initializing a container controller with child controllers.
	 * @param bc The controller.
	 */
	private setUpApi_(bc: BladeController): void {
		const api = this.apiSet_.find((api) => api['controller_'] === bc);
		if (!api) {
			// Auto-fill missing API
			this.apiSet_.add(this.pool_.createBladeApi(bc));
		}
	}

	private onRackAdd_(ev: RackEvents['add']) {
		this.setUpApi_(ev.bladeController);
	}

	private onRackRemove_(ev: RackEvents['remove']) {
		if (ev.isRoot) {
			const api = getApiByController(this.apiSet_, ev.bladeController);
			this.apiSet_.remove(api);
		}
	}

	private onRackValueChange_(ev: RackEvents['valuechange']) {
		const bc = ev.bladeController;
		const api = getApiByController(this.apiSet_, bc);
		const binding = isBindingValue(bc.value) ? bc.value.binding : null;

		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				api,
				binding ? binding.target.read() : bc.value.rawValue,
				binding ? binding.presetKey : undefined,
				ev.options.last,
			),
		});
	}
}
