import {
	BindingValue,
	BladeRack,
	FolderApi,
	InputBindingController,
	isInputBindingController,
	isMonitorBindingController,
	LabeledValueController,
	MonitorBindingValue,
	PluginPool,
} from '@tweakpane/core';

import {RootController} from '../controller/root';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

function findInputBindingValues(rack: BladeRack): BindingValue<unknown>[] {
	const vcs = rack
		.find(LabeledValueController)
		.filter((vc) =>
			isInputBindingController(vc),
		) as InputBindingController<unknown>[];
	return vcs.map((vc) => vc.value);
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
		const values = findInputBindingValues(this.controller_.rackController.rack);
		importPresetJson(
			values.map((v) => v.binding.target),
			preset,
		);
	}

	/**
	 * Exports a preset of all inputs.
	 * @return An exported preset object.
	 */
	public exportPreset(): PresetObject {
		const values = findInputBindingValues(this.controller_.rackController.rack);
		return exportPresetJson(values.map((v) => v.binding.target));
	}

	/**
	 * Refreshes all bindings of the pane.
	 */
	public refresh(): void {
		// Force-read all input bindings
		findInputBindingValues(this.controller_.rackController.rack).forEach((bv) =>
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
