import * as InputBindingControllerCreators from '../controller/binding-creators/input';
import * as MonitorBindingControllerCreators from '../controller/binding-creators/monitor';
import ButtonController from '../controller/button';
import FolderController from '../controller/folder';
import InputBindingController from '../controller/input-binding';
import MonitorBindingController from '../controller/monitor-binding';
import RootController from '../controller/root';
import SeparatorController from '../controller/separator';
import * as UiUtil from '../controller/ui-util';
import Target from '../model/target';
import ButtonApi from './button';
import FolderApi from './folder';
import InputBindingApi from './input-binding';
import MonitorBindingApi from './monitor-binding';
import * as Preset from './preset';

import {EventName as InternalEventName} from '../controller/root';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
} from '../controller/ui';
import {Handler} from '../misc/emitter';
import {PresetObject} from './preset';

type EventName = 'change' | 'fold' | 'update';

const TO_INTERNAL_EVENT_NAME_MAP: {
	[eventName in EventName]: InternalEventName
} = {
	change: 'inputchange',
	fold: 'fold',
	update: 'monitorupdate',
};

/**
 * The Tweakpane interface.
 *
 * ```
 * new Tweakpane(options: TweakpaneConfig): RootApi
 * ```
 *
 * See [[TweakpaneConfig]] interface for available options.
 */
export default class RootApi {
	/**
	 * @hidden
	 */
	public readonly controller: RootController;

	/**
	 * @hidden
	 */
	constructor(rootController: RootController) {
		this.controller = rootController;
	}

	get element(): HTMLElement {
		return this.controller.view.element;
	}

	get expanded(): boolean {
		const folder = this.controller.folder;
		return folder ? folder.expanded : true;
	}

	set expanded(expanded: boolean) {
		const folder = this.controller.folder;
		if (folder) {
			folder.expanded = expanded;
		}
	}

	public addInput(object: object, key: string, opt_params?: InputParams) {
		const params = opt_params || {};
		const uc = InputBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key, params.presetKey),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new InputBindingApi<
			InputBindingControllerCreators.InputtableInType,
			InputBindingControllerCreators.InputtableOutType
		>(uc);
	}

	public addMonitor(object: object, key: string, opt_params?: MonitorParams) {
		const params = opt_params || {};
		const uc = MonitorBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new MonitorBindingApi<
			MonitorBindingControllerCreators.MonitorableType
		>(uc);
	}

	public addButton(params: ButtonParams): ButtonApi {
		const uc = new ButtonController(this.controller.document, params);
		this.controller.uiControllerList.append(uc);
		return new ButtonApi(uc);
	}

	public addFolder(params: FolderParams): FolderApi {
		const uc = new FolderController(this.controller.document, params);
		this.controller.uiControllerList.append(uc);
		return new FolderApi(uc);
	}

	public addSeparator(): void {
		const uc = new SeparatorController(this.controller.document);
		this.controller.uiControllerList.append(uc);
	}

	/**
	 * Import a preset of all inputs.
	 * @param preset The preset object to import.
	 */
	public importPreset(preset: PresetObject): void {
		const targets = UiUtil.findControllers(
			this.controller.uiControllerList.items,
			InputBindingController,
		).map((ibc) => {
			return ibc.binding.target;
		});
		Preset.importJson(targets, preset);
		this.refresh();
	}

	/**
	 * Export a preset of all inputs.
	 * @return The exported preset object.
	 */
	public exportPreset(): PresetObject {
		const targets = UiUtil.findControllers(
			this.controller.uiControllerList.items,
			InputBindingController,
		).map((ibc) => {
			return ibc.binding.target;
		});
		return Preset.exportJson(targets);
	}

	/**
	 * Adds a global event listener. It handles all events of child inputs/monitors.
	 * @param eventName The event name to listen.
	 * @return The API object itself.
	 */
	public on(eventName: EventName, handler: Handler): RootApi {
		const internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];
		if (internalEventName) {
			const emitter = this.controller.emitter;
			emitter.on(internalEventName, handler);
		}
		return this;
	}

	/**
	 * Refreshes all bindings of the pane.
	 */
	public refresh(): void {
		// Force-read all input bindings
		UiUtil.findControllers(
			this.controller.uiControllerList.items,
			InputBindingController,
		).forEach((ibc) => {
			ibc.binding.read();
		});

		// Force-read all monitor bindings
		UiUtil.findControllers(
			this.controller.uiControllerList.items,
			MonitorBindingController,
		).forEach((mbc) => {
			mbc.binding.read();
		});
	}
}
