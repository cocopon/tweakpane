// @flow

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

import type {EventName as InternalEventName} from '../controller/root';
import type {PresetObject} from './preset';
import type {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
} from '../controller/ui';

type EventName = 'change' | 'fold' | 'update';

const TO_INTERNAL_EVENT_NAME_MAP: {[EventName]: InternalEventName} = {
	change: 'inputchange',
	fold: 'fold',
	update: 'monitorupdate',
};

export default class RootApi {
	+controller: RootController;

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

	set expanded(expanded: boolean): void {
		const folder = this.controller.folder;
		if (folder) {
			folder.expanded = expanded;
		}
	}

	addInput(object: Object, key: string, opt_params?: InputParams) {
		const params = opt_params || {};
		const uc = InputBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key, params.presetKey),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new InputBindingApi<*>(uc);
	}

	addMonitor(object: Object, key: string, opt_params?: MonitorParams) {
		const params = opt_params || {};
		const uc = MonitorBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new MonitorBindingApi<*>(uc);
	}

	addButton(params: ButtonParams): ButtonApi {
		const uc = new ButtonController(this.controller.document, params);
		this.controller.uiControllerList.append(uc);
		return new ButtonApi(uc);
	}

	addFolder(params: FolderParams): FolderApi {
		const uc = new FolderController(this.controller.document, params);
		this.controller.uiControllerList.append(uc);
		return new FolderApi(uc);
	}

	addSeparator(): void {
		const uc = new SeparatorController(this.controller.document);
		this.controller.uiControllerList.append(uc);
	}

	importPreset(preset: PresetObject): void {
		const targets = UiUtil.findControllers(
			this.controller.uiControllerList.items,
			InputBindingController,
		).map((ibc) => {
			return ibc.binding.target;
		});
		Preset.importJson(targets, preset);
		this.refresh();
	}

	exportPreset(): PresetObject {
		const targets = UiUtil.findControllers(
			this.controller.uiControllerList.items,
			InputBindingController,
		).map((ibc) => {
			return ibc.binding.target;
		});
		return Preset.exportJson(targets);
	}

	on(eventName: EventName, handler: Function): RootApi {
		const internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];
		if (internalEventName) {
			const emitter = this.controller.emitter;
			emitter.on(internalEventName, handler);
		}
		return this;
	}

	refresh(): void {
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
