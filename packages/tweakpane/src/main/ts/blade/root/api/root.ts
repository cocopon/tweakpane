import {
	FolderApi,
	InputBindingController,
	MonitorBindingController,
	PluginPool,
} from '@tweakpane/core';

import {RootController} from '../controller/root';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

export class RootApi extends FolderApi {
	/**
	 * @hidden
	 */
	constructor(controller: RootController, pool: PluginPool) {
		super(controller, pool);
	}

	get element(): HTMLElement {
		return this.controller_.view.element;
	}

	/**
	 * Imports a preset of all inputs.
	 * @param preset The preset object to import.
	 */
	public importPreset(preset: PresetObject): void {
		const targets = this.controller_.rackController.rack
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
		const targets = this.controller_.rackController.rack
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
		this.controller_.rackController.rack
			.find(InputBindingController)
			.forEach((ibc) => {
				ibc.binding.read();
			});

		// Force-read all monitor bindings
		this.controller_.rackController.rack
			.find(MonitorBindingController)
			.forEach((mbc) => {
				mbc.binding.read();
			});
	}
}
