import {Emitter} from '../../../common/model/emitter';
import {TpError} from '../../../common/tp-error';
import {forceCast} from '../../../misc/type-util';
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
import {
	TpChangeEvent,
	TpFoldEvent,
	TpUpdateEvent,
} from '../../common/api/tp-event';
import {
	BladeParams,
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from '../../common/api/types';
import {createBindingTarget} from '../../common/api/util';
import {BladeRackEvents} from '../../common/model/blade-rack';
import {NestedOrderedSet} from '../../common/model/nested-ordered-set';
import {SeparatorApi} from '../../separator/api/separator';
import {FolderController} from '../controller/folder';
import {FolderEvents} from '../model/folder';

interface FolderApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
	fold: {
		event: TpFoldEvent;
	};
	update: {
		event: TpUpdateEvent<unknown>;
	};
}

export class FolderApi implements BladeContainerApi {
	/**
	 * @hidden
	 */
	public readonly controller_: FolderController;
	private readonly emitter_: Emitter<FolderApiEvents>;
	private apiSet_: NestedOrderedSet<BladeApi>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);
		this.onRackInputChange_ = this.onRackInputChange_.bind(this);
		this.onRackFolderFold_ = this.onRackFolderFold_.bind(this);
		this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);

		this.controller_ = controller;

		this.emitter_ = new Emitter();

		this.apiSet_ = new NestedOrderedSet((api) =>
			api instanceof FolderApi ? api.apiSet_ : null,
		);

		this.controller_.folder.emitter.on('change', this.onFolderChange_);

		const rack = this.controller_.bladeRack;
		rack.emitter.on('remove', this.onRackRemove_);
		rack.emitter.on('inputchange', this.onRackInputChange_);
		rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
		rack.emitter.on('folderfold', this.onRackFolderFold_);
	}

	get expanded(): boolean {
		return this.controller_.folder.expanded;
	}

	set expanded(expanded: boolean) {
		this.controller_.folder.expanded = expanded;
	}

	get title(): string | undefined {
		return this.controller_.props.get('title');
	}

	set title(title: string | undefined) {
		this.controller_.props.set('title', title);
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	get children(): BladeApi[] {
		return this.controller_.bladeRack.children.map((bc) => {
			const api = this.apiSet_.find((api) => api.controller_ === bc);
			/* istanbul ignore next */
			if (api === null) {
				throw TpError.shouldNeverHappen();
			}
			return api;
		});
	}

	public dispose(): void {
		this.controller_.blade.dispose();
	}

	public addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		const params = opt_params || {};
		const bc = createInputBindingController(
			this.controller_.document,
			createBindingTarget(object, key, params.presetKey),
			params,
		);
		this.controller_.bladeRack.add(bc, params.index);

		const api = new InputBindingApi(bc);
		this.apiSet_.add(api);
		return api;
	}

	public addMonitor<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]> {
		const params = opt_params || {};
		const bc = createMonitorBindingController(
			this.controller_.document,
			createBindingTarget(object, key),
			params,
		);
		this.controller_.bladeRack.add(bc, params.index);

		const api = new MonitorBindingApi(bc);
		this.apiSet_.add(api);
		return forceCast(api);
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

	public remove(api: BladeApi): void {
		this.controller_.bladeRack.remove(api.controller_);
	}

	/**
	 * @hidden
	 */
	public addBlade_v3_(opt_params?: BladeParams): BladeApi {
		const params = opt_params ?? {};
		const api = createBladeApi(this.controller_.document, params);
		this.controller_.bladeRack.add(api.controller_, params.index);
		this.apiSet_.add(api);
		return api;
	}

	/**
	 * Adds a global event listener. It handles all events of child inputs/monitors.
	 * @param eventName The event name to listen.
	 * @return The API object itself.
	 */
	public on<EventName extends keyof FolderApiEvents>(
		eventName: EventName,
		handler: (ev: FolderApiEvents[EventName]['event']) => void,
	): FolderApi {
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

	private onRackFolderFold_(ev: BladeRackEvents['folderfold']) {
		const api = this.apiSet_.find((api) =>
			api instanceof FolderApi
				? api.controller_ === ev.folderController
				: false,
		);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}

		this.emitter_.emit('fold', {
			event: new TpFoldEvent(api, ev.folderController.folder.expanded),
		});
	}

	private onFolderChange_(ev: FolderEvents['change']) {
		if (ev.propertyName !== 'expanded') {
			return;
		}

		this.emitter_.emit('fold', {
			event: new TpFoldEvent(this, ev.sender.expanded),
		});
	}
}
