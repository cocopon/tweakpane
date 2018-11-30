// @flow

import * as InputBindingControllerCreators from '../controller/binding-creators/input';
import * as MonitorBindingControllerCreators from '../controller/binding-creators/monitor';
import ButtonController from '../controller/button';
import FolderController from '../controller/folder';
import SeparatorController from '../controller/separator';
import Target from '../model/target';
import ButtonApi from './button';
import InputBindingApi from './input-binding';
import MonitorBindingApi from './monitor-binding';

import type {EventName as InternalEventName} from '../controller/folder';
import type {ButtonParams, InputParams, MonitorParams} from '../controller/ui';

type EventName = 'change' | 'fold' | 'update';

const TO_INTERNAL_EVENT_NAME_MAP: {[EventName]: InternalEventName} = {
	change: 'inputchange',
	fold: 'fold',
	update: 'monitorupdate',
};

export default class FolderApi {
	+controller: FolderController;

	constructor(folderController: FolderController) {
		this.controller = folderController;
	}

	get expanded(): boolean {
		return this.controller.folder.expanded;
	}

	set expanded(expanded: boolean): void {
		this.controller.folder.expanded = expanded;
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

	addSeparator(): void {
		const uc = new SeparatorController(this.controller.document);
		this.controller.uiControllerList.append(uc);
	}

	on(eventName: EventName, handler: Function): FolderApi {
		const internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];
		if (internalEventName) {
			const emitter = this.controller.emitter;
			emitter.on(internalEventName, handler);
		}
		return this;
	}
}
