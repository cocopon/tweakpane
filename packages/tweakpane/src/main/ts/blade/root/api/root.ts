import {
	BindingValue,
	FolderApi,
	isInputBindingController,
	isMonitorBindingController,
	MonitorBindingValue,
	PluginPool,
	Rack,
} from '@tweakpane/core';

import {RootController} from '../controller/root';

function findInputBindingValues(rack: Rack): BindingValue<unknown>[] {
	const vcs = rack.find(isInputBindingController);
	return vcs.map((vc) => vc.value);
}

function findMonitorBindingValues(rack: Rack): MonitorBindingValue<unknown>[] {
	return rack
		.find(isMonitorBindingController)
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
