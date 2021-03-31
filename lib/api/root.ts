import {BladePlugin} from '../plugin/blade';
import {ButtonApi} from '../plugin/blade/button/api/button';
import {ButtonBladePlugin} from '../plugin/blade/button/plugin';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {FolderApi} from '../plugin/blade/folder/api/folder';
import {FolderBladePlugin} from '../plugin/blade/folder/plugin';
import {RootController} from '../plugin/blade/folder/root';
import {SeparatorApi} from '../plugin/blade/separator/api/separator';
import {SeparatorBladePlugin} from '../plugin/blade/separator/plugin';
import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {Plugins} from './plugins';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';
import {ButtonParams, FolderParams, SeparatorParams} from './types';

type PluginRegistration =
	| {
			type: 'blade';
			plugin: BladePlugin<any>;
	  }
	| {
			type: 'input';
			plugin: InputBindingPlugin<any, any>;
	  }
	| {
			type: 'monitor';
			plugin: MonitorBindingPlugin<any>;
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
	 * @param r The configuration of the plugin.
	 */
	public static registerPlugin(r: PluginRegistration): void {
		if (r.type === 'blade') {
			Plugins.blades.unshift(r.plugin);
		} else if (r.type === 'input') {
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
		return this.controller_.view.element;
	}

	public addFolder(params: FolderParams): FolderApi {
		return this.addBlade_v3_({
			...params,
			view: 'folder',
		}) as FolderApi;
	}

	public addButton(params: ButtonParams): ButtonApi {
		return this.addBlade_v3_({
			...params,
			view: 'button',
		}) as ButtonApi;
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		const params = opt_params || {};
		return this.addBlade_v3_({
			...params,
			view: 'separator',
		});
	}

	/**
	 * Imports a preset of all inputs.
	 * @param preset The preset object to import.
	 */
	public importPreset(preset: PresetObject): void {
		const targets = this.controller_.bladeRack
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
		const targets = this.controller_.bladeRack
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
		this.controller_.bladeRack.find(InputBindingController).forEach((ibc) => {
			ibc.binding.read();
		});

		// Force-read all monitor bindings
		this.controller_.bladeRack.find(MonitorBindingController).forEach((mbc) => {
			mbc.binding.read();
		});
	}
}

function registerDefaultPlugins() {
	[ButtonBladePlugin, FolderBladePlugin, SeparatorBladePlugin].forEach(
		(p: BladePlugin<any>) => {
			RootApi.registerPlugin({
				type: 'blade',
				plugin: p,
			});
		},
	);
}
registerDefaultPlugins();
