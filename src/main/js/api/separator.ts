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

	public dispose(): void {
		this.controller.disposable.dispose();
	}
}
