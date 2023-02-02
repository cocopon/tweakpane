import {Bindable, BindingTarget} from '../../../common/binding/target';
import {isBindingValue} from '../../../common/binding/value/binding';
import {TpBuffer} from '../../../common/model/buffered-value';
import {Emitter} from '../../../common/model/emitter';
import {Value} from '../../../common/model/value';
import {BaseBladeParams} from '../../../common/params';
import {TpError} from '../../../common/tp-error';
import {View} from '../../../common/view/view';
import {forceCast} from '../../../misc/type-util';
import {PluginPool} from '../../../plugin/pool';
import {BindingApi} from '../../binding/api/binding';
import {InputBindingApi} from '../../binding/api/input-binding';
import {MonitorBindingApi} from '../../binding/api/monitor-binding';
import {MonitorBindingController} from '../../binding/controller/monitor-binding';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {
	addButtonAsBlade,
	addFolderAsBlade,
	addSeparatorAsBlade,
	addTabAsBlade,
	BladeRackApi,
} from '../../common/api/blade-rack';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
	TabParams,
} from '../../common/api/params';
import {RackLikeApi} from '../../common/api/rack-like-api';
import {TpChangeEvent} from '../../common/api/tp-event';
import {BladeController} from '../../common/controller/blade';
import {ValueBladeController} from '../../common/controller/value-blade';
import {BladeRackEvents} from '../../common/model/blade-rack';
import {NestedOrderedSet} from '../../common/model/nested-ordered-set';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {RackController} from '../controller/rack';

export interface BladeRackApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
}

export function findSubBladeApiSet(
	api: BladeApi<BladeController<View>>,
): NestedOrderedSet<BladeApi<BladeController<View>>> | null {
	if (api instanceof RackApi) {
		return api['apiSet_'];
	}
	if (api instanceof RackLikeApi) {
		return api['rackApi_']['apiSet_'];
	}
	return null;
}

function getApiByController(
	apiSet: NestedOrderedSet<BladeApi<BladeController<View>>>,
	controller: BladeController<View>,
): BladeApi<BladeController<View>> {
	const api = apiSet.find((api) => api.controller_ === controller);
	/* istanbul ignore next */
	if (!api) {
		throw TpError.shouldNeverHappen();
	}
	return api;
}

function createBindingTarget<O extends Bindable, Key extends keyof O>(
	obj: O,
	key: Key,
	opt_id?: string,
): BindingTarget {
	if (!BindingTarget.isBindable(obj)) {
		throw TpError.notBindable();
	}
	return new BindingTarget(obj, key as string, opt_id);
}

export class RackApi extends BladeApi<RackController> implements BladeRackApi {
	private readonly emitter_: Emitter<BladeRackApiEvents>;
	private readonly apiSet_: NestedOrderedSet<BladeApi<BladeController<View>>>;
	private readonly pool_: PluginPool;

	/**
	 * @hidden
	 */
	constructor(controller: RackController, pool: PluginPool) {
		super(controller);

		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);
		this.onRackInputChange_ = this.onRackInputChange_.bind(this);

		this.emitter_ = new Emitter();
		this.apiSet_ = new NestedOrderedSet(findSubBladeApiSet);
		this.pool_ = pool;

		const rack = this.controller_.rack;
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('remove', this.onRackRemove_);
		rack.emitter.on('inputchange', this.onRackInputChange_);
		rack.children.forEach((bc) => {
			this.setUpApi_(bc);
		});
	}

	get children(): BladeApi<BladeController<View>>[] {
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
		const doc = this.controller_.view.element.ownerDocument;
		const bc = this.pool_.createInput(
			doc,
			createBindingTarget(object, key, params.presetKey),
			params,
		);
		const api = new BindingApi(bc);
		return this.add(api, params.index);
	}

	public addMonitor<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]> {
		const params = opt_params ?? {};
		const doc = this.controller_.view.element.ownerDocument;
		const bc = this.pool_.createMonitor(
			doc,
			createBindingTarget(object, key),
			params,
		);
		const api = new BindingApi<
			TpBuffer<unknown>,
			unknown,
			MonitorBindingController<unknown>
		>(bc);
		return forceCast(this.add(api, params.index));
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

	public add<A extends BladeApi<BladeController<View>>>(
		api: A,
		opt_index?: number,
	): A {
		this.controller_.rack.add(api.controller_, opt_index);

		// Replace generated API with specified one
		const gapi = this.apiSet_.find((a) => a.controller_ === api.controller_);
		if (gapi) {
			this.apiSet_.remove(gapi);
		}
		this.apiSet_.add(api);

		return api;
	}

	public remove(api: BladeApi<BladeController<View>>): void {
		this.controller_.rack.remove(api.controller_);
	}

	public addBlade(params: BaseBladeParams): BladeApi<BladeController<View>> {
		const doc = this.controller_.view.element.ownerDocument;
		const bc = this.pool_.createBlade(doc, params);
		const api = this.pool_.createBladeApi(bc);
		return this.add(api, params.index);
	}

	public on<EventName extends keyof BladeRackApiEvents>(
		eventName: EventName,
		handler: (ev: BladeRackApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	private setUpApi_(bc: BladeController<View>) {
		const api = this.apiSet_.find((api) => api.controller_ === bc);
		if (!api) {
			// Auto-fill missing API
			this.apiSet_.add(this.pool_.createBladeApi(bc));
		}
	}

	private onRackAdd_(ev: BladeRackEvents['add']) {
		this.setUpApi_(ev.bladeController);
	}

	private onRackRemove_(ev: BladeRackEvents['remove']) {
		if (ev.isRoot) {
			const api = getApiByController(this.apiSet_, ev.bladeController);
			this.apiSet_.remove(api);
		}
	}

	private onRackInputChange_(ev: BladeRackEvents['inputchange']) {
		const bc = ev.bladeController;
		const api = getApiByController(this.apiSet_, bc);
		const value: Value<unknown> =
			bc instanceof ValueBladeController ? bc.value : null;
		const binding = isBindingValue(value) ? value.binding : null;

		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				api,
				binding ? binding.target.read() : value.rawValue,
				binding ? binding.target.presetKey : undefined,
				ev.options.last,
			),
		});
	}
}
