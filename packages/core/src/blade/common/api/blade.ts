import {BladeController} from '../controller/blade.js';
import {BladeState} from '../controller/blade-state.js';

export class BladeApi<C extends BladeController = BladeController> {
	/**
	 * @hidden
	 */
	public readonly controller: C;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
		this.controller = controller;
	}

	get element(): HTMLElement {
		return this.controller.view.element;
	}

	get disabled(): boolean {
		return this.controller.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller.viewProps.set('disposed', true);
	}

	public importState(state: BladeState): boolean {
		return this.controller.importState(state);
	}

	public exportState(): BladeState {
		return this.controller.exportState();
	}
}
