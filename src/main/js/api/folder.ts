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

import {EventName as InternalEventName} from '../controller/folder';
import {ButtonParams, InputParams, MonitorParams} from '../controller/ui';
import {Handler} from '../misc/emitter';

type EventName = 'change' | 'fold' | 'update';

const TO_INTERNAL_EVENT_NAME_MAP: {
	[eventName in EventName]: InternalEventName
} = {
	change: 'inputchange',
	fold: 'fold',
	update: 'monitorupdate',
};

export default class FolderApi {
	public readonly controller: FolderController;

	constructor(folderController: FolderController) {
		this.controller = folderController;
	}

	get expanded(): boolean {
		return this.controller.folder.expanded;
	}

	set expanded(expanded: boolean) {
		this.controller.folder.expanded = expanded;
	}

	public addInput(object: object, key: string, opt_params?: InputParams) {
		const params = opt_params || {};
		const uc = InputBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key, params.presetKey),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new InputBindingApi(uc);
	}

	public addMonitor(object: object, key: string, opt_params?: MonitorParams) {
		const params = opt_params || {};
		const uc = MonitorBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key),
			params,
		);
		this.controller.uiControllerList.append(uc);
		return new MonitorBindingApi(uc);
	}

	public addButton(params: ButtonParams): ButtonApi {
		const uc = new ButtonController(this.controller.document, params);
		this.controller.uiControllerList.append(uc);
		return new ButtonApi(uc);
	}

	public addSeparator(): void {
		const uc = new SeparatorController(this.controller.document);
		this.controller.uiControllerList.append(uc);
	}

	public on(eventName: EventName, handler: Handler): FolderApi {
		const internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];
		if (internalEventName) {
			const emitter = this.controller.emitter;
			emitter.on(internalEventName, handler);
		}
		return this;
	}
}
