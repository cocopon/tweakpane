import {SeparatorController} from '../controller/separator';

export class SeparatorApi {
	/**
	 * @hidden
	 */
	public readonly controller: SeparatorController;

	/**
	 * @hidden
	 */
	constructor(controller: SeparatorController) {
		this.controller = controller;
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
}
