import {forceCast} from '../misc/type-util';
import {ButtonController} from '../plugin/blade/button/controller';
import {Blade} from '../plugin/blade/common/model/blade';
import {BladeRackEvents} from '../plugin/blade/common/model/blade-rack';
import {FolderController} from '../plugin/blade/folder/controller';
import {FolderEvents} from '../plugin/blade/folder/model/folder';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {
	TpChangeEvent,
	TpFoldEvent,
	TpUpdateEvent,
} from '../plugin/common/event/tp-event';
import {Emitter} from '../plugin/common/model/emitter';
import {ButtonApi} from './button';
import {ComponentApi} from './component-api';
import {InputBindingApi} from './input-binding';
import {createInputBindingController} from './input-binding-controllers';
import {MonitorBindingApi} from './monitor-binding';
import {createMonitorBindingController} from './monitor-binding-controllers';
import {SeparatorApi} from './separator';
import {
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

export class FolderApi implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: FolderController;
	private readonly emitter_: Emitter<FolderApiEvents<unknown>>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);
		this.onRackInputChange_ = this.onRackInputChange_.bind(this);
		this.onRackItemFold_ = this.onRackItemFold_.bind(this);
		this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);

		this.controller = controller;

		this.emitter_ = new Emitter();

		this.controller.folder.emitter.on('change', this.onFolderChange_);

		const rack = this.controller.bladeRack;
		rack.emitter.on('inputchange', this.onRackInputChange_);
		rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
		rack.emitter.on('itemfold', this.onRackItemFold_);
	}

	get expanded(): boolean {
		return this.controller.folder.expanded;
	}

	set expanded(expanded: boolean) {
		this.controller.folder.expanded = expanded;
	}

	get hidden(): boolean {
		return this.controller.blade.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.blade.hidden = hidden;
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
		return new InputBindingApi(forceCast(bc));
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
		return new MonitorBindingApi(forceCast(bc));
	}

	public addFolder(params: FolderParams): FolderApi {
		const bc = new FolderController(this.controller.document, {
			...params,
			blade: new Blade(),
		});
		this.controller.bladeRack.add(bc, params.index);
		return new FolderApi(bc);
	}

	public addButton(params: ButtonParams): ButtonApi {
		const bc = new ButtonController(this.controller.document, {
			...params,
			blade: new Blade(),
		});
		this.controller.bladeRack.add(bc, params.index);
		return new ButtonApi(bc);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		const bc = new SeparatorController(this.controller.document, {
			blade: new Blade(),
		});
		this.controller.bladeRack.add(bc, params.index);
		return new SeparatorApi(bc);
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
		const bapi = new InputBindingApi(ev.bindingController);
		const binding = ev.bindingController.binding;
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				bapi,
				forceCast(binding.target.read()),
				binding.target.presetKey,
			),
		});
	}

	private onRackMonitorUpdate_(ev: BladeRackEvents['monitorupdate']) {
		const bapi = new MonitorBindingApi(ev.bindingController);
		const binding = ev.bindingController.binding;
		this.emitter_.emit('update', {
			event: new TpUpdateEvent(
				bapi,
				forceCast(binding.target.read()),
				binding.target.presetKey,
			),
		});
	}

	private onRackItemFold_(ev: BladeRackEvents['itemfold']) {
		const fapi = new FolderApi(ev.folderController);
		this.emitter_.emit('fold', {
			event: new TpFoldEvent(fapi, ev.folderController.folder.expanded),
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
