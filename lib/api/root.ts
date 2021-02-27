import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {RootController} from '../plugin/blade/folder/root';
import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {FolderApi} from './folder';
import {Plugins} from './plugins';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

type PluginRegistration<In, Ex> =
	| {
			type: 'input';
			plugin: InputBindingPlugin<In, Ex>;
	  }
	| {
			type: 'monitor';
			plugin: MonitorBindingPlugin<Ex>;
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
export class RootApi extends FolderApi {
	/**
	 * Registers a plugin.
	 * @template In The type of the internal value.
	 * @template Ex The type of the external value.
	 * @param r The configuration of the plugin.
	 */
	public static registerPlugin<In, Ex>(r: PluginRegistration<In, Ex>): void {
		if (r.type === 'input') {
			Plugins.inputs.unshift(r.plugin);
		} else if (r.type === 'monitor') {
			Plugins.monitors.unshift(r.plugin);
		}
	}

	/**
	 * @hidden
	 */
	constructor(controller: RootController) {
		super(controller);
	}

	get element(): HTMLElement {
		return this.controller.view.element;
	}

	/**
	 * Imports a preset of all inputs.
	 * @param preset The preset object to import.
	 */
	public importPreset(preset: PresetObject): void {
		const targets = this.controller.bladeRack
			.find(InputBindingController)
			.map((ibc) => {
				return ibc.binding.target;
			});
		importPresetJson(targets, preset);
		this.refresh();
	}

	/**
	 * Exports a preset of all inputs.
	 * @return An exported preset object.
	 */
	public exportPreset(): PresetObject {
		const targets = this.controller.bladeRack
			.find(InputBindingController)
			.map((ibc) => {
				return ibc.binding.target;
			});
		return exportPresetJson(targets);
	}

	/**
	 * Refreshes all bindings of the pane.
	 */
	public refresh(): void {
		// Force-read all input bindings
		this.controller.bladeRack.find(InputBindingController).forEach((ibc) => {
			ibc.binding.read();
		});

		// Force-read all monitor bindings
		this.controller.bladeRack.find(MonitorBindingController).forEach((mbc) => {
			mbc.binding.read();
		});
	}
}
