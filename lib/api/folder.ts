import {forceCast} from '../misc/type-util';
import {ButtonController} from '../plugin/blade/button/controller';
import {Blade} from '../plugin/blade/common/model/blade';
import {FolderController} from '../plugin/blade/folder/controller';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {BindingTarget} from '../plugin/common/binding/target';
import {ButtonApi} from './button';
import {ComponentApi} from './component-api';
import {handleFolder} from './event-handler-adapters';
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

interface FolderApiEventHandlers {
	change: (value: unknown) => void;
	fold: (expanded: boolean) => void;
	update: (value: unknown) => void;
}

export class FolderApi implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: FolderController;

	/**
	 * @hidden
	 */
	constructor(folderController: FolderController) {
		this.controller = folderController;
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
			new BindingTarget(object, key, params.presetKey),
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
			new BindingTarget(object, key),
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

	public on<EventName extends keyof FolderApiEventHandlers>(
		eventName: EventName,
		handler: FolderApiEventHandlers[EventName],
	): FolderApi {
		handleFolder({
			eventName: eventName,
			folder: this.controller.folder,
			// TODO: Type-safe
			handler: forceCast(handler.bind(this)),
			bladeRack: this.controller.bladeRack,
		});
		return this;
	}
}
