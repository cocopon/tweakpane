import {ButtonController} from '../controller/button';
import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {RootController} from '../controller/root';
import {SeparatorController} from '../controller/separator';
import * as UiUtil from '../controller/ui-util';
import {Target} from '../model/target';
import {ViewModel} from '../model/view-model';
import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {ButtonApi} from './button';
import {ComponentApi} from './component-api';
import * as EventHandlerAdapters from './event-handler-adapters';
import {FolderApi} from './folder';
import {InputBindingApi} from './input-binding';
import * as InputBindingControllers from './input-binding-controllers';
import {MonitorBindingApi} from './monitor-binding';
import * as MonitorBindingControllers from './monitor-binding-controllers';
import {Plugins} from './plugins';
import * as Preset from './preset';
import {PresetObject} from './preset';
import {SeparatorApi} from './separator';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from './types';

interface RootApiEventHandlers {
	change: (value: unknown) => void;
	fold: (expanded: boolean) => void;
	update: (value: unknown) => void;
}

type PluginRegistration<In, Ex> =
	| {
			type: 'input';
			plugin: InputBindingPlugin<In, Ex>;
	  }
	| {
			type: 'monitor';
			plugin: MonitorBindingPlugin<In, Ex>;
	  };

/**
 * The Tweakpane interface.
 *
 * ```
 * new Tweakpane(options: TweakpaneConfig): RootApi
 * ```
 *
 * See [[`TweakpaneConfig`]] interface for available options.
 */
export class RootApi implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: RootController;

	// TODO: Publish
	/**
	 * @hidden
	 */
	public static registerPlugin<In, Ex>(r: PluginRegistration<In, Ex>): void {
		if (r.type === 'input') {
			Plugins.inputs.push(r.plugin);
		} else if (r.type === 'monitor') {
			Plugins.monitors.push(r.plugin);
		}
	}

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

	get hidden(): boolean {
		return this.controller.viewModel.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.viewModel.hidden = hidden;
	}

	public dispose(): void {
		this.controller.viewModel.dispose();
	}

	public addInput(object: object, key: string, opt_params?: InputParams) {
		const params = opt_params || {};
		const uc = InputBindingControllers.create(
			this.controller.document,
			new Target(object, key, params.presetKey),
			params,
		);
		this.controller.uiContainer.add(uc, params.index);
		return new InputBindingApi<
			InputBindingControllers.InputIn,
			InputBindingControllers.InputEx
		>(uc);
	}

	public addMonitor(object: object, key: string, opt_params?: MonitorParams) {
		const params = opt_params || {};
		const uc = MonitorBindingControllers.create(
			this.controller.document,
			new Target(object, key),
			params,
		);
		this.controller.uiContainer.add(uc, params.index);
		return new MonitorBindingApi<MonitorBindingControllers.MonitorableType>(uc);
	}

	public addButton(params: ButtonParams): ButtonApi {
		const uc = new ButtonController(this.controller.document, {
			...params,
			viewModel: new ViewModel(),
		});
		this.controller.uiContainer.add(uc, params.index);
		return new ButtonApi(uc);
	}

	public addFolder(params: FolderParams): FolderApi {
		const uc = new FolderController(this.controller.document, {
			...params,
			viewModel: new ViewModel(),
		});
		this.controller.uiContainer.add(uc, params.index);
		return new FolderApi(uc);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		const uc = new SeparatorController(this.controller.document, {
			viewModel: new ViewModel(),
		});
		this.controller.uiContainer.add(uc, params.index);
		return new SeparatorApi(uc);
	}

	/**
	 * Import a preset of all inputs.
	 * @param preset The preset object to import.
	 */
	public importPreset(preset: PresetObject): void {
		const targets = UiUtil.findControllers(
			this.controller.uiContainer.items,
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
			this.controller.uiContainer.items,
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
	public on<EventName extends keyof RootApiEventHandlers>(
		eventName: EventName,
		handler: RootApiEventHandlers[EventName],
	): RootApi {
		EventHandlerAdapters.folder({
			eventName: eventName,
			folder: this.controller.folder,
			handler: handler.bind(this),
			uiContainer: this.controller.uiContainer,
		});
		return this;
	}

	/**
	 * Refreshes all bindings of the pane.
	 */
	public refresh(): void {
		// Force-read all input bindings
		UiUtil.findControllers(
			this.controller.uiContainer.items,
			InputBindingController,
		).forEach((ibc) => {
			ibc.binding.read();
		});

		// Force-read all monitor bindings
		UiUtil.findControllers(
			this.controller.uiContainer.items,
			MonitorBindingController,
		).forEach((mbc) => {
			mbc.binding.read();
		});
	}
}
