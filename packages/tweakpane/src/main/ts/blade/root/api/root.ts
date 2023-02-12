import {
	BindingValue,
	FolderApi,
	InputBindingController,
	InputBindingValue,
	LabeledValueController,
	MonitorBindingController,
	MonitorBindingValue,
	PluginPool,
	Rack,
} from '@tweakpane/core';

import {RootController} from '../controller/root';
import {exportPresetJson, importPresetJson, PresetObject} from './preset';

function isInputBindingController(
	c: unknown,
): c is InputBindingController<unknown> {
	if (!(c instanceof LabeledValueController)) {
		return false;
	}
	if (!(c.value instanceof InputBindingValue)) {
		return false;
	}
	return true;
}

function isMonitorBindingController(
	c: unknown,
): c is MonitorBindingController<unknown> {
	if (!(c instanceof LabeledValueController)) {
		return false;
	}
	if (!(c.value instanceof MonitorBindingValue)) {
		return false;
	}
	return true;
}

function findInputBindingValues(rack: Rack): BindingValue<unknown>[] {
	const vcs = rack
		.find(LabeledValueController)
		.filter((vc) =>
			isInputBindingController(vc),
		) as InputBindingController<unknown>[];
	return vcs.map((vc) => vc.value);
}

function findMonitorBindingValues(rack: Rack): MonitorBindingValue<unknown>[] {
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
			values.map((v) => v.binding),
			preset,
		);
		this.refresh();
	}

	/**
	 * Exports a preset of all inputs.
	 * @return An exported preset object.
	 */
	public exportPreset(): PresetObject {
		const values = findInputBindingValues(this.controller_.rackController.rack);
		return exportPresetJson(values.map((v) => v.binding));
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
