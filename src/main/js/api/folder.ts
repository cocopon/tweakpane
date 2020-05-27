import * as InputBindingControllerCreators from '../controller/binding-creators/input';
import * as MonitorBindingControllerCreators from '../controller/binding-creators/monitor';
import {ButtonController} from '../controller/button';
import {FolderController} from '../controller/folder';
import {SeparatorController} from '../controller/separator';
import {Disposable} from '../model/disposable';
import {Target} from '../model/target';
import {ButtonApi} from './button';
import * as EventHandlerAdapters from './event-handler-adapters';
import {InputBindingApi} from './input-binding';
import {MonitorBindingApi} from './monitor-binding';
import {SeparatorApi} from './separator';
import {
	ButtonParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from './types';

interface FolderApiEventHandlers {
	change: (value: unknown) => void;
	fold: (expanded: boolean) => void;
	update: (value: unknown) => void;
}

export class FolderApi {
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

	public dispose(): void {
		this.controller.disposable.dispose();
	}

	public addInput(object: object, key: string, opt_params?: InputParams) {
		const params = opt_params || {};
		const uc = InputBindingControllerCreators.create(
			this.controller.document,
			new Target(object, key, params.presetKey),
			params,
		);
		this.controller.uiControllerList.add(uc, params.index);
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
		this.controller.uiControllerList.add(uc, params.index);
		return new MonitorBindingApi<
			MonitorBindingControllerCreators.MonitorableType
		>(uc);
	}

	public addButton(params: ButtonParams): ButtonApi {
		const uc = new ButtonController(this.controller.document, {
			...params,
			disposable: new Disposable(),
		});
		this.controller.uiControllerList.add(uc, params.index);
		return new ButtonApi(uc);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		const uc = new SeparatorController(this.controller.document, {
			disposable: new Disposable(),
		});
		this.controller.uiControllerList.add(uc, params.index);
		return new SeparatorApi(uc);
	}

	public on<EventName extends keyof FolderApiEventHandlers>(
		eventName: EventName,
		handler: FolderApiEventHandlers[EventName],
	): FolderApi {
		EventHandlerAdapters.folder({
			eventName: eventName,
			folder: this.controller.folder,
			handler: handler,
			uiControllerList: this.controller.uiControllerList,
		});
		return this;
	}
}
