import {Emitter} from '../../../common/model/emitter';
import {TpError} from '../../../common/tp-error';
import {View} from '../../../common/view/view';
import {forceCast} from '../../../misc/type-util';
import {BladeRackEvents} from '../../blade-rack/model/blade-rack';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {createBladeApi} from '../../common/api/blade-apis';
import {
	addButtonAsBlade,
	addFolderAsBlade,
	addSeparatorAsBlade,
	BladeContainerApi,
} from '../../common/api/blade-container';
import {InputBindingApi} from '../../common/api/input-binding';
import {createInputBindingController} from '../../common/api/input-binding-controllers';
import {MonitorBindingApi} from '../../common/api/monitor-binding';
import {createMonitorBindingController} from '../../common/api/monitor-binding-controllers';
import {TpChangeEvent, TpUpdateEvent} from '../../common/api/tp-event';
import {
	BladeParams,
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from '../../common/api/types';
import {createBindingTarget} from '../../common/api/util';
import {BladeController} from '../../common/controller/blade';
import {NestedOrderedSet} from '../../common/model/nested-ordered-set';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {BladeRackController} from '../controller/blade-rack';

interface BladeRackApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
	update: {
		event: TpUpdateEvent<unknown>;
	};
}

/**
 * @hidden
 */
export class BladeRackApi extends BladeApi<BladeRackController>
	implements BladeContainerApi {
	private readonly emitter_: Emitter<BladeRackApiEvents>;
	private apiSet_: NestedOrderedSet<BladeApi<BladeController<View>>>;

	/**
	 * @hidden
	 */
	constructor(controller: BladeRackController) {
		super(controller);

		this.onRackRemove_ = this.onRackRemove_.bind(this);
		this.onRackInputChange_ = this.onRackInputChange_.bind(this);
		this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);

		this.emitter_ = new Emitter();

		this.apiSet_ = new NestedOrderedSet((api) =>
			api instanceof FolderApi ? api['rackApi_']['apiSet_'] : null,
		);

		const rack = this.controller_.rack;
		rack.emitter.on('remove', this.onRackRemove_);
		rack.emitter.on('inputchange', this.onRackInputChange_);
		rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
	}

	get children(): BladeApi<BladeController<View>>[] {
		return this.controller_.rack.children.map((bc) => {
			const api = this.apiSet_.find((api) => api.controller_ === bc);
			/* istanbul ignore next */
			if (api === null) {
				throw TpError.shouldNeverHappen();
			}
			return api;
		});
	}

	public addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		const params = opt_params || {};
		const doc = this.controller_.view.element.ownerDocument;
		const bc = createInputBindingController(
			doc,
			createBindingTarget(object, key, params.presetKey),
			params,
		);
		const api = new InputBindingApi(bc);
		return this.add(api, params.index);
	}

	public addMonitor<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]> {
		const params = opt_params || {};
		const doc = this.controller_.view.element.ownerDocument;
		const bc = createMonitorBindingController(
			doc,
			createBindingTarget(object, key),
			params,
		);
		const api = new MonitorBindingApi(bc);
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

	public add<A extends BladeApi<BladeController<View>>>(
		api: A,
		opt_index?: number,
	): A {
		this.controller_.rack.add(api.controller_, opt_index);
		this.apiSet_.add(api);
		return api;
	}

	public remove(api: BladeApi<BladeController<View>>): void {
		this.controller_.rack.remove(api.controller_);
	}

	public addBlade_v3_(
		opt_params?: BladeParams,
	): BladeApi<BladeController<View>> {
		const params = opt_params ?? {};
		const doc = this.controller_.view.element.ownerDocument;
		const api = createBladeApi(doc, params);
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

	private onRackRemove_(ev: BladeRackEvents['remove']) {
		const api = this.apiSet_.find(
			(api) => api.controller_ === ev.bladeController,
		);
		if (api) {
			this.apiSet_.remove(api);
		}
	}

	private onRackInputChange_(ev: BladeRackEvents['inputchange']) {
		const api = this.apiSet_.find((api) =>
			api instanceof InputBindingApi
				? api.controller_ === ev.bindingController
				: false,
		);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}

		const binding = ev.bindingController.binding;
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				api,
				forceCast(binding.target.read()),
				binding.target.presetKey,
			),
		});
	}

	private onRackMonitorUpdate_(ev: BladeRackEvents['monitorupdate']) {
		const api = this.apiSet_.find((api) =>
			api instanceof MonitorBindingApi
				? api.controller_ === ev.bindingController
				: false,
		);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}

		const binding = ev.bindingController.binding;
		this.emitter_.emit('update', {
			event: new TpUpdateEvent(
				api,
				forceCast(binding.target.read()),
				binding.target.presetKey,
			),
		});
	}
}
