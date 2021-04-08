import {ButtonBladePlugin} from '../../button/plugin';
import {PluginRegistration, registerPlugin} from '../../common/api/util';
import {InputBindingController} from '../../common/controller/input-binding';
import {MonitorBindingController} from '../../common/controller/monitor-binding';
import {FolderApi} from '../../folder/api/folder';
import {FolderBladePlugin} from '../../folder/plugin';
import {BladePlugin} from '../../plugin';
import {SeparatorBladePlugin} from '../../separator/plugin';
import {RootController} from '../controller/root';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

export class RootApi extends FolderApi {
	/**
	 * @hidden
	 */
	constructor(controller: RootController) {
		super(controller);
	}

	/**
	 * Registers a plugin.
	 * @param r The configuration of the plugin.
	 */
	public static registerPlugin(r: PluginRegistration): void {
		registerPlugin(r);
	}

	get element(): HTMLElement {
		return this.controller_.view.element;
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
			registerPlugin({
				type: 'blade',
				plugin: p,
			});
		},
	);
}
registerDefaultPlugins();
