import {forceCast} from '../../../../misc/type-util';
import {Emitter} from '../../../common/model/emitter';
import {TpError} from '../../../common/tp-error';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {createBladeApi} from '../../common/api/blade-apis';
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

export interface FolderApiEvents<Ex> {
	change: {
		event: TpChangeEvent<Ex>;
	};
	fold: {
		event: TpFoldEvent;
	};
	update: {
		event: TpUpdateEvent<Ex>;
	};
}

export class FolderApi implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller_: FolderController;
	private readonly emitter_: Emitter<FolderApiEvents<unknown>>;
	private apiSet_: NestedOrderedSet<BladeApi>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);
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

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
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
		return this.addBlade_v3_({
			...params,
			view: 'folder',
		}) as FolderApi;
	}

	public addButton(params: ButtonParams): ButtonApi {
		return this.addBlade_v3_({
			...params,
			view: 'button',
		}) as ButtonApi;
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		return this.addBlade_v3_({
			...params,
			view: 'separator',
		});
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
	public on<EventName extends keyof FolderApiEvents<unknown>>(
		eventName: EventName,
		handler: (ev: FolderApiEvents<unknown>[EventName]['event']) => void,
	): FolderApi {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
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
