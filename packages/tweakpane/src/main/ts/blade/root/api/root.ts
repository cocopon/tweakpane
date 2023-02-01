import {
	BindingValue,
	BladeRack,
	FolderApi,
	isInputBindingController,
	isMonitorBindingController,
	LabeledValueController,
	MonitorBindingValue,
	PluginPool,
} from '@tweakpane/core';

import {RootController} from '../controller/root';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

function findBindingValues(rack: BladeRack): BindingValue<unknown>[] {
	return rack
		.find(LabeledValueController)
		.filter(isInputBindingController)
		.map((vc) => vc.value);
}

function findMonitorBindingValues(
	rack: BladeRack,
): MonitorBindingValue<unknown>[] {
	return rack
		.find(LabeledValueController)
		.filter(isMonitorBindingController)
		.map((vc) => vc.value as MonitorBindingValue<unknown>);
}

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
		const bvs = findBindingValues(this.controller_.rackController.rack);
		const targets = bvs.map((bv) => bv.binding.target);
		importPresetJson(targets, preset);
		this.refresh();
	}

	/**
	 * Exports a preset of all inputs.
	 * @return An exported preset object.
	 */
	public exportPreset(): PresetObject {
		const bvs = findBindingValues(this.controller_.rackController.rack);
		const targets = bvs.map((bv) => bv.binding.target);
		return exportPresetJson(targets);
	}

	/**
	 * Refreshes all bindings of the pane.
	 */
	public refresh(): void {
		// Force-read all input bindings
		findBindingValues(this.controller_.rackController.rack).forEach((bv) =>
			bv.fetch(),
		);

		// Force-read all monitor bindings
		findMonitorBindingValues(this.controller_.rackController.rack).forEach(
			(mbv) => {
				mbv.fetch();
			},
		);
	}
}
