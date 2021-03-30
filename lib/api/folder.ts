import {forceCast} from '../misc/type-util';
import {ButtonController} from '../plugin/blade/button/controller/button';
import {Blade} from '../plugin/blade/common/model/blade';
import {BladeRackEvents} from '../plugin/blade/common/model/blade-rack';
import {NestedOrderedSet} from '../plugin/blade/common/model/nested-ordered-set';
import {FolderController} from '../plugin/blade/folder/controller';
import {FolderEvents} from '../plugin/blade/folder/model/folder';
import {LabeledController} from '../plugin/blade/labeled/controller';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {Emitter} from '../plugin/common/model/emitter';
import {createViewProps} from '../plugin/common/model/view-props';
import {TpError} from '../plugin/common/tp-error';
import {BladeApi} from './blade-api';
import {createBladeApi} from './blade-apis';
import {ButtonApi} from './button';
import {InputBindingApi} from './input-binding';
import {createInputBindingController} from './input-binding-controllers';
import {MonitorBindingApi} from './monitor-binding';
import {createMonitorBindingController} from './monitor-binding-controllers';
import {SeparatorApi} from './separator';
import {TpChangeEvent, TpFoldEvent, TpUpdateEvent} from './tp-event';
import {
	BladeParams,
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from './types';
import {createBindingTarget} from './util';

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
	public readonly controller: FolderController;
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

		this.controller = controller;

		this.emitter_ = new Emitter();

		this.apiSet_ = new NestedOrderedSet((api) =>
			api instanceof FolderApi ? api.apiSet_ : null,
		);

		this.controller.folder.emitter.on('change', this.onFolderChange_);

		const rack = this.controller.bladeRack;
		rack.emitter.on('inputchange', this.onRackInputChange_);
		rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
		rack.emitter.on('folderfold', this.onRackFolderFold_);
	}

	get expanded(): boolean {
		return this.controller.folder.expanded;
	}

	set expanded(expanded: boolean) {
		this.controller.folder.expanded = expanded;
	}

	get hidden(): boolean {
		return this.controller.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller.blade.dispose();
	}

	public addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		const params = opt_params || {};
		const bc = createInputBindingController(
			this.controller.document,
			createBindingTarget(object, key, params.presetKey),
			params,
		);
		this.controller.bladeRack.add(bc, params.index);

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
			this.controller.document,
			createBindingTarget(object, key),
			params,
		);
		this.controller.bladeRack.add(bc, params.index);

		const api = new MonitorBindingApi(bc);
		this.apiSet_.add(api);
		return forceCast(api);
	}

	public addFolder(params: FolderParams): FolderApi {
		const bc = new FolderController(this.controller.document, {
			...params,
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		this.controller.bladeRack.add(bc, params.index);

		const api = new FolderApi(bc);
		this.apiSet_.add(api);
		return api;
	}

	public addButton(params: ButtonParams): ButtonApi {
		const doc = this.controller.document;
		const bc = new LabeledController(doc, {
			blade: new Blade(),
			label: params.label,
			valueController: new ButtonController(doc, {
				...params,
				viewProps: createViewProps({
					disabled: params.disabled,
				}),
			}),
		});
		this.controller.bladeRack.add(bc, params.index);

		const api = new ButtonApi(bc);
		this.apiSet_.add(api);
		return api;
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		const bc = new SeparatorController(this.controller.document, {
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		this.controller.bladeRack.add(bc, params.index);

		const api = new SeparatorApi(bc);
		this.apiSet_.add(api);
		return api;
	}

	public addBlade_v3_(opt_params?: BladeParams): BladeApi {
		const params = opt_params ?? {};
		const api = createBladeApi(this.controller.document, params);
		this.controller.bladeRack.add(api.controller);
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
				? api.controller === ev.bindingController
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
				? api.controller === ev.bindingController
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
			api instanceof FolderApi ? api.controller === ev.folderController : false,
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
